import{_ as e,M as t,p as i,q as l,R as n,t as s,N as o,a1 as p}from"./framework-efe98465.js";const c={},r=n("h1",{id:"makefile",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#makefile","aria-hidden":"true"},"#"),s(" Makefile")],-1),u=n("p",null,"Makefile 是一个工具，能控制程序的源文件生成可执行文件和非源码文件程序。",-1),d={href:"https://www.gnu.org/software/make/manual/make.html",target:"_blank",rel:"noopener noreferrer"},v=p(`<p>举例子说如何使用一个 Makefile，例子代码如下：</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>BIN_FILE<span class="token operator">=</span>hello
ORIGIN_FILE<span class="token operator">=</span>main.go

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> all build run

<span class="token target symbol">all</span><span class="token punctuation">:</span> build

<span class="token target symbol">build</span><span class="token punctuation">:</span>
	<span class="token operator">@</span>go build -o <span class="token string">&quot;\${BIN_FILE}&quot;</span> <span class="token string">&quot;\${ORIGIN_FILE}&quot;</span>

<span class="token target symbol">run</span><span class="token punctuation">:</span> 
    ./<span class="token string">&quot;\${BIN_FILE}&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>声明一个变量使用 变量名=变量值 例如上述代码：</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>BIN_FILE<span class="token operator">=</span>hello
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>其中声明了一个变量 BIN_FILE 值为 hello 同样的 ORIGIN_FILE 也是一个变量，值为 main.go</p><p>使用 .PHONY: 声明可以使用的指令</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> all build run
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>即声明了 三个指令可以使用 all build run</p><p>指令的具体执行指令在 .PHONY 之后声明</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token target symbol">all</span><span class="token punctuation">:</span> build

<span class="token target symbol">build</span><span class="token punctuation">:</span>
	<span class="token operator">@</span>go build -o <span class="token string">&quot;\${BIN_FILE}&quot;</span> <span class="token string">&quot;\${ORIGIN_FILE}&quot;</span>

<span class="token target symbol">run</span><span class="token punctuation">:</span> 
    ./<span class="token string">&quot;\${BIN_FILE}&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用 指令名称: 其后为指令的具体执行各个子指令 all 为默认执行的指令，即当只输入 make 时执行 all: 中的指令 当没有 all 时，输入 make 不携带targes时，默认执行 .PHONY 后的第一个指令 可以使用 .DEFAULT_GOAL 置顶默认执行的指令</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>.DEFAULT_GOAL <span class="token operator">:=</span> help
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>以下是一个更复杂的例子：</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>GOHOSTOS<span class="token operator">:=</span><span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> go env GOHOSTOS<span class="token punctuation">)</span>
GOPATH<span class="token operator">:=</span><span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> go env GOPATH<span class="token punctuation">)</span>
VERSION<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> git describe --tags --always<span class="token punctuation">)</span>

<span class="token keyword">ifeq</span> <span class="token punctuation">(</span><span class="token variable">$</span><span class="token punctuation">(</span>GOHOSTOS<span class="token punctuation">)</span>, windows<span class="token punctuation">)</span>
	<span class="token comment">#the \`find.exe\` is different from \`find\` in bash/shell.</span>
	<span class="token comment">#to see https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/find.</span>
	<span class="token comment">#changed to use git-bash.exe to run find cli or other cli friendly, caused of every developer has a Git.</span>
	<span class="token comment">#Git_Bash= $(subst cmd\\,bin\\bash.exe,$(dir $(shell where git)))</span>
	Git_Bash<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">subst</span> \\,/,<span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">subst</span> cmd\\,bin\\bash.exe,<span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">dir</span> <span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> where git<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
	INTERNAL_PROTO_FILES<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> <span class="token variable">$</span><span class="token punctuation">(</span>Git_Bash<span class="token punctuation">)</span> -c <span class="token string">&quot;find internal -name *.proto&quot;</span><span class="token punctuation">)</span>
	API_PROTO_FILES<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> <span class="token variable">$</span><span class="token punctuation">(</span>Git_Bash<span class="token punctuation">)</span> -c <span class="token string">&quot;find api -name *.proto&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">else</span>
	INTERNAL_PROTO_FILES<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> find internal -name *.proto<span class="token punctuation">)</span>
	API_PROTO_FILES<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> find api -name *.proto<span class="token punctuation">)</span>
