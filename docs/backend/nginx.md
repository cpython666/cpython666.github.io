# Nginx笔记
## 常用命令
```bash
nginx -t
nginx -s reload
nginx -s stop
```
## 介绍
Nginx 是一款高性能的 Web 服务器和反向代理服务器，广泛用于处理 HTTP、HTTPS 等请求。以下是常用的 Nginx 命令及其说明：

---

### **Nginx 常用命令**
这些命令通常在终端中输入，假设 Nginx 已安装且配置正确。

1. **启动 Nginx**
   ```bash
   nginx
   ```
   - 直接启动 Nginx 服务，使用默认配置文件（通常是 `/etc/nginx/nginx.conf` 或安装路径下的 `nginx.conf`）。
   - 如果需要指定配置文件：
     ```bash
     nginx -c /path/to/nginx.conf
     ```

2. **停止 Nginx**
   ```bash
   nginx -s stop
   ```
   - 立即停止 Nginx 服务，强制关闭所有连接。
   - 更优雅的停止方式（等待现有连接处理完成）：
     ```bash
     nginx -s quit
     ```

3. **重新加载配置文件**
   ```bash
   nginx -s reload
   ```
   - 在不中断服务的情况下重新加载配置文件，适用于修改配置后更新。

4. **测试配置文件语法**
   ```bash
   nginx -t
   ```
   - 检查 Nginx 配置文件语法是否正确，默认检查 `/etc/nginx/nginx.conf`。
   - 指定配置文件：
     ```bash
     nginx -t -c /path/to/nginx.conf
     ```

5. **查看 Nginx 版本**
   ```bash
   nginx -v
   ```
   - 显示 Nginx 的版本号。
   - 如果需要更详细信息（如编译参数）：
     ```bash
     nginx -V
     ```

6. **重启 Nginx**
   - Nginx 没有直接的重启命令，通常组合使用停止和启动：
     ```bash
     nginx -s stop && nginx
     ```
   - 或者通过系统服务管理工具（取决于操作系统）：
     ```bash
     systemctl restart nginx  # 对于使用 systemd 的系统
     service nginx restart    # 对于使用 init.d 的系统
     ```

7. **查看 Nginx 运行状态**
   - 检查进程：
     ```bash
     ps -ef | grep nginx
     ```
   - 或使用服务状态：
     ```bash
     systemctl status nginx  # 对于 systemd 系统
     ```

8. **发送信号**
   - Nginx 支持通过 `-s` 参数发送信号，常见信号包括：
     - `stop`：快速停止。
     - `quit`：优雅停止。
     - `reload`：重新加载配置。
     - `reopen`：重新打开日志文件（用于日志切割）：
       ```bash
       nginx -s reopen
       ```

---

### **Nginx 简介**
- **什么是 Nginx？**
  Nginx（发音为 "engine-x"）是一个开源的高性能 Web 服务器、反向代理服务器和负载均衡器，由 Igor Sysoev 于 2004 年开发。它以异步事件驱动架构著称，能够处理大量并发连接，同时保持低内存和 CPU 占用。

- **主要功能**
  - **Web 服务器**：提供静态文件服务，支持 HTTP/HTTPS。
  - **反向代理**：将客户端请求转发到后端服务器。
  - **负载均衡**：支持多种算法（如轮询、IP 哈希）分发流量。
  - **邮件代理**：支持 IMAP/POP3/SMTP 协议。
  - **缓存**：提供静态内容和代理内容的缓存功能。

- **优点**
  - 高并发：单实例可处理数万并发连接。
  - 低资源占用：相比传统服务器（如 Apache），内存和 CPU 使用效率更高。
  - 配置简单：配置文件结构清晰，支持模块化扩展。

- **典型使用场景**
  - 托管静态网站。
  - 为动态应用（如 PHP、Python、Node.js）提供反向代理。
  - 实现负载均衡和高可用性。
  - 处理 HTTPS 流量并提供 SSL/TLS 证书支持。

---

### **配置文件基础**
Nginx 的核心配置文件通常位于 `/etc/nginx/nginx.conf`，主要包含以下部分：
- `http {}`：HTTP 服务的全局配置。
- `server {}`：定义虚拟主机（网站）。
- `location {}`：定义特定路径的处理规则。

示例：
```nginx
http {
    server {
        listen 80;
        server_name example.com;
        location / {
            root /var/www/html;
            index index.html;
        }
    }
}
```

---
