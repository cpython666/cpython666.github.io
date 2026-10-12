---
title: "go-zero 从零上手：最常用的功能一篇讲清（goctl、API、Model、JWT、RPC）"
description: "go-zero 图文入门教程：安装 goctl，一条命令生成 API 服务，看懂项目目录和请求流转，写 .api 文件定义接口，用 goctl model 连 MySQL 带 Redis 缓存，实现注册登录和 JWT 鉴权、统一返回格式、中间件，再拆出 RPC 服务用 etcd 做服务发现，先学最常用的 20% 功能。"
keywords: "go-zero,go-zero教程,go-zero入门,goctl,微服务,Go微服务,gRPC,etcd,JWT,api文件"
---

# go-zero 从零上手：最常用的功能一篇讲清

go-zero 是一个 Go 语言的微服务框架，官方文档内容很全：API 语法、RPC、服务治理、链路追踪、K8s 部署……第一次看很容易不知道从哪下手。

但日常写业务真正用到的就那么几样：**用 goctl 生成代码、写 .api 定义接口、在 logic 里写业务、用 model 查数据库、JWT 鉴权、拆 RPC 服务**。

这篇按「二八原则」来写：先把这 20% 最常用的功能讲透，它们能覆盖你 80% 的开发场景。剩下的高级玩法，等真用到了再查也不迟。

> 文中的命令和输出都来自我本地实际跑的一个演示项目（goctl 1.10.2、go-zero v1.10.3、Go 1.24），手机号、账号等都是演示数据。截图上的红色编号和方框，对应正文里的说明。

## go-zero 是干嘛的？

一句话：**go-zero 是一个「写接口 + 写微服务」的框架，配套一个叫 goctl 的代码生成工具**。

用其他框架写一个接口，你通常要自己：建目录、写路由、写参数解析和校验、写 handler、接数据库、写缓存、加鉴权……每个项目都差不多，又每次都得手写。

go-zero 的思路是：**你只负责写「接口长什么样」和「业务逻辑」，其他的都由 goctl 生成**。

- 写一个 `.api` 文件描述接口 → goctl 生成路由、参数解析、handler 骨架
- 给一个建表 SQL → goctl 生成带缓存的增删改查代码
- 写一个 `.proto` 文件 → goctl 生成 gRPC 服务端和客户端

另外，超时控制、限流、熔断、自适应降载、链路追踪这些微服务必备的东西，框架都内置了，大部分只需要改配置。

一个典型的 go-zero 项目长这样：

![go-zero 典型架构：API 层 + RPC 层 + etcd](/imgs/backend/go-zero/architecture.png)

- **API 服务**：对外提供 HTTP 接口，负责参数校验、鉴权、组装数据。
- **RPC 服务**：对内提供 gRPC 接口，负责具体的业务和数据读写。
- **etcd**：服务注册与发现，API 通过它找到 RPC 的地址。

刚开始做项目，**只写一个 API 服务直接查数据库也完全没问题**。业务变复杂了，再把某一块拆成 RPC 服务。这篇也按这个顺序来：先单体 API，最后再拆 RPC。

## 一、安装 goctl

前提是装好了 Go（1.21 以上）。国内网络先设置一下代理，不然下载依赖会很慢：

```bash
go env -w GOPROXY=https://goproxy.cn,direct
```

安装 goctl：

```bash
go install github.com/zeromicro/go-zero/tools/goctl@latest

# 检查是否安装成功
goctl --version
# goctl version 1.10.2 linux/amd64
```

> 如果提示 `goctl: command not found`，是因为 `$(go env GOPATH)/bin` 不在 PATH 里，把它加到 PATH 就行。

后面写 RPC 还需要 `protoc` 和两个插件，goctl 可以一键装好：

```bash
goctl env check --install --force
```

装完后 `$(go env GOPATH)/bin` 下会多出 `protoc`、`protoc-gen-go`、`protoc-gen-go-grpc` 三个文件。只写 API 的话可以先跳过这一步。

## 二、5 分钟跑通第一个服务

### 1. 生成项目

```bash
goctl api new greet
```

一条命令，就生成了一个完整可运行的 HTTP 服务：

![goctl api new 生成的项目目录](/imgs/backend/go-zero/goctl-api-new.png)

1. **`goctl api new greet`**：生成一个叫 greet 的 API 项目
2. **`etc/greet-api.yaml`**：配置文件，端口、数据库、Redis 等都写在这里
3. **`greet.api`**：接口定义文件，整个项目的代码都是从它生成的
4. **`greet.go`**：main 入口，读配置、启动服务
5. **`handler/routes.go`**：路由注册，每次都会重新生成，**不要手动改**
6. **`logic/greetlogic.go`**：业务逻辑，**你主要写代码的地方**
7. **`svc/servicecontext.go`**：依赖容器，数据库连接、RPC 客户端等都放这里
8. **`types/types.go`**：请求和响应的结构体，根据 .api 自动生成，**不要手动改**

