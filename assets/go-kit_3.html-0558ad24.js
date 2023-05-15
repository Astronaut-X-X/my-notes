import{_ as s,M as t,p as l,q as d,R as e,t as n,N as r,a1 as u}from"./framework-efe98465.js";const a={},v=e("h1",{id:"micro-server",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#micro-server","aria-hidden":"true"},"#"),n(" Micro Server")],-1),o=e("p",null,[n("此文为 go-kit 的 stringsvc3 例子"),e("br"),n(" 此文例子介绍了 如何调用其他的 RPC 服务 文中有表述不当的地方，可以通过 issue 请指出，谢谢阅读")],-1),c={href:"https://gokit.io/examples/stringsvc.html#middlewares",target:"_blank",rel:"noopener noreferrer"},m=u(`<p>此处以上文中的 go-kit 2 例子为基础，进行修改<br> 官方文档中介绍了，微服务中不进行服务调用是很罕见了，同时 go-kit 的服务调用也是很亮眼的。 go-kit 完成服务调用主要是通过增加一层中间件完成的，所以阅读此文建议先阅读 go-kit 2 。</p><blockquote><p>1、创建代理服务</p></blockquote><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>type proxymw struct {
	next      StringService
	uppercase endpoint.Endpoint
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>proxymw 结构体中有 StringService 接口属性，需要实现该接口的两个方法 Uppercase 和 Count 方法</li><li>Count 我们仍通过 <code>next.Count</code> 调用自生提供的服务</li></ul><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>func (mw proxymw) Count(s string) n int {
    return mw.next.Count(s)
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>func (mw proxymw) Uppercase(s string) (string, error) {
	// 调用远程服务
	response, err := mw.uppercase(context.Background(), uppercaseRequest{S: s})
	if err != nil {
		return &quot;&quot;, nil
	}

	// 获取响应消息
	resp := response.(uppercaseResponse)
	if resp.Err != &quot;&quot; {
		return resp.V, errors.New(resp.Err)
	}
	return resp.V, nil
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>2、中间件 proxymw 的创建及服务注入</p></blockquote><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>func proxyingMiddleware(svc StringService, instances string) StringService {

    // 创建服务调用对象
	uppercase := makeUppercaseProxy(instances)

	return &amp;proxymw{
		uppercase: uppercase,
		next:      svc,
	}
}

func makeUppercaseProxy(instance string) endpoint.Endpoint {
    // 服务调用地址
	if !strings.HasPrefix(instance, &quot;http&quot;) {
		instance = &quot;http://&quot; + instance
	}

    // 解析服务调用地址
	u, err := url.Parse(instance)
	if err != nil {
		panic(err)
	}
    // 服务调用方法
	if u.Path == &quot;&quot; {
		u.Path = &quot;/uppercase&quot;
	}
    // 返回远程服务调用对象
	return httptransport.NewClient(
		&quot;GET&quot;,
		u,
		encodeRequest,
		decodeUppercaseResponse,
	).Endpoint()
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>3、注入中间件 proxyingMiddleware</p></blockquote><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>func main() {
	logger := log.NewLogfmtLogger(os.Stderr)

	fieldKeys := []string{&quot;method&quot;, &quot;error&quot;}
	requestCount := kitprometheus.NewCounterFrom(stdprometheus.CounterOpts{
		Namespace: &quot;my_group&quot;,
		Subsystem: &quot;string_service&quot;,
		Name:      &quot;request_count&quot;,
		Help:      &quot;Number of requests received.&quot;,
	}, fieldKeys)
	requestLatency := kitprometheus.NewSummaryFrom(stdprometheus.SummaryOpts{
		Namespace: &quot;my_group&quot;,
		Subsystem: &quot;string_service&quot;,
		Name:      &quot;request_latency_microseconds&quot;,
		Help:      &quot;Total duration of requests in microseconds.&quot;,
	}, fieldKeys)
	countResult := kitprometheus.NewSummaryFrom(stdprometheus.SummaryOpts{
		Namespace: &quot;my_group&quot;,
		Subsystem: &quot;string_service&quot;,
		Name:      &quot;count_result&quot;,
		Help:      &quot;The result of each count method.&quot;,
	}, []string{}) // no fields here

	var svc StringService
	svc = &amp;stringService{}
	// 注册远程服务调用对象 暂时固定调用 127.0.0.1:8080 提供的服务
	svc = proxyingMiddleware(svc, &quot;127.0.0.1:8080&quot;)
	svc = loggingMiddleware{logger, svc}
	svc = instrumentingMiddleware{requestCount, requestLatency, countResult, svc}

	uppercaseHandler := makeUppercaseHandler(svc)
	countHandler := makeCountHandler(svc)

	http.Handle(&quot;/uppercase&quot;, uppercaseHandler)
	http.Handle(&quot;/count&quot;, countHandler)
	http.Handle(&quot;/metrics&quot;, promhttp.Handler())

    // 注意更改端口
	logger.Log(&quot;msg&quot;, &quot;HTTP&quot;, &quot;addr&quot;, &quot;:8081&quot;)
	logger.Log(&quot;err&quot;, http.ListenAndServe(&quot;:8081&quot;, nil))
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>在本地开启一个 go-kit 2 版本的服务，设置端口为 8080</li><li>再启动上面修改后的版本，设置端口为 8081</li><li>使用 Postman 测试发送请求到 http://127.0.0.1:8081/uppercase</li><li>JSON数据：{ &quot;s&quot; : &quot;hello&quot; }</li></ul><p>8080端口服务器日志： method=uppercase input=hello output=HELLO err=null took=0s</p><p>8081端口服务器日志： method=uppercase input=hello output=HELLO err=null took=3.5181ms</p><p>可以看到 8081的请求响应了，8080也有请求</p><blockquote><p>4、添加负载均衡</p></blockquote><p>使用 go-kit 自带的负载均衡</p><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>// ServiceMiddleware is a chainable behavior modifier for StringService.
type ServiceMiddleware func(StringService) StringService

func proxyingMiddleware(svc StringService, instances string) ServiceMiddleware {
	// 如果为空则返回默认
	if instances == &quot;&quot; {
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
	a := strings.Split(s, &quot;,&quot;)
	for i := range a {
		a[i] = strings.TrimSpace(a[i])
	}
	return a
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改 main 方法</p><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>
func main() {
	logger := log.NewLogfmtLogger(os.Stderr)

	fieldKeys := []string{&quot;method&quot;, &quot;error&quot;}
	requestCount := kitprometheus.NewCounterFrom(stdprometheus.CounterOpts{
		Namespace: &quot;my_group&quot;,
		Subsystem: &quot;string_service&quot;,
		Name:      &quot;request_count&quot;,
		Help:      &quot;Number of requests received.&quot;,
	}, fieldKeys)
	requestLatency := kitprometheus.NewSummaryFrom(stdprometheus.SummaryOpts{
		Namespace: &quot;my_group&quot;,
		Subsystem: &quot;string_service&quot;,
		Name:      &quot;request_latency_microseconds&quot;,
		Help:      &quot;Total duration of requests in microseconds.&quot;,
	}, fieldKeys)
	countResult := kitprometheus.NewSummaryFrom(stdprometheus.SummaryOpts{
		Namespace: &quot;my_group&quot;,
		Subsystem: &quot;string_service&quot;,
		Name:      &quot;count_result&quot;,
		Help:      &quot;The result of each count method.&quot;,
	}, []string{}) // no fields here

	var svc StringService
	svc = &amp;stringService{}

    // 注册如下服务器
	instances := &quot;127.0.0.1:8080,127.0.0.1:8081,127.0.0.1:8082&quot;
	// 注册远程服务调用对象
	svc = proxyingMiddleware(svc, instances)(svc)
	svc = loggingMiddleware{logger, svc}
	svc = instrumentingMiddleware{requestCount, requestLatency, countResult, svc}

	uppercaseHandler := makeUppercaseHandler(svc)
	countHandler := makeCountHandler(svc)

	http.Handle(&quot;/uppercase&quot;, uppercaseHandler)
	http.Handle(&quot;/count&quot;, countHandler)
	http.Handle(&quot;/metrics&quot;, promhttp.Handler())

    // 监听 8090 端口
	logger.Log(&quot;msg&quot;, &quot;HTTP&quot;, &quot;addr&quot;, &quot;:8090&quot;)
	logger.Log(&quot;err&quot;, http.ListenAndServe(&quot;:8090&quot;, nil))
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>开启多个 go-kit 2 版本的服务器 端口分别为 8080 8081 8082 。（<a href="#tag-1">修改参考</a>）</li><li>启动上述添加负载均衡后的远程服务调用并修改监听端口为 8090。</li><li>多次请求 uppercase 服务</li></ul><p>负载均衡服务的命令行输出：</p><div class="language-cmd line-numbers-mode" data-ext="cmd"><pre class="language-cmd"><code>msg=HTTP addr=:8090
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>8080端口服务的命令行输出：</p><div class="language-cmd line-numbers-mode" data-ext="cmd"><pre class="language-cmd"><code>msg=HTTP addr=:8080
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>8081端口服务的命令行输出：</p><div class="language-cmd line-numbers-mode" data-ext="cmd"><pre class="language-cmd"><code>msg=HTTP addr=:8081
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>8082端口服务的命令行输出：</p><div class="language-cmd line-numbers-mode" data-ext="cmd"><pre class="language-cmd"><code>msg=HTTP addr=:8082
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
method=uppercase input=hello output=HELLO err=null took=0s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>go-kit已经帮助实现了负载均衡</p><blockquote><p>5、添加熔断和限流</p></blockquote><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>    // 客户端的一些参数
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="修改-go-kit-2-版本通过-flag-启动设置端口-tag-1" tabindex="-1"><a class="header-anchor" href="#修改-go-kit-2-版本通过-flag-启动设置端口-tag-1" aria-hidden="true">#</a> 修改 go-kit 2 版本通过 flag 启动设置端口 {#tag-1}</h4><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>func main() {
	var (
		listen = flag.String(&quot;listen&quot;, &quot;:8080&quot;, &quot;HTTP listen address&quot;)
	)
	flag.Parse()

    // 注意！省略代码
	...

	http.Handle(&quot;/uppercase&quot;, uppercaseHandler)
	http.Handle(&quot;/count&quot;, countHandler)
	http.Handle(&quot;/metrics&quot;, promhttp.Handler())
	logger.Log(&quot;msg&quot;, &quot;HTTP&quot;, &quot;addr&quot;, *listen)
	logger.Log(&quot;err&quot;, http.ListenAndServe(*listen, nil))
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译后使用输入 <code>main.exe -listen=:8081</code> 启动，<code>-listen=:8081</code> 指定服务监听端口</p><ul><li>[ ] Threading a context</li></ul>`,35);function p(b,g){const i=t("ExternalLinkIcon");return l(),d("div",null,[v,o,e("p",null,[e("a",c,[n("stringsvc3"),r(i)])]),m])}const h=s(a,[["render",p],["__file","go-kit_3.html.vue"]]);export{h as default};
