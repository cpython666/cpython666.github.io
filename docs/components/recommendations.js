export const recommendationGroups = [
  {
    id: 'sponsors', title: '赞助', label: '感谢支持',
    description: '感谢这些伙伴，让分享可以一直继续。',
    items: [
      { name: '莱卡云', category: '云服务器', logo: 'lky.webp', wide: true, description: '为博客、个人网站与学习项目，找一台合适的云服务器。', tags: ['网站部署', '云主机'], link: 'https://www.lcayun.com/aff/DECEDOZS', cta: '了解产品' },
      { name: '猿人学', category: '爬虫学习', logo: 'yrx.webp', wide: true, description: '通过实战题目练习数据采集，积累爬虫与逆向经验。', tags: ['实战练习', '技术进阶'], link: 'https://match.yuanrenxue.cn/', cta: '去挑战' },
      { name: '青果网络', category: '代理 IP', logo: 'qgwl.webp', wide: true, description: '按项目需求选择代理 IP，为数据采集准备网络资源。', tags: ['代理 IP', '数据采集'], link: 'https://www.qg.net/product/proxyip.html?source=star', cta: '了解产品' },
    ],
  },
  {
    id: 'products', title: '产品推荐', label: '站长在用',
    description: 'AI 编程额度与订阅服务，按自己的使用方式选择。',
    items: [
      { name: 'XFastAPI', category: 'AI 编程中转', logo: '/imgs/sponsors/xfastapi_logo.svg', kind: 'relay', featured: true, badge: '优先推荐', description: 'Codex / Claude Code 额度不够用？为日常编程补充 API 额度。', tags: ['无需翻墙', '低价额度'], link: 'https://xfastapi.ai/register?aff=8XQ944ESTPWY', cta: '邀请注册' },
      { name: 'HeyRoute', category: 'AI 编程中转', logo: 'heyroute.webp', kind: 'relay', description: '一个 API Key，接入 Codex、Claude Code 和 OpenAI 兼容客户端。', tags: ['统一接口', '多客户端'], link: 'https://heyroute.ai/stardream', cta: '邀请注册' },
      { name: 'WildAI · Bewild', category: 'AI 订阅代充', mark: 'W', badge: '好友减 $1', tone: 'violet', description: '我在用的 ChatGPT / Claude 订阅代充服务，使用自己的账号订阅。', tags: ['ChatGPT', 'Claude'], note: '通过邀请链接订阅：好友减 $1，站长获 $1 奖励；适用条件以平台规则为准。', link: 'https://bewild.ai/?code=STARLOOK', cta: '使用邀请优惠' },
      { name: 'FastAI', category: 'AI 模型中转', mark: 'F', kind: 'relay', description: '另一种 API 额度选择，按模型与渠道查看价格和可用状态。', tags: ['按需选渠道', 'API 额度'], link: 'https://www.fastaitoken.com/register?aff=B4QFWEEW5VKT', cta: '邀请注册' },
    ],
  },
  {
    id: 'opensource', title: '免费开源', label: '自己做的小工具',
    description: '从自己的日常需求出发，也希望能帮到你。',
    items: [
      { name: '星笺 Starclip', category: '剪贴板管理', logo: 'starclip.webp', description: '找回复制过的文字、链接与代码，用星标和分组整理常用内容。', tags: ['本地历史', '收藏分组'], link: 'https://github.com/cpython666/starclip', cta: '源码与下载' },
      { name: '星镜 Starshot', category: '截图与标注', logo: 'starshot.webp', description: '截图、标注、置顶贴图，再加一点留白与背景，让分享更好看。', tags: ['截图标注', '图片美化'], link: 'https://github.com/cpython666/starshot', cta: '源码与下载' },
      { name: '星匣 StarVault', category: 'AI 聊天记录备份', logo: 'starvault.webp', description: '把分散的 AI 对话收进自己的长期档案，方便检索、回溯与迁移。', tags: ['会话归档', '私有仓库备份'], link: 'https://github.com/cpython666/starvault', cta: '源码与下载' },
    ],
  },
]