看一眼生成的 `greet.api`：

```go
syntax = "v1"

type Request {
	Name string `path:"name,options=you|me"`
}

type Response {
	Message string `json:"message"`
}

service greet-api {
	@handler GreetHandler
	get /from/:name (Request) returns (Response)
}
```

意思是：有一个 `GET /from/:name` 接口，路径参数 `name` 只能是 `you` 或 `me`，返回一个带 `message` 字段的 JSON。

### 2. 写业务逻辑

打开 `internal/logic/greetlogic.go`，生成的代码里留了一个 `todo`：

```go
func (l *GreetLogic) Greet(req *types.Request) (resp *types.Response, err error) {
	// todo: add your logic here and delete this line

	return
}
```

把它改成：

```go
func (l *GreetLogic) Greet(req *types.Request) (resp *types.Response, err error) {
	return &types.Response{Message: "Hello " + req.Name}, nil
}
```

注意你拿到的 `req` 已经是解析、校验好的结构体了，不用自己从请求里取参数。

### 3. 跑起来

```bash
cd greet
go mod tidy
go run greet.go -f etc/greet-api.yaml
```

![启动服务并用 curl 测试](/imgs/backend/go-zero/run-greet.png)

1. **启动服务**：`-f` 指定配置文件
2. 看到 **`Starting server at 0.0.0.0:8888...`** 就说明启动成功了
3. 请求 `/from/you`，**正常返回 JSON**
4. 请求 `/from/he`，`he` 不在 `options=you|me` 里，**框架直接返回 400**，你一行校验代码都没写

## 三、一次请求是怎么走的

上手 go-zero 最重要的就是搞清楚：一个请求进来，代码是怎么一层层调用的，你的代码该写在哪。

![一次请求在 go-zero 代码里的流转](/imgs/backend/go-zero/request-flow.png)

1. **HTTP 请求**进来
2. **`routes.go`**：按「方法 + 路径」找到对应的 handler，如果配置了 JWT 或中间件，先跑它们
3. **`handler`**：用 `httpx.Parse` 把路径参数、查询参数、JSON body 解析进 `types.XxxReq`，同时做参数校验，失败就直接返回 400
4. **`logic`**：调用你写的业务逻辑，返回 `resp, err`
5. **`svc`**：logic 里需要用的数据库 Model、RPC 客户端、配置，都从 `ServiceContext` 里取

最后 handler 把 `resp` 输出成 JSON，如果 `err` 不为空就走错误处理。

goctl 生成的 handler 代码长这样，看一眼就明白了：

```go
func GreetHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.Request
		if err := httpx.Parse(r, &req); err != nil { // 解析 + 校验参数
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := logic.NewGreetLogic(r.Context(), svcCtx)
		resp, err := l.Greet(&req) // 调你写的业务逻辑
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
```

**记住一句话：改接口就改 `.api` 然后重新生成，写业务就写 `logic`，加依赖就加到 `svc`。**

## 四、.api 文件：接口都在这里定义

接下来做一个稍微正式点的例子：**用户中心**，有注册、登录、获取当前用户信息、用户列表四个接口，其中后两个需要登录。

### 1. 写 .api 文件

新建一个目录 `usercenter`，写一个 `user.api`：

```go
syntax = "v1"

info (
	title:  "用户中心"
	author: "星梦启航"
)

type (
	RegisterReq {
		Mobile   string `json:"mobile"`
		Password string `json:"password"`
		Nickname string `json:"nickname,optional"`
	}
	RegisterResp {
		Id int64 `json:"id"`
	}
	LoginReq {
		Mobile   string `json:"mobile"`
		Password string `json:"password"`
	}
	LoginResp {
		Token  string `json:"token"`
		Expire int64  `json:"expire"`
	}
	UserInfoResp {
		Id       int64  `json:"id"`
		Mobile   string `json:"mobile"`
		Nickname string `json:"nickname"`
	}
	UserListReq {
		Page     int64  `form:"page,default=1"`
		PageSize int64  `form:"pageSize,default=10,range=[1:100]"`
		Keyword  string `form:"keyword,optional"`
	}
	UserListResp {
		Total int64          `json:"total"`
		List  []UserInfoResp `json:"list"`
	}
)

// 不需要登录的接口
@server (
	prefix: /api/v1/user
	group:  user
)
service user-api {
	@doc "注册"
	@handler Register
	post /register (RegisterReq) returns (RegisterResp)

	@doc "登录"
	@handler Login
	post /login (LoginReq) returns (LoginResp)
}

// 需要登录的接口：带 jwt，还挂了一个日志中间件
@server (
	prefix:     /api/v1/user
	group:      user
	jwt:        Auth
	middleware: AccessLog
)
service user-api {
	@doc "当前用户信息"
	@handler Info
	get /info returns (UserInfoResp)

	@doc "用户列表"
	@handler List
	get /list (UserListReq) returns (UserListResp)
}
```

