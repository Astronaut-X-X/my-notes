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

此文为 go-kit 的 stringsvc1 例子  
此文主要写了如何使用 go-kit 创建一个简单的基于 http 协议的 RPC 服务  
文中有表述不当的地方，可以通过 issue 请指出，谢谢阅读

[stringsvc1](https://gokit.io/examples/stringsvc.html#stringsvc1)

流程步骤：

> 1、定义服务
```golang
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

上述服务及消息的定义可以使用 protobuf 定义。简化定义过程

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

```golang

func main() {
    // 创建服务
	svc := stringService{}

    // 创建 Uppercase 的 Transport 
	uppercaseHandler := httptransport.NewServer(
		makeUppercaseEndpoint(svc),
		decodeUppercaseRequest,
		encodeResponse,
	)

    // 创建 Countcase 的 Transpornt
	countHandler := httptransport.NewServer(
		makeCountEndpoint(svc),
		decodeCountRequest,
		encodeResponse,
	)

    // 注册到 HTTP 服务中
	http.Handle("/uppercase", uppercaseHandler)
	http.Handle("/count", countHandler)

    // 开启 HTTP 服务
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

- 可以使用 Postman 发送 HTTP 的 POST 请求到 localhost:8080/uppercase 测试 RPC 服务
- 官方使用 Curl 发送请求

```bash
$ curl -XPOST -d'{"s":"hello, world"}' localhost:8080/uppercase
{"v":"HELLO, WORLD"}
$ curl -XPOST -d'{"s":"hello, world"}' localhost:8080/count
{"v":12}
```

