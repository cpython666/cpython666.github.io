# 星梦启航公开文章目录

共 275 篇，按栏目分组，每条是“标题（日期）：摘要”。只收公开文章，会员文章和草稿不在其中。需要全文时打开链接阅读。

## Python

- [Python买课指南](https://cpython666.github.io/python/买课指南)：学 Python 需要买课吗？我的答案是 B 站就够了，而且是最顶级的资源。
- [视频配套源码](https://cpython666.github.io/python/视频源码)：视频配套源码合集，包含两分钟搞定的连点器脚本等示例代码，支持热键启停。
- [Python学习路线](https://cpython666.github.io/python/学习路线)：纯原创的 Python 学习路线：从 Python 是什么、优缺点、如何安装、pip 与镜像源、requirements.txt 到虚拟环境与 conda 的使用。
- [Python学习资源](https://cpython666.github.io/python/学习资源)：Python 学习资源汇总，收录值得长期使用的教程、文档与社区入口。
- [备忘录模式：恢复对象状态的智能方式](https://cpython666.github.io/python/collection/23-design/备忘录模式：恢复对象状态的智能方式)：备忘录模式在不破坏封装的前提下捕获并外部化对象的内部状态，是实现撤销与回滚的关键机制。Python 讲解实现与优缺点。
- [策略模式：灵活调整算法的设计精髓](https://cpython666.github.io/python/collection/23-design/策略模式：灵活调整算法的设计精髓)：策略模式把一组算法各自封装起来，使它们可以互换并独立于调用方，从而支持运行时切换行为。Python 讲解实现与优缺点。
- [抽象工厂模式：深入探索面向对象设计的多样性](https://cpython666.github.io/python/collection/23-design/抽象工厂模式：深入探索面向对象设计的多样性)：抽象工厂模式提供高层接口来创建一系列相关或依赖的对象，无需指定具体类。Python 讲解实现要点，并对比工厂方法模式。
- [代理模式：控制对象访问的智能方式](https://cpython666.github.io/python/collection/23-design/代理模式：控制对象访问的智能方式)：代理模式为目标对象加一层占位符来控制访问，常用于权限校验、延迟初始化和远程调用。Python 讲解实现方式与优缺点。
- [迭代器模式：统一访问集合元素的优雅方式](https://cpython666.github.io/python/collection/23-design/迭代器模式：统一访问集合元素的优雅方式)：迭代器模式在不暴露内部表示的前提下顺序访问聚合对象的元素，是 Python 遍历机制的核心。讲解实现、应用与优缺点。
- [单例模式：独一无二：探索单例模式在现代编程中的奥秘与实践](https://cpython666.github.io/python/collection/23-design/独一无二：探索单例模式在现代编程中的奥秘与实践)：单例模式确保一个类只有一个实例并提供全局访问点。Python 给出类属性和装饰器两种实现，并分析它的缺点、限制与替代方案。
- [访问者模式：处理复杂对象结构的灵活方式](https://cpython666.github.io/python/collection/23-design/访问者模式：处理复杂对象结构的灵活方式)：访问者模式把操作从对象结构中剥离出来，可以在不改动既有结构的前提下新增操作，特别适合树形结构。Python 讲解实现与优缺点。
- [工厂方法模式：解锁灵活的对象创建策略](https://cpython666.github.io/python/collection/23-design/工厂方法模式：解锁灵活的对象创建策略)：工厂方法模式把实例化推迟到子类，让创建过程与具体类解耦。Python 讲解实现方式、应用场景，并对比简单工厂模式的差异。
- [观察者模式：实现高效事件驱动编程的策略](https://cpython666.github.io/python/collection/23-design/观察者模式：实现高效事件驱动编程的策略)：观察者模式又称发布-订阅，对象状态变化时自动通知所有依赖方，是事件监听与响应编程的基石。Python 讲解实现与优缺点。
- [建造者模式：构造复杂对象的艺术](https://cpython666.github.io/python/collection/23-design/建造者模式：构造复杂对象的艺术)：建造者模式把对象的构造代码与表示代码分离，同一套构建流程可以产出不同表示。Python 讲解实现、应用实例与优缺点。
- [解释器模式：专为语言处理定制的模式](https://cpython666.github.io/python/collection/23-design/解释器模式：专为语言处理定制的模式)：解释器模式定义一套语法并提供解释器来求值表达式，适用于需要处理简单自定义语言的场景。Python 讲解实现与优缺点。
- [命令模式：封装操作为对象的强大技术](https://cpython666.github.io/python/collection/23-design/命令模式：封装操作为对象的强大技术)：命令模式把请求封装成对象，从而支持请求排队、记录日志和撤销操作。Python 讲解定义、实现、应用实例与优缺点。
- [模板方法模式：定义算法骨架的设计策略](https://cpython666.github.io/python/collection/23-design/模板方法模式：定义算法骨架的设计策略)：模板方法模式在父类里定好算法骨架，子类只重定义其中某些步骤而不改动整体结构。Python 讲解抽象类实现与优缺点。
- [桥接模式：解耦抽象与实现的设计艺术](https://cpython666.github.io/python/collection/23-design/桥接模式：解耦抽象与实现的设计艺术)：桥接模式用组合替代继承，把抽象与实现拆成两条可独立演化的维度，在多平台开发中尤其好用。Python 讲解实现与优缺点。
- [适配器模式：连接不兼容接口的桥梁](https://cpython666.github.io/python/collection/23-design/适配器模式：连接不兼容接口的桥梁)：适配器模式让互不兼容的接口协同工作，常见于系统升级和集成第三方库时。Python 讲解实现方式、应用实例与优缺点。
- [外观模式：简化复杂系统的统一接口](https://cpython666.github.io/python/collection/23-design/外观模式：简化复杂系统的统一接口)：外观模式用一个高层接口封装复杂子系统，让客户端以简单的方式完成调用。Python 讲解定义、实现、应用实例与优缺点。
- [享元模式：优化资源利用的高效策略](https://cpython666.github.io/python/collection/23-design/享元模式：优化资源利用的高效策略)：享元模式通过共享相似对象来削减内存占用，适合处理大量细粒度对象的场景。Python 讲解内部状态与外部状态的划分、实现与优缺点。
- [原型模式：复制对象的智能解决方案](https://cpython666.github.io/python/collection/23-design/原型模式：复制对象的智能解决方案)：当对象初始化涉及数据库读取、IO 或复杂计算时，原型模式通过复制现有实例来规避高昂的创建成本。Python 讲解深浅拷贝与实现要点。
- [责任链模式：灵活处理请求的分级策略](https://cpython666.github.io/python/collection/23-design/责任链模式：灵活处理请求的分级策略)：责任链模式把接收者串成一条链，请求沿链传递直到被处理，从而解耦发送方与接收方。Python 讲解实现、应用实例与优缺点。
- [中介者模式：简化对象间通信的协调者](https://cpython666.github.io/python/collection/23-design/中介者模式：简化对象间通信的协调者)：中介者模式用一个中心对象接管组件间的交互，让组件不必互相持有引用。Python 讲解定义、实现、应用实例与优缺点。
- [装饰器模式：动态扩展对象功能的设计艺术](https://cpython666.github.io/python/collection/23-design/装饰器模式：动态扩展对象功能的设计艺术)：装饰器模式通过包装原始对象来动态追加职责，是继承的一个更灵活的替代方案。Python 讲解实现方式、应用场景与优缺点。
- [状态模式：管理对象状态转换的动态策略](https://cpython666.github.io/python/collection/23-design/状态模式：管理对象状态转换的动态策略)：状态模式把各状态相关的行为分散到独立的状态类中，让对象随内部状态改变而改变行为。Python 讲解实现与优缺点。
- [组合模式：构建树形对象结构的设计艺术](https://cpython666.github.io/python/collection/23-design/组合模式：构建树形对象结构的设计艺术)：组合模式让单个对象与组合对象共享同一接口，客户端得以统一处理部分-整体的树形层次结构。Python 讲解实现与优缺点。
- [23种设计模式-Python](https://cpython666.github.io/python/collection/23-design/)：用 Python 学习 23 种设计模式，包含创建型、结构型、行为型模式的概念、场景和代码示例。
- [Langchain](https://cpython666.github.io/python/collection/langchain)：Langchain 是构建大模型应用的开源框架，提供工具与组件帮助开发者集成语言模型，做出聊天机器人、问答系统和内容生成工具。
- [PyQt6实战开发之旅-代码均可运行](https://cpython666.github.io/python/collection/pyqt6)：PyQt6 实战开发合集入口，附免费视频教程。不逐个死磕几百个控件，而是从有 Python 基础的角度切入，代码均可直接运行。
- [SQLAlchemy 2.0 介绍](https://cpython666.github.io/python/database/sqlalthemy2)：SQLAlchemy 2.0 相比 1.x 的重大更新：统一 API、异步支持、类型注解、新的查询 API、性能优化与增强的 ORM 支持。
- [Django最常用命令合集](https://cpython666.github.io/python/django-series/django-common-commands)（2024-12-20）：Django 常用命令速查：静态文件配置 STATICFILES_DIRS、模型管理、settings 中的语言时区数据库配置，以及中文与时区设置。
- [django-orm常用的方法函数【django】](https://cpython666.github.io/python/django-series/django-orm-methods)（2024-12-20）：Django ORM 常用方法速查：模型实例方法、查询集方法、聚合函数、字段查找器、关系查找、更新与创建，以及事务管理。
- [django-simpleui【django】](https://cpython666.github.io/python/django-series/django-simpleui)（2024-12-20）：django-simpleui 配置记录：加入 INSTALLED_APPS 的位置要求、设置中文语言、去掉或替换默认 Logo、修改后台名称与标题。
- [drf限流模块-源码翻译及解读【django】](https://cpython666.github.io/python/django-series/drf-throttling-source)（2024-12-20）：DRF 限流文档看不明白，索性直接读两百多行源码并加上中文注释。逐段解读限流实现，顺带处理真实 IP 的获取问题。
- [Django-合集](https://cpython666.github.io/python/django-series/)：Django 系列合集目录，收录使用笔记、源码解读与相关技术栈整理。
- [Python Agent 开发：从入门到精通](https://cpython666.github.io/python/libs/agent)：面向有 Python 与采集经验但没接触过 Agent 的读者：从零理解 Agent 与聊天机器人的区别，手写 Agent 循环，再到工具、记忆、RAG、评测与生产部署。
- [Celery 从基础到精通：面向 Python 与自动化数据采集开发者](https://cpython666.github.io/python/libs/celery)：以 Celery 5.x + Redis 为主，从核心组件、Broker 选型讲到第一个可运行项目，目标是能设计、部署、监控和排查可靠的异步任务系统。
- [Python 三方包](https://cpython666.github.io/python/libs/)：Python 常用三方包与开发工具的实战教程合集。
- [常用命令总敲错？记不住？让你的命令短起来！-invoke【python三方库】](https://cpython666.github.io/python/libs/invoke)（2025-03-06）：命令老是拼错、记不住、要翻笔记？用 invoke 把冗长的 Docker 与 Django 命令封装成短命令，讲解安装与实际配置写法。
- [pre-commit 使用指南](https://cpython666.github.io/python/libs/pre-commit)：pre-commit 是 Git 钩子管理工具，在 commit 前自动跑代码检查与格式化。讲解安装、初始化配置、装钩子、手动运行、CI/CD 集成与跳过方式。
- [Pytest 从基础到精通：面向 Python 开发与自动化采集](https://cpython666.github.io/python/libs/pytest)：从测试是什么、三个层次和 AAA 结构讲起，覆盖测试发现规则、断言与异常、fixture、参数化、临时文件与日志输出的完整实践。
- [文本差异对比如此简单！](https://cpython666.github.io/python/libs/text-diff-simple)（2025-01-21）：几千行文本靠人眼找差异不现实。用 Python 标准库 difflib 快速比较两段文本并输出 HTML，附 isjunk 参数与换行符处理的解读。
- [uv 从基础到精通：给 Conda 用户的实战迁移指南](https://cpython666.github.io/python/libs/uv)：uv 是 Astral 用 Rust 写的 Python 包与项目管理工具。面向长期使用 Conda 的读者，讲清两者区别、各平台安装方式与核心工作流。
- [Pygame游戏开发合集](https://cpython666.github.io/python/pygame-series/)：Pygame 游戏开发合集目录，从基础讲起，涵盖窗口设置、粒子特效、拖尾动画等案例，代码均可直接运行。
- [P0-合集介绍](https://cpython666.github.io/python/pygame-series/p0-series-intro)（2024-12-20）：一张画布、一个宇宙。本合集介绍 Pygame 并演示若干案例，代码行数虽多但基本是固定框架，理解每行作用后复制粘贴即可复用。
- [P1-教程文档](https://cpython666.github.io/python/pygame-series/p1-docs)（2024-12-20）：Pygame 基础教程：初始化、设置主屏窗口、设置窗口标题、实现点击 X 退出的固定代码段，以及 Display 显示模块讲解，附教程来源。
- [P10-炫彩小球交互效果-pygame实现](https://cpython666.github.io/python/pygame-series/p10-colorful-ball-interaction)（2024-12-20）：几分钟实现炫彩小球交互效果：满屏小球只由一个变量控制，多种颜色只用一个随机数，几乎不需要任何知识准备。
- [P2-设置logo与标题](https://cpython666.github.io/python/pygame-series/p2-window-logo-title)（2024-12-20）：Pygame 设置窗口图标与标题的写法，给游戏窗口换上自己的 logo。
- [P3-下雨特效](https://cpython666.github.io/python/pygame-series/p3-rain-effect)（2024-12-20）：用 Pygame 实现下雨特效：初始化屏幕、定义雨滴数量与颜色、维护雨滴列表并逐帧更新位置。
- [P4-点击后粒子爆炸](https://cpython666.github.io/python/pygame-series/p4-particle-explosion)（2024-12-20）：Pygame 实现鼠标点击后的粒子爆炸效果，从简陋版到完整版，包含粒子类定义、画布尺寸、字体与颜色设置及主循环。
- [P5-数字粒子消散](https://cpython666.github.io/python/pygame-series/p5-number-particle-dissolve)（2024-12-20）：用 Pygame 做数字粒子消散动画：渲染字体后拆成粒子，通过粒子类控制每个点的运动与消散。
- [P6-画面显示fps](https://cpython666.github.io/python/pygame-series/p6-show-fps)（2024-12-20）：在 Pygame 画面上实时显示帧率：用 Clock 对象控制帧率，再把 FPS 渲染成文字画到窗口上。
- [P7-画出一个棋盘背景](https://cpython666.github.io/python/pygame-series/p7-chessboard-background)（2024-12-20）：一分钟一个 Pygame 案例：从思路到代码画出棋盘格背景，可用作页面背景或贪吃蛇地图。
- [P8-物体运动尾迹拖尾](https://cpython666.github.io/python/pygame-series/p8-motion-trail)（2024-12-20）：Pygame 实现物体运动拖尾：本体拖尾、透明度递减拖尾与彩色线条拖尾三种做法，附小球运动轨迹的完整代码。
- [P9-代码-鼠标环形文字旋转动画特效](https://cpython666.github.io/python/pygame-series/p9-rotating-text-effect)（2024-12-20）：Pygame 实现跟随鼠标的环形文字旋转动画：初始化窗口与背景色、计算文本渲染矩形、逐帧旋转排布。
- [PyQt6实战开发之旅-合集](https://cpython666.github.io/python/pyqt6-series/)：PyQt6 实战开发系列合集目录，35 篇拆分讲解窗口、布局、多页面切换、图形视图、线程与界面美化，代码均可直接运行。
- [P1-PyQt6学习感悟](https://cpython666.github.io/python/pyqt6-series/p1-learning-reflection)（2024-12-20）：PyQt6 该怎么学？聊聊为什么不必从头啃几百个控件、信号与槽其实没那么玄乎，以及有 Python 基础的人更高效的入门路径。
- [P10-pyqt6中如何实现多页面切换？](https://cpython666.github.io/python/pyqt6-series/p10-how-to-switch-pages)（2024-12-20）：PyQt6 实现多页面切换的两条主要路线：QStackedWidget 与 QTabWidget，分别说明用法、代码结构和各自的适用场景。
- [P11-QTabweight与Qstackweight的区别](https://cpython666.github.io/python/pyqt6-series/p11-qtabwidget-qstackedwidget)（2024-12-20）：QTabWidget 与 QStackedWidget 到底差在哪：一个自带选项卡导航，一个只管堆叠、导航要自己做。从设计意图和用途逐条对比。
- [P12-Qframe与Qweight的区别](https://cpython666.github.io/python/pyqt6-series/p12-qframe-qwidget)（2024-12-20）：QFrame 是 QWidget 的子类，多出了边框样式与阴影控制。对比两者的定位差异，说明什么时候该用 QFrame 当容器。
- [P13-先显示登陆页面，登陆成功后显示主页面](https://cpython666.github.io/python/pyqt6-series/p13-login-before-main-window)（2024-12-20）：PyQt6 登录流程实现：先弹登录窗口，校验通过后再关闭它并打开主窗口，附完整可运行代码。
- [P14-窗口渐显与渐隐](https://cpython666.github.io/python/pyqt6-series/p14-window-fade)（2024-12-20）：用 QPropertyAnimation 控制 windowOpacity，给 PyQt6 窗口做出淡入淡出的渐显渐隐效果。
- [P15-窗口居中变大出现](https://cpython666.github.io/python/pyqt6-series/p15-window-scale-in)（2024-12-20）：窗口从小放大同时保持居中，边放大边调用居中函数会闪动。改成预先算出初末状态的位置与大小，交给 QPropertyAnimation 处理。
- [P16-最小化窗口到托盘，右键菜单，窗口恢复](https://cpython666.github.io/python/pyqt6-series/p16-minimize-to-tray)（2024-12-20）：PyQt6 实现最小化到系统托盘：QSystemTrayIcon 图标、托盘右键菜单，以及双击托盘恢复窗口的完整写法。
- [P17-背景运动及模糊滤镜](https://cpython666.github.io/python/pyqt6-series/p17-background-motion-blur)（2024-12-20）：复现 Steam 登录界面的运动模糊背景。重写 paintEvent 会让窗口内容一起变模糊，改用 QLabel 堆叠承载背景就能避开这个问题。
- [P18-窗口自定义拖拽功能](https://cpython666.github.io/python/pyqt6-series/p18-custom-window-drag)（2024-12-20）：隐藏系统标题栏后窗口拖不动了？重写 mousePressEvent 与 mouseMoveEvent，给 PyQt6 无边框窗口加上自定义拖拽。
- [P19-窗口双击更换背景](https://cpython666.github.io/python/pyqt6-series/p19-double-click-change-bg)（2024-12-20）：监听 PyQt6 窗口的鼠标双击事件，在 mouseDoubleClickEvent 里切换背景图片，附可运行示例。
- [P2-合集简介](https://cpython666.github.io/python/pyqt6-series/p2-series-intro)（2024-12-20）：PyQt6 合集的编排思路：把大项目拆成可复用的小功能点，方便按需查阅。附 PyQt6 各组成模块的功能说明与版本信息。
- [P20-多软件图标排布](https://cpython666.github.io/python/pyqt6-series/p20-app-icon-layout)（2024-12-20）：做出类似启动器的多图标网格界面：用 QGridLayout 排布多个软件图标，PyQt6 完整示例代码。
- [P21-点击按钮打开新页面](https://cpython666.github.io/python/pyqt6-series/p21-open-new-page)（2024-12-20）：PyQt6 里点击按钮弹出新窗口的写法，以及新窗口对象为什么必须保留引用，否则会被回收导致一闪而过。
- [P22-窗口中画一个框](https://cpython666.github.io/python/pyqt6-series/p22-draw-rectangle)（2024-12-20）：在 PyQt6 窗口里画出一个矩形框：重写 paintEvent，用 QPainter 配合 QPen 完成绘制。
- [P23-介绍一下QGraphicsScene和QGraphicsView](https://cpython666.github.io/python/pyqt6-series/p23-qgraphicsscene-qgraphicsview)（2024-12-20）：QGraphicsScene 负责管理二维图元，QGraphicsView 负责展示与交互。讲清这套图形视图框架的分工，以及它比手写 paintEvent 强在哪。
- [P24-图片浏览，可以放大缩小拖拽](https://cpython666.github.io/python/pyqt6-series/p24-image-viewer)（2024-12-20）：基于 QGraphicsView 做一个支持滚轮缩放和鼠标拖拽的 PyQt6 图片浏览器，附完整可运行代码。
- [P25-图片浏览，ctrl+滚轮放大缩小，左键按压拖拽，右键按压画框，框显示坐标信息](https://cpython666.github.io/python/pyqt6-series/p25-image-viewer-box-select)（2024-12-20）：进阶版 PyQt6 图片浏览器：Ctrl+滚轮缩放、左键拖拽平移、右键拉框选区，并实时显示选框的坐标信息。
- [P26-图片场景输出为图片](https://cpython666.github.io/python/pyqt6-series/p26-export-scene-image)（2024-12-20）：把 QGraphicsScene 的内容导出成图片文件。对比按视图区域导出和用 itemsBoundingRect 按实际内容外接矩形导出两种做法。
- [P27-浮点数滑块](https://cpython666.github.io/python/pyqt6-series/p27-float-slider)（2024-12-20）：QSlider 只支持整数，想拖出小数怎么办？通过内部放大倍数封装一个支持浮点数的 PyQt6 滑块控件。
- [P28-QListWidget中添加Widget](https://cpython666.github.io/python/pyqt6-series/p28-qlistwidget-add-widget)（2024-12-20）：用 setItemWidget 往 QListWidget 的每一行塞入自定义 Widget，做出图文混排的复杂列表项。
- [P29-更换主题](https://cpython666.github.io/python/pyqt6-series/p29-change-theme)（2024-12-20）：程序员不必在界面美化上死磕。用 qt-material 样式表几行代码给 PyQt6 或 PySide 程序换上现成的现代主题。
- [P3-第一个程序-Hello,PyQt6~](https://cpython666.github.io/python/pyqt6-series/p3-hello-pyqt6)（2024-12-20）：从零写出第一个 PyQt6 程序 Hello PyQt6，逐行说明 QApplication、QWidget 与事件循环的作用，同时验证开发环境是否装好。
- [P30-多选列表](https://cpython666.github.io/python/pyqt6-series/p30-multi-select-list)（2024-12-20）：配置 QListWidget 的 selectionMode 实现多选列表，并取出用户选中的全部条目，PyQt6 示例代码。
- [P31-主线程中执行耗时任务时GUI 被阻塞，如何强制处理事件循环中的待处理事件，以更新 GUI](https://cpython666.github.io/python/pyqt6-series/p31-process-events-when-gui-blocked)（2024-12-20）：主线程跑耗时任务会让界面卡死不刷新。用 QApplication.processEvents() 强制处理事件循环中的待办事件，让 GUI 及时更新，同时说明它的局限。
- [P32-单独线程处理任务](https://cpython666.github.io/python/pyqt6-series/p32-worker-thread)（2024-12-20）：把耗时操作搬到 QThread 里执行，保持 PyQt6 界面响应，并通过信号实时把子线程的任务进度回传到窗口上。
- [P33-防锯齿选项](https://cpython666.github.io/python/pyqt6-series/p33-antialiasing)（2024-12-20）：拆解 QPainter.RenderHint 这个标志枚举里各个防锯齿与渲染选项的含义，以及它们如何影响 PyQt6 的绘制效果。
- [P34-配置相关QSettings](https://cpython666.github.io/python/pyqt6-series/p34-qsettings)（2024-12-20）：用 QSettings 持久化 PyQt6 程序的配置项，读写窗口位置、用户偏好等状态，跨平台自动落到注册表或配置文件。
- [P35-【自定义磨砂动态背景】前端及pyqt6实现](https://cpython666.github.io/python/pyqt6-series/p35-frosted-dynamic-background)（2024-12-20）：磨砂动态背景的原理其实是底层多个彩色多边形移动再叠一层模糊滤镜。分别给出 CSS 前端实现和 PyQt6 实现，附参数说明。
- [P4-居中显示窗口](https://cpython666.github.io/python/pyqt6-series/p4-center-window)（2024-12-20）：用 frameGeometry 与 primaryScreen().availableGeometry().center() 把 PyQt6 窗口居中显示，逐句拆解几何计算的过程。
- [P5-PyQt6-初探QMainWindow-各模块的学习方法](https://cpython666.github.io/python/pyqt6-series/p5-qmainwindow-overview)（2024-12-20）：QMainWindow 的菜单栏、工具栏、状态栏和中央工作区分别负责什么，以及面对几百个 Qt 控件时该用什么顺序去查文档和学习。
- [P6-多页面切换实例](https://cpython666.github.io/python/pyqt6-series/p6-multi-page-switch)（2024-12-20）：用 QTabWidget 搭配 QWidget 实现 PyQt6 多页面切换，附可运行示例，说明如何把每个页面拆成独立的 QWidget 子类。
- [P7-顶部菜单栏实例](https://cpython666.github.io/python/pyqt6-series/p7-menu-bar)（2024-12-20）：PyQt6 顶部菜单栏实战：创建 menuBar、添加菜单项与 QAction，并把动作绑定到对应的处理函数上。
- [P8-多种栏示例](https://cpython666.github.io/python/pyqt6-series/p8-bars-demo)（2024-12-20）：一次看清 PyQt6 里的菜单栏、工具栏、状态栏怎么写，各自适用什么场景，附可运行的对比示例代码。
- [P9-左侧菜单控制右侧多页面切换](https://cpython666.github.io/python/pyqt6-series/p9-sidebar-page-switch)（2024-12-20）：做出常见的后台管理界面布局：左侧菜单列表点击后，右侧 QStackedWidget 跟着切换对应页面，PyQt6 完整示例。
- [Python基础合集](https://cpython666.github.io/python/python-basics/)：Python 基础学习合集入口，涵盖学习路线与必会知识点，后续将陆续补充关联文章。
- [Python常用命令](https://cpython666.github.io/python/shorthand)：Python 日常开发常用命令速查，随手记录方便查阅。
- [字幕提取器系列](https://cpython666.github.io/python/subtitle-extractor/)：字幕提取器系列合集目录，讲解批量提取视频文案的思路、几种技术方案的优劣，以及 OCR 版工具的使用教程。
- [P1-用Python批量提取视频文案，超详细-字幕提取器](https://cpython666.github.io/python/subtitle-extractor/p1-video-copy-extractor)（2024-12-15）：用 Python 批量提取视频文案的完整流程，字幕提取器系列开篇，步骤讲解尽量详细。
- [P2-提取视频文案的几种场景及其优缺点-字幕提取器](https://cpython666.github.io/python/subtitle-extractor/p2-subtitle-extraction-scenarios)（2024-12-15）：对比提取视频文案的几种技术方案：语音识别适合无字幕但受背景音与口音影响，OCR 适合字幕清晰但耗时且受颜色区分度限制。
- [P4-字幕提取器-OCR版-1.0，使用教程及后续改进方向，进步空间很大](https://cpython666.github.io/python/subtitle-extractor/p4-ocr-subtitle-extractor-guide)（2024-12-15）：字幕提取器 OCR 版 1.0 的完整使用教程，从 GitHub 下载到实际运行，并总结当前软件的不足与后续改进方向。
- [Django笔记](https://cpython666.github.io/python/web/django)：Django 使用笔记：模型管理、settings 常用配置，以及语言、时区与数据库相关设置。
- [P1-FastAPI简介-合集规划介绍](https://cpython666.github.io/python/web/fastapi-intro)（2025-03-31）：为什么做 FastAPI 合集：数据采集中间系统就用的它，三四行代码启动服务，但限流、登录、数据库这些还需要自己设计和封装。
- [FastAPI 学习路线](https://cpython666.github.io/python/web/fastapi-road)：结构化的 FastAPI 学习路线，从准备基础知识、入门、中级技能到进阶优化与项目实战五个阶段，每阶段含目标、内容与资源建议。
- [FastAPI 简介](https://cpython666.github.io/python/web/fastapi)：FastAPI 基于 Python 类型提示并支持异步，是现代高性能的 API 框架。讲解主要特点、定义数据模型与路由、安装方式和适用场景。
- [JWT（JSON Web Token）详解](https://cpython666.github.io/python/web/jwt)：JWT 是用于身份验证与信息安全传输的开放标准 RFC 7519，通过数字签名保证完整性。讲解原理、Python 实现生成与校验 Token，以及 RSA 密钥进阶用法。
- [Pydantic 详解](https://cpython666.github.io/python/web/pydantic)：Pydantic 基于类型注解做数据验证与序列化，是 FastAPI 的基础。讲解基本概念、核心特性、高级功能，以及它的优势与局限。
- [探索SimpleUI：让Django Admin焕发现代光彩](https://cpython666.github.io/python/web/simple-ui)：SimpleUI 基于 Vue 与 Element UI 为 Django Admin 提供现代化主题，内置 28 种主题，完全兼容原生功能无需修改代码。
- [Starlette 简介](https://cpython666.github.io/python/web/starlette)：Starlette 是轻量级 ASGI 框架，也是 FastAPI 的底层基础。讲解主要特点、安装方式，以及定义处理函数、配置路由、运行应用的完整示例。
- [Python typing 模块详解](https://cpython666.github.io/python/web/typing)：typing 模块用于类型注解，运行时不强制检查但能显著提升可读性并配合 mypy 发现潜在错误。讲解常用类型、高级用法与各版本写法演进。

## 爬虫与自动化数据采集

- [练手网站](https://cpython666.github.io/spider/练手网站)：验证码练手网站清单，按点选、滑块、语序、轨迹、旋转分类整理，地址均做 base64 处理，侵权即删。
- [看到这样的爬虫课程可以直接划走，卖课不等于忽悠人](https://cpython666.github.io/spider/买课指南)：爬虫需要报班吗？宣称学完就能拿 VIP 视频音乐资源的课程要警惕。卖课不等于忽悠人，但忽悠得太过就该划走了。
- [【千字总结】爬虫学习指南-2024最新版](https://cpython666.github.io/spider/学习指南)：如何自学爬虫？从涉及学科、如何学编程、自学的优缺点到学习方法和建议，全是个人见解，没有一句是从网上复制的。
- [反爬之行为检测-鼠标与按钮位置匹配](https://cpython666.github.io/spider/anti-crawler-game/behavior-detection-mouse-button)（2025-01-21）：点击按钮时鼠标不在按钮范围内，就是异常行为。通过比对事件触发时的鼠标坐标与按钮位置来识别自动化点击，附 demo 页面与实现思路。
- [看似最简单，实则很难的验证码【爬虫反爬】](https://cpython666.github.io/spider/anti-crawler-game/hard-simple-captcha)（2025-03-30）：从无感验证码到滑块验证码，最难的往往不是识别图像，而是理解语义、模拟轨迹、绕过环境检测。聊聊验证码在体验与效果之间的平衡。
- [网络爬虫的反爬与反反爬博弈艺术鉴赏](https://cpython666.github.io/spider/anti-crawler-game/)：反爬、反反爬、验证码、行为检测和混淆策略的案例合集，记录爬虫与反爬之间来回博弈的各种手段。
- [很损的反爬，不相信科学了，赶紧分享给大家，薛定谔的数据](https://cpython666.github.io/spider/anti-crawler-game/schrodinger-anti-crawler-data)（2024-11-30）：同样的脚本，一个月前跑得丝滑，再跑却拿到了错的数据。记录一个杀敌一千自损八百的反爬策略，以及它是怎么被发现的。
- [大眼瞪小眼编码，视觉层面混淆-O10编码解码](https://cpython666.github.io/spider/anti-crawler-game/visual-obfuscation-o10)（2024-10-27）：O10 编码是一种视觉层面的混淆：人眼看着正常，复制出来却是另一回事。讲解这种前端反采集编码的原理与解码方法。
- [aiohttp](https://cpython666.github.io/spider/collection/aiohttp)：aiohttp 是基于 asyncio 的异步 HTTP 客户端/服务器框架，适合高并发爬虫。讲解安装、异步请求、POST、并发控制、超时与错误处理。
- [ast详解](https://cpython666.github.io/spider/collection/ast)：抽象语法树 AST 是代码分析、混淆与还原的核心，也是 JS 逆向的基本功。讲解什么是 AST、为什么要学，以及完整的学习路线与资源。
- [数据采集使用自动化真的慢吗？实测速度震惊！](https://cpython666.github.io/spider/collection/automation-data-collection-speed-test)（2024-11-03）：都说自动化采集慢，实测并发 32、连续请求 50 次的真实速度，看看自动化到底慢在哪、又能快到什么程度。
- [浏览器指纹详解](https://cpython666.github.io/spider/collection/browser-fingerprint)：浏览器指纹通过操作系统、浏览器版本、插件、时区、分辨率等信息识别用户，不依赖 cookie。讲解原理、涉及技术与学习路线。
- [🤑 几乎免费的海外代理【Clash 神级玩法🤩】【无广告】](https://cpython666.github.io/spider/collection/cheap-ip)：普通海外代理 1 美元 1G，Clash 订阅 1 块钱 20G。为什么这么便宜？能不能当爬虫代理用？逐条讲清原理、差异与它的局限。
- [Clash 进阶：把订阅节点提取出来，部署成爬虫可用的代理池](https://cpython666.github.io/spider/collection/clash-nodes-for-crawler)：把 Clash 订阅里的节点导出来，用 Mihomo 给每个节点开一个本机端口并部署到服务器，爬虫按端口轮换节点，失败自动冷却换下一个。以我的聪明钱追踪项目为例讲完整流程。
- [Clash 使用教程：导入订阅、开启代理、全局模式与规则模式](https://cpython666.github.io/spider/collection/clash)：Clash（Clash Verge）图文教程：复制订阅链接导入、打开系统代理、用全局模式选节点，再到规则模式的基本用法，以及 TUN 模式是什么、对爬虫程序有什么用。
- [Crawlab使用记录](https://cpython666.github.io/spider/collection/crawlab)：Crawlab 分布式爬虫管理平台的单节点部署记录：安装 Docker、拉取镜像、编写 docker-compose.yml、启动容器。
- [爬虫可以做哪些事情？项目探究，项目推荐](https://cpython666.github.io/spider/collection/crawler-project-ideas)（2024-11-17）：爬虫理论上能做哪些项目？梳理若干可行方向，同时提醒自用与传播售卖之间的风险边界，风险需自行评估。
- [爬虫学习路线-自动化，80%需求有手就行](https://cpython666.github.io/spider/collection/crawler-roadmap-automation)（2024-11-09）：先讲清法律红线：什么能采、什么绝对不能采。再讲编辑器、Python 基础与自动化工具，80% 的采集需求靠自动化就能解决。
- [DrissionPage](https://cpython666.github.io/spider/collection/drissionpage)：DrissionPage 官方文档入口，一个把浏览器控制与 HTTP 请求合二为一的 Python 数据采集工具。
- [Hook 通用模板](https://cpython666.github.io/spider/collection/hook)：Hook Cookie、Request Header、无限 debugger、XHR、fetch 的 JS 注入通用模板。无限 debugger 常见于构造函数、定时器和 eval，可按场景调整。
- [就业分享-谁的青春不迷茫](https://cpython666.github.io/spider/collection/job-sharing)：在小公司做数据采集的真实就业分享：行情、地区、薪资三年增长曲线、需要什么专业能力，以及非 985/211 靠什么拿到 offer。
- [能听到的音乐就能下载，音乐下载通杀](https://cpython666.github.io/spider/collection/music-download-all-in-one)（2024-10-31）：官网、第三方小站、实在不行录屏录音——能听到的音乐总有办法留下来。梳理音乐下载的几条通用思路。
- [python小白学习路线，必会知识点详细解析，资源推荐](https://cpython666.github.io/spider/collection/python-beginner-roadmap)（2024-10-27）：Python 小白学习路线与必会知识点解析，附资源推荐。特别建议在校生顺带学数据结构与算法，能帮你写出更好的代码。
- [Scrapy简介-快速开始-项目实战-注意事项-踩坑之路](https://cpython666.github.io/spider/collection/scrapy)：Scrapy 是基于异步网络框架的健壮爬虫框架。讲解架构组成、安装、创建项目、修改设置、爬虫模板与常用命令。
- [现在的引流爬虫太猖狂了，兄弟们注意点别进去了](https://cpython666.github.io/spider/collection/traffic-crawler-warning)（2024-11-10）：抓取 APP 用户信息、批量私信投广告，这类引流爬虫已有多起被抓案例。哪些是红线，别为了几百块把自己搭进去。
- [xpath简介及常用语法](https://cpython666.github.io/spider/collection/xpath-intro)（2024-11-10）：刚学采集时最容易卡在网页解析上，原因多半是 XPath 不熟。系统整理 XPath 基础语法与常用表达式，提高解析效率。
- [DrissionPage 自动化数据采集](https://cpython666.github.io/spider/dp-series/)：DrissionPage 自动化数据采集系列文章，覆盖监听接口、表格提取、部署、反检测和项目实战。
- [P0-为什么学习数据采集？为什么是自动化？为什么选择DrissionPage？](https://cpython666.github.io/spider/dp-series/p0-why-data-collection)（2024-11-25）：数据是这个时代的财富，也是训练大模型最重要的原料。系列开篇讲清三个问题：为什么学采集、为什么选自动化、为什么用 DrissionPage。
- [P1-本专栏的目的，会讲那些知识？DrissionPage自动化数据采集](https://cpython666.github.io/spider/dp-series/p1-series-intro)（2024-11-26）：DrissionPage 自动化数据采集专栏会涉及哪些知识点，按什么思路编排，以及做这个系列的原因。
- [P2-Hello～DrissionPage，开端即巅峰，专栏可以结束了](https://cpython666.github.io/spider/dp-series/p2-hello-drissionpage)（2024-11-27）：数据采集分逆向接口和自动化两条路。理解静态与动态页面，学会监听接口和提取页面数据，就能解决 80% 的采集需求。
- [P3-DrissionPage批量监听采集接口数据](https://cpython666.github.io/spider/dp-series/p3-listen-api-data)（2024-11-28）：点击下一页、滚动加载更多、展开评论——这类批量采集需求怎么做？用 DrissionPage 批量监听接口响应，一次拿全数据。
- [P4-自动化批量保存文章的方法与系统设计指南](https://cpython666.github.io/spider/dp-series/p4-save-articles-system-design)（2024-11-30）：把文章、视频、新闻、博客批量保存到本地做备份。拆解需求步骤并给出系统设计思路，DrissionPage 自动化实战。
- [P5-DrissionPage监听websocket请求](https://cpython666.github.io/spider/dp-series/p5-listen-websocket)（2024-12-02）：讲完 HTTP 监听后，网上关于 WebSocket 监听的教程还很少。结合现有资料实现用 DrissionPage 监听 WebSocket 请求。
- [P6-快速、精准、优雅提取网页大部分表格数据-DrissionPage自动化数据采集](https://cpython666.github.io/spider/dp-series/p6-extract-table-data)（2024-12-03）：网页表格数据提取的几种方案对比：写 XPath 硬拼、监听接口拿 JSON、pandas 直接转 Excel，按页面类型选择最优解。
- [P7-DrissionPage项目部署服务器的最佳实践](https://cpython666.github.io/spider/dp-series/p7-deploy-server)（2024-12-07）：DrissionPage 项目部署到 Linux 服务器或 Docker 时常见的问题与解决思路，本文重点讲思路而非代码。
- [P8-自动化的检测与反检测-DrissionPage自动化数据采集](https://cpython666.github.io/spider/dp-series/p8-anti-detection)（2025-01-05）：自动化不是万能的。检测手段很多且需因地制宜，这一集浇盆凉水，探讨自动化相关的检测方式与应对办法。
- [DrissionPage自动化数据采集中间系统](https://cpython666.github.io/spider/drissionpage-system/)：DrissionPage 自动化数据采集中间系统合集，记录围绕 DrissionPage 搭建采集系统的设计与实践。
- [Python 爬虫与自动化数据采集](https://cpython666.github.io/spider/)：Python 爬虫、自动化数据采集、DrissionPage、Scrapy、反爬与数据采集项目实践的文章入口。
- [大佬博客](https://cpython666.github.io/spider/learn-resource)：收录爬虫与逆向方向值得长期关注的大佬博客与主页，学习路上的优质信息源。
- [爬虫学习路线](https://cpython666.github.io/spider/learn-road)：从大佬水群聊天记录里攒出来的爬虫学习路线：浏览器调试、哈希与国标对称/非对称加密、webpack 模块打包、AST 等 JS 逆向专题。
- [自动化填写问卷系列-Python-自动化](https://cpython666.github.io/spider/questionnaire/)：自动化填写问卷系列合集，用 Python 自动化工具批量完成问卷的方法、代码示例与实战记录。
- [P1-Selenium自动做问卷星](https://cpython666.github.io/spider/questionnaire/p1-selenium-wjx)（2024-10-21）：用 Selenium 自动完成问卷星填写，附对应视频与文章索引，包括自动生成代码一键搞定各类题型的做法。
- [P2-问卷代码示例-已脱敏【自动化填问卷的第一桶金，半小时一百块】](https://cpython666.github.io/spider/questionnaire/p2-questionnaire-code-example)（2024-11-06）：自动化填问卷的完整代码示例，已做脱敏处理。配套「半小时一百块」那期内容，附视频与文章索引。
- [Scrapy-合集](https://cpython666.github.io/spider/scrapy-series/)：Scrapy 系列合集目录：框架简介、快速开始、项目实战、注意事项与踩坑记录。
- [P1-Scrapy简介](https://cpython666.github.io/spider/scrapy-series/p1-scrapy-intro)（2024-12-20）：Scrapy 是什么、架构由哪些部分组成。它用异步网络框架处理通讯，我们只需定制少量模块就能实现一个健壮的爬虫。
- [P2-快速开始-项目实战](https://cpython666.github.io/spider/scrapy-series/p2-quick-start-project)（2024-12-20）：以新闻推送页面为例走完 Scrapy 全流程：安装、创建项目、逐个说明项目文件作用、修改 ROBOTSTXT_OBEY 与 User-Agent 等设置。
- [P3-注意事项【Scrapy】](https://cpython666.github.io/spider/scrapy-series/p3-scrapy-notes)（2024-12-20）：Scrapy 实战注意事项：自定义 spider 起始方式、item 可省略、item 与 pipeline 的对应关系、异步执行的坑、同时运行多个爬虫、发送图像与表单数据。
- [P1-scrapy教程-scrapy框架简介](https://cpython666.github.io/spider/scrapy-series/p4-scrapy-framework-intro)（2025-02-04）：什么是框架？Scrapy 框架的基本组成与好处：高效异步处理、自动化数据提取、灵活扩展性和高度可配置。
- [P2-第一个scrapy项目【scrapy教程】](https://cpython666.github.io/spider/scrapy-series/p5-first-scrapy-project)（2025-02-20）：从零跑通第一个 Scrapy 项目：安装 scrapy、创建项目、修改基本配置、创建爬虫、发送第一个请求，含 Linux/macOS 与 Windows 说明。
- [一些视频的源码](https://cpython666.github.io/spider/source-code)：视频配套源码索引，收录 Selenium 自动做问卷星等内容对应的代码与文章链接。

## Web3 与区块漫步

- [加密笑话](https://cpython666.github.io/web3/basics/bitcoin-jokes)：收录比特币相关的 meme 与反讽图，以及从 2013 年到今天媒体唱衰比特币的标题合集，看看这十多年的标题水平进化史。
- [币圈骗局合集鉴赏](https://cpython666.github.io/web3/basics/crypto-scams)：带单骗局、助记词骗局、智能合约漏洞、粉尘攻击——拆解币圈常见骗局的套路。在币圈，不要相信任何人。
- [优质资源收录](https://cpython666.github.io/web3/basics/high-quality-materials)：Web3 学习资源收录：比特币白皮书原文与中文注解、《囤比特币》、WTF Academy 等 Solidity 与 Web3 开发教程。
- [Web3 常用指标](https://cpython666.github.io/web3/basics/)：Web3、币圈和加密市场常用指标记录，包括比特币地址、恐慌指数、山寨指数等观察入口。
- [感悟灵感](https://cpython666.github.io/web3/basics/insights)：入币圈一年半积累的思考碎片：交易是一场修行、二八定律、爆仓的血泪教训，以及每个人都会有他配得上的那个价格。
- [合约教训](https://cpython666.github.io/web3/basics/lesson)：收录几个真实的合约爆仓案例：滚仓上亿最终本金归零的战队、从炒币到亏损两百万的宝妈。合约的代价往往不只是钱。
- [规则](https://cpython666.github.io/web3/basics/rules)：给自己定下的交易准则：翻倍出本、单币保证金不超 100u、杠杆不超十倍、只做主流币、数据发布前设好止损，附常用工具与经验。
- [声明](https://cpython666.github.io/web3/basics/statement)：本站视频和文章内容不构成任何形式的投资建议，仅作技术交流分享，盈亏自负。
- [敬请期待～](https://cpython666.github.io/web3/basics/stay-tuned)：该板块内容正在准备中。有优质内容欢迎推荐，好教程需要大家一起共建。
- [赞助](https://cpython666.github.io/web3/basics/support)：赞助本博客的方式与权益说明，包括好友位与本页广告位，附钱包地址与联系方式。
- [Web3 常见问题解答](https://cpython666.github.io/web3/basics/web3-qas)：Web3 新手常见问题：什么是区块链、什么是 U、用什么买币、什么样的人会亏完、去哪看资讯、怎么安装交易所、去哪学投资方法。
- [币圈入圈指南](https://cpython666.github.io/web3/basics/web3forever)：写给 Web3 新人的币圈入圈指南，强调风险意识、基础常识、不要玩合约和少走弯路。
- [为什么不能碰合约](https://cpython666.github.io/web3/basics/why-can’t-we-touch-the-contract)：上杠杆就是赌博。用赌场为什么稳赚不赔的逻辑解释合约，人性贪婪加上随意开杠杆的市场，结局往往是被杀得一分不剩。
- [P9-资产千万的大哥分享给我的全部心得](https://cpython666.github.io/web3/block-walk/a-big-brother-with-tens-of-millions-of-assets)：资产千万的大哥给的几句忠告：杠杆大于五倍就是找死，玩合约赚的最后都会玩合约亏回去，以及《囤比特币》这本书。
- [P7-链上打狗，无限印钞？](https://cpython666.github.io/web3/block-walk/beating-the-dog-on-the-chain-and-unlimited-money-printing)：链上打狗到底是什么？千倍收益背后是万里挑一的概率。把打狗拆成四个问题，讲清最难判断的聪明钱，以及我为什么最终选择放弃。
- [P1-一个散户的醒悟：我走过的弯路，希望你不再重蹈](https://cpython666.github.io/web3/block-walk/don’t-repeat-my-mistakes)：区块漫步开篇。当所有人都在喊拉满、梭哈时，聊聊投资能不能别这么赌。不投机、不喊单、不带单，只有一个普通人的笨拙理解。
- [P10-做外汇黄金的常识，算了下我交易过几个小目标的黄金](https://cpython666.github.io/web3/block-walk/forex-gold-trading-basics)：外汇黄金交易常识：经纪商怎么选、晒单喊单返佣背后的生意、MT4/MT5 与量化不是提款机，以及真正决定盈亏的仓位管理。
- [P8-分享一组对冲策略，做多龙头做空山寨的可行性分析🧐](https://cpython666.github.io/web3/block-walk/hedging-strategies)：单一走势押注等同于赌博，盈亏同源。分析做多龙头、做空山寨这组对冲策略的可行性，追求稳中求胜而非高收益。
- [小白入场怎么做？](https://cpython666.github.io/web3/block-walk/how-to-enter-the-market-as-a-newbie)：新手入场三件事：资金量小没关系，生存第一；心性控制不好就是赌博；玩法很多，套利、撸毛、KOL、链上数据、开发都可以试。
- [区块漫步](https://cpython666.github.io/web3/block-walk/)：记录区块链、Web3、长期投资和风险管理相关的常识、经验与思考。
- [P3-信息差只是借口，认知差才是改变命运的分水岭](https://cpython666.github.io/web3/block-walk/information-gap-vs-cognitive-gap)：总说早知道就买了、怎么没人告诉我，问题往往不是信息，而是认知。对比信息差与认知差，聊聊什么才是真正的分水岭。
- [P10-避坑手册：新人进币圈必须牢记的黄金法则](https://cpython666.github.io/web3/block-walk/newcomers-keep-in-mind)：新人进币圈的几条铁律：远离合约、只囤比特币和以太坊、坚持 DCA 用时间换钱、不急不贪，慢慢变富而不是投机。
- [P6-投资比特币和以太坊的风险](https://cpython666.github.io/web3/block-walk/risks-of-investing-in-bitcoin-and-ethereum)：价格剧烈波动、供需决定价格、监管不确定性、技术漏洞与黑天鹅、链上生态系统性风险、FOMO 认知风险，逐条拆解 BTC 与 ETH 的风险面。
- [P4-比特币为什么会不断上涨？](https://cpython666.github.io/web3/block-walk/why-does-bitcoin-continue-to-rise)：从六个层面理解比特币上涨的原因：总量恒定的稀缺性、减半机制、共识增强、宏观环境、ETF 资金渠道，以及叙事与周期驱动。
- [为什么我坚定投资比特币和以太坊？](https://cpython666.github.io/web3/block-walk/why-i-am-determined-to-invest-in-bitcoin-and-ethereum)：法币体系天然通胀，长期持有购买力缩水。比特币被称为数字黄金，以太坊被称为数字石油，讲清我的投资依据与注意点。
- [P2-从爆仓中悟出的“必胜投资法”](https://cpython666.github.io/web3/block-walk/winning-investment-method)：掌握了永胜法怎么还会亏光本金？聊聊在币圈如何长期活下来这件事，以及失败者口中的成功秘籍到底还有没有价值。
- [区块链周报](https://cpython666.github.io/web3/blockchain-weekly-report/)：记录比特币、以太坊、山寨币、稳定币、链上生态和宏观事件的区块链周报入口。
- [「区块链周报第一期」沉睡七年比特币巨鲸高调换仓以太坊[09/01-09/07]](https://cpython666.github.io/web3/blockchain-weekly-report/issue-1-09-01)：本期看点：沉睡七年的比特币巨鲸高调换仓以太坊、WLFI 上线即暴跌、以太坊 PoS 退出与加入队列变化、纳斯达克审查微策略、非农爆冷黄金破 3600。
- [「区块链周报第二期」纳斯达克下场RWA，CEX自建链百花齐放[09/08-09/14]](https://cpython666.github.io/web3/blockchain-weekly-report/issue-2-09-08)：本期看点：纳斯达克争取推出代币化证券交易、Aster 即将 TGE、CEX 自建链百花齐放、Hyperliquid 开启 USDH 竞拍，以及比特币基本面。
- [「区块链周报第三期」DEX2.0大战一触即发，谁能撼动Hyperliquid王座？[09/15-09/21]](https://cpython666.github.io/web3/blockchain-weekly-report/issue-3-09-15)：本期看点：BNB 破千美元背后的钻石之手、Aster 五天二十倍的拉盘逻辑、DEX2.0 大战格局，以及 FOMC 降息 25 基点落地后的行情。
- [「区块链周报第四期」稳定币买一切时代序章，链上美股天时地利[2026/05/31]](https://cpython666.github.io/web3/blockchain-weekly-report/issue-4-2026-05-31)：断更半年后回归。本期聊稳定币买一切的时代序章、链上美股的天时地利、金融核心是否正在迁移，以及 BNB 与 HYPE。
- [CCXT 加密货币交易库使用指南](https://cpython666.github.io/web3/cctx)：CCXT 是开源的加密货币交易库，为多家交易所提供统一接口。讲解安装、初始化交易所对象、获取市场数据与创建限价单。
- [黑天鹅给我撞上了-记录币圈10-11](https://cpython666.github.io/web3/high-quality-articles/black-swan-10-11)：2025 年 10 月 11 日，从国庆前四五万本金玩合约到二十多万，再到几乎归零。真实记录这场黑天鹅里的心路与代价。
- [我们真的需要比特币吗？](https://cpython666.github.io/web3/high-quality-articles/do-we-really-need-bitcoin)：从巴菲特与芒格的批评讲起，聊比特币为何未消亡：去中心化账本、工作量证明、固定总量、私钥主权，以及它到底意味着什么。
- [币圈几件黑天鹅事件，你经历了几件?](https://cpython666.github.io/web3/high-quality-articles/how-many-black-swan-events-have-you-experienced)：从 2014 年门头沟事件比特币一夜跌八成，到 2017 年中国 ICO 叫停，回顾币圈历史上那些改写市场的黑天鹅事件。
- [我的朋友-超仔](https://cpython666.github.io/web3/high-quality-articles/my-friend-chaozai)：转载自巴黎哥的推文，讲述朋友超仔爆仓的经历。数字背后是真实的人和真实的代价。
- [AI不是万能的：做 Hyperliquid 聪明钱追踪，我走过的弯路](https://cpython666.github.io/web3/smart-money-tracking/ai-not-omnipotent-hyperliquid-lessons)（2026-07-08）：复盘 Hyperliquid 聪明钱追踪项目从 Hyperdash 数据、原始订单、分区表、代理池到最终回归胜率数据的试错过程，以及对 AI 辅助开发边界的思考。
- [这就是数据分析的魅力！聪明钱追踪仍需要时间检验。](https://cpython666.github.io/web3/smart-money-tracking/data-analysis-charm)：此前分析出聪明钱做空 HYPE、做多 ADA 的倾向，后续如何？聪明钱分析不等于可靠，纯属自娱自乐，不构成任何投资建议。
- [HYPE要回调了？聪明钱更多在做空。ADA还有未来吗？我仿佛看到了曙光「聪明钱追踪」](https://cpython666.github.io/web3/smart-money-tracking/hype-ada-smart-money-short)（2026-07-02）：基于币种多空价值比快照，观察 HYPE、ADA、BTC、ETH 等币种的聪明钱仓位分布，以及单次数据快照的参考边界。
- [聪明钱追踪](https://cpython666.github.io/web3/smart-money-tracking/)：通过链上公开交易、历史胜率和持仓变化，持续观察聪明资金的多空方向，并复盘分析系统的有效性与局限。
- [机构巨鲸都在做空，美股危险了](https://cpython666.github.io/web3/smart-money-tracking/institutions-whales-short)：采集大量地址的历史交易与持仓，按盈利降序筛出聪明钱群体后发现：排名靠前的大多在做空。记录这个观察与随后的市场回调。
- [多空趋势已经改变！牛市一定还会来，聪明钱已经建仓抄底布局多单](https://cpython666.github.io/web3/smart-money-tracking/smart-money-trend-changed)（2026-07-01）：复盘聪明钱分析系统从高位偏空到低位偏多的信号变化，讨论链上公开仓位、历史胜率、跟单风险与系统局限。
- [常用工具合集](https://cpython666.github.io/web3/tools)：Web3 常用工具整理：Hyperliquid 等去中心化交易所、中心化交易所、TradingView 看盘工具，以及闪电贷等概念名词。

## 人生感悟与自媒体

- [写给两年前刚毕业的自己：三条忠告](https://cpython666.github.io/life/advice-to-myself-two-years-ago)：如果能穿越回两年前刚毕业那天，我会告诉自己三件事：别想着赚快钱、财不入急门、知足常乐。一个双非毕业生的真实复盘。
- [想做自媒体不敢开始？不敢露脸怕被别人看到？](https://cpython666.github.io/life/afraid-to-start-self-media)（2024-12-22）：怕被亲戚同事领导刷到所以不敢做自媒体？我也是从不露脸不出声的 AI 配音开始的，聊聊后来为什么改了主意。
- [Agent开发的时代来啦，全栈开发的时代来啦，自动化数据采集的时代来啦](https://cpython666.github.io/life/agent-fullstack-data-collection)：在 BOSS 上活跃两周的观察：招专精前端、后端、爬虫的少了，招复合型全栈的多了。聊聊 AI 普及对招聘需求的实际影响。
- [自动化数据采集危险啦，我的饭碗裂开啦](https://cpython666.github.io/life/ai-automation-data-collection)：我的工作就是写代码控制浏览器自动采集数据。MCP、Skill、Agent 这些我都知道，聊聊 AI 到底会不会端掉这个饭碗。
- [AI时代，学习方式的变革：一天打造浏览器插件，我成了“产品经理+测试”](https://cpython666.github.io/life/ai-learning-browser-plugin-product-manager)（2025-03-09）：花一天时间在 AI 帮助下从零做出一个浏览器插件。这件事让我意识到：学习方式已经变了，程序员的角色正在往产品经理和测试靠。
- [代码写的垃圾是会被打的](https://cpython666.github.io/life/bad-code-will-be-punished)（2025-03-30）：怎么把 Python 代码写得像样：遵循 PEP 8、模块化拆分、加类型注解、统一格式化、命名习惯，以及用 logging 替掉 print。
- [CC Switch 是干嘛的？怎么用？中转站一键导入、一键切换 API 供应商](https://cpython666.github.io/life/cc-switch-guide)：CC Switch 图文教程：从中转站一键导入供应商、在 CC Switch 里一键切换 Claude Code 和 Codex 的 API，并用大白话讲清楚切换背后改了哪些配置。
- [全自动写代码，博客全自动改造，一句话生成表情包动态图标，CodeX太好用了，我已经不自己写代码了](https://cpython666.github.io/life/codex-auto-coding-blog-refactor)：用 CodeX 全自动改造博客、一句话生成动态表情图标的三个实操例子，以及重度使用 AI 编程之后的真实感受。
- [CodeX 可以定制皮肤啦](https://cpython666.github.io/life/codex-dream-skin)：Codex Dream Skin 用带调试端口启动 Codex Desktop，再通过 Chromium DevTools Protocol 注入 CSS、JS 和背景图，给 CodeX 换上自定义皮肤。
- [Codex 如何使用中转站？历史记录不显示如何解决？好用的中转站推荐](https://cpython666.github.io/life/codex-relay-provider-history-sync)：Codex 五小时额度一小时就用完？记录中转站的配置方法、历史记录不显示的解决办法，以及实测好用的中转站推荐。
- [做正确的事，无惧风雨，交给时间](https://cpython666.github.io/life/do-the-right-thing)：为什么我的账号从埋头讲技术转向聊人生观和选择：技术受众太小、没赚到钱、也没有坚持的理由，而人怎么活其实更重要。
- [那时候的我，靠幻想和宇宙活着](https://cpython666.github.io/life/fantasy-and-universe)：高中最灰暗那段时间，《三体》和《秘密》这两本书救了我。人有时候需要的不是立刻解决痛苦，而是先从痛苦里抬头。
- [【千粉纪念】一千个粉丝了，激情不再！](https://cpython666.github.io/life/follower-milestones/1000-followers-passion-fades)：五百粉时精心做了纪念视频，一千粉时最大的变化却是激情不再。在首页偶然刷到别人的千粉记录，才意识到自己很久没总结反思了。
- [3000粉丝了，和兄弟们对齐下颗粒度](https://cpython666.github.io/life/follower-milestones/3000-followers-self-media-review)：一年时间、3000 粉丝、两百万播放，视频播放收入 900 块。复盘为什么开始做自媒体、收获了什么，以及后续规划和真实收益。
- [粉丝里程碑](https://cpython666.github.io/life/follower-milestones/)：收录粉丝数量节点上的纪念与复盘，包括千粉、三千粉时的心态变化，以及内容创作路上的阶段性记录。
- [主流模型免费版生图能力对比从夯到拉，ChatGPT，Claude，豆包，千问，智谱，Kimi，gemini，Grok](https://cpython666.github.io/life/free-model-image-generation-comparison)：同一组提示词横评 ChatGPT、Claude、豆包、千问、智谱、Kimi、Gemini、Grok 八家免费版的生图效果，从夯到拉排个序。
- [一天做出来的GEO系统长什么样？](https://cpython666.github.io/life/geo-system-built-in-one-day)（2026-07-29）：借助 AI 一天开发出来的 GEO 系统界面与功能展示。
- [星探计划：AI搜索时代的GEO探索](https://cpython666.github.io/life/geo/)：记录星探 GEO 系统从研究、设计到开发落地的过程。
- [毕业节点复盘](https://cpython666.github.io/life/graduation-milestones/)：收录毕业周年、工作阶段、城市生活变化等时间节点上的总结与回望，记录一个双非毕业生的真实轨迹。
- [大家都有一堆亮眼的title，只有我是个真草根](https://cpython666.github.io/life/grassroots-without-bright-title)（2024-11-02）：满屏大厂程序员、架构师、985/211，自己却是双非本科、技术半吊子、简历石沉大海。title 不亮眼、故事不精彩，真的很不堪吗？
- [毕业杭州工作五个月存了多少钱？花销怎么样？](https://cpython666.github.io/life/hangzhou-five-month-savings)（2024-10-31）：答案是存了 6500。毕业带着三四千块到杭州，逐项拆开五个月的收入与支出明细，包括那台一万五的电脑。
- [大家都是怎么过生日的？我是怎么过生日的？](https://cpython666.github.io/life/how-we-spend-birthdays)（2024-11-01）：每年都记不住自己的生日，也很多年没庆祝了。这不是丧失了对生活的热情，而是热情花在了敲代码、做项目和做视频上。
- [海力士暴跌，如来。这次不一样？次次都一样！](https://cpython666.github.io/life/hynix-drop-same-story)：没有东西可以一直涨。所有人都在喊的时候进场追高，你就是山顶的接盘人。聊聊这个观点，以及为什么它一次次被验证。
- [自主思考，找到自己的特长和节奏。我喜欢看什么样的博主？](https://cpython666.github.io/life/independent-thinking-strength-rhythm)：喜欢一个博主不等于全盘接受他的观点。以陈昌文为例，聊聊怎么在别人的经验里做取舍，找到自己的特长和节奏。
- [人生感悟](https://cpython666.github.io/life/)：记录普通程序员毕业后、工作、自媒体、成长复盘和长期主义思考的个人文章合集。
- [知道自己不懂并不可怕，可怕的是不懂却以为自己很懂](https://cpython666.github.io/life/know-what-you-dont-know)：世界杯期间赌球的人有赚有亏，输了就说庄家操控比赛。庄家抽水本来就稳赚。我一块钱没输，不是因为懂球，而是知道自己不懂。
- [不开美颜，是一种筛选，我不是gay也是](https://cpython666.github.io/life/no-beauty-filter-not-gay)：有观众建议我开美颜。实测对比开与不开的区别之后，我还是决定不开，因为不开美颜本身就是一种筛选。
- [一个让 AI 编程更“懒”、更少写废代码的 skill](https://cpython666.github.io/life/ponytail-ai-coding-skill)（2026-07-10）：推荐 Ponytail 这个让 AI 编程更克制、更少过度工程化的 skill，介绍 lite、full、ultra 三种模式和安装使用方式。
- [程序员如何找对象？如何聊天？](https://cpython666.github.io/life/programmer-dating-chat)：粉丝问码农怎么找对象。其实职业关系不大，程序员甚至有点优势。聊聊不能太内向、要会聊天、不能太自我这几件事。
- [推荐两个我最近反复看的博主：陈昌文、路飞](https://cpython666.github.io/life/recommended-bloggers-chenchangwen-lufei)：推荐陈昌文和自己造船的路飞。不是因为他们有钱，而是有钱还真诚、没架子，愿意把领悟到的东西直接讲出来。
- [拷打自己五个月前的简历，进来体验当面试官，24春招面试回顾](https://cpython666.github.io/life/review-my-resume-after-five-months)（2024-12-01）：以面试官视角逐条拷打自己五个月前的简历，回顾 24 春招 Python 后端岗的面试经历。相关信息已脱敏。
- [做自媒体，是为了被“对的人”找到](https://cpython666.github.io/life/self-media-found-by-right-people)：现实社交低效又随机，互联网靠内容加算法实现精准匹配。做自媒体本质上是长期构建一个可被理解的自己。
- [做自媒体，就是在向世界发射信号。想赚钱，先修心](https://cpython666.github.io/life/self-media-signal-money-mind)：有人问怎么赚钱，我第一推荐永远是做自媒体。但大部分人其实没有内容，得先反思自己有什么特长可以拿出来，还要克服镜头前的自卑与恐惧。
- [我想要的生活，好像也很简单。目前我的人生规划[幻想]](https://cpython666.github.io/life/simple-life-plan)（2024-10-27）：当前的规划至少能反映当前的认知，过一段时间回头看，或觉得有先见之明，或觉得目光短浅。记录下这一阶段的职业与人生规划。
- [把火箭装进跑车：特斯拉是怎么“飞”起来的？离钢铁侠还差多远](https://cpython666.github.io/life/tesla-roadster-flying)（2026-10-19）：特斯拉新 Roadster 冲上倒挂弯道、腾空翻身，用的是和火箭同一套的冷气推进和姿态控制。但它更像“跳”，不是“飞”。算一笔能量账，看看它离真正的飞、离钢铁侠还差多远。
- [用交易思维看白冰和抱抱盲兔，他们的爆仓几乎是必然的](https://cpython666.github.io/life/trading-thinking-baibing-mangtu)：白冰偷税漏税、抱抱盲兔剧本演绎博同情。用交易思维看，他们嫌赚得慢就开始加杠杆，爆仓结局几乎是必然事件。
- [毕业两年，我还没开始我的人生。杭漂程序员生活公开！](https://cpython666.github.io/life/two-years-after-graduation-hangzhou-programmer)：24 届双非本科，现在在杭州做 Python 自动化数据采集。两年里想明白了几件事：要有被动收入、身体最重要、形象也重要。
- [送钱的需求长什么样，钱这么好赚吗？](https://cpython666.github.io/life/what-easy-money-demand-looks-like)（2024-10-31）：下班打开私信收到一个需求，乍看眉头紧皱，细想喜笑颜开。记录一个看起来像送钱的接单需求，以及它最后为什么飞了。
- [25年的flag做到了多少？](https://cpython666.github.io/life/yearly-flags/2025-flag-review)：逐条核对 2025 年立下的 flag：定投买黄金、摸索上班外的收入、练出腹肌和 50 个俯卧撑、短视频做到 3000 粉。最大的进步是认清自己。
- [年度总结与Flag](https://cpython666.github.io/life/yearly-flags/)：收录年终总结、阶段复盘、新年计划，以及那些认真立下的 flag，和后来它们的兑现情况。

## 后端

- [布隆过滤器](https://cpython666.github.io/backend/布隆过滤器)：布隆过滤器用于判断元素是否在集合中，空间效率和查询时间远超一般算法，代价是存在误判率且难以删除。含维基百科版与 GPT 版两种讲解及工作原理。
- [Cron 表达式介绍](https://cpython666.github.io/backend/cron)：Cron 表达式用于设置定时任务，广泛用于 Linux 及 Quartz、APScheduler 等框架。讲解字段结构、特殊字符含义、常见示例与使用注意事项。
- [Git笔记](https://cpython666.github.io/backend/git)：Git 使用笔记与提交规范整理：提交信息格式、type 类型、scope 作用域、subject 标题、body 正文与 footer 页脚的写法。
- [go-zero 从零上手：最常用的功能一篇讲清（goctl、API、Model、JWT、RPC）](https://cpython666.github.io/backend/go-zero)：go-zero 图文入门教程：安装 goctl，一条命令生成 API 服务，看懂项目目录和请求流转，写 .api 文件定义接口，用 goctl model 连 MySQL 带 Redis 缓存，实现注册登录和 JWT 鉴权、统一返回格式、中间件，再拆出 RPC 服务用 etcd 做服务发现，先学最常用的 20% 功能。
- [Jenkins 从零上手：最常用的功能一篇讲清（自由风格、流水线、凭据、插件）](https://cpython666.github.io/backend/jenkins)：Jenkins 图文入门教程：用 Docker 安装并完成初始化，新建自由风格任务配置 Git、定时触发、shell 构建和归档，带参数构建看日志，再到 Pipeline 流水线、凭据管理和插件管理，先学最常用的 20% 功能。
- [Nginx笔记](https://cpython666.github.io/backend/nginx)：Nginx 是高性能的 Web 服务器与反向代理服务器。整理常用命令、简介与配置文件基础，含启动、重载、测试配置等操作说明。

## 前端

- [博客搭建记录](https://cpython666.github.io/web/collection/vitepress博客搭建)：VitePress 博客搭建过程记录：用 Element 组件做回到顶部按钮、实现分享页面按钮获取当前链接与标题，以及首页重构。
- [VitePress 环境差异排查记录](https://cpython666.github.io/web/collection/vitepress环境差异记录)：本地跑不出鼠标样式，打包 preview 和线上都正常。记录这次环境差异的排查过程，以及脚本放 head 里操作 body 的时机问题。
- [CSS](https://cpython666.github.io/web/css)：CSS 常用片段速查：首行缩进、隐藏滚动条、按钮悬浮旋转与点击缩小动画、发光与内凹外凸阴影、去掉输入框边框、禁止选中文字。
- [HTML](https://cpython666.github.io/web/html)：HTML 常用片段速查：设置网页 logo、引入 CSS 文件、原始表单登录写法与页面空格处理。
- [JQuery](https://cpython666.github.io/web/jquery)：为什么要学 jQuery：原生 JS 查找元素单一、遍历麻烦、有兼容问题、动画难写且代码冗余。讲解 jQuery 版本差异、入口函数、jq 对象与 DOM 对象的区别及选择器。
- [JS](https://cpython666.github.io/web/js)：JavaScript 常用片段速查：获取与解析 cookie、显示当前时间、计算时间差、列表操作、获取当前页面链接、数组排序、回到顶部与锚点被导航栏覆盖的处理。

## 科技日报

- [科技日报 001｜Roadster亮相，AI向本地走](https://cpython666.github.io/tech-daily/2026-10-16)（2026-10-16）：Roadster今早亮相，马斯克谈Star Mind量产计划；台积电回应Terafab，Meta与英伟达更新开放模型。六条科技消息，分清演示、计划和已经能用的产品。
- [科技日报 002｜特斯拉FSD再进一国，AI走进实验室](https://cpython666.github.io/tech-daily/2026-10-17)（2026-10-17）：特斯拉FSD在斯洛伐克获准使用；Codex更新任务中途纠偏，Claude追溯密码学旧谜，谷歌让AI参与真实实验。再看Waymo与英伟达的自动驾驶新动向。
- [科技日报 003｜DeepSeek更新，AI开始分头干活](https://cpython666.github.io/tech-daily/2026-10-18)（2026-10-18）：DeepSeek更新、ChatGPT多智能体与Claude量子电路研究；另看马斯克动态、Anthropic融资报道，以及管理多个编程Agent的热门项目Orca。
- [科技日报 004｜马斯克看重机器人，AI代码也要“答辩”](https://cpython666.github.io/tech-daily/2026-10-19)（2026-10-19）：马斯克看重Optimus与Cybercab，Anthropic拟设公益基金；再看REA软件逆向、Sphinx代码问答，以及CLI-Anything和Android官方Skills。
- [科技日报 005｜MiniMax降价，安卓应用跑上Mac](https://cpython666.github.io/tech-daily/2026-10-20)（2026-10-20）：MiniMax M3.1 Flash上线，亚马逊降低PyTorch换芯片门槛；再看SpaceX发射计划、AI权限管理，以及Mac.apk和电视桌面改造项目。
- [科技日报](https://cpython666.github.io/tech-daily/)：Python斗罗的科技日报专栏，分期整理AI工具、科技进展、马斯克公司动态与GitHub/X热门项目，附官方公告、项目仓库和报道来源。

## 普通人的破局笔记

- [普通人的破局笔记](https://cpython666.github.io/breakthrough-notes/)：关于赚钱、思维认知、信息差、资源获取和普通人如何做选择的个人笔记。
- [找资源宝典：资源无界，打破信息壁垒-说明](https://cpython666.github.io/breakthrough-notes/resource-treasure-manual)（2025-01-02）

## 网站与作者

- [交流群](https://cpython666.github.io/web-intro/community-group)：Python / Java / HTML / 大数据编程学习交流群，欢迎点击链接加入一起讨论。
- [开发日记](https://cpython666.github.io/web-intro/development-diary)：本站的开发日记，按时间记录踩过的坑与实现过程。曾经想做最炫酷的网站写最花哨的样式，现在写代码能跑就行。
- [开发历程](https://cpython666.github.io/web-intro/development-origins)：为什么搭建这个网站：自己淋过雨，才更想为别人撑伞。记录从 2024.03.28 开始的技术选型、待办规划与建站开端。
- [页面特效设置](https://cpython666.github.io/web-intro/effects-settings)：控制网站飞翔的小鸟和点击爆炸特效是否关闭
- [关于本站](https://cpython666.github.io/web-intro/)：站长个人介绍、技能、奖项与作品，附仓库地址、个性签名和联系方式，以及支持站长的方式。
- [支持作者](https://cpython666.github.io/web-intro/support)：支持本站的几种方式，以及一个高性价比服务器厂商的推荐与推广链接。
- [团队介绍](https://cpython666.github.io/web-intro/team-intro)：本站团队成员介绍，含头像、职能与 GitHub 等社交主页链接。

## 算法

- [探索递归：从简单到复杂的迷人之旅](https://cpython666.github.io/算法/递归)：递归是函数不断调用自身来解决问题，把问题分解成更小的子问题直到基本情况再逐层返回。讲解本质、原理与应用，附斐波那契和阶乘示例。
- [探索广度优先搜索（BFS）：从概念到实践](https://cpython666.github.io/算法/bfs)：BFS 从起始顶点逐层向外扩展直到找到目标。讲解基本概念、工作原理、在图遍历与最短路径中的应用，附示例代码与示例图。
- [蓝桥杯万字攻略：算法模板大放送！-c++](https://cpython666.github.io/算法/collection/蓝桥杯万字攻略：算法模板大放送！-c++)：蓝桥杯 C++ 算法模板合集：由数据范围反推算法复杂度，涵盖快速排序、归并排序、整数与浮点数二分、高精度加法等基础算法模板。
- [一分钟学算法-递归-斐波那契数列递归解法及优化](https://cpython666.github.io/算法/collection/一分钟学算法-递归-斐波那契数列递归解法及优化)：一分钟学一个算法题：用递归求解斐波那契数列。讲清数列定义与推导过程，给出朴素递归解法及其优化思路，附视频教程链接。
- [深度优先搜索（DFS）：探索图的无尽可能性](https://cpython666.github.io/算法/dfs)：DFS 沿一条路径尽可能深地遍历，走不通再回溯。讲解概念、工作原理，以及在图遍历、拓扑排序和连通性检测中的应用，附示例代码。

## 好文推荐

- [程序员脱单指南](https://cpython666.github.io/好文推荐/程序员脱单指南)：程序员脱单的几点心得：先对自己好、投资自己、别有过多分享欲，女生是吸引来的不是追来的，以及 18 条恋爱忠告。
- [好文分享](https://cpython666.github.io/好文推荐/)：好文与工具分享合集：GitHub Gist、Codeshare、JSFiddle、Codepad、JS Bin 等代码共享网站，以及艺术字生成、图片压缩和爬虫相关资源。
- [土味情话](https://cpython666.github.io/好文推荐/twqh)：收录一批土味情话，随手翻翻图一乐。
