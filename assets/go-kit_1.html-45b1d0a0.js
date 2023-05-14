import{_ as s,M as r,p as l,q as t,R as e,t as n,N as a,a1 as d}from"./framework-efe98465.js";const c={},u=e("h1",{id:"micro-server",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#micro-server","aria-hidden":"true"},"#"),n(" Micro Server")],-1),v=e("p",null,"此文为 go-kit 的 stringsvc1 例子",-1),o={href:"https://gokit.io/examples/stringsvc.html#stringsvc1",target:"_blank",rel:"noopener noreferrer"},p=d(`<p>流程步骤：</p><blockquote><p>1、定义服务</p></blockquote><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>// 定义提供的服务
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>3、服务调用消息定义</p></blockquote><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>
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

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述服务及消息的定义可以使用 protobuf 定义。简化定义过程</p><blockquote><p>4、定义 Endpoint</p></blockquote><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>
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

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>Endpoints are a primary abstraction in go-kit. An endpoint represents a single RPC (method in our service interface)</li><li>Endpoint 是主要的抽象，代表一个 RPC（服务的方法）</li></ul><ul><li><p>上述的 StringService 是步骤 1 中抽象出来的一个服务包含两个方法</p></li><li><p>endpoint.Endpoint 的签名为 func(ctx context.Context, request interface{}) (response interface{}, err error)</p></li><li><p>Endpoint 主要负责对 RPC 服务请求的处理</p></li></ul><blockquote><p>5、创建 解码请求消息 编码响应消息</p></blockquote><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>上述 RPC 服务通过 HTTP 协议完成通讯，其中的请求消息以 JSON 格式通过 HTTP 发送</li><li>接收到消息后需要将 JSON 消息解析到不同的请求消息结构体中</li><li>响应时，需要将 response 编码成 JSON 格式，不同的响应消息可以统一处理</li></ul><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>
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
	http.Handle(&quot;/uppercase&quot;, uppercaseHandler)
	http.Handle(&quot;/count&quot;, countHandler)

    // 开启 HTTP 服务
    log.Fatal(http.ListenAndServe(&quot;:8080&quot;, nil))
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>可以使用 Postman 发送 HTTP 的 POST 请求到 localhost:8080/uppercase 测试 RPC 服务</li><li>官方使用 Curl 发送请求</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> -d<span class="token string">&#39;{&quot;s&quot;:&quot;hello, world&quot;}&#39;</span> localhost:8080/uppercase
<span class="token punctuation">{</span><span class="token string">&quot;v&quot;</span><span class="token builtin class-name">:</span><span class="token string">&quot;HELLO, WORLD&quot;</span><span class="token punctuation">}</span>
$ <span class="token function">curl</span> <span class="token parameter variable">-XPOST</span> -d<span class="token string">&#39;{&quot;s&quot;:&quot;hello, world&quot;}&#39;</span> localhost:8080/count
<span class="token punctuation">{</span><span class="token string">&quot;v&quot;</span>:12<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,18);function m(b,g){const i=r("ExternalLinkIcon");return l(),t("div",null,[u,v,e("p",null,[e("a",o,[n("stringsvc1"),a(i)])]),p])}const f=s(c,[["render",m],["__file","go-kit_1.html.vue"]]);export{f as default};
