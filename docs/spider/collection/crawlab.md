# Crawlab使用记录
## 官网
官方文档：[https://docs.crawlab.cn/zh/guide/](https://docs.crawlab.cn/zh/guide/)

## 单节点部署
单节点部署: [https://docs.crawlab.cn/zh/guide/installation/docker.html](https://docs.crawlab.cn/zh/guide/installation/docker.html)

## 运行crawlab

### 步骤概览
- 安装 Docker 和 Docker-Compose
- 拉取 Crawlab Docker 镜像（如果没有 MongoDB，也需要拉取）
- 创建 docker-compose.yml 并进行配置
- 启动 Docker 容器
### 安装 Docker 和 Docker-Compose
安装docker：[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
查看是否安装成功
```python
docker --version
docker-compose --version
```
设置镜像源：[https://yeasy.gitbook.io/docker_practice/install/mirror](https://yeasy.gitbook.io/docker_practice/install/mirror)
### 拉取 Crawlab Docker 镜像（如果没有 MongoDB，也需要拉取）
```python
docker pull crawlabteam/crawlab
docker pull mongo
```
### 创建 docker-compose.yml 并进行配置
`docker-compose.yml`
```python
version: '3.3'
services:
  master:
    image: crawlabteam/crawlab
    container_name: crawlab_master
    restart: always
    environment:
      CRAWLAB_NODE_MASTER: "Y"  # Y: 主节点
      CRAWLAB_MONGO_HOST: "mongo"  # mongo host address. 在 Docker-Compose 网络中，直接引用 service 名称
      CRAWLAB_MONGO_PORT: "27017"  # mongo port 
      CRAWLAB_MONGO_DB: "crawlab"  # mongo database 
      CRAWLAB_MONGO_USERNAME: "username"  # mongo username
      CRAWLAB_MONGO_PASSWORD: "password"  # mongo password 
      CRAWLAB_MONGO_AUTHSOURCE: "admin"  # mongo auth source 
    volumes:
      - "/opt/.crawlab/master:/root/.crawlab"  # 持久化 crawlab 元数据
      - "/opt/crawlab/master:/data"  # 持久化 crawlab 数据
      - "/var/crawlab/log:/var/log/crawlab" # 持久化 crawlab 任务日志
    ports:
      - "8080:8080"  # 开放 api 端口
    depends_on:
      - mongo

  mongo:
    image: mongo:4.2
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: "username"  # mongo username
      MONGO_INITDB_ROOT_PASSWORD: "password"  # mongo password
    volumes:
      - "/opt/crawlab/mongo/data/db:/data/db"  # 持久化 mongo 数据
    ports:
      - "27017:27017"  # 开放 mongo 端口到宿主机
```
### 启动 Docker 容器
执行 docker-compose up -d 并在浏览器中导航至 http://<your_ip>:8080，然后开始使用 Crawlab。

