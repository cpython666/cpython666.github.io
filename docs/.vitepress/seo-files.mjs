// 构建结束时生成的 SEO 文件（robots.txt、RSS），只用 frontmatter 摘要，不读取正文。

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toTime(value) {
  const time = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(time) ? 0 : time;
}

// 在 public/robots.txt 的基础上，把会员文章路径追加为 Disallow，其余爬虫规则不变
export function buildRobotsTxt(baseRobots, memberPaths = []) {
  const paths = [...new Set(memberPaths)].sort();
  if (!paths.length) {
    return baseRobots;
  }

  const memberRules = ["# 会员文章：不允许抓取", ...paths.map((path) => `Disallow: ${encodeURI(path)}`)].join("\n");
  const lines = baseRobots.replace(/\s+$/, "").split("\n");
  const sitemapIndex = lines.findIndex((line) => /^Sitemap:/i.test(line));
  if (sitemapIndex === -1) {
    return `${lines.join("\n")}\n${memberRules}\n`;
  }

  // 追加到 User-agent: * 分组内，放在 Sitemap 行之前
  const before = lines.slice(0, sitemapIndex).join("\n").replace(/\s+$/, "");
  const after = lines.slice(sitemapIndex).join("\n");
  return `${before}\n\n${memberRules}\n\n${after}\n`;
}

export function buildRssFeed({ siteUrl, title, description, author, items, limit = 50 }) {
  const sorted = [...items]
    .sort((a, b) => toTime(b.publishedAt) - toTime(a.publishedAt))
    .slice(0, limit);
  const lastBuildDate = new Date().toUTCString();

  const itemXml = sorted
    .map((item) => {
      const pubDate = toTime(item.publishedAt) ? new Date(item.publishedAt).toUTCString() : "";
      return [
        "    <item>",
        `      <title>${escapeXml(item.title)}</title>`,
        `      <link>${escapeXml(item.url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(item.url)}</guid>`,
        `      <description>${escapeXml(item.description || "")}</description>`,
        `      <dc:creator>${escapeXml(author)}</dc:creator>`,
        ...(pubDate ? [`      <pubDate>${pubDate}</pubDate>`] : []),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(siteUrl)}/</link>
    <description>${escapeXml(description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(siteUrl)}/feed.xml" rel="self" type="application/rss+xml"/>
${itemXml}
  </channel>
</rss>
`;
}

// llms.txt：保留 public 里手写的介绍，按栏目追加全部公开文章
export function buildLlmsTxt(baseLlms, groups = []) {
  const sections = groups
    .filter((group) => group.items.length)
    .map((group) => {
      const lines = group.items.map((item) =>
        item.description ? `- [${item.title}](${item.url}): ${item.description}` : `- [${item.title}](${item.url})`
      );
      return `### ${group.title}\n\n${lines.join("\n")}`;
    });
  if (!sections.length) {
    return baseLlms;
  }
  return `${baseLlms.replace(/\s+$/, "")}\n\n## 全部公开文章\n\n${sections.join("\n\n")}\n`;
}

// 去掉 frontmatter 和 Vue 的 script / style 块，留下给 AI 读的 Markdown
export function stripMarkdownSource(source) {
  return source
    .replace(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---\r?\n?/, "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function buildLlmsFullTxt({ title, siteUrl, items }) {
  const docs = items
    .filter((item) => item.content)
    .map((item) => `# ${item.title}\n\n来源：${item.url}\n\n${item.content}`);
  return `# ${title} 全部公开文章\n\n> 来自 ${siteUrl}，不含会员文章与草稿。每篇以一级标题和来源链接开头。\n\n${docs.join("\n\n---\n\n")}\n`;
}
