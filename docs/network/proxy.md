---
lang: zh-CN
title: Proxy 
description: 模板
prev: ../index.md
next: ../index.md
search: true
tags:
    - Proxy
---

# Proxy

### 什么是网络代理
+ 用户通过代理请求信息
+ 请求通过网络代理完成转发到达目标服务器
+ 目标服务器响应后在通过网络代理回传给用户
+ 用户不直接连接服务器，网络代理去服务器。获取数据后反回用户
+ 网络转发是有路由器对报文的转发操作，中间可能对数据包进行修改

> NAT (Network Address Tranlation) 网络地址转换 是将 IP 地址转换为另一个 IP 地址的过程。在实际应用中，NAT主要用于
> 实现稀有网络访问公共网络的功能。这种通过使用少量的公共 IP 地址代表较多的私有 IP 地址的方式，将有助于减缓可用 IP 
> 地址空间的枯竭
> 
> DNAT (Destination Network Address Tranlation) 目的网络地址转换
> 
> SNAT (Source Network Address Tranlation) 源网络地址转换，将 IP 数据包的源地址转换成另外一个地址。

### 网络代理类型
+ 正向代理
是一种客户端的代理技术，帮助客户端访问无法访问的服务资源，可以隐藏用户真实 IP 。
比如：浏览器web代理，VPN等。

+ 反向代理
是一种服务端的代理技术，帮助服务器做负载均衡、缓冲、提供安全校验等。可以隐藏服务器真实 IP 。
比如：LVS技术、nginx proxy_pass等

### HTTP 代理
+ 错误回调及错误日志处理
+ 更改代理的返回内容
+ 负载均衡
+ URL 重写
+ 熔断 降级 限流
+ 数据统计
+ 权限验证

### ReverseProxy 
Golang 官方实现的 反向代理

> ReverseProxy 支持如下功能：
> 更改内容支持
> 错误信息回调
> 支持自定义负载均衡
> URL 重写
> 连接池功能
> 支持 websocket 服务
> 支持 https 代理


