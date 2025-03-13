import {defineConfig} from "vitepress";

let fast_api_items = [
    {
        text: "现代、高性能的PythonWeb框架: FastAPI",
        link: "/python/web/fastapi",
    },
    {text: "Python标准库: typing", link: "/python/web/typing"},
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
];
let spider_items = [
    {text: "学习路线", link: "/spider/learn-road"},
    {
        text: "学习资源",
        link: "/spider/learn-resource",
    },
    {text: "学习指南", link: "/spider/学习指南"},
    {text: "买课指南", link: "/spider/买课指南"},
    {
        text: "视频源码",
        link: "/spider/source-code",
    },
    {text: "练手网站", link: "/spider/练手网站"},
];
let spider_set_items = [
    {text: "常用hook代码片段", link: "/spider/collection/hook"},
    {
        text: "ast详解",
        link: "/spider/collection/ast",
    },
    {text: "浏览器指纹详解", link: "/spider/collection/browser-fingerprint"},
    {
        text: "DrissionPage学习笔记",
        link: "/spider/collection/drissionpage",
    },
    {text: "Scrapy学习笔记", link: "/spider/collection/scrapy"},
    {
        text: "Crawlab使用记录",
        link: "/spider/collection/crawlab",
    },
];
let python_items = [
    {text: "学习路线", link: "/python/学习路线"},
    {
        text: "学习资源",
        link: "/python/学习资源",
    },
    {text: "学习指南", link: "/python/学习指南"},
    {text: "买课指南", link: "/python/买课指南"},
    {
        text: "视频源码",
        link: "/python/视频源码",
    },
    {text: "常用命令", link: "/python/shorthand"},
];
let python_col_items = [
    {
        text: "23种设计模式-Python",
        link: "/python/collection/23种设计模式/",
    },
    {
        text: "PyQt6实战开发之旅",
        link: "/python/collection/pyqt6",
    },
    {text: "分布式任务队列工具：Celery", link: "/python/collection/celery"},
];
let backend_items = [
    {text: "git笔记", link: "/backend/git笔记"},
    {
        text: "docker笔记",
        link: "/backend/docker笔记",
    },
    {text: "nginx笔记", link: "/backend/nginx笔记"},
    {text: "布隆过滤器", link: "/backend/布隆过滤器"},
];
let web_intro_items = [
    {text: "站长介绍", link: "/web-intro/"},
    {
        text: "团队介绍",
        link: "/web-intro/team-intro",
    },
    {text: "开发缘由", link: "/web-intro/development-origins"},
    {
        text: "开发日记",
        link: "/web-intro/development-diary",
    },
    {text: "交流群", link: "/web-intro/community-group"},
    {text: "支持", link: "/web-intro/support"},
    {
        text: "旧版首页",
        link: "/index/old/index-0.1",
    },
];
let nav_tmp = [
    {
        text: "主站",
        link: "http://www.stardream.vip/",
    },
    {
        text: "主页",
        link: "/",
    },
    {
        text: "工具",
        link: "/spider-tools/",
    },
    {
        text: "资源导航",
        link: "/nav/",
    },
    {
        text: "爬虫",
        items: [
            {
                text: "关于爬虫",
                items: spider_items,
            },
            {
                text: "系列文章",
                items: spider_set_items,
            },
        ],
    },

    {
        text: "Python",
        items: [
            {
                text: "Python",
                items: python_items,
            },

            {
                text: "FastAPI",
                items: fast_api_items,
            },
            {
                text: "Django",
                items: [
                    {
                        text: "Django笔记",
                        link: "/python/web/django",
                    },
                    {
                        text: "探索SimpleUI: 让Django Admin焕发现代光彩",
                        link: "/python/web/simple-ui",
                    },
                ],
            },

            {
                text: "系列文章",
                items: python_col_items,
            },
        ],
    },
    {
        text: "算法",
        items: [
            {
                text: "探索递归：从简单到复杂的迷人之旅",
                link: "/算法/递归",
            },
            {
                text: "探索广度优先搜索（BFS）：从概念到实践",
                link: "/算法/bfs",
            },
            {text: "深度优先搜索（DFS）：探索图的无尽可能性", link: "/算法/dfs"},
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
        ],
    },
    {
        text: "前端",
        items: [
            {text: "HTML", link: "/web/html"},
            {text: "CSS", link: "/web/css"},
            {
                text: "JS",
                link: "/web/js",
            },
            {text: "JQuery", link: "/web/jquery"},
            {text: "NodeJs", link: "/web/nodejs"},
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
        ],
    },
    {
        text: "后端",
        items: backend_items,
    },
    {
        text: "网站相关",
        items: web_intro_items,
    },
    {text: "程序员脱单指南", link: "/好文推荐/程序员脱单指南"}, // { text: '好文推荐', link: '/好文推荐/' },
];
let sidebar_tmp = {
    "/": nav_tmp,
    "/spider-tools/": [],
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
                {text: "Django笔记", link: "/python/web/django"},
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
                    link: "/python/collection/23种设计模式/",
                },
                {
                    text: "PyQt6实战开发之旅",
                    link: "/python/collection/PyQt6实战开发之旅",
                },
            ],
        },
    ],
    "/backend/": [
        {
            text: "后端",
            collapsed: false,
            items: backend_items,
        },
    ],
    "/好文推荐/": [
        {
            text: "程序员脱单指南",
            collapsed: false,
            items: [
                {text: "土味情话", link: "/好文推荐/twqh"},
                {
                    text: "36计（待更新）",
                    link: "/好文推荐/程序员脱单指南",
                },
                {text: "七步流程法（待更新）", link: "/好文推荐/程序员脱单指南"},
                {
                    text: "开场白（待更新）",
                    link: "/好文推荐/程序员脱单指南",
                },
                {text: "聊天技巧（待更新）", link: "/好文推荐/程序员脱单指南"},
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
    ],
    "/python/collection/23种设计模式/": [
        {
            text: "0)23种设计模式-Python，优缺点场景与示例代码",
            link: "/python/collection/23种设计模式/",
        },
        {
            text: "创建型模式",
            collapsed: false,
            items: [
                {
                    text: "1)独一无二：探索单例模式在现代编程中的奥秘与实践",
                    link: "/python/collection/23种设计模式/独一无二：探索单例模式在现代编程中的奥秘与实践",
                },
                {
                    text: "2)工厂方法模式：解锁灵活的对象创建策略",
                    link: "/python/collection/23种设计模式/工厂方法模式：解锁灵活的对象创建策略",
                },
                {
                    text: "3)抽象工厂模式：深入探索面向对象设计的多样性",
                    link: "/python/collection/23种设计模式/抽象工厂模式：深入探索面向对象设计的多样性",
                },
                {
                    text: "4)建造者模式：构造复杂对象的艺术",
                    link: "/python/collection/23种设计模式/建造者模式：构造复杂对象的艺术",
                },
                {
                    text: "5)原型模式：复制对象的智能解决方案",
                    link: "/python/collection/23种设计模式/原型模式：复制对象的智能解决方案",
                },
            ],
        },
        {
            text: "结构型模式",
            collapsed: false,
            items: [
                {
                    text: "6)适配器模式：连接不兼容接口的桥梁",
                    link: "/python/collection/23种设计模式/适配器模式：连接不兼容接口的桥梁",
                },
                {
                    text: "7)代理模式：控制对象访问的智能方式",
                    link: "/python/collection/23种设计模式/代理模式：控制对象访问的智能方式",
                },
                {
                    text: "8)桥接模式：解耦抽象与实现的设计艺术",
                    link: "/python/collection/23种设计模式/桥接模式：解耦抽象与实现的设计艺术",
                },
                {
                    text: "9)装饰器模式：动态扩展对象功能的设计艺术",
                    link: "/python/collection/23种设计模式/装饰器模式：动态扩展对象功能的设计艺术",
                },
                {
                    text: "10)外观模式：简化复杂系统的统一接口",
                    link: "/python/collection/23种设计模式/外观模式：简化复杂系统的统一接口",
                },
                {
                    text: "11)组合模式：构建树形对象结构的设计艺术",
                    link: "/python/collection/23种设计模式/组合模式：构建树形对象结构的设计艺术",
                },
                {
                    text: "12)享元模式：优化资源利用的高效策略",
                    link: "/python/collection/23种设计模式/享元模式：优化资源利用的高效策略",
                },
            ],
        },
        {
            text: "结构型模式",
            collapsed: false,
            items: [
                {
                    text: "13)观察者模式：实现高效事件驱动编程的策略",
                    link: "/python/collection/23种设计模式/观察者模式：实现高效事件驱动编程的策略",
                },
                {
                    text: "14)策略模式：灵活调整算法的设计精髓",
                    link: "/python/collection/23种设计模式/策略模式：灵活调整算法的设计精髓",
                },
                {
                    text: "15)命令模式：封装操作为对象的强大技术",
                    link: "/python/collection/23种设计模式/命令模式：封装操作为对象的强大技术",
                },
                {
                    text: "16)中介者模式：简化对象间通信的协调者",
                    link: "/python/collection/23种设计模式/中介者模式：简化对象间通信的协调者",
                },
                {
                    text: "17)备忘录模式：恢复对象状态的智能方式",
                    link: "/python/collection/23种设计模式/备忘录模式：恢复对象状态的智能方式",
                },
                {
                    text: "18)模板方法模式：定义算法骨架的设计策略",
                    link: "/python/collection/23种设计模式/模板方法模式：定义算法骨架的设计策略",
                },
                {
                    text: "19)迭代器模式：统一访问集合元素的优雅方式",
                    link: "/python/collection/23种设计模式/迭代器模式：统一访问集合元素的优雅方式",
                },
                {
                    text: "20)状态模式：管理对象状态转换的动态策略",
                    link: "/python/collection/23种设计模式/状态模式：管理对象状态转换的动态策略",
                },
                {
                    text: "21)责任链模式：灵活处理请求的分级策略",
                    link: "/python/collection/23种设计模式/责任链模式：灵活处理请求的分级策略",
                },
                {
                    text: "22)解释器模式：专为语言处理定制的模式",
                    link: "/python/collection/23种设计模式/解释器模式：专为语言处理定制的模式",
                },
                {
                    text: "23)访问者模式：处理复杂对象结构的灵活方式",
                    link: "/python/collection/23种设计模式/访问者模式：处理复杂对象结构的灵活方式",
                },
            ],
        },
    ],
};
// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "星梦启航",
    description: "Python斗罗的代码笔记",
    base: "/",
    head: [
        // 我的logo
        ["script", {src: "/js/cpython666.js"}], // <script src="https://gist.github.com/cpython666/94813553a7ac80b74cdf6fe0e9d6d079.js"></script>
        // ['script', {
        //   // async:true,
        //   src: 'https://gist.githubusercontent.com/cpython666/94813553a7ac80b74cdf6fe0e9d6d079/raw/8730dd7b808f5bcb8b0a01cce9d442f4bca0a228/cpython666.js',
        // }],

        // 像小鱼一样的鼠标
        // ['link', { rel: 'stylesheet', href: '/css/nomouse.css' }],
        // 引入外部 JavaScript 文件
        // ['script', { src: '/js/pointer.js' }],

        // 星露谷物语的飞鸟
        ["script", {src: "/js/birdfly.js"}],

        // 鼠标拖尾
        ["script", {src: "/js/mouse-trail.js"}], // 引入自定义的 JavaScript 文件，前端反爬js文件
        // ['script', { src: '/js/fuckspider.js' }],
        ["link", {rel: "icon", href: "/logo.svg"}], // 点击彩虹
        // <!--鼠标点击特效-->
        // ['script', { type: "text/javascript", src: '/js/clickjs/meme.js' }],
        ["script", {type: "text/javascript", src: "/js/clickjs/anime.min.js"}],
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
        ["meta", {name: "referrer", content: "no-referrer"}], // 谷歌统计
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
        nav: nav_tmp,
        sidebar: sidebar_tmp,
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
            {icon: "github", link: "https://github.com/cpython666"},
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
    },
});
