# 探索SimpleUI：让Django Admin焕发现代光彩
## 介绍
SimpleUI 是一个基于 Vue 和 Element-UI 为 Django Admin 界面提供的现代化主题。它旨在通过提供一个更加美观、现代的用户界面来改善 Django Admin 的用户体验。SimpleUI 内置了28种流行主题，支持快速安装，且完全兼容 Django Admin 原生功能，无需修改现有代码即可使用。它通过简化配置和增强视觉元素，极大提升了后端开发的效率和体验。此外，SimpleUI 支持 Django 3.0 和 Python 3.8、3.9，显示了其对最新技术栈的支持。


在众多开源项目中，SimpleUI以其独特的方式脱颖而出，为Django Admin界面带来一股清新之风。这个基于Vue和Element-UI的现代化主题，不仅美化了传统的后台管理界面，而且通过提供28种流行的主题选择，确保了每位开发者都能找到心仪的风格。

SimpleUI的亮点在于它的即插即用特性，允许开发者无需修改现有代码即可享受到全新的用户体验。它完美兼容Django Admin的原生功能，同时引入了对最新技术栈的支持，包括Django 3.0以及Python 3.8和3.9版本。

除了外观上的革新，SimpleUI还注重实用性。它通过简化配置和优化页面布局，大幅提升了后台管理的效率。无论是数据库管理、用户权限分配还是内容发布，SimpleUI都能让这些日常任务变得更加直观和便捷。

SimpleUI不仅是一个界面美化工具，它还代表了Django社区对现代化开发理念的追求和实践。通过这款主题，开发者能够以更少的时间和精力，创建出既美观又功能强大的后台管理系统。

总的来说，SimpleUI为Django Admin注入了新活力，展示了技术与美学的完美结合。对于追求高效且不愿妥协于后台界面美观的开发者而言，SimpleUI无疑是一个值得探索的项目。



今天给大家推荐的是一款基于vue+element-ui的django admin现代化主题。名字是Simple UI。
大家喜欢的话可以去官方仓库点个star。

https://github.com/newpanjing/simpleui

特点是：简单不简约，多款主题，一键安装

内置28款流行的主题
⚡️ pip闪电安装100%兼容原生admin无需修改代码
✨ 多标签页面，各个模块更加清晰明了
🎯 配置简单，极速上手，在settings.py中加入simpleui后启动立即生效，效率提升 100%！让后端开发得心应手。
☕️ Element-UI + Vue 加持，让古老的django admin 焕然一新。
🦀 新增支持Django3.0，Python3.8、Python3.9，敢于做第一个吃螃蟹的人。

Django Admin默认界面设计语言存在着的一些不足，比如色彩单一，大量线条的使用，分割化明显。将这些不足归类一下就是界面单调、雷同性明显、缺少惊喜。我们认为新的平台类视觉风格可以打破这些束缚，尝试一些新的探索，启发传统的设计认知,因此结合当下设计趋势，构思了Element+Django Admin的Simpleui。让Django Admin和Element产生完美的交互。配以最流行的后台设计风格，让Django Admin更加强大。

## simpleui教程

<a name="rLhHn"></a>

## 官方仓库

