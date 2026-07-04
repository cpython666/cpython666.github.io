#!/usr/bin/env node
import { chromium } from "playwright";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

const DEFAULT_OUTPUT_ROOT = "docs/public/backups/x";
const DEFAULT_USER_DATA_DIR = ".cache/x-backup-chrome";
const DEFAULT_PROFILE_MAX_POSTS = 40;
const DEFAULT_REPLY_SCROLLS = 6;
const DEFAULT_PROFILE_SCROLLS = 18;
const ARCHIVE_SCHEMA_VERSION = 3;
const DEFAULT_COMMENT_BLOCKLIST = [
  "固炮",
  "炮友",
  "破处",
  "约炮",
  "找炮",
  "寻男",
  "点主页",
  "免费破",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseArgs(argv) {
  const options = {
    handle: "",
    url: "",
    outputRoot: DEFAULT_OUTPUT_ROOT,
    userDataDir: DEFAULT_USER_DATA_DIR,
    cdp: "",
    headless: false,
    loginOnly: false,
    renderMarkdownOnly: false,
    reset: false,
    skipMedia: false,
    commentBlocklist: [...DEFAULT_COMMENT_BLOCKLIST],
    profileMaxPosts: DEFAULT_PROFILE_MAX_POSTS,
    profileScrolls: DEFAULT_PROFILE_SCROLLS,
    replyScrolls: DEFAULT_REPLY_SCROLLS,
    post: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => argv[++index];

    if (arg === "--handle") options.handle = normalizeHandle(next());
    else if (arg === "--url") options.url = next();
    else if (arg === "--output-root") options.outputRoot = next();
    else if (arg === "--user-data-dir") options.userDataDir = next();
    else if (arg === "--cdp") options.cdp = next();
    else if (arg === "--headless") options.headless = true;
    else if (arg === "--login-only") options.loginOnly = true;
    else if (arg === "--render-md-only") options.renderMarkdownOnly = true;
    else if (arg === "--reset") options.reset = true;
    else if (arg === "--skip-media") options.skipMedia = true;
    else if (arg === "--comment-blocklist") options.commentBlocklist = parseBlocklist(next());
    else if (arg === "--profile-max-posts") options.profileMaxPosts = Number(next());
    else if (arg === "--profile-scrolls") options.profileScrolls = Number(next());
    else if (arg === "--reply-scrolls") options.replyScrolls = Number(next());
    else if (arg === "--post") options.post.push(next());
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!options.handle && options.url) {
    options.handle = handleFromUrl(options.url);
  }
  if (!options.handle) {
    throw new Error("Missing --handle, for example: --handle wufantouzi");
  }

  options.profileMaxPosts = normalizePositiveInteger(options.profileMaxPosts, DEFAULT_PROFILE_MAX_POSTS);
  options.profileScrolls = normalizePositiveInteger(options.profileScrolls, DEFAULT_PROFILE_SCROLLS);
  options.replyScrolls = normalizePositiveInteger(options.replyScrolls, DEFAULT_REPLY_SCROLLS);
  return options;
}

function normalizePositiveInteger(value, fallback) {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

function normalizeHandle(handle = "") {
  return String(handle).trim().replace(/^@/, "").replace(/^https?:\/\/x\.com\//, "").split(/[/?#]/)[0];
}

function postIdFromUrl(url = "") {
  return String(url).match(/\/status\/(\d+)/)?.[1] || "";
}

function isTranslatedPost(post = {}) {
  const text = [post.text, ...(post.comments || []).map((comment) => comment.text)].join("\n");
  return /(^|\n)Translated from /i.test(text) || /(^|\n)Show original(\n|$)/i.test(text);
}

function hasArchivedContent(post = {}) {
  return Boolean(String(post.text || "").trim());
}

function isCurrentArchiveSchema(post = {}) {
  return post.schemaVersion === ARCHIVE_SCHEMA_VERSION;
}

function hasCjkText(value = "") {
  return /[\u3400-\u9fff]/.test(String(value));
}

function parseBlocklist(value = "") {
  return String(value)
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean);
}

function isBlockedComment(comment = {}, blocklist = []) {
  const haystack = [
    comment.author?.name,
    comment.author?.handle,
    comment.text,
  ].join("\n").toLowerCase();

  return blocklist.some((word) => haystack.includes(String(word).toLowerCase()));
}

function handleFromUrl(url) {
  const parsed = new URL(url);
  return normalizeHandle(parsed.pathname.split("/").filter(Boolean)[0]);
}

function printHelp() {
  console.log(`Usage:
  node scripts/x-backup.mjs --handle wufantouzi
  node scripts/x-backup.mjs --handle wufantouzi --post https://x.com/wufantouzi/status/1975171860573655100
  node scripts/x-backup.mjs --handle wufantouzi --login-only

Options:
  --handle <id>             X user id without @.
  --post <url-or-id>        Backup one post detail. Can be repeated.
  --profile-max-posts <n>   Max profile posts to collect before detail fetch. Default ${DEFAULT_PROFILE_MAX_POSTS}.
  --profile-scrolls <n>     Max profile page scrolls. Default ${DEFAULT_PROFILE_SCROLLS}.
  --reply-scrolls <n>       Max detail page scrolls for visible top-level conversation. Default ${DEFAULT_REPLY_SCROLLS}.
  --skip-media              Save media URLs but do not download files.
  --comment-blocklist <csv> Filter comments by author name, handle, and text. Default: ${DEFAULT_COMMENT_BLOCKLIST.join(",")}.
  --render-md-only          Rebuild Markdown files from existing index.json without opening Chrome.
  --reset                   Clear this handle archive and recreate an empty index.json.
  --login-only              Open Chrome profile for manual X login, then press Enter here.
  --cdp <url>               Connect to an existing Chrome remote debugging endpoint, for example http://127.0.0.1:9222.
  --user-data-dir <path>    Chrome profile used by this script. Default ${DEFAULT_USER_DATA_DIR}.
`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const outputDir = join(options.outputRoot, options.handle);
  await mkdir(outputDir, { recursive: true });

  if (options.reset) {
    await resetArchive(outputDir, {
      type: "x",
      handle: options.handle,
      profileUrl: `https://x.com/${options.handle}`,
    });
    console.log(`Reset archive at ${outputDir}.`);
    return;
  }

  if (options.renderMarkdownOnly) {
    const archive = await readJsonIfExists(join(outputDir, "index.json"), null);
    const posts = await loadArchivePosts(outputDir, archive);
    for (const post of posts) {
      await writePostMarkdown(post, outputDir);
    }
    await writeArchiveIndex(outputDir, archive?.source || {
      type: "x",
      handle: options.handle,
      profileUrl: `https://x.com/${options.handle}`,
    }, posts);
    console.log(`Rendered ${posts.length} Markdown files from ${join(outputDir, "index.json")}.`);
    return;
  }

  const { browser, context, close } = await openBrowser(options);
  const page = await context.newPage();

  if (options.loginOnly) {
    await page.goto("https://x.com/home", { waitUntil: "domcontentloaded", timeout: 60_000 });
    console.log("Chrome is open. Log in to X if needed, then press Enter in this terminal.");
    await waitForEnter();
    await close(browser, context);
    return;
  }

  const postUrls = new Set(options.post.map((post) => normalizePostUrl(post, options.handle)));
  if (postUrls.size === 0) {
    const profilePosts = await collectProfilePosts(page, options);
    for (const post of profilePosts) {
      postUrls.add(post.url);
      if (postUrls.size >= options.profileMaxPosts) break;
    }
  }

  const existing = await readJsonIfExists(join(outputDir, "index.json"), null);
  const existingPosts = await loadArchivePosts(outputDir, existing);
  const postsById = new Map(existingPosts.map((post) => [post.id, post]));
  const source = {
    type: "x",
    handle: options.handle,
    profileUrl: `https://x.com/${options.handle}`,
  };

  for (const url of postUrls) {
    const postId = postIdFromUrl(url);
    const existingPost = postId ? postsById.get(postId) : null;
    if (existingPost && isCurrentArchiveSchema(existingPost) && hasArchivedContent(existingPost) && !isTranslatedPost(existingPost)) {
      console.log(`Skipped ${postId}, already archived.`);
      continue;
    }

    const post = await collectPostDetail(page, url, options);
    if (!post?.id) continue;

    if (!options.skipMedia) {
      await downloadPostMedia(post, outputDir);
    }

    await writePostMarkdown(post, outputDir);
    postsById.set(post.id, post);
    await writeArchiveIndex(outputDir, source, Array.from(postsById.values()));
    console.log(`Saved ${post.id} with ${post.comments.length} visible comments.`);
    await sleep(1200);
  }

  await writeArchiveIndex(outputDir, source, Array.from(postsById.values()));
  await close(browser, context);
}

async function openBrowser(options) {
  if (options.cdp) {
    const browser = await chromium.connectOverCDP(options.cdp);
    const context = browser.contexts()[0] || await browser.newContext();
    return {
      browser,
      context,
      close: async () => browser.close(),
    };
  }

  const context = await chromium.launchPersistentContext(options.userDataDir, {
    channel: process.env.X_BACKUP_BROWSER_CHANNEL || "chrome",
    headless: options.headless,
    viewport: { width: 1280, height: 900 },
    args: ["--disable-blink-features=AutomationControlled"],
  });

  return {
    browser: null,
    context,
    close: async () => context.close(),
  };
}

async function waitForEnter() {
  await new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.once("data", resolve);
  });
}

async function resetArchive(outputDir, source) {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  await writeFile(
    join(outputDir, "index.json"),
    `${JSON.stringify({
      source,
      updatedAt: new Date().toISOString(),
      count: 0,
      posts: [],
    }, null, 2)}\n`,
  );
}

async function collectProfilePosts(page, options) {
  const profileUrl = `https://x.com/${options.handle}`;
  await page.goto(profileUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(4000);

  const posts = new Map();
  let unchanged = 0;

  for (let scroll = 0; scroll < options.profileScrolls; scroll += 1) {
    const batch = await page.evaluate((handle) => {
      return Array.from(document.querySelectorAll("article")).map((article) => {
        const timeLink = Array.from(article.querySelectorAll("a"))
          .map((link) => link.href)
          .find((href) => href.includes(`/${handle}/status/`) && !href.includes("/photo/"));
        if (!timeLink) return null;
        const id = timeLink.match(/\/status\/(\d+)/)?.[1];
        const text = article.innerText || "";
        return id ? { id, url: `https://x.com/${handle}/status/${id}`, text } : null;
      }).filter(Boolean);
    }, options.handle);

    const before = posts.size;
    for (const post of batch) {
      posts.set(post.id, post);
    }
    if (posts.size >= options.profileMaxPosts) break;
    unchanged = posts.size === before ? unchanged + 1 : 0;
    if (unchanged >= 3) break;
    await page.mouse.wheel(0, 2600);
    await page.waitForTimeout(2200);
  }

  return Array.from(posts.values()).slice(0, options.profileMaxPosts);
}

async function collectPostDetail(page, url, options) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(4500);
  await showOriginalText(page);

  const targetId = url.match(/\/status\/(\d+)/)?.[1] || "";
  let main = null;
  const commentsById = new Map();

  for (let index = 0; index <= options.replyScrolls; index += 1) {
    await showOriginalText(page);
    const batch = await extractVisibleConversation(page, targetId);
    if (batch.main) {
      main = main || batch.main;
    }
    for (const comment of batch.comments) {
      commentsById.set(comment.id, comment);
    }

    if (index < options.replyScrolls) {
      await page.mouse.wheel(0, 1700);
      await page.waitForTimeout(1500);
      await showOriginalText(page);
    }
  }

  if (!main) {
    console.warn(`No post article found: ${url}`);
    return null;
  }

  const allComments = Array.from(commentsById.values());
  const comments = allComments.filter((comment) => !isBlockedComment(comment, options.commentBlocklist));
  const blockedCommentCount = allComments.length - comments.length;
  if (blockedCommentCount > 0) {
    console.log(`Filtered ${blockedCommentCount} blocked comments for ${main.id}.`);
  }

  if (main.translated && !hasCjkText(main.text)) {
    console.warn(`Skipped ${main.id}, X still shows translated text after trying to switch to original.`);
    return null;
  }

  const loginBlocked = await page.evaluate(() => {
    const text = document.body?.innerText || "";
    return text.includes("Join X now to read replies") || text.includes("Log in") && text.includes("Sign up");
  }).catch(() => false);
  const replyCount = Number.parseInt(String(main.metrics?.replies || "").replace(/[^\d]/g, ""), 10);
  if (loginBlocked || (replyCount > 0 && comments.length === 0)) {
    console.warn(
      `No visible comments collected for ${main.id}. Make sure the Chrome profile is logged in to X, then rerun with --login-only if needed.`,
    );
  }

  return {
    ...main,
    schemaVersion: ARCHIVE_SCHEMA_VERSION,
    source: "x",
    capturedAt: new Date().toISOString(),
    capturedFromUrl: page.url(),
    blockedCommentCount,
    comments,
  };
}

async function showOriginalText(page) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const clicked = await page.evaluate(() => {
      const labels = new Set(["Show original", "显示原文", "查看原文"]);
      const nodes = Array.from(document.querySelectorAll('button, [role="button"], span, div'))
        .filter((node) => labels.has((node.textContent || "").trim()));
      let count = 0;

      for (const node of nodes) {
        const clickable = node.closest('button, [role="button"]') || node;
        if (typeof clickable.click === "function") {
          clickable.click();
          count += 1;
        }
      }

      return count;
    }).catch(() => 0);

    if (!clicked) return;
    await page.waitForTimeout(1200);
  }
}

