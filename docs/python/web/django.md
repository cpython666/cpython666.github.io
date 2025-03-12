# Django笔记
```python
pip freeze > requirements.txt
pip install django
pip install djangorestframework
pip install mysqlclient
pip install django-simpleui
pip install djongo

django-admin startproject djangoproname


python manage.py runserver


python manage.py startapp polls
python manage.py startapp api apps/api

python manage.py sqlmigrate 应用名 文件名
python manage.py makemigrations
python manage.py migrate

python manage.py createsuperuser

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
        "NAME": BASE_DIR / "db.sqlite3",
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
