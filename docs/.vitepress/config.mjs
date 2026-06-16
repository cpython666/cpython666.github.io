import { defineConfig } from "vitepress";
import { existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const SITE_URL = "https://cpython666.github.io";
const SITE_NAME = "星梦启航";
const SITE_AUTHOR = "Python斗罗";
const SITE_DESCRIPTION =
  "Python斗罗的个人代码笔记，分享 Python、爬虫、自动化数据采集、Web3、AI 工具、程序员成长和自媒体复盘。";
const SITE_KEYWORDS = "Python,爬虫,自动化数据采集,DrissionPage,Web3,AI工具,程序员成长,自媒体";
const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.jpg`;
const NO_INDEX_PREFIXES = ["草稿箱/", "视频待办列表/"];

function isNoIndexPage(page, frontmatter = {}) {
  const normalizedPage = page.replace(/\\/g, "/");
  return frontmatter.noindex === true || NO_INDEX_PREFIXES.some((prefix) => normalizedPage.startsWith(prefix));
}

function pageToPath(page) {
  const normalizedPage = page.replace(/\\/g, "/");
  const path = normalizedPage
    .replace(/(^|\/)index\.md$/, "$1")
    .replace(/\.md$/, "");

  if (!path || path === "/") {
    return "/";
  }
  return path.startsWith("/") ? path : `/${path}`;
}

function pageToUrl(page) {
  return `${SITE_URL}${encodeURI(pageToPath(page))}`;
}

function categoryDescription(relativePath = "") {
  if (relativePath.startsWith("spider/")) {
    return "围绕 Python 爬虫、自动化数据采集、DrissionPage、反爬与项目实战的经验记录。";
  }
  if (relativePath.startsWith("python/")) {
    return "围绕 Python 学习路线、三方库、GUI、Web 后端和项目实践的代码笔记。";
  }
  if (relativePath.startsWith("web3/")) {
    return "围绕 Web3、比特币、以太坊、交易风险、链上生态和投资认知的个人复盘。";
  }
  if (relativePath.startsWith("life/")) {
    return "围绕程序员成长、自媒体、普通人破局、工作生活和长期主义的个人思考。";
  }
  if (relativePath.startsWith("web/")) {
    return "围绕前端、VitePress、Vue、JavaScript 和网站搭建的学习记录。";
  }
  if (relativePath.startsWith("backend/")) {
    return "围绕后端开发、Docker、Nginx、Git 和工程化实践的学习笔记。";
  }
  return SITE_DESCRIPTION;
}

function resolvePageTitle(pageData = {}) {
  return pageData.frontmatter?.title || pageData.title || SITE_NAME;
}

function resolvePageDescription(pageData = {}) {
  const frontmatter = pageData.frontmatter || {};
  if (frontmatter.description) {
    return String(frontmatter.description);
  }

  const title = resolvePageTitle(pageData);
  if (!title || title === SITE_NAME) {
    return SITE_DESCRIPTION;
  }

  const suffix = categoryDescription(pageData.relativePath || "");
  return `${title}，${suffix}`;
}

function toIsoDate(value) {
  if (!value) {
    return undefined;
  }

  const raw = String(value).trim();
  const normalized = raw.includes("T") ? raw : raw.replace(" ", "T");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return raw;
  }
  return date.toISOString();
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function collectHtmlFiles(dir, files = []) {
  if (!existsSync(dir)) {
    return files;
  }

  for (const item of readdirSync(dir)) {
    const filePath = join(dir, item);
    const stats = statSync(filePath);
    if (stats.isDirectory()) {
      collectHtmlFiles(filePath, files);
    } else if (item.endsWith(".html")) {
      files.push(filePath);
    }
  }

  return files;
}

function htmlFileToSitemapUrl(filePath, outDir) {
  const relPath = relative(outDir, filePath).split(sep).join("/");
  if (relPath === "404.html" || NO_INDEX_PREFIXES.some((prefix) => relPath.startsWith(prefix))) {
    return null;
  }

  const routePath = `/${relPath}`
    .replace(/\/index\.html$/, "/")
    .replace(/\.html$/, "");

  return `${SITE_URL}${encodeURI(routePath)}`;
}

let fast_api_items = [
  {
    text: "现代、高性能的PythonWeb框架: FastAPI",
    link: "/python/web/fastapi",
  },
  { text: "Python标准库: typing", link: "/python/web/typing" },
  {
    text: "数据验证和序列化: Pydantic",
    link: "/python/web/pydantic",
  },
  {
    text: "强大、灵活、轻量级ASGI框架: Starlette",
    link: "/python/web/starlette",
  },
  {
    text: "FastAPI 学习路线",
    link: "/python/web/fastapi-road",
  },
  {
    text: "P1-FastAPI简介-合集规划介绍",
    link: "/python/web/fastapi-intro",
  },
  {
    text: "JWT（JSON Web Token）详解",
    link: "/python/web/jwt",
  },
];
let spider_items = [
  { text: "学习路线", link: "/spider/learn-road" },
  {
    text: "学习资源",
    link: "/spider/learn-resource",
  },
  { text: "学习指南", link: "/spider/学习指南" },
  { text: "买课指南", link: "/spider/买课指南" },
  {
    text: "视频源码",
    link: "/spider/source-code",
  },
  { text: "练手网站", link: "/spider/练手网站" },
];
let spider_set_items = [
  { text: "就业分享-谁的青春不迷茫", link: "/spider/collection/job-sharing" },
  { text: "几乎免费的海外代理【clash妙用🤩】【无广告】", link: "/spider/collection/cheap-ip" },
  { text: "Clash 常用配置", link: "/spider/collection/clash" },
  { text: "常用hook代码片段", link: "/spider/collection/hook" },
  {
    text: "ast详解",
    link: "/spider/collection/ast",
  },
  { text: "aiohttp", link: "/spider/collection/aiohttp" },
  { text: "浏览器指纹详解", link: "/spider/collection/browser-fingerprint" },
  {
    text: "DrissionPage学习笔记",
    link: "/spider/collection/drissionpage",
  },
  { text: "Scrapy学习笔记", link: "/spider/collection/scrapy" },
  { text: "python小白学习路线，必会知识点详细解析，资源推荐", link: "/spider/collection/python-beginner-roadmap" },
  { text: "能听到的音乐就能下载，音乐下载通杀", link: "/spider/collection/music-download-all-in-one" },
  { text: "数据采集使用自动化真的慢吗？实测速度震惊！", link: "/spider/collection/automation-data-collection-speed-test" },
  { text: "爬虫学习路线-自动化，80%需求有手就行", link: "/spider/collection/crawler-roadmap-automation" },
  { text: "xpath简介及常用语法", link: "/spider/collection/xpath-intro" },
  { text: "现在的引流爬虫太猖狂了，兄弟们注意点别进去了", link: "/spider/collection/traffic-crawler-warning" },
  { text: "爬虫可以做哪些事情？项目探究，项目推荐", link: "/spider/collection/crawler-project-ideas" },
  { text: "网站数据采集-分析思路/流程", link: "/spider/collection/website-data-collection-analysis" },
  { text: "数据采集系统的通用设计思路", link: "/spider/collection/data-collection-system-design" },
  { text: "通用爬虫介绍和实现思路", link: "/spider/collection/general-crawler-design" },
  {
    text: "Crawlab使用记录",
    link: "/spider/collection/crawlab",
  },
];
let spider_anti_crawler_game_items = [
  { text: "合集介绍", link: "/spider/anti-crawler-game/" },
  { text: "大眼瞪小眼编码，视觉层面混淆-O10编码解码", link: "/spider/anti-crawler-game/visual-obfuscation-o10" },
  { text: "很损的反爬，不相信科学了，赶紧分享给大家，薛定谔的数据", link: "/spider/anti-crawler-game/schrodinger-anti-crawler-data" },
  { text: "反爬之行为检测-鼠标与按钮位置匹配", link: "/spider/anti-crawler-game/behavior-detection-mouse-button" },
  { text: "看似最简单，实则很难的验证码【爬虫反爬】", link: "/spider/anti-crawler-game/hard-simple-captcha" },
];
let spider_drissionpage_imported_items = [
  { text: "合集介绍", link: "/spider/dp-series/" },
  { text: "P0-为什么学习数据采集？为什么是自动化？为什么选择DrissionPage？", link: "/spider/dp-series/p0-why-data-collection" },
  { text: "P1-本专栏的目的，会讲那些知识？DrissionPage自动化数据采集", link: "/spider/dp-series/p1-series-intro" },
  { text: "P2-Hello～DrissionPage，开端即巅峰，专栏可以结束了", link: "/spider/dp-series/p2-hello-drissionpage" },
  { text: "P3-DrissionPage批量监听采集接口数据", link: "/spider/dp-series/p3-listen-api-data" },
  { text: "P4-自动化批量保存文章的方法与系统设计指南", link: "/spider/dp-series/p4-save-articles-system-design" },
  { text: "P5-DrissionPage监听websocket请求", link: "/spider/dp-series/p5-listen-websocket" },
  { text: "P6-快速、精准、优雅提取网页大部分表格数据-DrissionPage自动化数据采集", link: "/spider/dp-series/p6-extract-table-data" },
  { text: "P7-DrissionPage项目部署服务器的最佳实践", link: "/spider/dp-series/p7-deploy-server" },
  { text: "P8-自动化的检测与反检测-DrissionPage自动化数据采集", link: "/spider/dp-series/p8-anti-detection" },
];
let spider_drissionpage_system_items = [
  { text: "合集介绍", link: "/spider/drissionpage-system/" },
  { text: "P1-DrissionPage数据采集中间系统【源码及讲解】", link: "/spider/drissionpage-system/p1-system-source-guide" },
  { text: "P2-自动化采集系统-体验优化", link: "/spider/drissionpage-system/p2-system-ux-optimization" },
  { text: "P3-自动化采集系统功能丰富-支持截图，接口文档描述完善", link: "/spider/drissionpage-system/p3-screenshot-api-docs" },
  { text: "P4-自动化采集系统代码优化-实例化浏览器管理类", link: "/spider/drissionpage-system/p4-browser-manager-refactor" },
  { text: "P5-增加响应状态码-后续系统功能规划【自动化采集系统代码】", link: "/spider/drissionpage-system/p5-response-status-planning" },
];
let spider_questionnaire_items = [
  { text: "合集介绍", link: "/spider/questionnaire/" },
  { text: "P1-Selenium自动做问卷星", link: "/spider/questionnaire/p1-selenium-wjx" },
  { text: "P2-问卷代码示例-已脱敏【自动化填问卷的第一桶金，半小时一百块】", link: "/spider/questionnaire/p2-questionnaire-code-example" },
  { text: "P3-填问卷不再手动！自动生成自动化代码，一键搞定所有问卷类型！", link: "/spider/questionnaire/p3-generate-automation-code" },
];
let spider_scrapy_series_items = [
  { text: "合集介绍", link: "/spider/scrapy-series/" },
  { text: "P1-Scrapy简介", link: "/spider/scrapy-series/p1-scrapy-intro" },
  { text: "P2-快速开始-项目实战", link: "/spider/scrapy-series/p2-quick-start-project" },
  { text: "P3-注意事项【Scrapy】", link: "/spider/scrapy-series/p3-scrapy-notes" },
  { text: "P1-scrapy教程-scrapy框架简介", link: "/spider/scrapy-series/p4-scrapy-framework-intro" },
  { text: "P2-第一个scrapy项目【scrapy教程】", link: "/spider/scrapy-series/p5-first-scrapy-project" },
];

let web3_basics_items = [
  { text: "为什么要有这个指南？", link: "/web3/basics/web3forever" },
  { text: "常见问题及解答", link: "/web3/basics/web3-qas" },
  {
    text: "为什么不能碰合约？",
    link: "/web3/basics/why-can’t-we-touch-the-contract",
  },
  { text: "教训合集", link: "/web3/basics/lesson" },
  { text: "炒币感悟", link: "/web3/basics/insights" },
  { text: "币圈骗局合集鉴赏", link: "/web3/basics/crypto-scams" },
  { text: "优质资源", link: "/web3/basics/high-quality-materials" },
  { text: "加密笑话", link: "/web3/basics/bitcoin-jokes" },
  { text: "个人准则", link: "/web3/basics/rules" },
  { text: "赞助", link: "/web3/basics/support" },
  { text: "声明", link: "/web3/basics/statement" },
  { text: "敬请期待...", link: "/web3/basics/stay-tuned" },
];
let block_walk_items = [
  {
    text: "P1-一个散户的醒悟：我走过的弯路，希望你不再重蹈",
    link: "/web3/block-walk/don’t-repeat-my-mistakes",
  },
  {
    text: "P2-从爆仓中悟出的“必胜投资法”",
    link: "/web3/block-walk/winning-investment-method",
  },
  {
    text: "P3-信息差只是借口，认知差才是改变命运的分水岭",
    link: "/web3/block-walk/information-gap-vs-cognitive-gap",
  },
  {
    text: "P4-比特币为什么会不断上涨？",
    link: "/web3/block-walk/why-does-bitcoin-continue-to-rise",
  },
  {
    text: "P5-为什么我坚定投资比特币和以太坊？",
    link: "/web3/block-walk/why-i-am-determined-to-invest-in-bitcoin-and-ethereum",
  },
  {
    text: "P6-投资比特币和以太坊的风险",
    link: "/web3/block-walk/risks-of-investing-in-bitcoin-and-ethereum",
  },
  {
    text: "P7-链上打狗，无限印钞？",
    link: "/web3/block-walk/beating-the-dog-on-the-chain-and-unlimited-money-printing",
  },
  {
    text: "P8-分享一组对冲策略，做多龙头做空山寨的可行性分析🧐",
    link: "/web3/block-walk/hedging-strategies",
  },
  {
    text: "P9-资产千万的大哥分享给我的全部心得",
    link: "/web3/block-walk/a-big-brother-with-tens-of-millions-of-assets",
  },
  {
    text: "P10-做外汇黄金的常识，算了下我交易过几个小目标的黄金",
    link: "/web3/block-walk/forex-gold-trading-basics",
  },
];

let blockchain_weekly_report = [
  {
    text: "区块链周报介绍",
    link: "/web3/blockchain-weekly-report/",
  },
  {
    text: "「区块链周报第四期」稳定币买一切时代序章，链上美股天时地利，金融核心正在迁移？[2026/05/31]",
    link: "/web3/blockchain-weekly-report/issue-4-2026-05-31",
  },
  {
    text: "「区块链周报第三期」DEX2.0大战一触即发，谁能撼动Hyperliquid王座？[09/15-09/21]",
    link: "/web3/blockchain-weekly-report/issue-3-09-15",
  },
  {
    text: "「区块链周报第二期」纳斯达克下场RWA，CEX自建链百花齐放[09/08-09/14]",
    link: "/web3/blockchain-weekly-report/issue-2-09-08",
  },
  {
    text: "「区块链周报第一期」沉睡七年比特币巨鲸高调换仓以太坊，是神之一手、内幕还是最后的逃命机会？[09/01-09/07]",
    link: "/web3/blockchain-weekly-report/issue-1-09-01",
  },
];

let high_quality_articles = [
  {
    text: "我们真的需要比特币吗？",
    link: "/web3/high-quality-articles/do-we-really-need-bitcoin",
  },
  {
    text: "币圈几件黑天鹅事件，你经历了几件?",
    link: "/web3/high-quality-articles/how-many-black-swan-events-have-you-experienced",
  },
  {
    text: "我的朋友-超仔",
    link: "/web3/high-quality-articles/my-friend-chaozai",
  },
  {
    text: "黑天鹅给我撞上了-记录币圈10-11",
    link: "/web3/high-quality-articles/black-swan-10-11",
  },
];
let web3_items = [
  {
    text: "基础常识",
    collapsed: false,
    items: web3_basics_items,
  },
  {
    text: "区块漫步🚶",
    collapsed: false,
    items: block_walk_items,
  },
  {
    text: "区块链周报",
    items: blockchain_weekly_report,
  },
  {
    text: "优质文章",
    items: high_quality_articles,
  },
];

let python_items = [
  { text: "学习路线", link: "/python/学习路线" },
  {
    text: "学习资源",
    link: "/python/学习资源",
  },
  { text: "学习指南", link: "/python/学习指南" },
  { text: "买课指南", link: "/python/买课指南" },
  {
    text: "视频源码",
    link: "/python/视频源码",
  },
  { text: "常用命令", link: "/python/shorthand" },
  { text: "常用命令总敲错？记不住？让你的命令短起来！-invoke【python三方库】", link: "/python/libs/invoke" },
  { text: "用Python手搓限流类-支持同步与异步，内存或者redis", link: "/python/libs/rate-limiter" },
  { text: "文本差异对比如此简单！", link: "/python/libs/text-diff-simple" },
];

let django_items = [
  {
    text: "Django笔记",
    link: "/python/web/django",
  },
  {
    text: "探索SimpleUI: 让Django Admin焕发现代光彩",
    link: "/python/web/simple-ui",
  },
];

let python_col_items = [
  {
    text: "23种设计模式-Python",
    link: "/python/collection/23-design/",
  },
  {
    text: "PyQt6实战开发之旅",
    link: "/python/collection/pyqt6",
  },
  { text: "分布式任务队列工具：Celery", link: "/python/collection/celery" },
  {
    text: "pre-commit 简明教程：让你的代码提交更规范",
    link: "/python/libs/pre-commit",
  },
];
let python_subtitle_extractor_items = [
  { text: "字幕提取器系列", link: "/python/subtitle-extractor/" },
  { text: "P1-用Python批量提取视频文案，超详细-字幕提取器", link: "/python/subtitle-extractor/p1-video-copy-extractor" },
  { text: "P2-提取视频文案的几种场景及其优缺点-字幕提取器", link: "/python/subtitle-extractor/p2-subtitle-extraction-scenarios" },
  { text: "P3-【开源自制】字幕提取器-OCR版-1.0，文案提取不再烦恼！", link: "/python/subtitle-extractor/p3-ocr-subtitle-extractor-1" },
  { text: "P4-字幕提取器-OCR版-1.0，使用教程及后续改进方向，进步空间很大", link: "/python/subtitle-extractor/p4-ocr-subtitle-extractor-guide" },
  { text: "P5-字幕提取器-OCR版-2.0，多线程，批量自动化，实现了真正的一步到位", link: "/python/subtitle-extractor/p5-ocr-subtitle-extractor-2" },
];
let python_basics_imported_items = [
  { text: "Python基础合集", link: "/python/python-basics/" },
];
let python_pygame_series_items = [
  { text: "Pygame游戏开发合集", link: "/python/pygame-series/" },
  { text: "P0-合集介绍", link: "/python/pygame-series/p0-series-intro" },
  { text: "P1-教程文档", link: "/python/pygame-series/p1-docs" },
  { text: "P2-设置logo与标题", link: "/python/pygame-series/p2-window-logo-title" },
  { text: "P3-下雨特效", link: "/python/pygame-series/p3-rain-effect" },
  { text: "P4-点击后粒子爆炸", link: "/python/pygame-series/p4-particle-explosion" },
  { text: "P5-数字粒子消散", link: "/python/pygame-series/p5-number-particle-dissolve" },
  { text: "P6-画面显示fps", link: "/python/pygame-series/p6-show-fps" },
  { text: "P7-画出一个棋盘背景", link: "/python/pygame-series/p7-chessboard-background" },
  { text: "P8-物体运动尾迹拖尾", link: "/python/pygame-series/p8-motion-trail" },
  { text: "P9-代码-鼠标环形文字旋转动画特效", link: "/python/pygame-series/p9-rotating-text-effect" },
  { text: "P10-炫彩小球交互效果-pygame实现", link: "/python/pygame-series/p10-colorful-ball-interaction" },
];
let python_pyqt6_series_items = [
  { text: "PyQt6实战开发之旅-合集", link: "/python/pyqt6-series/" },
  { text: "P1-PyQt6学习感悟", link: "/python/pyqt6-series/p1-learning-reflection" },
  { text: "P2-合集简介", link: "/python/pyqt6-series/p2-series-intro" },
  { text: "P3-第一个程序-Hello,PyQt6~", link: "/python/pyqt6-series/p3-hello-pyqt6" },
  { text: "P4-居中显示窗口", link: "/python/pyqt6-series/p4-center-window" },
  { text: "P5-PyQt6-初探QMainWindow-各模块的学习方法", link: "/python/pyqt6-series/p5-qmainwindow-overview" },
  { text: "P6-多页面切换实例", link: "/python/pyqt6-series/p6-multi-page-switch" },
  { text: "P7-顶部菜单栏实例", link: "/python/pyqt6-series/p7-menu-bar" },
  { text: "P8-多种栏示例", link: "/python/pyqt6-series/p8-bars-demo" },
  { text: "P9-左侧菜单控制右侧多页面切换", link: "/python/pyqt6-series/p9-sidebar-page-switch" },
  { text: "P10-pyqt6中如何实现多页面切换？", link: "/python/pyqt6-series/p10-how-to-switch-pages" },
  { text: "P11-QTabweight与Qstackweight的区别", link: "/python/pyqt6-series/p11-qtabwidget-qstackedwidget" },
  { text: "P12-Qframe与Qweight的区别", link: "/python/pyqt6-series/p12-qframe-qwidget" },
  { text: "P13-先显示登陆页面，登陆成功后显示主页面", link: "/python/pyqt6-series/p13-login-before-main-window" },
  { text: "P14-窗口渐显与渐隐", link: "/python/pyqt6-series/p14-window-fade" },
  { text: "P15-窗口居中变大出现", link: "/python/pyqt6-series/p15-window-scale-in" },
  { text: "P16-最小化窗口到托盘，右键菜单，窗口恢复", link: "/python/pyqt6-series/p16-minimize-to-tray" },
  { text: "P17-背景运动及模糊滤镜", link: "/python/pyqt6-series/p17-background-motion-blur" },
  { text: "P18-窗口自定义拖拽功能", link: "/python/pyqt6-series/p18-custom-window-drag" },
  { text: "P19-窗口双击更换背景", link: "/python/pyqt6-series/p19-double-click-change-bg" },
  { text: "P20-多软件图标排布", link: "/python/pyqt6-series/p20-app-icon-layout" },
  { text: "P21-点击按钮打开新页面", link: "/python/pyqt6-series/p21-open-new-page" },
  { text: "P22-窗口中画一个框", link: "/python/pyqt6-series/p22-draw-rectangle" },
  { text: "P23-介绍一下QGraphicsScene和QGraphicsView", link: "/python/pyqt6-series/p23-qgraphicsscene-qgraphicsview" },
  { text: "P24-图片浏览，可以放大缩小拖拽", link: "/python/pyqt6-series/p24-image-viewer" },
  { text: "P25-图片浏览，ctrl+滚轮放大缩小，左键按压拖拽，右键按压画框，框显示坐标信息", link: "/python/pyqt6-series/p25-image-viewer-box-select" },
  { text: "P26-图片场景输出为图片", link: "/python/pyqt6-series/p26-export-scene-image" },
  { text: "P27-浮点数滑块", link: "/python/pyqt6-series/p27-float-slider" },
  { text: "P28-QListWidget中添加Widget", link: "/python/pyqt6-series/p28-qlistwidget-add-widget" },
  { text: "P29-更换主题", link: "/python/pyqt6-series/p29-change-theme" },
  { text: "P30-多选列表", link: "/python/pyqt6-series/p30-multi-select-list" },
  { text: "P31-主线程中执行耗时任务时GUI 被阻塞，如何强制处理事件循环中的待处理事件，以更新 GUI", link: "/python/pyqt6-series/p31-process-events-when-gui-blocked" },
  { text: "P32-单独线程处理任务", link: "/python/pyqt6-series/p32-worker-thread" },
  { text: "P33-防锯齿选项", link: "/python/pyqt6-series/p33-antialiasing" },
  { text: "P34-配置相关QSettings", link: "/python/pyqt6-series/p34-qsettings" },
  { text: "P35-【自定义磨砂动态背景】前端及pyqt6实现", link: "/python/pyqt6-series/p35-frosted-dynamic-background" },
];
let python_django_series_items = [
  { text: "Django-合集", link: "/python/django-series/" },
  { text: "drf限流模块-源码翻译及解读【django】", link: "/python/django-series/drf-throttling-source" },
  { text: "django-orm常用的方法函数【django】", link: "/python/django-series/django-orm-methods" },
  { text: "django-simpleui【django】", link: "/python/django-series/django-simpleui" },
  { text: "Django最常用命令合集", link: "/python/django-series/django-common-commands" },
];
let frontend_items = [
  { text: "HTML", link: "/web/html" },
  { text: "CSS", link: "/web/css" },
  {
    text: "JS",
    link: "/web/js",
  },
  { text: "JQuery", link: "/web/jquery" },
  { text: "NodeJs", link: "/web/nodejs" },
  {
    text: "Vue",
    link: "/web/vue",
  },
  {
    text: "系列文章",
    items: [
      {
        text: "VitePress环境踩坑",
        link: "/web/collection/vitepress环境差异记录",
      },
      {
        text: "vitepress博客搭建",
        link: "/web/collection/vitepress博客搭建",
      },
    ],
  },
];
let backend_items = [
  { text: "git提交规范", link: "/backend/git" },
  { text: "cron表达式: 设置定时任务", link: "/backend/cron" },
  {
    text: "docker笔记",
    link: "/backend/docker",
  },
  { text: "nginx笔记", link: "/backend/nginx" },
  { text: "布隆过滤器", link: "/backend/布隆过滤器" },
];

let algorithm_items = [
  {
    text: "探索递归：从简单到复杂的迷人之旅",
    link: "/算法/递归",
  },
  {
    text: "探索广度优先搜索（BFS）：从概念到实践",
    link: "/算法/bfs",
  },
  { text: "深度优先搜索（DFS）：探索图的无尽可能性", link: "/算法/dfs" },
  {
    text: "系列文章",
    items: [
      {
        text: "蓝桥杯万字攻略：算法模板大放送！-c++",
        link: "/算法/collection/蓝桥杯万字攻略：算法模板大放送！-c++",
      },
      {
        text: "一分钟学算法-递归-斐波那契数列递归解法及优化",
        link: "/算法/collection/一分钟学算法-递归-斐波那契数列递归解法及优化",
      }, // { text: '经典算法五十例-算法五十重天', link: '/算法/collection/经典算法' },
    ],
  },
];
let web_intro_items = [
  { text: "站长介绍", link: "/web-intro/" },
  {
    text: "团队介绍",
    link: "/web-intro/team-intro",
  },
  { text: "开发缘由", link: "/web-intro/development-origins" },
  {
    text: "开发日记",
    link: "/web-intro/development-diary",
  },
  { text: "交流群", link: "/web-intro/community-group" },
  { text: "支持", link: "/web-intro/support" },
  {
    text: "旧版首页",
    link: "/index/old/index-0.1",
  },
];
let life_items = [
  { text: "人生感悟", link: "/life/" },
  {
    text: "自动化数据采集危险啦，我的饭碗裂开啦",
    link: "/life/ai-automation-data-collection",
  },
  {
    text: "毕业两年，我还没开始我的人生。杭漂程序员生活公开！",
    link: "/life/two-years-after-graduation-hangzhou-programmer",
  },
  {
    text: "写给两年前刚毕业的自己：三条忠告",
    link: "/life/advice-to-myself-two-years-ago",
  },
  {
    text: "做正确的事，无惧风雨，交给时间",
    link: "/life/do-the-right-thing",
  },
  {
    text: "做自媒体，是为了被“对的人”找到",
    link: "/life/self-media-found-by-right-people",
  },
  {
    text: "做自媒体，就是在向世界发射信号。想赚钱，先修心",
    link: "/life/self-media-signal-money-mind",
  },
  {
    text: "自主思考，找到自己的特长和节奏。我喜欢看什么样的博主？",
    link: "/life/independent-thinking-strength-rhythm",
  },
  {
    text: "推荐两个我最近反复看的博主：陈昌文、路飞",
    link: "/life/recommended-bloggers-chenchangwen-lufei",
  },
  {
    text: "不开美颜，是一种筛选，我不是gay也是",
    link: "/life/no-beauty-filter-not-gay",
  },
  {
    text: "程序员如何找对象？如何聊天？",
    link: "/life/programmer-dating-chat",
  },
  {
    text: "用交易思维看白冰和抱抱盲兔，他们的爆仓几乎是必然的",
    link: "/life/trading-thinking-baibing-mangtu",
  },
  {
    text: "那时候的我，靠幻想和宇宙活着",
    link: "/life/fantasy-and-universe",
  },
  {
    text: "我想要的生活，好像也很简单。目前我的人生规划[幻想]",
    link: "/life/simple-life-plan",
  },
  {
    text: "毕业杭州工作五个月存了多少钱？花销怎么样？",
    link: "/life/hangzhou-five-month-savings",
  },
  {
    text: "送钱的需求长什么样，钱这么好赚吗？",
    link: "/life/what-easy-money-demand-looks-like",
  },
  {
    text: "大家都是怎么过生日的？我是怎么过生日的？",
    link: "/life/how-we-spend-birthdays",
  },
  {
    text: "大家都有一堆亮眼的title，只有我是个真草根",
    link: "/life/grassroots-without-bright-title",
  },
  {
    text: "拷打自己五个月前的简历，进来体验当面试官，24春招面试回顾",
    link: "/life/review-my-resume-after-five-months",
  },
  {
    text: "想做自媒体不敢开始？不敢露脸怕被别人看到？",
    link: "/life/afraid-to-start-self-media",
  },
  {
    text: "AI时代，学习方式的变革：一天打造浏览器插件，我成了“产品经理+测试”",
    link: "/life/ai-learning-browser-plugin-product-manager",
  },
  {
    text: "代码写的垃圾是会被打的",
    link: "/life/bad-code-will-be-punished",
  },
  {
    text: "全自动写代码，博客全自动改造，一句话生成表情包动态图标，CodeX太好用了，我已经不自己写代码了",
    link: "/life/codex-auto-coding-blog-refactor",
  },
];
let life_yearly_flag_items = [
  { text: "年度总结与Flag", link: "/life/yearly-flags/" },
  { text: "25年的flag做到了多少？", link: "/life/yearly-flags/2025-flag-review" },
];
let life_graduation_milestone_items = [
  { text: "毕业节点复盘", link: "/life/graduation-milestones/" },
];
let life_follower_milestone_items = [
  { text: "粉丝里程碑", link: "/life/follower-milestones/" },
  { text: "【千粉纪念】一千个粉丝了，激情不再！", link: "/life/follower-milestones/1000-followers-passion-fades" },
  { text: "3000粉丝了，和兄弟们对齐下颗粒度", link: "/life/follower-milestones/3000-followers-self-media-review" },
];
let breakthrough_notes_items = [
  { text: "普通人的破局笔记", link: "/breakthrough-notes/" },
  {
    text: "找资源宝典：资源无界，打破信息壁垒-说明",
    link: "/breakthrough-notes/resource-treasure-manual",
  },
];
let nav_config = [
  // {
  //   text: "主站",
  //   link: "http://www.stardream.vip/",
  // },
  {
    text: "主页",
    link: "/",
  },
  {
    text: "文章导航",
    link: "/navigation/",
  },
  {
    text: "项目",
    link: "/projects/",
  },
  {
    text: "工具",
    link: "/spider-tools/",
  },
  {
    text: "博客会员",
    link: "/vip/",
  },
  {
    text: "人生感悟",
    link: "/life/",
  },
  {
    text: "破局笔记",
    link: "/breakthrough-notes/",
  },
  {
    text: "区块漫步",
    link: "/web3/block-walk/",
  },
  {
    text: "资源导航",
    link: "/nav/",
  },
    {
    text: "网站相关",
    items: web_intro_items,
  },
];
let sidebar_config = {
  "/": nav_config,
  "/spider-tools/": [],
  "/web3/": web3_items,
  "/python/": [
    {
      text: "Python之旅",
      collapsed: false,
      items: python_items,
    },
    {
      text: "FastAPI",
      collapsed: false,
      items: fast_api_items,
    },
    {
      text: "Django",
      collapsed: false,
      items: [
        { text: "Django笔记", link: "/python/web/django" },
        {
          text: "探索SimpleUI: 让Django Admin焕发现代光彩",
          link: "/python/web/simple-ui",
        },
      ],
    },
    {
      text: "系列文章",
      collapsed: false,
      items: [
        {
          text: "23种设计模式-Python",
          link: "/python/collection/23-design/",
        },
        {
          text: "PyQt6实战开发之旅",
          link: "/python/collection/PyQt6实战开发之旅",
        },
      ],
    },
    {
      text: "字幕提取器系列",
      collapsed: true,
      items: python_subtitle_extractor_items,
    },
    {
      text: "Python基础合集",
      collapsed: true,
      items: python_basics_imported_items,
    },
    {
      text: "Pygame游戏开发合集",
      collapsed: true,
      items: python_pygame_series_items,
    },
    {
      text: "PyQt6实战开发之旅-合集",
      collapsed: true,
      items: python_pyqt6_series_items,
    },
    {
      text: "Django-合集",
      collapsed: true,
      items: python_django_series_items,
    },
  ],
  "/web/": [
    {
      text: "前端",
      collapsed: false,
      items: frontend_items,
    },
  ],
  "/backend/": [
    {
      text: "后端",
      collapsed: false,
      items: backend_items,
    },
  ],
  "/life/": [
    {
      text: "人生感悟",
      collapsed: false,
      items: life_items,
    },
    {
      text: "年度总结与Flag",
      collapsed: false,
      items: life_yearly_flag_items,
    },
    {
      text: "毕业节点复盘",
      collapsed: false,
      items: life_graduation_milestone_items,
    },
    {
      text: "粉丝里程碑",
      collapsed: false,
      items: life_follower_milestone_items,
    },
  ],
  "/breakthrough-notes/": [
    {
      text: "普通人的破局笔记",
      collapsed: false,
      items: breakthrough_notes_items,
    },
  ],
  "/算法/": [
    {
      text: "算法",
      collapsed: false,
      items: algorithm_items,
    },
  ],
  "/好文推荐/": [
    {
      text: "程序员脱单指南",
      collapsed: false,
      items: [
        { text: "土味情话", link: "/好文推荐/twqh" },
        {
          text: "36计（待更新）",
          link: "/好文推荐/程序员脱单指南",
        },
        { text: "七步流程法（待更新）", link: "/好文推荐/程序员脱单指南" },
        {
          text: "开场白（待更新）",
          link: "/好文推荐/程序员脱单指南",
        },
        { text: "聊天技巧（待更新）", link: "/好文推荐/程序员脱单指南" },
      ],
    },
  ],
  "/web-intro/": [
    {
      text: "站长介绍",
      collapsed: false,
      items: web_intro_items,
    },
  ],
  "/spider/": [
    {
      text: "爬虫系列",
      collapsed: false,
      items: spider_items,
    },
    {
      text: "系列文章",
      collapsed: false,
      items: spider_set_items,
    },
    {
      text: "网络爬虫的反爬与反反爬博弈艺术鉴赏",
      collapsed: false,
      items: spider_anti_crawler_game_items,
    },
    {
      text: "DrissionPage自动化数据采集",
      collapsed: false,
      items: spider_drissionpage_imported_items,
    },
    {
      text: "DrissionPage自动化数据采集中间系统",
      collapsed: false,
      items: spider_drissionpage_system_items,
    },
    {
      text: "自动化填写问卷系列-Python-自动化",
      collapsed: false,
      items: spider_questionnaire_items,
    },
    {
      text: "Scrapy-合集",
      collapsed: false,
      items: spider_scrapy_series_items,
    },
  ],
  "/python/collection/23-design/": [
    {
      text: "0)23种设计模式-Python，优缺点场景与示例代码",
      link: "/python/collection/23-design/",
    },
    {
      text: "创建型模式",
      collapsed: false,
      items: [
        {
          text: "1)独一无二：探索单例模式在现代编程中的奥秘与实践",
          link: "/python/collection/23-design/独一无二：探索单例模式在现代编程中的奥秘与实践",
        },
        {
          text: "2)工厂方法模式：解锁灵活的对象创建策略",
          link: "/python/collection/23-design/工厂方法模式：解锁灵活的对象创建策略",
        },
        {
          text: "3)抽象工厂模式：深入探索面向对象设计的多样性",
          link: "/python/collection/23-design/抽象工厂模式：深入探索面向对象设计的多样性",
        },
        {
          text: "4)建造者模式：构造复杂对象的艺术",
          link: "/python/collection/23-design/建造者模式：构造复杂对象的艺术",
        },
        {
          text: "5)原型模式：复制对象的智能解决方案",
          link: "/python/collection/23-design/原型模式：复制对象的智能解决方案",
        },
      ],
    },
    {
      text: "结构型模式",
      collapsed: false,
      items: [
        {
          text: "6)适配器模式：连接不兼容接口的桥梁",
          link: "/python/collection/23-design/适配器模式：连接不兼容接口的桥梁",
        },
        {
          text: "7)代理模式：控制对象访问的智能方式",
          link: "/python/collection/23-design/代理模式：控制对象访问的智能方式",
        },
        {
          text: "8)桥接模式：解耦抽象与实现的设计艺术",
          link: "/python/collection/23-design/桥接模式：解耦抽象与实现的设计艺术",
        },
        {
          text: "9)装饰器模式：动态扩展对象功能的设计艺术",
          link: "/python/collection/23-design/装饰器模式：动态扩展对象功能的设计艺术",
        },
        {
          text: "10)外观模式：简化复杂系统的统一接口",
          link: "/python/collection/23-design/外观模式：简化复杂系统的统一接口",
        },
        {
          text: "11)组合模式：构建树形对象结构的设计艺术",
          link: "/python/collection/23-design/组合模式：构建树形对象结构的设计艺术",
        },
        {
          text: "12)享元模式：优化资源利用的高效策略",
          link: "/python/collection/23-design/享元模式：优化资源利用的高效策略",
        },
      ],
    },
    {
      text: "结构型模式",
      collapsed: false,
      items: [
        {
          text: "13)观察者模式：实现高效事件驱动编程的策略",
          link: "/python/collection/23-design/观察者模式：实现高效事件驱动编程的策略",
        },
        {
          text: "14)策略模式：灵活调整算法的设计精髓",
          link: "/python/collection/23-design/策略模式：灵活调整算法的设计精髓",
        },
        {
          text: "15)命令模式：封装操作为对象的强大技术",
          link: "/python/collection/23-design/命令模式：封装操作为对象的强大技术",
        },
        {
          text: "16)中介者模式：简化对象间通信的协调者",
          link: "/python/collection/23-design/中介者模式：简化对象间通信的协调者",
        },
        {
          text: "17)备忘录模式：恢复对象状态的智能方式",
          link: "/python/collection/23-design/备忘录模式：恢复对象状态的智能方式",
        },
        {
          text: "18)模板方法模式：定义算法骨架的设计策略",
          link: "/python/collection/23-design/模板方法模式：定义算法骨架的设计策略",
        },
        {
          text: "19)迭代器模式：统一访问集合元素的优雅方式",
          link: "/python/collection/23-design/迭代器模式：统一访问集合元素的优雅方式",
        },
        {
          text: "20)状态模式：管理对象状态转换的动态策略",
          link: "/python/collection/23-design/状态模式：管理对象状态转换的动态策略",
        },
        {
          text: "21)责任链模式：灵活处理请求的分级策略",
          link: "/python/collection/23-design/责任链模式：灵活处理请求的分级策略",
        },
        {
          text: "22)解释器模式：专为语言处理定制的模式",
          link: "/python/collection/23-design/解释器模式：专为语言处理定制的模式",
        },
        {
          text: "23)访问者模式：处理复杂对象结构的灵活方式",
          link: "/python/collection/23-design/访问者模式：处理复杂对象结构的灵活方式",
        },
      ],
    },
  ],
};
// https://vitepress.dev/reference/site-config
export default defineConfig({

  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  base: "/",
  transformPageData(pageData) {
    return {
      description: resolvePageDescription(pageData),
    };
  },
  transformHead({ page, pageData }) {
    const frontmatter = pageData.frontmatter || {};
    const title = resolvePageTitle(pageData);
    const description = resolvePageDescription(pageData);
    const url = pageToUrl(page);
    const noIndex = isNoIndexPage(page, frontmatter);
    const publishedAt = toIsoDate(frontmatter.created_at || frontmatter.date);
    const updatedAt = toIsoDate(frontmatter.updated_at || frontmatter.lastUpdated || frontmatter.created_at || frontmatter.date);
    const isHome = page === "index.md";

    const head = [
      ["link", { rel: "canonical", href: url }],
      ["meta", { name: "description", content: description }],
      ["meta", { name: "keywords", content: String(frontmatter.keywords || SITE_KEYWORDS) }],
      ["meta", { property: "og:locale", content: "zh_CN" }],
      ["meta", { property: "og:site_name", content: SITE_NAME }],
      ["meta", { property: "og:type", content: isHome ? "website" : "article" }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:image", content: String(frontmatter.image || DEFAULT_OG_IMAGE) }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:title", content: title }],
      ["meta", { name: "twitter:description", content: description }],
      ["meta", { name: "twitter:image", content: String(frontmatter.image || DEFAULT_OG_IMAGE) }],
    ];

    if (noIndex) {
      head.push(["meta", { name: "robots", content: "noindex,nofollow,noarchive" }]);
      return head;
    }

    const structuredData = isHome
      ? {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description,
          inLanguage: "zh-CN",
          publisher: {
            "@type": "Person",
            name: SITE_AUTHOR,
            url: `${SITE_URL}/web-intro/`,
          },
        }
      : {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: title,
          description,
          url,
          mainEntityOfPage: url,
          image: String(frontmatter.image || DEFAULT_OG_IMAGE),
          inLanguage: "zh-CN",
          author: {
            "@type": "Person",
            name: SITE_AUTHOR,
            url: `${SITE_URL}/web-intro/`,
          },
          publisher: {
            "@type": "Person",
            name: SITE_AUTHOR,
            url: `${SITE_URL}/web-intro/`,
          },
          ...(publishedAt ? { datePublished: publishedAt } : {}),
          ...(updatedAt ? { dateModified: updatedAt } : {}),
        };

    head.push(["script", { type: "application/ld+json" }, JSON.stringify(structuredData)]);
    return head;
  },
  buildEnd(siteConfig) {
    const urls = collectHtmlFiles(siteConfig.outDir)
      .map((filePath) => htmlFileToSitemapUrl(filePath, siteConfig.outDir))
      .filter(Boolean)
      .sort();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`)
      .join("\n")}\n</urlset>\n`;

    writeFileSync(join(siteConfig.outDir, "sitemap.xml"), sitemap, "utf-8");
  },
  head: [
    // 我的logo
    ["script", { src: "/js/cpython666.js" }], // <script src="https://gist.github.com/cpython666/94813553a7ac80b74cdf6fe0e9d6d079.js"></script>
    // ['script', {
    //   // async:true,
    //   src: 'https://gist.githubusercontent.com/cpython666/94813553a7ac80b74cdf6fe0e9d6d079/raw/8730dd7b808f5bcb8b0a01cce9d442f4bca0a228/cpython666.js',
    // }],

    // 像小鱼一样的鼠标
    // ['link', { rel: 'stylesheet', href: '/css/nomouse.css' }],
    ["link", { rel: "stylesheet", href: "/css/index.css" }],
    // 引入外部 JavaScript 文件
    // ['script', { src: '/js/pointer.js' }],

    // 星露谷物语的飞鸟
    ["script", { src: "/js/birdfly.js" }],
    // 鼠标拖尾
    ["script", { src: "/js/mouse-trail.js" }], // 引入自定义的 JavaScript 文件，前端反爬js文件

    // ["script", { src: "/js/copy.js" }], // 引入自定义的 JavaScript 文件，前端反爬js文件
    // ["script", { src: "/js/alertify.min.js" }], // 引入自定义的 JavaScript 文件，前端反爬js文件
    // ['script', { src: '/js/fuckspider.js' }],
    ["link", { rel: "icon", href: "/logo.svg" }], // 点击彩虹
    ["meta", { name: "author", content: SITE_AUTHOR }],
    ["meta", { name: "theme-color", content: "#20B0E3" }],
    ["meta", { name: "format-detection", content: "telephone=no" }],
    // <!--鼠标点击特效-->
    // ['script', { type: "text/javascript", src: '/js/clickjs/meme.js' }],
    ["script", { type: "text/javascript", src: "/js/clickjs/anime.min.js" }],
    ["script", { type: "text/javascript", src: "/js/clarity.js" }],
    [
      "script",
      {
        type: "text/javascript",
        src: "/js/clickjs/fireworks.js",
      },
    ],

    // <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

    //<script type="text/javascript" src="https://www.liuzehe.top/upload/bkjs/meme.js"></script>
    //<canvas class="fireworks" style="position:fixed;left:0;top:0;z-index:99999999;pointer-events:none;"></canvas>
    //<script type="text/javascript" src="https://www.liuzehe.top/upload/bkjs/anime.min.js"></script>
    //<script type="text/javascript" src="https://www.liuzehe.top/upload/bkjs/fireworks.js"></script>
    // 点击彩虹

    // <meta name="google-site-verification" content="0QTiVl6hixpkg_fJQSKH37g9Y5iqklaWYFXJRt20CgU" />
    // 谷歌搜索站点验证头标签
    // 未成功。。。
    [
      "meta",
      {
        name: "google-site-verification",
        content: "0QTiVl6hixpkg_fJQSKH37g9Y5iqklaWYFXJRt20CgU",
      },
    ],
    ["meta", { name: "referrer", content: "no-referrer" }], // 谷歌统计
    // [
    //   'script',
    //   { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=TAG_ID' }
    // ],
    // [
    //   'script',
    //   {},
    //   `window.dataLayer = window.dataLayer || [];
    //   function gtag(){dataLayer.push(arguments);}
    //   gtag('js', new Date());
    //   gtag('config', 'TAG_ID');`
    // ],
    // 百度统计
    [
      "script",
      {},
      `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?4febaf14d8d93b86f93e2dc8806a888c";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`,
    ], // 51.la统计
    [
      "script",
      {},
      `
    !function(p){"use strict";!function(t){var s=window,e=document,i=p,c="".concat("https:"===e.location.protocol?"https://":"http://","sdk.51.la/js-sdk-pro.min.js"),n=e.createElement("script"),r=e.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=c,n.id="LA_COLLECT",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:"3HxyEJbVZ8Mv2rgP",ck:"3HxyEJbVZ8Mv2rgP",hashMode:true});
      `,
    ],
    [
      "script",
      {},
      `
      function runtime(){
        // 初始时间，日/月/年 时:分:秒
        X = new Date("3/10/2022 15:32:00");
        Y = new Date();
        T = (Y.getTime()-X.getTime());
        M = 24*60*60*1000;
        a = T/M;
        A = Math.floor(a);
        b = (a-A)*24;
        B = Math.floor(b);
        c = (b-B)*60;
        C = Math.floor((b-B)*60);
        D = Math.floor((c-C)*60);
        //信息写入到DIV中
        document.getElementById("runtime").innerHTML = "星梦已启航: "+"<font style='color:#FFA500;font-weight:bold'>"+A+"</font>"+"天"+"<font style='color:#8A2BE2;font-weight:bold'>"+B+"</font>"+"小时<font style='color:#1DBF97;font-weight:bold'>"+C+"</font>分<font style='color:#007EC6;font-weight:bold'>"+D+"</font>秒"
    }
    setInterval(runtime, 1000);
      `,
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo_super.svg",
    nav: nav_config,
    sidebar: sidebar_config,
    outline: [2, 3, 4],
    socialLinks: [
      // https://vitepress.dev/zh/reference/default-theme-config#sociallinks
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" t="1711703428533" class="icon" viewBox="0 0 1129 1024" version="1.1" p-id="4271" width="200" height="200"><g><path d="M234.909 9.656a80.468 80.468 0 0 1 68.398 0 167.374 167.374 0 0 1 41.843 30.578l160.937 140.82h115.07l160.936-140.82a168.983 168.983 0 0 1 41.843-30.578A80.468 80.468 0 0 1 930.96 76.445a80.468 80.468 0 0 1-17.703 53.914 449.818 449.818 0 0 1-35.406 32.187 232.553 232.553 0 0 1-22.531 18.508h100.585a170.593 170.593 0 0 1 118.289 53.109 171.397 171.397 0 0 1 53.914 118.288v462.693a325.897 325.897 0 0 1-4.024 70.007 178.64 178.64 0 0 1-80.468 112.656 173.007 173.007 0 0 1-92.539 25.75h-738.7a341.186 341.186 0 0 1-72.421-4.024A177.835 177.835 0 0 1 28.91 939.065a172.202 172.202 0 0 1-27.36-92.539V388.662a360.498 360.498 0 0 1 0-66.789A177.03 177.03 0 0 1 162.487 178.64h105.414c-16.899-12.07-31.383-26.555-46.672-39.43a80.468 80.468 0 0 1-25.75-65.984 80.468 80.468 0 0 1 39.43-63.57M216.4 321.873a80.468 80.468 0 0 0-63.57 57.937 108.632 108.632 0 0 0 0 30.578v380.615a80.468 80.468 0 0 0 55.523 80.469 106.218 106.218 0 0 0 34.601 5.632h654.208a80.468 80.468 0 0 0 76.444-47.476 112.656 112.656 0 0 0 8.047-53.109v-354.06a135.187 135.187 0 0 0 0-38.625 80.468 80.468 0 0 0-52.304-54.719 129.554 129.554 0 0 0-49.89-7.242H254.22a268.764 268.764 0 0 0-37.82 0z m0 0" p-id="4272"/><path d="M348.369 447.404a80.468 80.468 0 0 1 55.523 18.507 80.468 80.468 0 0 1 28.164 59.547v80.468a80.468 80.468 0 0 1-16.094 51.5 80.468 80.468 0 0 1-131.968-9.656 104.609 104.609 0 0 1-10.46-54.719v-80.468a80.468 80.468 0 0 1 70.007-67.593z m416.02 0a80.468 80.468 0 0 1 86.102 75.64v80.468a94.148 94.148 0 0 1-12.07 53.11 80.468 80.468 0 0 1-132.773 0 95.757 95.757 0 0 1-12.875-57.133V519.02a80.468 80.468 0 0 1 70.007-70.812z m0 0" p-id="4273"/><!-- <animate attributeName="fill" from="#20B0E3" to="blue" dur="2s" repeatCount="indefinite" /> --><animate attributeName="fill" values="#20B0E3;red;orange;yellow;green;cyan;blue;purple;#20B0E3" dur="3s" repeatCount="indefinite"/></g></svg>',
          // svg: '<svg t="1711703428533" class="icon" viewBox="0 0 1129 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4271" width="200" height="200"><path d="M234.909 9.656a80.468 80.468 0 0 1 68.398 0 167.374 167.374 0 0 1 41.843 30.578l160.937 140.82h115.07l160.936-140.82a168.983 168.983 0 0 1 41.843-30.578A80.468 80.468 0 0 1 930.96 76.445a80.468 80.468 0 0 1-17.703 53.914 449.818 449.818 0 0 1-35.406 32.187 232.553 232.553 0 0 1-22.531 18.508h100.585a170.593 170.593 0 0 1 118.289 53.109 171.397 171.397 0 0 1 53.914 118.288v462.693a325.897 325.897 0 0 1-4.024 70.007 178.64 178.64 0 0 1-80.468 112.656 173.007 173.007 0 0 1-92.539 25.75h-738.7a341.186 341.186 0 0 1-72.421-4.024A177.835 177.835 0 0 1 28.91 939.065a172.202 172.202 0 0 1-27.36-92.539V388.662a360.498 360.498 0 0 1 0-66.789A177.03 177.03 0 0 1 162.487 178.64h105.414c-16.899-12.07-31.383-26.555-46.672-39.43a80.468 80.468 0 0 1-25.75-65.984 80.468 80.468 0 0 1 39.43-63.57M216.4 321.873a80.468 80.468 0 0 0-63.57 57.937 108.632 108.632 0 0 0 0 30.578v380.615a80.468 80.468 0 0 0 55.523 80.469 106.218 106.218 0 0 0 34.601 5.632h654.208a80.468 80.468 0 0 0 76.444-47.476 112.656 112.656 0 0 0 8.047-53.109v-354.06a135.187 135.187 0 0 0 0-38.625 80.468 80.468 0 0 0-52.304-54.719 129.554 129.554 0 0 0-49.89-7.242H254.22a268.764 268.764 0 0 0-37.82 0z m0 0" fill="#20B0E3" p-id="4272"></path><path d="M348.369 447.404a80.468 80.468 0 0 1 55.523 18.507 80.468 80.468 0 0 1 28.164 59.547v80.468a80.468 80.468 0 0 1-16.094 51.5 80.468 80.468 0 0 1-131.968-9.656 104.609 104.609 0 0 1-10.46-54.719v-80.468a80.468 80.468 0 0 1 70.007-67.593z m416.02 0a80.468 80.468 0 0 1 86.102 75.64v80.468a94.148 94.148 0 0 1-12.07 53.11 80.468 80.468 0 0 1-132.773 0 95.757 95.757 0 0 1-12.875-57.133V519.02a80.468 80.468 0 0 1 70.007-70.812z m0 0" fill="#20B0E3" p-id="4273"></path></svg>'
        },
        link: "https://space.bilibili.com/1909782963",
      },
      { icon: "github", link: "https://github.com/cpython666" },
      {
        icon: {
          svg: '<svg t="1711708617267" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5302" width="200" height="200"><path d="M0 0h1024v1024H0z" fill="#FF6633" p-id="5303"></path><path d="M698.9824 42.3936c-158.8736-32.5632-289.536 31.2832-324.9152 48.5888-94.72 46.2848-147.712 108.288-174.4896 140.288-25.9584 31.0272-82.7392 105.9328-108.288 215.8592-21.6576 93.1328-10.752 167.7824-6.0416 194.2528 11.4688 64.3072 33.28 186.88 150.4256 275.2 132.5056 99.8912 293.4784 85.5552 342.9888 80.9472 107.264-10.0352 289.4848-57.2928 300.8512-145.7152 5.1712-39.936-24.4224-89.4464-66.2016-102.5024-65.6384-20.5312-108.3392 63.5392-228.6592 80.9472-8.5504 1.2288-126.5664 16.6912-216.6272-48.5888-105.8816-76.6976-98.9696-211.3024-96.256-264.3968 1.536-30.5664 5.5808-93.5424 48.128-161.8944 14.7968-23.7568 60.3136-94.5664 156.4672-134.912 25.2928-10.5984 76.8512-31.5904 144.4352-26.9824 70.0416 4.7616 120.9856 34.5088 144.4352 48.5888 75.8272 45.4144 86.528 90.0608 120.3712 86.3232 35.8912-3.9424 69.9904-59.2896 66.2016-107.9296-7.424-93.7984-155.5968-158.1056-252.8256-178.0736z" fill="#FFFFFF" p-id="5304"></path></svg>',
        },
        link: "https://codefly.blog.csdn.net/",
      },
      {
        icon: {
          svg: '<svg t="1711724017028" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4251" width="200" height="200"><path d="M228.7 643.9c-0.1 0.1-0.2 0.3-0.3 0.4 3.9-4.4 8-9 12-13.5-7.5 8.4-11.7 13.1-11.7 13.1z" fill="#1590E9" p-id="4252"></path><path d="M894 298.1l25.6-15.1c10.4-6.1 9.1-21.5-2.1-25.9l-12.3-4.8c-18-7.1-34.2-18.2-46.7-33-15.7-18.5-44.7-45.1-90.9-60.8-52.7-18-142.9-14.4-193.2-10.5-15.9 1.2-25 18.4-17.4 32.5 42.6 78.6 16.7 114.3-5.7 140.7-34.3 40.4-97.4 112.2-160.7 183.6 21.9-24.5 41.8-46.8 58.1-65.1 36.4-40.8 91.3-61.5 145.1-51.7 171.5 31.3 191 253.4-9.2 385.6 26.1-1.4 52.6-3.3 79.2-6 252.6-26 272.6-232.1 218-333.9-19.4-36.1-22.2-60.5-20.1-83.9 2-21.5 13.8-40.8 32.3-51.7z" fill="#99C236" p-id="4253"></path><path d="M212.8 704.5C241.1 672.9 316 589 390.7 504.7c-54.6 61.2-121.8 136.7-177.9 199.8z" fill="#1590E9" p-id="4254"></path><path d="M216.3 758.6c-19.5-2.5-28.2-25.6-15.5-40.6-51.7 58.3-91.7 103.5-99.1 112.6-24.1 29.5 247.7 97.9 482.6-56.8 0.1-0.1 0.3-0.2 0.4-0.3-156.5 8.2-298.5-5.9-368.4-14.9z" fill="#CAC134" p-id="4255"></path><path d="M593.9 387.9c-53.8-9.8-108.7 10.9-145.1 51.7-16.3 18.2-36.2 40.5-58.1 65.1C316 589 241.1 672.9 212.8 704.5c-4.1 4.6-8.1 9.1-12 13.5-12.7 14.9-4 38 15.5 40.6 69.9 9 211.9 23.1 368.3 15 200.2-132.3 180.8-354.4 9.3-385.7z" fill="#029F40" p-id="4256"></path></svg>',
        },
        link: "https://www.yuque.com/python666",
      },
    ],

    // 编辑链接
    editLink: {
      pattern: "https://github.com/cpython666/cpython666.github.io", // 自己项目仓库地址
      text: "在 github 上编辑此页",
    },
    footer: {
      message: `本站收录内容源自互联网，不对其网站内容或交易负责。&ensp;|&ensp;如有内容侵犯权益，请联系站长删除相关内容！`,
      copyright:
        '<a href="https://space.bilibili.com/1909782963" target="_blank">Copyright © 2024 IT.Python斗罗</a>&ensp;|&ensp;<span id="runtime"></span>',
    },
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    outlineTitle: "本页目录",
    lastUpdated: true,
    markdown: {
      lineNumbers: true,
      image: {
        // 默认禁用图片懒加载
        lazyLoading: true,
      },
    },
    search: {
      provider: "local",
    }, // carbonAds: {
    //   code: '广告',
    //   placement: '广告'
    // }
    // 会员相关（示例激活码，可在此处配置多个，支持明文或SHA-256哈希）
    vipActivationHashes: ["8873ecdec2da162100e9bd7789ecb8bd7b0ea671d784853b7dde966bf05e510e"],
    blogNavExclude: ["/nav/","/spider-tools/"],
    blogNavTitles: {
      "/backend/": "后端",
      "/breakthrough-notes/": "普通人的破局笔记",
      "/life/": "人生感悟",
      "/life/follower-milestones/": "粉丝里程碑",
      "/life/graduation-milestones/": "毕业节点复盘",
      "/life/yearly-flags/": "年度总结与Flag",
      "/python/": "Python",
      "/python/collection/23-design/": "23种设计模式-Python",
      "/spider/": "爬虫",
      "/web/": "前端",
      "/web-intro/": "网站相关",
      "/web3/": "币圈入圈指南",
      "/好文推荐/": "好文推荐",
      "/算法/": "算法",
    },
  },
    define: {
    __API_BASE__: JSON.stringify('https://api.example.com'),
    __APP_VERSION__: '"1.0.0"',
  }
});