async function extractVisibleConversation(page, targetId) {
  return page.evaluate((targetId) => {
    const absoluteUrl = (href) => {
      if (!href) return "";
      try {
        return new URL(href, "https://x.com").href;
      } catch {
        return href;
      }
    };

    const cleanLines = (text) => {
      const result = [];
      for (const rawLine of String(text || "").split("\n")) {
        const line = rawLine.trim();
        const previous = result[result.length - 1];
        if (!line && previous === "") continue;
        result.push(line);
      }
      while (result[0] === "") result.shift();
      while (result[result.length - 1] === "") result.pop();
      return result;
    };

    const hasCjkText = (value = "") => /[\u3400-\u9fff]/.test(String(value));

    const parseAuthor = (article) => {
      const profileLinks = Array.from(article.querySelectorAll("a"))
        .map((link) => ({
          href: absoluteUrl(link.getAttribute("href")),
          text: link.textContent?.trim() || "",
        }))
        .filter((link) => /^https:\/\/x\.com\/[A-Za-z0-9_]+$/.test(link.href));

      const handleLink = profileLinks.find((link) => link.text.startsWith("@"));
      const nameLink = profileLinks.find((link) => link.text && !link.text.startsWith("@"));
      const handle = handleLink?.text?.replace(/^@/, "") || profileLinks[0]?.href?.split("/").pop() || "";
      return {
        name: nameLink?.text || handle,
        handle,
        profileUrl: handle ? `https://x.com/${handle}` : profileLinks[0]?.href || "",
      };
    };

    const parseMetrics = (article) => {
      const group = article.querySelector('[role="group"][aria-label]');
      const label = group?.getAttribute("aria-label") || "";
      const metrics = {};
      for (const part of label.split(",")) {
        const match = part.trim().match(/^([\d,.KMB万千]+)\s+(.+)$/i);
        if (match) metrics[match[2].toLowerCase().replace(/\s+/g, "_")] = match[1];
      }
      return metrics;
    };

    const parseArticle = (article, index) => {
      const author = parseAuthor(article);
      const time = article.querySelector("time");
      const statusLink = Array.from(article.querySelectorAll("a"))
        .map((link) => absoluteUrl(link.getAttribute("href")))
        .find((href) => /\/status\/\d+$/.test(href));
      const id = statusLink?.match(/\/status\/(\d+)$/)?.[1] || "";
      const lines = cleanLines(article.innerText);
      const hasTranslationMarker = lines.some((line) => /^Translated from .+/i.test(line) || /^(Show original|显示原文|查看原文)$/i.test(line));
      const authorTokens = new Set([
        author.name,
        `@${author.handle}`,
        "Subscribe",
        "Show translation",
        "显示翻译",
        "Relevant",
        "View quotes",
        time?.textContent?.trim() || "",
      ].filter(Boolean));

      const contentLines = lines.filter((line) => {
        if (line === "") return true;
        if (authorTokens.has(line)) return false;
        if (/^Translated from .+/i.test(line)) return false;
        if (/^(Show original|显示原文|查看原文|显示翻译|Show translation)$/i.test(line)) return false;
        if (line === "·") return false;
        if (/^(Reply|Repost|Like|Bookmark|Share|Views?)$/i.test(line)) return false;
        if (/^[\d,.KMB万千]+$/.test(line)) return false;
        if (/^[\d,.KMB万千]+\s+Views$/i.test(line)) return false;
        return true;
      });
      const text = contentLines.join("\n").trim();
      const translated = hasTranslationMarker && !hasCjkText(text);

      const images = Array.from(article.querySelectorAll("img"))
        .map((img) => ({
          alt: img.alt || "",
          url: img.src || "",
        }))
        .filter((image) => {
          if (!image.url) return false;
          if (image.url.includes("/profile_images/")) return false;
          if (image.url.includes("/emoji/")) return false;
          return image.url.includes("pbs.twimg.com/media/");
        })
        .map((image) => ({
          ...image,
          url: image.url.replace(/name=(small|medium|900x900|360x360)/, "name=large").replace("format=webp", "format=jpg"),
        }));

      const outgoingLinks = Array.from(article.querySelectorAll("a"))
        .map((link) => ({
          text: link.textContent?.trim() || "",
          url: absoluteUrl(link.getAttribute("href")),
        }))
        .filter((link) => link.url && !link.url.startsWith("https://x.com/"));

      return {
        index,
        id,
        url: statusLink || "",
        author,
        text,
        translated,
        createdAt: time?.getAttribute("datetime") || "",
        visibleTime: time?.textContent?.trim() || "",
        metrics: parseMetrics(article),
        images,
        links: outgoingLinks,
      };
    };

    const articles = Array.from(document.querySelectorAll("article"));
    const parsed = articles.map(parseArticle).filter((item) => item.id && item.author.handle);
    const main = parsed.find((item) => item.id === targetId) || null;
    const comments = parsed.filter((item) => item.id !== targetId).map((item) => ({
      ...item,
      relation: item.author.handle === main?.author?.handle ? "author-visible-reply" : "visible-reply",
    }));

    return {
      main,
      comments,
    };
  }, targetId);
}

