---
lang: zh-CN
title: Micro Server
description: Micro Server
prev: ../index.md
next: ../index.md
search: true
tags:
    - Go
    - Golang
    - golang
    - micro
    - server
---

# Micro Server

此文为 go-kit 的 stringsvc2 例子  
主要介绍了如何增加中间件 Middleware  
文中所述的代码放置位置与官方实例有所不同，请注意  
文中有表述不当的地方，可以通过 issue 请指出，谢谢阅读

[stringsvc2](https://gokit.io/examples/stringsvc.html#middlewares)

流程步骤：

> 1、定义服务
```Golang
// 定义提供的服务
type StringService interface {
	Uppercase(string) (string, error)
	Count(string) int
}
```

> 2、实现服务
```golang
// 服务实现
type stringService struct{}

// 定义空字符串响应错误
var ErrEmpty error = errors.New("empty string")

// 实现服务中的 Uppercase 方法 
func (s *stringService) Uppercase(str string) (string, error){
    if str == "" {
        return "", ErrEmpty
    }
    return strings.ToUpper(str), nil
}

// 实现服务中的 Count 方法
func (s *stringService) Count(str string) int {
    return len(str)
}
```

上述代码与 go-kit_1 中文件相同，但为了更好组织代码。我们用一个叫 service.go 的文件存储上述代码。

> 3、服务调用消息定义
```golang

// 服务 Uppercase 的请求消息
type uppercaseRequest struct {
    S string `json:"s"`
}

// 服务 Uppercase 的响应消息
type uppercaseResponse struct {
    V string `json:"v"`
    Err string  `json:"err,omitempty"` // omitempty：表示该字段在序列化为 JSON 字符串时如果是零值或空值，则不会出现在 JSON 对象中。
}

// 服务 Count 的请求消息
type countRequest struct {
    S string `json:"s"`
}

// 服务 Count 的响应消息
type countResponse struct {
	V int `json:"v"`
}

```

上述代码同样存放 service.go 存放。此处定义了消息的结构

> 4、定义 Endpoint
```golang

// 创建 Uppercase 的 Endpoint
func makeUppercaseEndpoint(svc StringService) endpoint.Endpoint {
	return func(_ context.Context, request interface{}) (interface{}, error) {
		req := request.(uppercaseRequest)
		v, err := svc.Uppercase(req.S)
		if err != nil {
			return uppercaseResponse{v, err.Error()}, nil
		}
		return uppercaseResponse{v, ""}, nil
	}
}

// 创建 Countcase 的 Endpoint
func makeCountEndpoint(svc StringService) endpoint.Endpoint {
	return func(_ context.Context, request interface{}) (interface{}, error) {
		req := request.(countRequest)
		v := svc.Count(req.S)
		return countResponse{v}, nil
	}
}

```

- Endpoints are a primary abstraction in go-kit. An endpoint represents a single RPC (method in our service interface)
- Endpoint 是主要的抽象，代表一个 RPC（服务的方法）

+ 上述的 StringService 是步骤 1 中抽象出来的一个服务包含两个方法
+ endpoint.Endpoint 的签名为 func(ctx context.Context, request interface{}) (response interface{}, err error)

+ Endpoint 主要负责对 RPC 服务请求的处理
+ 创建一个叫 endpoint.go 的文件存放上述代码

> 5、创建 解码请求消息 编码响应消息 
```golang

// 先定义编解码的请求方法，此处用的 HTTP 作为 RPC 的通讯协议
// Uppercase 的请求解码
func decodeUppercaseRequest(_ context.Context, r *http.Request) (interface{}, error) {
	var request uppercaseRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		return nil, err
	}
	return request, nil
}

// Countrcase 的请求解码
func decodeCountRequest(_ context.Context, r *http.Request) (interface{}, error) {
	var request countRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		return nil, err
	}
	return request, nil
}

// 响应编码
func encodeResponse(_ context.Context, w http.ResponseWriter, response interface{}) error {
	return json.NewEncoder(w).Encode(response)
}
```

- 上述 RPC 服务通过 HTTP 协议完成通讯，其中的请求消息以 JSON 格式通过 HTTP 发送
- 接收到消息后需要将 JSON 消息解析到不同的请求消息结构体中
- 响应时，需要将 response 编码成 JSON 格式，不同的响应消息可以统一处理
- 创建一个叫 transport.go 的文件存放上述代码

> 6、创建以 HTTP 为通讯协议的 RPC 服务

```golang

// 创建 Uppercase 的 HTTP 处理服务
func makeUppercaseHandler(svc StringService) *httptransport.Server {
	return httptransport.NewServer(
		makeUppercaseEndpoint(svc),
		decodeUppercaseRequest,
		encodeResponse,
	)
}

// 创建 Uppercase 的 HTTP 处理服务
func makeCountcaseHandler(svc StringService) *httptransport.Server {
	return httptransport.NewServer(
		makeCountEndpoint(svc),
		decodeCountRequest,
		encodeResponse,
	)
}

```

- 创建生成 以 HTTP 协议为通讯基础的 RPC 服务
- 在 transport.go 的文件添加上述代码

> 7、创建执行 main 方法

```golang
package main

import (
	"net/http"
	"os"

	"github.com/go-kit/kit/log"
)

func main() {
	// 使用 go-kit 的日志
	logger := log.NewLogfmtLogger(os.Stderr)

	// 创建 service
	svc := &stringService{}

	// 创建 service 的 handler
	uppercaseHandler := makeUppercaseHandler(svc)
	countHandler := makeCountHandler(svc)

	// 开启以 HTTP 为通讯协议的 RPC 服务
	http.Handle("/uppercase", uppercaseHandler)
	http.Handle("/count", countHandler)

	// 输出服务端口地址信息
	logger.Log("msg", "HTTP", "addr", ":8080")
	logger.Log("err", http.ListenAndServe(":8080", nil))
}

```

+ 创建一个名为 main.go 的文件存放上述代码
+ 此时的目录结构如下

>  目录结构：
>  ├ service.go
>  ├ endpoint.go
>  ├ transport.go
>  └ main.go

+ 上述代码只是创建了一个 RPC 服务，下面我们增加日志中间件
+ 中间件可以添加在 Endpoint 层，也可添加在 Service 层，参考官方文档：[Middleware](https://gokit.io/examples/stringsvc.html#middlewares)

- Endpoint 层的中间件函数签名为：type Middleware func(Endpoint) Endpoint
- 

> 8、日志中间件

```golang

type loggingMiddleware struct {
	logger log.Logger
	next   StringService
}

```

+ 此处的中间件是位于 Service 层的中间件，创建一个结构体 logginMiddleware 内部有一个 go-kit 的日志接口属性 logger，
+ 还有一个 StringService 的接口属性 next，用于接收传入 stringService 实例

```golang 
func (mw loggingMiddleware) Uppercase(s string) (output string, err error) {
	defer func(begin time.Time) {
		_ = mw.logger.Log(
			"method", "uppercase",
			"input", s,
			"output", output,
			"err", err,
			"took", time.Since(begin),
		)
	}(time.Now())

	output, err = mw.next.Uppercase(s)
	return
}

func (mw loggingMiddleware) Count(s string) (n int) {
	defer func(begin time.Time) {
		_ = mw.logger.Log(
			"method", "count",
			"input", s,
			"n", n,
			"took", time.Since(begin),
		)
	}(time.Now())

	n = mw.next.Count(s)
	return
}

```

+ loggingMiddleware 中间件实现 StringService 的 Uppercase 和 Count 两个接口，为后面创建服务的时候使用
+ 接口实习内部通过调用 next 属性来调用注入的 service，从而达到中间件的作用
+ 创建一个名为 logging.go 的文件存放上述代码

> 9、添加中间件

```golang

func main() {
	// 使用 go-kit 的日志
	logger := log.NewLogfmtLogger(os.Stderr)

	// 创建 service
	var svc StringService
	svc = &stringService{}
	svc = loggingMiddleware{logger, svc}

	// 创建 service 的 handler
	uppercaseHandler := makeUppercaseHandler(svc)
	countHandler := makeCountHandler(svc)

	// 开启以 HTTP 为通讯协议的 RPC 服务
	http.Handle("/uppercase", uppercaseHandler)
	http.Handle("/count", countHandler)

	// 输出服务端口地址信息
	logger.Log("msg", "HTTP", "addr", ":8080")
	logger.Log("err", http.ListenAndServe(":8080", nil))
}

```

+ 在 main 方法中，`svc := &stringService{}` 后添加日志中间件
+ 由于 loggingMiddleware 同样实现了 StringService 的方法，直接传入下面的方法中创建服务

> 10、同样方法增加 Prometheus 中间件

```golang
package main

import (
	"fmt"
	"time"

	"github.com/go-kit/kit/metrics"
)

type instrumentingMiddleware struct {
	requestCount   metrics.Counter
	requestLatency metrics.Histogram
	countResult    metrics.Histogram
	next           StringService
}

func (mw instrumentingMiddleware) Uppercase(s string) (output string, err error) {
	defer func(begin time.Time) {
		lvs := []string{"method", "uppercase", "error", fmt.Sprint(err != nil)}
		mw.requestCount.With(lvs...).Add(1)
		mw.requestLatency.With(lvs...).Observe(time.Since(begin).Seconds())
	}(time.Now())

	output, err = mw.next.Uppercase(s)
	return
}

func (mw instrumentingMiddleware) Count(s string) (n int) {
	defer func(begin time.Time) {
		lvs := []string{"method", "count", "error", "false"}
		mw.requestCount.With(lvs...).Add(1)
		mw.requestLatency.With(lvs...).Observe(time.Since(begin).Seconds())
		mw.countResult.Observe(float64(n))
	}(time.Now())

	n = mw.next.Count(s)
	return
}

```

+ 创建一个名为 instrument.go 的文件存放上述代码

>  目录结构：
>  ├ service.go
>  ├ endpoint.go
>  ├ transport.go
>  ├ logging.go
>  ├ instrumenting.go
>  └ main.go

+ main 方法中修改如下：

```golang
func main() {
	// 使用 go-kit 的日志
	logger := log.NewLogfmtLogger(os.Stderr)

	// 监控中间件相关配置
	fieldKeys := []string{"method", "error"}
	requestCount := kitprometheus.NewCounterFrom(stdprometheus.CounterOpts{
		Namespace: "my_group",
		Subsystem: "string_service",
		Name:      "request_count",
		Help:      "Number of requests received.",
	}, fieldKeys)
	requestLatency := kitprometheus.NewSummaryFrom(stdprometheus.SummaryOpts{
		Namespace: "my_group",
		Subsystem: "string_service",
		Name:      "request_latency_microseconds",
		Help:      "Total duration of requests in microseconds.",
	}, fieldKeys)
	countResult := kitprometheus.NewSummaryFrom(stdprometheus.SummaryOpts{
		Namespace: "my_group",
		Subsystem: "string_service",
		Name:      "count_result",
		Help:      "The result of each count method.",
	}, []string{}) // no fields here

	// 创建 service
	var svc StringService
	svc = &stringService{}

	// 日志中间件
	svc = loggingMiddleware{logger, svc}
	// 监控中间件
	svc = instrumentingMiddleware{requestCount, requestLatency, countResult, svc}

	// 创建 service 的 handler
	uppercaseHandler := makeUppercaseHandler(svc)
	countHandler := makeCountHandler(svc)

	// 开启以 HTTP 为通讯协议的 RPC 服务
	http.Handle("/uppercase", uppercaseHandler)
	http.Handle("/count", countHandler)

	// 监控数据信息
	http.Handle("/metrics", promhttp.Handler())

	// 输出服务端口地址信息
	logger.Log("msg", "HTTP", "addr", ":8080")
	logger.Log("err", http.ListenAndServe(":8080", nil))
}

```

- 启动服务器后，查看控制台输出日志，通过进入 /metrics 页面查看请求监控信息
- 可以使用 Postman 发送 HTTP 的 POST 请求到 localhost:8080/uppercase 测试 RPC 服务
- 或 使用 Curl 发送请求

```bash
$ curl -XPOST -d'{"s":"hello, world"}' localhost:8080/uppercase
{"v":"HELLO, WORLD"}
$ curl -XPOST -d'{"s":"hello, world"}' localhost:8080/count
{"v":12}
```