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

此文为 go-kit 的 stringsvc3 例子  
此文例子介绍了 如何调用其他的 RPC 服务
文中有表述不当的地方，可以通过 issue 请指出，谢谢阅读

[stringsvc3](https://gokit.io/examples/stringsvc.html#middlewares)

此处以上文中的 go-kit 2 例子为基础，进行修改  
官方文档中介绍了，微服务中不进行服务调用是很罕见了，同时 go-kit 的服务调用也是很亮眼的。
go-kit 完成服务调用主要是通过增加一层中间件完成的，所以阅读此文建议先阅读 go-kit 2 。

> 1、创建代理服务

```golang
type proxymw struct {
	next      StringService
	uppercase endpoint.Endpoint
}
```

+ proxymw 结构体中有 StringService 接口属性，需要实现该接口的两个方法 Uppercase 和 Count 方法
+ Count 我们仍通过 `next.Count` 调用自生提供的服务

```golang
func (mw proxymw) Count(s string) n int {
    return mw.next.Count(s)
}
```

```golang
func (mw proxymw) Uppercase(s string) (string, error) {
	// 调用远程服务
	response, err := mw.uppercase(context.Background(), uppercaseRequest{S: s})
	if err != nil {
		return "", nil
	}

	// 获取响应消息
	resp := response.(uppercaseResponse)
	if resp.Err != "" {
		return resp.V, errors.New(resp.Err)
	}
	return resp.V, nil
}
```

> 2、中间件 proxymw 的创建及服务注入

```golang
func proxyingMiddleware(svc StringService, instances string) StringService {

    // 创建服务调用对象
	uppercase := makeUppercaseProxy(instances)

	return &proxymw{
		uppercase: uppercase,
		next:      svc,
	}
}

func makeUppercaseProxy(instance string) endpoint.Endpoint {
    // 服务调用地址
	if !strings.HasPrefix(instance, "http") {
		instance = "http://" + instance
	}

    // 解析服务调用地址
	u, err := url.Parse(instance)
	if err != nil {
		panic(err)
	}
    // 服务调用方法
	if u.Path == "" {
		u.Path = "/uppercase"
	}
    // 返回远程服务调用对象
	return httptransport.NewClient(
		"GET",
		u,
		encodeRequest,
		decodeUppercaseResponse,
	).Endpoint()
}

```

> 3、注入中间件 proxyingMiddleware

```golang
func main() {
	logger := log.NewLogfmtLogger(os.Stderr)

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

	var svc StringService
	svc = &stringService{}
	// 注册远程服务调用对象 暂时固定调用 127.0.0.1:8080 提供的服务
	svc = proxyingMiddleware(svc, "127.0.0.1:8080")
	svc = loggingMiddleware{logger, svc}
	svc = instrumentingMiddleware{requestCount, requestLatency, countResult, svc}

	uppercaseHandler := makeUppercaseHandler(svc)
	countHandler := makeCountHandler(svc)

	http.Handle("/uppercase", uppercaseHandler)
	http.Handle("/count", countHandler)
	http.Handle("/metrics", promhttp.Handler())

    // 注意更改端口
	logger.Log("msg", "HTTP", "addr", ":8081")
	logger.Log("err", http.ListenAndServe(":8081", nil))
}
```

- 在本地开启一个 go-kit 2 版本的服务，设置端口为 8080
- 再启动上面修改后的版本，设置端口为 8081
- 使用 Postman 测试发送请求到 http://127.0.0.1:8081/uppercase
- JSON数据：{ "s" : "hello" }

8080端口服务器日志：
method=uppercase input=hello output=HELLO err=null took=0s

8081端口服务器日志：
method=uppercase input=hello output=HELLO err=null took=3.5181ms

可以看到 8081的请求响应了，8080也有请求

> 4、添加负载均衡

使用 go-kit 自带的负载均衡

```golang
// ServiceMiddleware is a chainable behavior modifier for StringService.
type ServiceMiddleware func(StringService) StringService

func proxyingMiddleware(svc StringService, instances string) ServiceMiddleware {
	// 如果为空则返回默认
	if instances == "" {
        // 此处修改为返回一个方法
		return func(next StringService) StringService { return next }
	}

	// 客户端的一些参数
	var (
		maxAttempts = 3                      // 重启请求次数
		maxTime     = 250 * time.Millisecond // 等待时间
	)

    // 解析多个地址
    instanceList := split(instances)
    // 负载均衡 生成一个固定的 endpoint 集合
    var endpointer sd.FixedEndpointer

    for _, instance := range instanceList {
		var e endpoint.Endpoint
		e = makeUppercaseProxy(instance)
		endpointer = append(endpointer, e)
	}

    // 现在，从所有这些单独的端点中构建一个可重试的负载平衡端点
	balancer := lb.NewRoundRobin(endpointer)
	retry := lb.Retry(maxAttempts, maxTime, balancer)

    // 此处修改为返回一个方法
	return func(next StringService) StringService {
		return proxymw{next, retry}
	}
}

func split(s string) []string {
	a := strings.Split(s, ",")
	for i := range a {
		a[i] = strings.TrimSpace(a[i])
	}
	return a
}
```

修改 main 方法

```golang

func main() {
	logger := log.NewLogfmtLogger(os.Stderr)

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

	var svc StringService
	svc = &stringService{}

    // 注册如下服务器
	instances := "127.0.0.1:8080,127.0.0.1:8081,127.0.0.1:8082"
	// 注册远程服务调用对象
	svc = proxyingMiddleware(svc, instances)(svc)
	svc = loggingMiddleware{logger, svc}
	svc = instrumentingMiddleware{requestCount, requestLatency, countResult, svc}

	uppercaseHandler := makeUppercaseHandler(svc)
	countHandler := makeCountHandler(svc)

	http.Handle("/uppercase", uppercaseHandler)
	http.Handle("/count", countHandler)
	http.Handle("/metrics", promhttp.Handler())

    // 监听 8090 端口
	logger.Log("msg", "HTTP", "addr", ":8090")
	logger.Log("err", http.ListenAndServe(":8090", nil))
}

```

- 开启多个 go-kit 2 版本的服务器 端口分别为 8080 8081 8082 。（[修改参考](#tag-1)）
- 启动上述添加负载均衡后的远程服务调用并修改监听端口为 8090。
- 多次请求 uppercase 服务

负载均衡服务的命令行输出：
```cmd
msg=HTTP addr=:8090
method=uppercase input=hello output=HELLO err=null took=1.6164ms
method=uppercase input=hello output=HELLO err=null took=983.8µs
method=uppercase input=hello output=HELLO err=null took=1.4144ms
method=uppercase input=hello output=HELLO err=null took=518.5µs
method=uppercase input=hello output=HELLO err=null took=564.7µs
method=uppercase input=hello output=HELLO err=null took=959.5µs
method=uppercase input=hello output=HELLO err=null took=618.9µs
method=uppercase input=hello output=HELLO err=null took=930.7µs
method=uppercase input=hello output=HELLO err=null took=675.5µs
method=uppercase input=hello output=HELLO err=null took=924.3µs
method=uppercase input=hello output=HELLO err=null took=106.4µs
```

8080端口服务的命令行输出：
```cmd
msg=HTTP addr=:8080
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
```

8081端口服务的命令行输出：
```cmd
msg=HTTP addr=:8081
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
```

8082端口服务的命令行输出：
```cmd
msg=HTTP addr=:8082
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
```

go-kit已经帮助实现了负载均衡

> 5、添加熔断和限流
```golang
    // 客户端的一些参数
	var (
		qps         = 1                      // 限流值
		maxAttempts = 3                      // 重启请求次数
		maxTime     = 250 * time.Millisecond // 等待时间
	)

	// 解析多个地址
	instanceList := split(instances)
	// 负载均衡 生成一个固定的 endpoint 集合
	var endpointer sd.FixedEndpointer

	for _, instance := range instanceList {
		var e endpoint.Endpoint
		e = makeUppercaseProxy(instance)
		// 添加熔断
		e = circuitbreaker.Gobreaker(gobreaker.NewCircuitBreaker(gobreaker.Settings{}))(e)
		// 添加限流
		e = ratelimit.NewErroringLimiter(rate.NewLimiter(rate.Every(time.Second), qps))(e)
		endpointer = append(endpointer, e)
	}
```

#### 修改 go-kit 2 版本通过 flag 启动设置端口 {#tag-1}
```golang
func main() {
	var (
		listen = flag.String("listen", ":8080", "HTTP listen address")
	)
	flag.Parse()

    // 注意！省略代码
	...

	http.Handle("/uppercase", uppercaseHandler)
	http.Handle("/count", countHandler)
	http.Handle("/metrics", promhttp.Handler())
	logger.Log("msg", "HTTP", "addr", *listen)
	logger.Log("err", http.ListenAndServe(*listen, nil))
}
```

编译后使用输入 `main.exe -listen=:8081` 启动，`-listen=:8081` 指定服务监听端口

- [ ] Threading a context