function normalizePostUrl(post, handle) {
  const raw = String(post || "").trim();
  if (/^\d+$/.test(raw)) return `https://x.com/${handle}/status/${raw}`;
  return raw.replace("https://twitter.com/", "https://x.com/");
}

async function downloadPostMedia(post, outputDir) {
  for (const [index, image] of post.images.entries()) {
    const ext = extensionFromMediaUrl(image.url);
    const relativePath = `media/${post.id}-${index + 1}${ext}`;
    const target = join(outputDir, relativePath);
    if (existsSync(target)) {
      image.localPath = `./${relativePath}`;
      image.publicPath = `/backups/x/${basename(outputDir)}/${relativePath}`;
      continue;
    }

    await mkdir(dirname(target), { recursive: true });
    try {
      const response = await fetch(image.url);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      await writeFile(target, buffer);
      image.localPath = `./${relativePath}`;
      image.publicPath = `/backups/x/${basename(outputDir)}/${relativePath}`;
    } catch (error) {
      image.downloadError = error.message;
    }
  }
}

function extensionFromMediaUrl(url) {
  const format = new URL(url).searchParams.get("format");
  if (format) return `.${format.replace(/[^a-z0-9]/gi, "")}`;
  return ".jpg";
}

async function writeArchiveIndex(outputDir, source, posts) {
  const sortedPosts = posts
    .filter((post) => post?.id)
    .sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)));

  await mkdir(join(outputDir, "posts"), { recursive: true });
  for (const post of sortedPosts) {
    await writeFile(join(outputDir, "posts", `${post.id}.json`), `${JSON.stringify(post, null, 2)}\n`);
  }

  await writeFile(
    join(outputDir, "index.json"),
    `${JSON.stringify({
      source,
      updatedAt: new Date().toISOString(),
      count: sortedPosts.length,
      posts: sortedPosts.map(toPostSummary),
    }, null, 2)}\n`,
  );
}