几个关键的地方：

![.api 文件语法要点](/imgs/backend/go-zero/api-file.png)

1. **`type`**：定义请求和响应结构体，可以用 `type ( ... )` 一次写多个
2. **`optional`**：字段默认是**必填**的，不传会直接 400，可以不传的字段要加 `optional`
3. **`form`**：从查询参数取值，`default` 设默认值，`range` 限制范围
4. **`@server`**：给下面整个 service 块的接口统一配置，`prefix` 是路由前缀，`group` 会把生成的文件放到同名子目录里
5. **`service user-api`**：服务名，同一个文件里多个 service 块**必须同名**
6. **`@handler` + 路由**：`@handler` 后面是处理函数名，下一行是「请求方法 路径 (请求类型) returns (响应类型)」，没有请求参数或没有响应时可以省掉对应的括号
7. **`jwt: Auth`**：这个 service 块里的接口都**必须带 token** 才能访问
8. **`middleware: AccessLog`**：这个 service 块里的接口都会经过 `AccessLog` 中间件

参数从哪取，由结构体 tag 决定：

| tag | 取值位置 | 例子 |
| --- | --- | --- |
| `json` | 请求 body（JSON） | `json:"mobile"` |
| `form` | 查询参数（GET）或表单 | `form:"page"` |
| `path` | 路径参数 | `path:"id"`，路由写成 `/user/:id` |
| `header` | 请求头 | `header:"X-Token"` |

tag 里还能加这些校验选项：

| 选项 | 作用 | 例子 |
| --- | --- | --- |
| `optional` | 可选，不传不报错 | `json:"nickname,optional"` |
| `default` | 默认值 | `form:"page,default=1"` |
| `options` | 只能是这几个值之一 | `json:"status,options=on\|off"` |
| `range` | 数字范围，`[` `]` 包含，`(` `)` 不包含 | `form:"size,range=[1:100]"` |

### 2. 生成代码

```bash
cd usercenter
go mod init usercenter

# 格式化 .api 文件（可选）
goctl api format --dir .

# 根据 .api 生成代码，--style gozero 表示文件名用 registerlogic.go 这种风格
goctl api go -api user.api -dir . --style gozero
```

生成后 `internal` 下会多出 `handler/user/`、`logic/user/` 两个分组目录，以及 `middleware/accesslogmiddleware.go`。配置结构体里也自动加上了 JWT 需要的字段：

```go
type Config struct {
	rest.RestConf
	Auth struct {
		AccessSecret string
		AccessExpire int64
	}
}
```

### 3. 改了接口怎么办？

以后要加接口、改字段，**直接改 `.api` 文件，再执行一次同样的 `goctl api go` 命令**就行。

不用担心写好的业务代码被覆盖：goctl 只会重新生成 `routes.go` 和 `types.go` 这种开头写着 `DO NOT EDIT` 的文件，**已经存在的 logic、handler、svc、config 文件不会动**，新加的接口会生成新的 logic 文件。我实际试过在 .api 里加一个接口后重新生成，原来的 logic 文件内容一个字节都没变。

## 五、连数据库：goctl model

### 1. 根据建表语句生成 Model

准备一个建表 SQL `user.sql`：

```sql
CREATE TABLE `user` (
  `id`          bigint unsigned NOT NULL AUTO_INCREMENT,
  `mobile`      varchar(20)  NOT NULL DEFAULT '' COMMENT '手机号',
  `password`    varchar(255) NOT NULL DEFAULT '' COMMENT '密码哈希',
  `nickname`    varchar(50)  NOT NULL DEFAULT '' COMMENT '昵称',
  `create_time` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

先在 MySQL 里执行建表，然后生成 Model 代码：

```bash
goctl model mysql ddl -src user.sql -dir ./model -c --style gozero
```

![goctl model 生成数据库访问代码](/imgs/backend/go-zero/model-gen.png)

1. **`-src`**：建表语句文件
2. **`-c`**：生成**带缓存**的代码，查询会自动先查 Redis，没有再查 MySQL，更新和删除时自动删缓存
3. **`usermodel.go`**：自定义的查询方法写这里，重新生成**不会被覆盖**
4. **`usermodel_gen.go`**：生成的增删改查，每次重新生成都会覆盖，**不要改**
5. 主键会生成 `FindOne`，**唯一索引**会生成 `FindOneByXxx`（这里是 `FindOneByMobile`）

> 不想手写 SQL 文件的话，也可以直接连数据库生成：`goctl model mysql datasource -url="user:pass@tcp(127.0.0.1:3306)/demo" -table="user" -dir ./model -c`

### 2. 配置数据库和 Redis

`etc/user-api.yaml`：

```yaml
Name: user-api
Host: 0.0.0.0
Port: 8888
Timeout: 3000            # 接口超时，毫秒

