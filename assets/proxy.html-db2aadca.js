import{_ as e,p as r,q as i,a1 as a}from"./framework-efe98465.js";const l={},t=a('<h1 id="proxy" tabindex="-1"><a class="header-anchor" href="#proxy" aria-hidden="true">#</a> Proxy</h1><h3 id="什么是网络代理" tabindex="-1"><a class="header-anchor" href="#什么是网络代理" aria-hidden="true">#</a> 什么是网络代理</h3><ul><li>用户通过代理请求信息</li><li>请求通过网络代理完成转发到达目标服务器</li><li>目标服务器响应后在通过网络代理回传给用户</li><li>用户不直接连接服务器，网络代理去服务器。获取数据后反回用户</li><li>网络转发是有路由器对报文的转发操作，中间可能对数据包进行修改</li></ul><blockquote><p>NAT (Network Address Tranlation) 网络地址转换 是将 IP 地址转换为另一个 IP 地址的过程。在实际应用中，NAT主要用于 实现稀有网络访问公共网络的功能。这种通过使用少量的公共 IP 地址代表较多的私有 IP 地址的方式，将有助于减缓可用 IP 地址空间的枯竭</p><p>DNAT (Destination Network Address Tranlation) 目的网络地址转换</p><p>SNAT (Source Network Address Tranlation) 源网络地址转换，将 IP 数据包的源地址转换成另外一个地址。</p></blockquote><h3 id="网络代理类型" tabindex="-1"><a class="header-anchor" href="#网络代理类型" aria-hidden="true">#</a> 网络代理类型</h3><ul><li><p>正向代理 是一种客户端的代理技术，帮助客户端访问无法访问的服务资源，可以隐藏用户真实 IP 。 比如：浏览器web代理，VPN等。</p></li><li><p>反向代理 是一种服务端的代理技术，帮助服务器做负载均衡、缓冲、提供安全校验等。可以隐藏服务器真实 IP 。 比如：LVS技术、nginx proxy_pass等</p></li></ul><h3 id="http-代理" tabindex="-1"><a class="header-anchor" href="#http-代理" aria-hidden="true">#</a> HTTP 代理</h3><ul><li>错误回调及错误日志处理</li><li>更改代理的返回内容</li><li>负载均衡</li><li>URL 重写</li><li>熔断 降级 限流</li><li>数据统计</li><li>权限验证</li></ul><h3 id="reverseproxy" tabindex="-1"><a class="header-anchor" href="#reverseproxy" aria-hidden="true">#</a> ReverseProxy</h3><p>Golang 官方实现的 反向代理</p><blockquote><p>ReverseProxy 支持如下功能： 更改内容支持 错误信息回调 支持自定义负载均衡 URL 重写 连接池功能 支持 websocket 服务 支持 https 代理</p></blockquote>',11),o=[t];function n(s,d){return r(),i("div",null,o)}const c=e(l,[["render",n],["__file","proxy.html.vue"]]);export{c as default};
