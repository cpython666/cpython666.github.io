---
title: "Django最常用命令合集"
created_at: 2024-12-20 23:35:32
updated_at: 2024-12-20 23:35:32
---

# Django最常用命令合集

# django常用命令

```python
pip freeze > requirements.txt
pip install django
pip install djangorestframework
pip install mysqlclient
pip install django-simpleui
pip install djongo
pip install djangorestframework-simplejwt

django-admin startproject djangoproname


python manage.py runserver


python manage.py startapp polls
python manage.py startapp api apps/api

python manage.py sqlmigrate 应用名 文件名
python manage.py makemigrations
python manage.py migrate
python manage.py makemigrations appname
python manage.py migrate appname

python manage.py createsuperuser


pip install celery
pip install django-allauth
pip install django-imagekit
pip install django-debug-toolbar
pip install django-mptt
pip install django-crispy-forms
pip install django-celery-email

pip install django-ckeditor
```

## 静态文件

<font style="color:rgb(12, 60, 38);">你的工程可能包含未与任何应用绑定的静态资源。除了在 apps 中使用</font><font style="color:rgb(12, 60, 38);"> </font>`**static/**`<font style="color:rgb(12, 60, 38);"> </font><font style="color:rgb(12, 60, 38);">目录，你可以在配置文件中定义一个目录列表 (</font>[<font style="color:rgb(12, 60, 38);">STATICFILES_DIRS</font>](https://docs.djangoproject.com/zh-hans/5.0/ref/settings/#std-setting-STATICFILES_DIRS)<font style="color:rgb(12, 60, 38);">) ，Django 会从中寻找静态文件。例子:</font>

```plain
STATICFILES_DIRS = [
    BASE_DIR / "static",
    "/var/www/static/",
]
```

## 管理模型

```python
from django.contrib import admin

from .models import Question

admin.site.register(Question)
```

## settings常用配置

## 语言，时区，数据库

```python
# settings
# 多语言配置更改语言为中文
LANGUAGE_CODE = "zh-hans"
# 时区
TIME_ZONE = 'Asia/Shanghai'
USE_TZ = True


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        # "NAME": BASE_DIR / "db.sqlite3",
        "NAME": BASE_DIR + "/db.sqlite3",
    }
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # 默认
        'NAME': 'homeservice',  # 连接的数据库  #一定要存在的数据库名
        'HOST': '127.0.0.1',  # mysql的ip地址
        'PORT': 3306,  # mysql的端口
        'USER': 'root', # mysql的用户名
        'PASSWORD': '1234'  # mysql的密码
        }
}

DATABASES = {
   'default': {
      'ENGINE': 'djongo',
      'ENFORCE_SCHEMA': True,
      'NAME': 'your-db-name',
      'HOST': 'host-name or ip address',
      'PORT': 27017,
      'USER': 'db-username',
      'PASSWORD': 'password',
      'AUTH_SOURCE': 'db-name',
      'AUTH_MECHANISM': 'SCRAM-SHA-1',
      'REPLICASET': 'replicaset',
      'SSL': 'ssl',
      'SSL_CERTFILE': 'ssl_certfile',
      'SSL_CA_CERTS': 'ssl_ca_certs',
      'READ_PREFERENCE': 'read_preference'
   }
}
   'default': {
      'ENGINE': 'djongo',
      'ENFORCE_SCHEMA': True,
      'NAME': 'django2024',
      'HOST': 'localhost',
      'PORT': 27017,
      # 'USER': 'db-username',
      # 'PASSWORD': 'password',
      # 'AUTH_SOURCE': 'db-name',
      'AUTH_MECHANISM': 'SCRAM-SHA-1',
      'REPLICASET': 'replicaset',
      'SSL': 'ssl',
      'SSL_CERTFILE': 'ssl_certfile',
      'SSL_CA_CERTS': 'ssl_ca_certs',
      'READ_PREFERENCE': 'read_preference'
   }
```

## django的command脚本一个文件中能写多个命令吗  

在 Django 中，每个管理命令通常对应一个文件，并放置在应用的 `management/commands/` 目录下。每个命令的入口类继承自 `BaseCommand` 或其子类。这种设计是为了让 Django 的命令能够独立运行，且文件名与命令名称一一对应。

因此，**一个文件中只能定义一个 Django 命令**。文件名就是命令的名称。

---

### **正确的实现方式**

如果需要定义多个命令，应为每个命令单独创建一个文件。例如：

1. 假设有一个应用名为 `myapp`。
2. 创建管理命令目录结构：

```plain
myapp/
    management/
        commands/
            command_one.py
            command_two.py
```

3. 每个文件定义一个命令：`command_one.py`

```python
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Command one description'

    def handle(self, *args, **kwargs):
        self.stdout.write('Executing command one')
```

`command_two.py`

```python
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Command two description'

    def handle(self, *args, **kwargs):
        self.stdout.write('Executing command two')
```

---

### **调用方式**

运行命令时，命令名与文件名对应：

```bash
python manage.py command_one
python manage.py command_two
```

---

### **特殊需求：一个文件包含多个功能**

如果你希望一个命令文件中包含多个逻辑功能，可以通过命令的 **参数** 来实现。例如：

`multi_command.py`

```python
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'A multi-functional command'

    def add_arguments(self, parser):
        parser.add_argument(
            'operation',
            type=str,
            choices=['task1', 'task2'],
            help='Choose the operation to execute: task1 or task2'
        )

    def handle(self, *args, **kwargs):
        operation = kwargs['operation']
        if operation == 'task1':
            self.stdout.write('Executing Task 1...')
            # Task 1 logic here
        elif operation == 'task2':
            self.stdout.write('Executing Task 2...')
            # Task 2 logic here
```

运行时：

```bash
python manage.py multi_command task1
python manage.py multi_command task2
```

### 总结

+ **一个文件只能对应一个 Django 命令名称**，如果需要多个命令，请使用多个文件。
+ 如果需要一个命令文件中实现多个功能，可以通过命令参数来区分。