Log:
  Mode: console          # console 打到控制台，file 写文件
  Encoding: plain        # plain 人类可读，json 方便采集

Auth:
  AccessSecret: "change-me-to-a-long-random-string"
  AccessExpire: 86400    # token 有效期，秒

Mysql:
  DataSource: demo:demo123@tcp(127.0.0.1:3306)/demo?charset=utf8mb4&parseTime=true&loc=Asia%2FShanghai

Cache:
  - Host: 127.0.0.1:6379
```

> `DataSource` 里的 `parseTime=true` 一定要加，不然 `timestamp` 字段扫描到 `time.Time` 会报错。

配置文件里加了字段，`internal/config/config.go` 也要加上对应的字段，**名字要一致**：

```go
type Config struct {
	rest.RestConf
	Auth struct {
		AccessSecret string
		AccessExpire int64
	}
	Mysql struct {
		DataSource string
	}
	Cache cache.CacheConf
}
```

### 3. 把 Model 放进 ServiceContext

`internal/svc/servicecontext.go`：

```go
type ServiceContext struct {
	Config    config.Config
	AccessLog rest.Middleware
	UserModel model.UserModel
}

func NewServiceContext(c config.Config) *ServiceContext {
	conn := sqlx.NewMysql(c.Mysql.DataSource)
	return &ServiceContext{
		Config:    c,
		AccessLog: middleware.NewAccessLogMiddleware().Handle,
		UserModel: model.NewUserModel(conn, c.Cache),
	}
}
```

`ServiceContext` 只在启动时创建一次，所有请求共用。之后在任何 logic 里都能用 `l.svcCtx.UserModel` 查数据库了。

### 4. 加一个自定义查询

生成的代码只有按主键、唯一索引查单条，列表、分页这种查询要自己写，写在 `usermodel.go` 里：

```go
type (
	UserModel interface {
		userModel
		// 自己加的方法，先在接口里声明
		FindPage(ctx context.Context, keyword string, page, pageSize int64) ([]*User, int64, error)
	}

	customUserModel struct {
		*defaultUserModel
	}
)