function toPostSummary(post) {
  return {
    id: post.id,
    url: post.url,
    author: post.author,
    excerpt: makeExcerpt(post.text),
    createdAt: post.createdAt,
    visibleTime: post.visibleTime,
    detailPath: `./posts/${post.id}.json`,
    commentCount: post.comments?.length || 0,
    imageCount: post.images?.length || 0,
    blockedCommentCount: post.blockedCommentCount || 0,
    schemaVersion: post.schemaVersion,
  };
}

function makeExcerpt(text = "") {
  return String(text).replace(/\s+/g, " ").trim().slice(0, 180);
}

async function loadArchivePosts(outputDir, archive) {
  const summaries = archive?.posts || [];
  const posts = [];

  for (const item of summaries) {
    if (item.detailPath) {
      const detailPath = item.detailPath.replace(/^\.\//, "");
      const detail = await readJsonIfExists(join(outputDir, detailPath), null);
      if (detail?.id) {
        posts.push(detail);
        continue;
      }
    }
    if (item.text || item.comments || item.images) {
      posts.push(item);
    }
  }

  return posts;
}

async function writePostMarkdown(post, outputDir) {
  const target = join(outputDir, `${post.id}.md`);
  const lines = [
    "---",
    `source: x`,
    `id: "${post.id}"`,
    `url: "${post.url}"`,
    `author: "${escapeYaml(post.author.name)}"`,
    `handle: "${escapeYaml(post.author.handle)}"`,
    `createdAt: "${post.createdAt}"`,
    "---",
    "",
    `# ${post.author.name} @${post.author.handle}`,
    "",
    `[原帖](${post.url})`,
    "",
    post.text,
    "",
  ];

  if (post.images.length) {
    lines.push("## 图片", "");
    for (const image of post.images) {
      lines.push(`![${image.alt || "media"}](${image.localPath || image.url})`, "");
    }
  }

  if (post.comments.length) {
    lines.push("## 可见评论流", "");
    for (const comment of post.comments) {
      const tag = comment.relation === "author-visible-reply" ? "作者回复" : "评论";
      lines.push(`### ${tag}: ${comment.author.name} @${comment.author.handle}`);
      lines.push("");
      lines.push(`- 时间: ${comment.createdAt || comment.visibleTime}`);
      lines.push(`- 主页: ${comment.author.profileUrl}`);
      lines.push(`- 链接: ${comment.url}`);
      lines.push("");
      lines.push(comment.text || "(无正文)");
      lines.push("");
    }
  }

  await writeFile(target, `${lines.join("\n").replace(/\n{3,}/g, "\n\n")}\n`);
}

function escapeYaml(value) {
  return String(value || "").replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

async function readJsonIfExists(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return fallback;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
