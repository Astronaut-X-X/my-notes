---
lang: zh-CN
title: Vimrc
description: 模板
prev: ../index.md
next: ../index.md
search: true
tags:
    - Vimrc 
---

### Vimrc

.vimrc 是 Vim 文本编辑器的配置文件，用于定义用户的编辑器偏好设置和自定义快捷键等内容。

以下是一份简单的 .vimrc 示例：

```.vimrc
" 显示行号
set number

" 语法高亮
syntax on

" 配色方案
colorscheme desert

" 设置自动缩进
set autoindent

" 设置 Tab 缩进为 4 个空格
set tabstop=4
set shiftwidth=4
set softtabstop=4
set expandtab

" 显示当前行和列号
set ruler

" 打开文件类型检测
filetype on
filetype plugin on
filetype indent on
```

这些设置可以根据个人喜好进行修改和添加，例如添加插件支持、更改配色方案、设置保存备份等等

自定义快捷键映射：