// FindPage 分页查询：列表查询不走缓存，用 NoCache 系列方法
func (m *customUserModel) FindPage(ctx context.Context, keyword string, page, pageSize int64) ([]*User, int64, error) {
	where, args := "1=1", []any{}
	if keyword != "" {
		where += " AND nickname LIKE ?"
		args = append(args, "%"+keyword+"%")
	}

	var total int64
	countSql := fmt.Sprintf("SELECT COUNT(*) FROM %s WHERE %s", m.table, where)
	if err := m.QueryRowNoCacheCtx(ctx, &total, countSql, args...); err != nil {
		return nil, 0, err
	}

	var list []*User
	query := fmt.Sprintf("SELECT %s FROM %s WHERE %s ORDER BY id DESC LIMIT ?, ?", userRows, m.table, where)
	err := m.QueryRowsNoCacheCtx(ctx, &list, query, append(args, (page-1)*pageSize, pageSize)...)
	return list, total, err
}
```

带缓存的 Model 常用这几个方法：

| 方法 | 用途 |
| --- | --- |
| `QueryRowCtx` | 查单条，**走缓存**（需要自己指定缓存 key） |
| `QueryRowNoCacheCtx` | 查单条，不走缓存 |
| `QueryRowsNoCacheCtx` | 查多条，不走缓存（列表查询都用这个） |
| `ExecCtx` | 增删改，执行后**自动删除**指定的缓存 key |
| `TransactCtx` | 开启事务 |

> SQL 参数一律用 `?` 占位，不要用 `fmt.Sprintf` 拼用户输入，防止 SQL 注入。上面 `Sprintf` 拼的只是表名和固定的 where 结构。

## 六、实战：注册、登录和 JWT

### 1. 注册

`internal/logic/user/registerlogic.go`：

```go
func (l *RegisterLogic) Register(req *types.RegisterReq) (resp *types.RegisterResp, err error) {
	// 1. 手机号是否已注册（这条查询会先查 Redis，再查 MySQL）
	_, err = l.svcCtx.UserModel.FindOneByMobile(l.ctx, req.Mobile)
	if err == nil {
		return nil, errorx.ErrMobileExists
	}
	if !errors.Is(err, model.ErrNotFound) {
		return nil, err
	}

	// 2. 密码不能明文存，用 bcrypt 做哈希
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// 3. 入库
	res, err := l.svcCtx.UserModel.Insert(l.ctx, &model.User{
		Mobile:   req.Mobile,
		Password: string(hash),
		Nickname: req.Nickname,
	})
	if err != nil {
		return nil, err
	}
	id, _ := res.LastInsertId()
	return &types.RegisterResp{Id: id}, nil
}
```

`errorx.ErrMobileExists` 是自定义的业务错误，下一节讲。查不到数据时 Model 返回的是 `model.ErrNotFound`，要和真正的数据库错误区分开。

### 2. 登录：签发 token

`internal/logic/user/loginlogic.go`：

```go
func (l *LoginLogic) Login(req *types.LoginReq) (resp *types.LoginResp, err error) {
	user, err := l.svcCtx.UserModel.FindOneByMobile(l.ctx, req.Mobile)
	if err != nil {
		return nil, errorx.ErrLoginFailed
	}
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)) != nil {
		return nil, errorx.ErrLoginFailed
	}

	auth := l.svcCtx.Config.Auth
	now := time.Now().Unix()
	claims := jwt.MapClaims{
		"iat":    now,
		"exp":    now + auth.AccessExpire,
		"userId": user.Id, // 自定义字段，后面在 logic 里能从 ctx 取出来
	}
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(auth.AccessSecret))
	if err != nil {
		return nil, err
	}
	return &types.LoginResp{Token: token, Expire: now + auth.AccessExpire}, nil
}
```

这里用的 `github.com/golang-jwt/jwt/v4` 是 go-zero 自己也在用的 JWT 库，密码哈希用的是 `golang.org/x/crypto/bcrypt`。

### 3. 获取当前用户：从 token 里取 userId

`/info` 在 .api 里配了 `jwt: Auth`，框架会自动校验 token，校验通过后，**token 里的字段会被放进 `ctx`**：

```go
func (l *InfoLogic) Info() (resp *types.UserInfoResp, err error) {
	// 数字类型的字段取出来是 json.Number
	userId, err := l.ctx.Value("userId").(json.Number).Int64()
	if err != nil {
		return nil, err
	}

	user, err := l.svcCtx.UserModel.FindOne(l.ctx, uint64(userId))
	if err != nil {
		return nil, err
	}
	return &types.UserInfoResp{Id: int64(user.Id), Mobile: user.Mobile, Nickname: user.Nickname}, nil
}
```

> 坑：`ctx.Value("userId")` 取出来的数字是 `json.Number`，不是 `int64`，直接 `.(int64)` 断言会 panic。

列表接口 `ListLogic` 就是调一下前面写的 `FindPage`，再把 `model.User` 转成 `types.UserInfoResp`，这里不贴了。

### 4. 跑起来测一下

```bash
go mod tidy
go run user.go
```

![用 curl 测试注册、登录和鉴权接口](/imgs/backend/go-zero/run-curl.png)

1. **注册成功**，返回新用户的 id
2. 同一个手机号再注册，返回**业务错误码** `10001`
3. 登录时没传 `password`，这个字段没加 `optional`，**框架自动拦截**
4. **登录成功**，拿到 token
5. 不带 token 访问 `/info`，直接 **401**
6. **带上 token** `Authorization: Bearer <token>`，正常返回当前用户信息

服务端控制台会打印每条 SQL 和每个请求的耗时，开发时排查问题很方便：

```text
info  sql query: select `id`,`mobile`,... from `user` where `mobile` = '13800000001' limit 1  duration=1.2ms
info  sql exec: insert into `user` (`mobile`,`password`,`nickname`) values ('13800000001', '$2a$10$...', '星梦')  duration=6.0ms
info  [HTTP]  200  -  POST  /api/v1/user/register - 127.0.0.1:58132 - curl/8.5.0  duration=83.6ms
```

再看一眼 Redis，登录查过一次之后，缓存已经自动写进去了：

```bash
$ redis-cli keys 'cache:*'
cache:user:mobile:13800000001
cache:user:id:1
```

所以紧接着请求 `/info` 时 `FindOne` 直接命中缓存，日志里不会再出现查库的 SQL。

## 七、统一返回格式和错误码

默认情况下，成功直接返回结构体的 JSON，失败返回 HTTP 400 加一行纯文本错误信息。前端一般希望统一成 `{"code":0,"msg":"ok","data":{...}}` 这种格式，在 main 函数里设置一下就行，**不用改任何 handler**。

先定义一个带错误码的错误类型 `internal/errorx/errorx.go`：

```go
package errorx

// CodeError 带业务错误码的错误
type CodeError struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
}

func (e *CodeError) Error() string { return e.Msg }

