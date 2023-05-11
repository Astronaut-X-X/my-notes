---
lang: zh-CN
title: TCP
description: TCP
---

# TCP

TCP 传输控制协议(Transmission Control Protocal),是一种面向连接的、可靠的、基于字节流的传输层控制协议。最早由[RFC 793](https://www.rfc-editor.org/rfc/rfc793) 决议定义，如今已近在[RFC 9293](https://www.rfc-editor.org/rfc/rfc9293#name-status-of-this-memo)中被重新定义。

TCP 面向连接 指的是 TCP是通过3次握手、4次挥手创建的TCP连接。
3次握手的具体流程如下：
1、由客户端发出建立请求数据报 
2、由服务端接收到数据包后返回响应
3、客户端再次接收到响应数据报后，返回响应
建立TCP连接，

注意点：
TCP连接是建立在IP协议之上的，也就是说，没次TCP的数据报传输过程中通过的数据链路可能不相同。
TCP长连接是通过双方维持一个Sokcet保持的，Socket分别记录了对方和本机的IP地址和端口号。
