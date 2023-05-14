---
lang: zh-CN
title: Vim 
description: 模板
prev: ../index.md
next: ../index.md
search: true
tags:
    - Vim 
---

# Vim 

### 开始编辑
+ 使用 i 进入编辑模式，开始输入文字
+ i 表示（insert），a（append），o（open a line below）
+ 使用 Esc 又可以回到 normal 模式。使用 :wq 保存退出
+ I insert before line A append after line O open a line above

### normal 模式 
+ 进入 Vim 默认是 normal （普通）模式。使用 Esc 从插入回到普通模式
+ 普通模式下可以进行各种命令操作和移动
+ 大多数情况下是在浏览而不是输入，所以 Vim 默认是 normal 模式

### insert 模式
+ 使用 i 表示（insert），a（append），o（open a line below）进入插入模式
+ 使用 Esc 退出插入模式到 normal 模式

### command 模式 
normal 模式下输入 : 之后执行命令，例如：保存 :w 退出 :q
+ 例如：分屏 :vs（vertical split） , :sp（split）
+ 例如：%s /foo/bar/g 进行全局替换

### visual 模式
+ normal 模式下按下 v 进入 visual 模式
+ 使用 V 选择行
+ 使用 ctrl + v 进行方块选择

### 快速纠错
+ 进入 insert 模式 （终端下也适用）
+ ctrl + h 删除前一个字符，ctrl + w 删除前一个单词，ctrl + u 删除当前行
+ ctrl + a 光标前移 ctrl + e 光标移到末尾 ctrl + b 光标前移 ctrl + f 光标后移

### 光标移动
+ 使用 H J K L 移动光标往 左 下 上 右 移动
+ w/W 移动到 word/WORD 开头， e/E 移动到 word/WORD 尾部
+ b/B 回到上个word/WORD 的开头，理解为 backword
+ word 指的是以非空白字符分割的单词，WORD 以空白字符分割的单词

### 行间搜索
+ 使用 f{char} 可以移动到 char 字符上，t 移动到 char 的前一个字符上
+ 如果第一次没搜索到，可以使用 分号(;)/逗号(,) 继续搜索该行下一个/上一个
+ 大写的 F 表示反过来搜索前面的字符

### 水平移动
+ 0 移动到行首的第一个字符，^ 移动到第一个非空白字符
+ $ 移动到行尾，g_ 移动到行尾非空白字符

### 段落移动
+ 使用 （） {} [] 进行段落间的移动

### 页面移动
+ 使用 gg/G 移动到页尾部，使用 ctrl + o 快速反回上的位置
+ 使用 H M L 移动到屏幕的开头 中间 结尾
+ 使用 ctrl + u / ctrl + f 上下翻页，zz 屏幕 

### 快速删除
+ Vim 在 normal 模式下使用 x 快速删除一个单词
+ 使用 d （delete） 配合文本对象快速删除一个单词 daw （d around word）
+ d 和 x 都可以搭配数字来执行多次

### 快速修改
+ 常用有三个，r (replace), c(change), s(substitute)
+ normal 模式下使用 r 可以替换一个字符 s 替换并进入插入模式
+ 使用 c 配合文本对象，可以快速进行修改

### 查询
+ 使用/或者？进行前向或反向搜索
+ 使用n/N 跳转到下一个或者上一个匹配
+ 使用 * 或者 # 进行当前单词的前向和后向匹配

### 替换命令
subsitute 命令允许我们查找并替换掉文本，并支持正则式
+ :[range]s[ubsitute]/{pattern}/{string}/[{flags}]
+ range 表示范围 例如 :10,20 表示 10-20行，% 表示全部
+ patternn 是要替换的模式，string 是替换后的文本
+ Flags 有几个常用的标志
+ g(global) 表示全局范围内执行
+ c(confirm) 表示确认，可以确认或拒绝修改
+ n(number) 报告匹配到的次数而不是替换，可以用来查询匹配的次数

### 多文件操作
+ Buffer 是指打开的一个文件的内存缓冲区
+ 窗口是 Buffer 可视化的分割区域
+ Tab 可以组织窗口为一个工作区

### Buffer 切换
如何在 buffer 间切换呢
+ 使用 :ls 会列举当前缓冲区，然后使用 :b n 跳转到第 n 个缓冲区
+ :bpre :bnext :bfirst :blast
+ 或者用 :b buffer_name 加上 tab 补全来跳转

### Window 窗口
窗口是可视化的分割区域
+ 一个缓冲区可以分割成多个窗口，每个窗口也可以打开不同缓冲区
+ \<Ctrl+w\>s 水平分割， \<Ctrl+w\>v 垂直分割。或者  :sp 和 :vs
+ 每个窗口可以继续被无限分割（取决于你的屏幕大小）
+ 切换窗口的命令使用 Ctrl + w (window)作为前缀
命令        用途
\<C-w\>w      在窗口间循环切换
\<C-w\>h      切换到左边窗口
\<C-w\>j      切换到下面窗口
\<C-w\>k      切换到上面窗口
\<C-w\>l      切换到右边窗口

### Tab （标签页）
+ 使用 :tabnew file_name 打开新标签页
+ 使用 gt 切换到下个标签页 使用 gT 切换到上个标签页
+ 使用 \<Ctrl+w\>c (close) 关闭当前活动的标签页
+ :tabonly 保留当前标签页
+ :tabclose 关闭当前标签页 

### backspace 模式
+ 使用 :set backspace={mode}