func New(code int, msg string) error { return &CodeError{Code: code, Msg: msg} }

var (
	ErrMobileExists = New(10001, "手机号已注册")
	ErrLoginFailed  = New(10002, "手机号或密码错误")
)
```

然后在 `user.go` 的 `server.Start()` 之前加上：

```go
// Body 统一的返回格式
type Body struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data any    `json:"data,omitempty"`
}

// 成功：包一层 {code:0, msg:"ok", data:...}
httpx.SetOkHandler(func(_ context.Context, v any) any {
	return Body{Code: 0, Msg: "ok", Data: v}
})
// 失败：业务错误返回自己的错误码，其他错误（参数校验等）统一 400
httpx.SetErrorHandlerCtx(func(_ context.Context, err error) (int, any) {
	var ce *errorx.CodeError
	if errors.As(err, &ce) {
		return http.StatusOK, Body{Code: ce.Code, Msg: ce.Msg}
	}
	return http.StatusBadRequest, Body{Code: 400, Msg: err.Error()}
})
```

上面 curl 截图里的返回格式就是这么来的。logic 里只管 `return nil, errorx.ErrXxx`，返回格式由这一个地方统一控制。

> 正式项目里，数据库报错这类内部错误最好不要把 `err.Error()` 原样返回给前端，打日志后返回一个「服务器繁忙」之类的通用提示。

## 八、中间件

.api 里写了 `middleware: AccessLog`，goctl 就生成了 `internal/middleware/accesslogmiddleware.go`，并在 svc 里自动注册好了。只需要把逻辑填进去：

```go
func (m *AccessLogMiddleware) Handle(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next(w, r) // 交给下一个中间件 / handler
		logx.WithContext(r.Context()).Infof("[AccessLog] %s %s 耗时 %s",
			r.Method, r.URL.Path, time.Since(start))
	}
}
```

`next(w, r)` 之前的代码在请求处理前执行，之后的在处理完成后执行。不调 `next` 就是把请求拦下来（比如做权限判断，直接返回 403）。

- 写在 `@server` 的 `middleware` 里：只对这一组接口生效，多个用逗号隔开。
- 想对**所有接口**生效：在 main 里 `server.Use(middleware)` 注册全局中间件。

## 九、拆微服务：RPC + etcd

业务越来越多，用户相关的逻辑订单服务也要用、商品服务也要用，就可以把它拆成一个独立的 **RPC 服务**，其他服务通过 gRPC 调它。

再看一下开头那张图：

![go-zero 典型架构：API 层 + RPC 层 + etcd](/imgs/backend/go-zero/architecture.png)

### 1. 写 proto，生成 RPC 服务

在 `usercenter/rpc` 目录下写 `user.proto`：

```protobuf
syntax = "proto3";

package user;
option go_package = "./user";

message GetUserReq {
  int64 id = 1;
}

message GetUserResp {
  int64  id       = 1;
  string mobile   = 2;
  string nickname = 3;
}

