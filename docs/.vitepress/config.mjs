import { defineConfig } from 'vitepress'

let nav_tmp=[
  {
    text: '主页',link: '/'
  },
  {
    text: '爬虫',
    items: [
      { text: '学习指南', link: '/爬虫/学习指南' },
      { text: '买课指南', link: '/爬虫/买课指南' },
      { text: '学习路线', link: '/爬虫/学习路线' },
      { text: '学习资源', link: '/爬虫/学习资源' },
      { text: '视频源码', link: '/爬虫/视频源码' },
    ]
  },
  { text: 'Python', link: '/Python/' },
  { text: '前端', link: '/前端/' },
  { 
    text: '站长介绍',
    items:[
      { text: '站长介绍', link: '/站长介绍/' },
      { text: '团队介绍', link: '/站长介绍/团队介绍' },
    ]},
  { text: '支持', link: '/支持/' },

]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "星梦启航",
  description: "Python斗罗的代码笔记",
  base:'/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav_tmp,
    sidebar: nav_tmp,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cpython666/StarDream-VitePress' }
    ],
    footer: {
      message: `<meta name="referrer" content="no-referrer">
      本站收录内容源自互联网，不对其网站内容或交易负责。如有内容侵犯权益，请联系站长删除相关内容！<br/>
      <a href="https://beian.miit.gov.cn/" target="_blank">鄂ICP备2022009482号</a>
      `,
      copyright: '<a href="https://space.bilibili.com/1909782963" target="_blank">Copyright © 2024 IT.Python斗罗</a>',
    },
    markdown: {
      lineNumbers: true,
      image: {
        // 默认禁用图片懒加载
        lazyLoading: true
      }
    },
    search: {
      provider: 'local'
    }
    
  }
})
