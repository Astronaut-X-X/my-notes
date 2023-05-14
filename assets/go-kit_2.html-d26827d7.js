import{_ as r,M as l,p as d,q as t,R as e,t as n,N as s,a1 as a}from"./framework-efe98465.js";const v={},u=e("h1",{id:"micro-server",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#micro-server","aria-hidden":"true"},"#"),n(" Micro Server")],-1),c=e("p",null,[n("此文为 go-kit 的 stringsvc2 例子"),e("br"),n(" 主要介绍了如何增加中间件 Middleware"),e("br"),n(" 文中所述的代码放置位置与官方实例有所不同，请注意"),e("br"),n(" 文中有表述不当的地方，可以通过 issue 请指出，谢谢阅读")],-1),o={href:"https://gokit.io/examples/stringsvc.html#middlewares",target:"_blank",rel:"noopener noreferrer"},m=a(`<p>流程步骤：</p><blockquote><p>1、定义服务</p></blockquote><div class="language-Golang line-numbers-mode" data-ext="Golang"><pre class="language-Golang"><code>// 定义提供的服务
type StringService interface {
	Uppercase(string) (string, error)
	Count(string) int
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>2、实现服务</p></blockquote><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>// 服务实现
type stringService struct{}

// 定义空字符串响应错误
var ErrEmpty error = errors.New(&quot;empty string&quot;)

// 实现服务中的 Uppercase 方法 
func (s *stringService) Uppercase(str string) (string, error){
    if str == &quot;&quot; {
        return &quot;&quot;, ErrEmpty
    }
    return strings.ToUpper(str), nil
}

// 实现服务中的 Count 方法
func (s *stringService) Count(str string) int {
    return len(str)
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码与 go-kit_1 中文件相同，但为了更好组织代码。我们用一个叫 service.go 的文件存储上述代码。</p><blockquote><p>3、服务调用消息定义</p></blockquote><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>
// 服务 Uppercase 的请求消息
type uppercaseRequest struct {
    S string \`json:&quot;s&quot;\`
}

// 服务 Uppercase 的响应消息
type uppercaseResponse struct {
    V string \`json:&quot;v&quot;\`
    Err string  \`json:&quot;err,omitempty&quot;\` // omitempty：表示该字段在序列化为 JSON 字符串时如果是零值或空值，则不会出现在 JSON 对象中。
}

// 服务 Count 的请求消息
type countRequest struct {
    S string \`json:&quot;s&quot;\`
}

// 服务 Count 的响应消息
type countResponse struct {
	V int \`json:&quot;v&quot;\`
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码同样存放 service.go 存放。此处定义了消息的结构</p><blockquote><p>4、定义 Endpoint</p></blockquote><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>
// 创建 Uppercase 的 Endpoint
func makeUppercaseEndpoint(svc StringService) endpoint.Endpoint {
	return func(_ context.Context, request interface{}) (interface{}, error) {
		req := request.(uppercaseRequest)
		v, err := svc.Uppercase(req.S)
		if err != nil {
			return uppercaseResponse{v, err.Error()}, nil
		}
		return uppercaseResponse{v, &quot;&quot;}, nil
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

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>Endpoints are a primary abstraction in go-kit. An endpoint represents a single RPC (method in our service interface)</li><li>Endpoint 是主要的抽象，代表一个 RPC（服务的方法）</li></ul><ul><li><p>上述的 StringService 是步骤 1 中抽象出来的一个服务包含两个方法</p></li><li><p>endpoint.Endpoint 的签名为 func(ctx context.Context, request interface{}) (response interface{}, err error)</p></li><li><p>Endpoint 主要负责对 RPC 服务请求的处理</p></li><li><p>创建一个叫 endpoint.go 的文件存放上述代码</p></li></ul><blockquote><p>5、创建 解码请求消息 编码响应消息</p></blockquote><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>
// 先定义编解码的请求方法，此处用的 HTTP 作为 RPC 的通讯协议
// Uppercase 的请求解码
func decodeUppercaseRequest(_ context.Context, r *http.Request) (interface{}, error) {
	var request uppercaseRequest
	if err := json.NewDecoder(r.Body).Decode(&amp;request); err != nil {
		return nil, err
	}
	return request, nil
}

// Countrcase 的请求解码
func decodeCountRequest(_ context.Context, r *http.Request) (interface{}, error) {
	var request countRequest
	if err := json.NewDecoder(r.Body).Decode(&amp;request); err != nil {
		return nil, err
	}
	return request, nil
}

// 响应编码
func encodeResponse(_ context.Context, w http.ResponseWriter, response interface{}) error {
	return json.NewEncoder(w).Encode(response)
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>上述 RPC 服务通过 HTTP 协议完成通讯，其中的请求消息以 JSON 格式通过 HTTP 发送</li><li>接收到消息后需要将 JSON 消息解析到不同的请求消息结构体中</li><li>响应时，需要将 response 编码成 JSON 格式，不同的响应消息可以统一处理</li><li>创建一个叫 transport.go 的文件存放上述代码</li></ul><blockquote><p>6、创建以 HTTP 为通讯协议的 RPC 服务</p></blockquote><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>
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

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>创建生成 以 HTTP 协议为通讯基础的 RPC 服务</li><li>在 transport.go 的文件添加上述代码</li></ul><blockquote><p>7、创建执行 main 方法</p></blockquote><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>package main

import (
	&quot;net/http&quot;
	&quot;os&quot;

	&quot;github.com/go-kit/kit/log&quot;
)

func main() {
	// 使用 go-kit 的日志
	logger := log.NewLogfmtLogger(os.Stderr)

	// 创建 service
	svc := &amp;stringService{}

	// 创建 service 的 handler
	uppercaseHandler := makeUppercaseHandler(svc)
	countHandler := makeCountHandler(svc)

	// 开启以 HTTP 为通讯协议的 RPC 服务
	http.Handle(&quot;/uppercase&quot;, uppercaseHandler)
	http.Handle(&quot;/count&quot;, countHandler)

	// 输出服务端口地址信息
	logger.Log(&quot;msg&quot;, &quot;HTTP&quot;, &quot;addr&quot;, &quot;:8080&quot;)
	logger.Log(&quot;err&quot;, http.ListenAndServe(&quot;:8080&quot;, nil))
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>创建一个名为 main.go 的文件存放上述代码</li><li>此时的目录结构如下</li></ul><blockquote><p>目录结构： ├ service.go ├ endpoint.go ├ transport.go └ main.go</p></blockquote>`,23),p=e("li",null,"上述代码只是创建了一个 RPC 服务，下面我们增加日志中间件",-1),b={href:"https://gokit.io/examples/stringsvc.html#middlewares",target:"_blank",rel:"noopener noreferrer"},g=e("ul",null,[e("li",null,"Endpoint 层的中间件函数签名为：type Middleware func(Endpoint) Endpoint"),e("li")],-1),q=e("blockquote",null,[e("p",null,"8、日志中间件")],-1);function h(f,k){const i=l("ExternalLinkIcon");return d(),t("div",null,[u,c,e("p",null,[e("a",o,[n("stringsvc1"),s(i)])]),m,e("ul",null,[p,e("li",null,[n("中间件可以添加在 Endpoint 层，也可添加在 Service 层，参考官方文档："),e("a",b,[n("Middleware"),s(i)])])]),g,q])}const S=r(v,[["render",h],["__file","go-kit_2.html.vue"]]);export{S as default};