service User {
  rpc GetUser(GetUserReq) returns (GetUserResp);
}
```

生成代码：

```bash
goctl rpc protoc user.proto --go_out=. --go-grpc_out=. --zrpc_out=. --style gozero
```

![goctl rpc protoc 生成的 RPC 服务目录](/imgs/backend/go-zero/rpc-gen.png)

1. **`user.proto`**：服务定义文件
2. **`etc/user.yaml`**：配置文件，默认监听 8080，注册到 etcd 的 `user.rpc` 这个 key 下
3. **`logic/getuserlogic.go`**：业务逻辑，和 API 服务一样写在 logic 里
4. **`user/*.pb.go`**：protoc 生成的消息和 gRPC 代码，不要改
5. **`userclient/user.go`**：给**调用方**用的客户端，API 服务就是通过它来调 RPC 的

目录结构和 API 服务几乎一样，**config → svc → logic** 的套路完全相同，学会一个另一个也就会了。

### 2. 写 RPC 的业务逻辑

和 API 一样，在 `rpc/etc/user.yaml` 里加上 `Mysql`、`Cache` 配置，在 rpc 的 config、svc 里加上对应字段和 `UserModel`（复用上面生成的 model 包），然后写 logic：

```go
func (l *GetUserLogic) GetUser(in *user.GetUserReq) (*user.GetUserResp, error) {
	u, err := l.svcCtx.UserModel.FindOne(l.ctx, uint64(in.Id))
	if errors.Is(err, model.ErrNotFound) {
		return nil, status.Error(codes.NotFound, "用户不存在")
	}
	if err != nil {
		return nil, err
	}
	return &user.GetUserResp{Id: int64(u.Id), Mobile: u.Mobile, Nickname: u.Nickname}, nil
}
```

RPC 返回错误时，用 gRPC 的 `status.Error` 带上错误码，调用方能拿到 `codes.NotFound` 做判断。

### 3. API 服务调用 RPC

第一步，API 的配置文件里加上 RPC 客户端配置，告诉它去 etcd 的哪个 key 找服务：

```yaml
UserRpc:
  Etcd:
    Hosts:
      - 127.0.0.1:2379
    Key: user.rpc
```

第二步，config 里加字段：

```go
type Config struct {
	rest.RestConf
	// ...省略其他字段
	UserRpc zrpc.RpcClientConf
}
```

第三步，svc 里创建客户端：

```go
type ServiceContext struct {
	// ...省略其他字段
	UserRpc userclient.User
}

func NewServiceContext(c config.Config) *ServiceContext {
	return &ServiceContext{
		// ...省略其他字段
		UserRpc: userclient.NewUser(zrpc.MustNewClient(c.UserRpc)),
	}
}
```

第四步，logic 里调用，就像调用一个本地函数：

```go
func (l *InfoLogic) Info() (resp *types.UserInfoResp, err error) {
	userId, err := l.ctx.Value("userId").(json.Number).Int64()
	if err != nil {
		return nil, err
	}

	// 不直接查库了，改成调用 user.rpc 服务
	u, err := l.svcCtx.UserRpc.GetUser(l.ctx, &userclient.GetUserReq{Id: userId})
	if err != nil {
		return nil, err
	}
	return &types.UserInfoResp{Id: u.Id, Mobile: u.Mobile, Nickname: u.Nickname}, nil
}
```

### 4. 启动和验证

先启动 etcd，用 Docker 的话一条命令：

```bash
docker run -d --name etcd -p 2379:2379 quay.io/coreos/etcd:v3.5.17 \
  etcd --listen-client-urls http://0.0.0.0:2379 --advertise-client-urls http://127.0.0.1:2379
```

然后**先启动 RPC，再启动 API**：

```bash
# 终端 1：RPC 服务
go run rpc/user.go -f rpc/etc/user.yaml

# 终端 2：API 服务
go run user.go -f etc/user-api.yaml
```

再请求一次 `/info`，然后看看 etcd 和两边的日志：

![etcd 中的服务注册信息，以及 API 和 RPC 日志中相同的 trace](/imgs/backend/go-zero/rpc-trace.png)

1. user.rpc 启动后**自动把自己注册到 etcd**，key 是 `user.rpc/` 加一串 ID
2. value 就是它的地址，API 服务就是从这里拿到地址去连的。同一个服务启动多个实例，这里就会有多条记录，客户端自动负载均衡
3. API 日志里这次请求的 **trace**
4. RPC 日志里也是**同一个 trace**。go-zero 默认就会在服务之间传递链路 ID，排查问题时拿着 trace 一搜，整条调用链的日志都能找到

> 本地开发不想装 etcd，可以让 API 直连 RPC：把 `UserRpc` 配置里的 `Etcd` 换成 `Endpoints: ["127.0.0.1:8080"]` 就行，我实际测过可以正常调用。不过 RPC 那边的配置里如果还写着 `Etcd`，它启动时依然会去连 etcd，也要一并删掉。

## 十、框架自带的服务治理：改配置就能用

这部分是 go-zero 和普通 Web 框架拉开差距的地方，而且大部分**默认就是开启的**，你只需要知道有这些东西、在哪改：

| 能力 | 配置项 | 默认值 | 说明 |
| --- | --- | --- | --- |
| 超时控制 | `Timeout` | API 3000ms，RPC 2000ms | 超时自动返回，不会一直卡着 |
| 最大连接数 | `MaxConns` | 10000 | 超过的请求直接拒绝 |
| 请求体大小 | `MaxBytes` | 1MB | 上传文件的接口要调大 |
| 自适应降载 | `CpuThreshold` | 900（即 90%） | CPU 超过阈值时自动丢弃部分请求，防止被打挂 |
| 熔断 | 无需配置 | 开启 | RPC 调用、MySQL、Redis 出错多了自动熔断，避免雪崩 |
| 负载均衡 | 无需配置 | p2c_ewma | RPC 客户端自动选负载低、延迟小的实例 |
| 日志 | `Log` | 输出到控制台 | `Mode: file` 写文件，`Encoding: plain/json`，`Level` 控制级别 |
| 运行模式 | `Mode` | pro | `dev` / `test` 模式下 RPC 会开启反射，方便用 grpcurl 调试 |

一个更完整的 API 配置示例：

```yaml
Name: user-api
Host: 0.0.0.0
Port: 8888
Mode: pro
Timeout: 3000
MaxBytes: 10485760        # 10MB

Log:
  Mode: file
  Path: logs
  Level: info
  KeepDays: 7

# 开发调试用的内部服务：健康检查、Prometheus 指标、pprof
DevServer:
  Enabled: true
  Port: 6060
```

## 十一、部署：生成 Dockerfile

goctl 可以直接生成一个多阶段构建的 Dockerfile：

```bash
goctl docker --go user.go --exe user-api
```

生成的 Dockerfile 先用 `golang:alpine` 编译，再把二进制和 `etc` 目录拷到 `scratch` 空镜像里，最终镜像里基本只有一个二进制文件，还自动带上了时区和 CA 证书：

```dockerfile
FROM golang:alpine AS builder
# ...
RUN go build -ldflags="-s -w" -o /app/user-api user.go

FROM scratch
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=builder /usr/share/zoneinfo/Asia/Shanghai /usr/share/zoneinfo/Asia/Shanghai
ENV TZ Asia/Shanghai

WORKDIR /app
COPY --from=builder /app/user-api /app/user-api
COPY ./etc /app/etc

CMD ["./user-api", "-f", "etc/user-api.yaml"]
```

```bash
docker build -t user-api:v1 .
docker run -d -p 8888:8888 user-api:v1
```

> 容器里的服务连 MySQL、Redis、etcd 时，配置里不能再写 `127.0.0.1`（那是容器自己），要换成宿主机 IP 或者 docker compose 里的服务名。

用 K8s 部署的话，还有 `goctl kube deploy` 可以生成 Deployment 和 Service 的 yaml，用到时再查即可。

## 十二、常见问题

**1. 改了 .api 重新生成，我写的代码会被覆盖吗？**

不会。只有开头写着 `// Code generated by goctl. DO NOT EDIT.` 的文件（`routes.go`、`types.go`）会被重新生成，logic、handler、svc、config、middleware 这些文件已存在就跳过。所以**不要在 `routes.go` 和 `types.go` 里写任何代码**。

**2. 请求返回 `field "xxx" is not set`？**

go-zero 的字段**默认必填**，这个字段请求里没传。如果它确实可以不传，在 tag 里加上 `optional`；GET 请求的参数要用 `form` tag 而不是 `json`。

**3. 配置文件里加了字段，程序里读不到？**

检查 `config.go` 里有没有加对应的字段，名字要和 yaml 里的 key 一致，另外注意 yaml 缩进。反过来，config 里的字段默认也是必填的，yaml 里缺了会启动失败，并提示类似 `"Mysql" is not set` 的错误。

**4. 启动报 `address already in use`？**

端口被占用了，可能是上一次的进程还没退出。换个端口，或者用 `lsof -i :8888` 找到进程关掉。

**5. API 调 RPC 报 `context deadline exceeded` 或连不上？**

依次检查：RPC 服务是否已启动、两边配置里的 etcd 地址和 `Key` 是否一致、用 `etcdctl get --prefix user.rpc` 看服务有没有注册上去。如果是 RPC 逻辑本身耗时长，调大 RPC 服务端和客户端的 `Timeout`。

**6. 修改了数据库数据，接口返回的还是旧的？**

用了带缓存的 Model（`-c` 生成）时，**必须通过 Model 的方法去改数据**，它会自动删缓存。如果直接在数据库里手动改，或者用自己写的不带缓存的 SQL 去更新，缓存不会失效，要手动删除对应的 `cache:user:id:xxx` 这类 key。

**7. MySQL 的 `timestamp` / `datetime` 字段报错 `unsupported Scan`？**

DataSource 里没加 `parseTime=true`。

## 总结

回顾一下这篇覆盖的最常用功能：

1. **goctl**：`api new` / `api go` 生成 API 服务，`model mysql ddl -c` 生成带缓存的 Model，`rpc protoc` 生成 RPC 服务，`docker` 生成 Dockerfile
2. **项目结构**：改接口改 `.api`，写业务写 `logic`，加依赖加 `svc`，加配置同时改 yaml 和 `config.go`
3. **.api 文件**：`type` 定义结构体，tag 决定参数来源和校验，`@server` 配前缀、分组、JWT、中间件
4. **数据库**：Model 自带按主键和唯一索引的查询和缓存，列表查询自己写在 `xxxmodel.go`
5. **JWT**：登录时签发 token，`jwt: Auth` 自动校验，`ctx.Value` 取出自定义字段
6. **统一返回**：`httpx.SetOkHandler` + `httpx.SetErrorHandlerCtx` 一处搞定
7. **RPC**：proto 定义服务，etcd 注册发现，API 通过生成的 client 调用，链路 trace 自动传递
8. **服务治理**：超时、限流、熔断、降载默认就有，按需改配置

把这些掌握了，用 go-zero 写一个完整的后端服务基本就没问题了。等遇到消息队列、分布式事务、K8s 部署这些需求时，再去看官方文档对应的章节就好。