[https://github.com/newpanjing/simpleui](https://github.com/newpanjing/simpleui)
<a name="kzT4t"></a>

## 官方文档

[https://newpanjing.github.io/simpleui_docs/config.html](https://newpanjing.github.io/simpleui_docs/config.html)
<a name="MNQur"></a>

## 基础功能

```python
pip install django-simpleui
```

修改settings.py, 将simpleui加入到INSTALLED_APPS里去，放在第一行，也就是django自带admin的前面。

```python
INSTALLED_APPS = [
      'simpleui', # 注意这里
      'django.contrib.admin',
      'django.contrib.auth',
      'django.contrib.contenttypes',
      'django.contrib.sessions',
      'django.contrib.messages',
      'django.contrib.staticfiles',
      ...     
]
```

使用python manage.py runserver命令启动本地测试服务器, 访问/admin/, 如果你能看到如下页面说明安装成功。<br />注意：如果你在生成环境中使用SimpleUI，还需要使用python manage.py collectstatic命令收集静态文件，否则样式无法正常显示。
<a name="NXlTl"></a>

### 配置登陆注册链接

```python
# settings
SWAGGER_SETTINGS = {
    'LOGIN_URL' : '/api-auth/login/',
    'LOGOUT_URL' : '/api-auth/logout/'
}
```

<a name="taCyJ"></a>

## 常用配置

<a name="glSme"></a>

### 设置语言, 去Logo和管理后台名字

当你看到以上界面时，首先你想改动的一定是语言，去掉SimpleUI的默认logo，并把Django administration改成比如某某管理后台的名字。<br />修改settings.py， 添加如下代码：

```python
# 更改默认语言为中文
LANGUAGE_CODE = 'zh-hans'

# 去掉默认Logo或换成自己Logo链接
SIMPLEUI_LOGO = 'https://i0.hdslb.com/bfs/face/245cab06813938c7f4a4cb2a8e43ed9f06be539d.jpg'


```

<a name="NRYIF"></a>

### 管理后台的名称和标题

修改管理后台的名称和标题要稍微复杂些，因为你不能在settings.py里进行配置。在任何一个app的目录下新建一个admin.py, 添加如下代码即可修改(本例app名为tasks)。这个设置属于Django的设置，不属于SimpleUI的设置。

```python
# tasks/admin.py
from django.contrib import admin

admin.site.site_header = '家政预约管理后台'  # 设置header
admin.site.site_title = '家政预约管理后台'   # 设置title
admin.site.index_title = '家政预约管理后台'

from .models import Task
admin.site.register(Task)
```

现在你可以看到语言、Logo和管理后台名字都已经改过来了。但是你会发现两个问题，左侧菜单的tasks显示的依然是英文，我们需要将其设置成中文。另外，右侧有simpleui的广告链接，页面背后有js文件跟踪simpleui的使用，这些都需要关闭。我们接下来教你如何解决这两个问题。
<a name="RCbLi"></a>

### 自定义或第三方APP名和模型名修改成中文

修改tasks/app.py, 通过verbose_name可以将app名改为中文，这里将tasks 改成了任务管理。

```python
from django.apps import AppConfig

class TasksConfig(AppConfig):
    name = 'tasks'

    verbose_name = '任务管理'
```

接着修改tasks/models.py, 设置模型的verbose_name, 如下所示：

```python
from django.db import models

class Status(models.TextChoices):
    UNSTARTED = 'u', "Not started yet"
    ONGOING = 'o', "Ongoing"
    FINISHED = 'f', "Finished"


class Task(models.Model):
    name = models.CharField(verbose_name="Task name", max_length=65, unique=True)
    status = models.CharField(verbose_name="Task status", max_length=1, choices=Status.choices)
    
    class Meta:
        verbose_name = "任务"
        verbose_name_plural = "任务"

    def __str__(self):
        return self.name
```

实际Django开发中，我们还会用到第三方应用app和第三方app提供的模型，我们也可以通过打补丁的方式更改第三方app或模型以及模型字段的verbose_name或者label，将其修改成中文，如下所示：

```python
from third_package.models import ModelA

ModelA._meta.verbose_name = ''
ModelA._meta.verbose_name_plural = ''
ModelA._meta.get_field('first_name').verbose_name = '名字'
```

<a name="O38gf"></a>

### 关闭右侧广告链接和使用分析

修改settings.py, 添加如下两行代码：

```python
# 隐藏右侧SimpleUI广告链接和使用分析
SIMPLEUI_HOME_INFO = False 
SIMPLEUI_ANALYSIS = False
```

<a name="xZwuG"></a>

### 设置默认主题

SimpleUI默认主题(default)是深蓝色的，它支持的主题有Element-ui, Admin Lte和Layui等多种风格。你可以通过右上角下拉菜单改变主题，也可以在settings.py中设置默认主题，如下所示：

```python
# 设置默认主题，指向主题css文件名。Admin Lte风格
SIMPLEUI_DEFAULT_THEME = 'admin.lte.css'

# 设置默认主题，指向主题css文件名。Element-ui风格
SIMPLEUI_DEFAULT_THEME = 'element.css'

# 设置默认主题，指向主题css文件名。layui风格
SIMPLEUI_DEFAULT_THEME = 'layui.css'

# 设置默认主题，指向主题css文件名。紫色风格
SIMPLEUI_DEFAULT_THEME = 'purple.css'
```

<a name="w1lH8"></a>

### 自定义菜单

左侧可折叠菜单是Simple UI系统默认菜单，根据已注册的应用和模型自动生成，其中父级菜单是App名，子菜单一般是所属App的各个模型名。SimpleUI甚至会自动为你分配默认图标，比如本例的tasks的应用使用了font-awsome的fa fa-tasks。在大多数情况下，Simple UI系统默认菜单不能满足需求，这时你就需要自定义菜单了，比如添加新的选项或给菜单选项分配新的图标。<br />修改settings.py, 添加如下代码：

```python
SIMPLEUI_CONFIG = {
     # 是否使用系统默认菜单。
    'system_keep': False,
    
     # 用于菜单排序和过滤, 不填此字段为默认排序和全部显示。 空列表[] 为全部不显示.
    'menu_display': ['任务管理', '权限认证'],
    
    # 设置是否开启动态菜单, 默认为False. 如果开启, 则会在每次用户登陆时刷新展示菜单内容。
    # 一般建议关闭。
    'dynamic': False,
    'menus': [
        {
            'app': 'auth',
            'name': '权限认证',
            'icon': 'fas fa-user-shield',
            'models': [
                {
                'name': '用户列表',
                'icon': 'fa fa-user',
                'url': 'auth/user/'
                },
                {
                    'name': '用户组',
                    'icon': 'fa fa-th-list',
                    'url': 'auth/group/'
                }
            ]
        },

        {
            'name': '任务管理',
            'icon': 'fa fa-th-list',
            'models': [
                {
                'name': '任务列表',
                # 注意url按'/admin/应用名小写/模型名小写/'命名。  
                'url': '/admin/tasks/task/',
                'icon': 'fa fa-tasks'
                },
            ]
        },
    ]
}
```

自定义菜单效果如下所示。我们更改了SimpleUI默认分配的图标。你还可以随意增减菜单选项并对其进行排序。<br />当然使用SimpleUI系统菜单也有优点，比如用户拥有什么模型的权限就显示什么菜单。自定义menus中输出的菜单不会受权限控制。如果你想要在后台使用基于RBAC控制的菜单，就不要通过SIMPLEUI_CONFIG自定义菜单。如果你不喜欢，系统默认的菜单图标，只需要通过SIMPLEUI_ICON定义即可，如下所示：

```python
# 注意key名为菜单上实际显示的名字，不是模型或App名。
SIMPLEUI_ICON = {
    '任务管理': 'fas fa-tasks',
    '任务': 'fas fa-th-list',
}
```

<a name="evWZx"></a>

### 自定义首页

SimpleUI默认首页由快捷链接和最近动作组成，我们可以将其隐藏，并将其链接到其它url。<br />继续修改settings.py, 添加如下代码：

```python
# 隐藏首页的快捷操作和最近动作
SIMPLEUI_HOME_QUICK = False 
SIMPLEUI_HOME_ACTION = False

# 修改左侧菜单首页设置
SIMPLEUI_HOME_PAGE = 'https://space.bilibili.com/1909782963'  # 指向页面
SIMPLEUI_HOME_TITLE = 'Python斗罗主页!' # 首页标题
SIMPLEUI_HOME_ICON = 'fa fa-code' # 首页图标

# 设置右上角Home图标跳转链接，会以另外一个窗口打开
SIMPLEUI_INDEX = 'https://space.bilibili.com/1909782963'
```

实际应用中后台首页通常是控制面板，需要用图表形式展示各种关键数据，这时就需要重写首页了。这里主要有两种实现方法。第一种是重写simpleui自带的home.html, 另一种自己编写一个控制面板的页面，然后设置首页指向它, 个人倾向于第二种, 因为它完全不涉及改动simpleui的源码。<br />我们现在开始使用Django编写一个用于显示控制面板的页面，用于在首页显示注册用户数量及任务数量。URL路由及对应的视图函数如下所示：

```python
# tasks/urls.py
urlpatterns = [
    path('tasks/dashboard/', views.dashboard, name='dashboard'),
]

# tasks/views.py
from django.contrib.auth.models import User
from django.shortcuts import render
from .models import Task

def dashboard(request):
    user_count = User.objects.count()
    task_count = Task.objects.count()

    context = { 'user_count': user_count, 'task_count': task_count }
    return render(request, 'tasks/dashboard.html',context)
```

我们的模板也很简单，使用了boostrap4的admin lte风格的卡片展示用户总数和任务总数。

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>控制面板</title>
  <!-- Tell the browser to be responsive to screen width -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Theme style -->
    <link rel="stylesheet" href="https://adminlte.io/themes/AdminLTE/bower_components/bootstrap/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://adminlte.io/themes/AdminLTE/dist/css/AdminLTE.min.css">
</head>

<body>
<div class="wrapper">
 <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <!-- Small boxes (Stat box) -->
        <div class="row">
          <div class="col-sm-3">
            <!-- small box -->
            <div class="small-box bg-info">
              <div class="inner">
                <h3>{{ user_count }}</h3>

                <p>用户总数</p>
              </div>
              <div class="icon">
                <i class="ion ion-bag"></i>
              </div>
              <a href="#" class="small-box-footer">更多信息 <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <!-- ./col -->
          <div class="col-sm-3">
            <!-- small box -->
            <div class="small-box bg-success">
              <div class="inner">
                <h3>{{ task_count }}</h3>
                <p>任务总数</p>
              </div>
              <div class="icon">
                <i class="ion ion-stats-bars"></i>
              </div>
              <a href="#" class="small-box-footer">更多信息 <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <!-- ./col -->
             <div class="col-sm-3">
            <!-- small box -->
            <div class="small-box bg-info">
              <div class="inner">
                <h3>{{ user_count }}</h3>

                <p>用户总数</p>
              </div>
              <div class="icon">
                <i class="ion ion-bag"></i>
              </div>
              <a href="#" class="small-box-footer">更多信息 <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <!-- ./col -->
          <div class="col-sm-3">
            <!-- small box -->
            <div class="small-box bg-success">
              <div class="inner">
                <h3>{{ task_count }}</h3>

                <p>任务总数</p>
              </div>
              <div class="icon">
                <i class="ion ion-stats-bars"></i>
              </div>
              <a href="#" class="small-box-footer">更多信息 <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <!-- ./col -->

        </div>
      </div>
    </section>
  </div>
</body>
```

现在修改我们的settings.py, 将首页指向这个新创建的控制面板。

```python
# 修改首页设置, 指向新创建的控制面板
SIMPLEUI_HOME_PAGE = '/tasks/dashboard/'
SIMPLEUI_HOME_TITLE = '控制面板!' 
SIMPLEUI_HOME_ICON = 'fa fa-eye'
```

刷新浏览器，你就会发现我们的首页已经修改了
<a name="juloD"></a>

### 其它常见配置

<a name="KPLAe"></a>

### cdn获取js,css，loading遮罩，登录界面粒子动画

```python
# 离线模式。不填该项或者为False的时候，默认从第三方的cdn获取
SIMPLEUI_STATIC_OFFLINE = False
# 关闭Loading遮罩层
SIMPLEUI_LOADING = False
# 关闭登录界面粒子动画
SIMPLEUI_LOGIN_PARTICLES = False
```

