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

### 