<span class="token keyword">endif</span>

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> init
<span class="token comment"># init env</span>
<span class="token target symbol">init</span><span class="token punctuation">:</span>
	go install google.golang.org/protobuf/cmd/protoc-gen-go<span class="token operator">@</span>latest
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc<span class="token operator">@</span>latest
	go install github.com/go-kratos/kratos/cmd/kratos/v2<span class="token operator">@</span>latest
	go install github.com/go-kratos/kratos/cmd/protoc-gen-go-http/v2<span class="token operator">@</span>latest
	go install github.com/google/gnostic/cmd/protoc-gen-openapi<span class="token operator">@</span>latest
	go install github.com/google/wire/cmd/wire<span class="token operator">@</span>latest

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> config
<span class="token comment"># generate internal proto</span>
<span class="token target symbol">config</span><span class="token punctuation">:</span>
	protoc --proto_path<span class="token operator">=</span>./internal \\
	       --proto_path<span class="token operator">=</span>./third_party \\
 	       --go_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative<span class="token punctuation">:</span>./internal \\
	       <span class="token variable">$</span><span class="token punctuation">(</span>INTERNAL_PROTO_FILES<span class="token punctuation">)</span>

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> api
<span class="token comment"># generate api proto</span>
<span class="token target symbol">api</span><span class="token punctuation">:</span>
	protoc --proto_path<span class="token operator">=</span>./api \\
	       --proto_path<span class="token operator">=</span>./third_party \\
 	       --go_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative<span class="token punctuation">:</span>./api \\
 	       --go-http_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative<span class="token punctuation">:</span>./api \\
 	       --go-grpc_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative<span class="token punctuation">:</span>./api \\
	       --openapi_out<span class="token operator">=</span>fq_schema_naming<span class="token operator">=</span>true,default_response<span class="token operator">=</span>false<span class="token punctuation">:</span>. \\
	       <span class="token variable">$</span><span class="token punctuation">(</span>API_PROTO_FILES<span class="token punctuation">)</span>

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> build
<span class="token comment"># build</span>
<span class="token target symbol">build</span><span class="token punctuation">:</span>
	mkdir -p bin/ &amp;&amp; go build -ldflags <span class="token string">&quot;-X main.Version=$(VERSION)&quot;</span> -o ./bin/ ./...

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> generate
<span class="token comment"># generate</span>
<span class="token target symbol">generate</span><span class="token punctuation">:</span>
	go mod tidy
	go get github.com/google/wire/cmd/wire<span class="token operator">@</span>latest
	go generate ./...

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> all
<span class="token comment"># generate all</span>
<span class="token target symbol">all</span><span class="token punctuation">:</span>
	make api<span class="token punctuation">;</span>
	make config<span class="token punctuation">;</span>
	make generate<span class="token punctuation">;</span>

<span class="token comment"># show help</span>
<span class="token target symbol">help</span><span class="token punctuation">:</span>
	<span class="token operator">@</span>echo <span class="token string">&#39;&#39;</span>
	<span class="token operator">@</span>echo <span class="token string">&#39;Usage:&#39;</span>
	<span class="token operator">@</span>echo <span class="token string">&#39; make [target]&#39;</span>
	<span class="token operator">@</span>echo <span class="token string">&#39;&#39;</span>
	<span class="token operator">@</span>echo <span class="token string">&#39;Targets:&#39;</span>
	<span class="token operator">@</span>awk <span class="token string">&#39;/^[a-zA-Z\\-\\_0-9]+:/ { \\
	helpMessage = match(lastLine, /^# (.*)/); \\
		if (helpMessage) { \\
			helpCommand = substr($$1, 0, index($$1, &quot;:&quot;)-1); \\
			helpMessage = substr(lastLine, RSTART + 2, RLENGTH); \\
			printf &quot;\\033[36m%-22s\\033[0m %s\\n&quot;, helpCommand,helpMessage; \\
		} \\
	} \\
	{ lastLine = $$0 }&#39;</span> <span class="token variable">$</span><span class="token punctuation">(</span>MAKEFILE_LIST<span class="token punctuation">)</span>

.DEFAULT_GOAL <span class="token operator">:=</span> help
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,14);function m(k,b){const a=t("ExternalLinkIcon");return i(),l("div",null,[r,u,n("p",null,[n("a",d,[s("官方文档"),o(a)])]),v])}const h=e(c,[["render",m],["__file","makefile.html.vue"]]);export{h as default};
