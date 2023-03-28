---
lang: zh-CN
title: CSS
description: CSS 工作中使用到的

search: true
tag:
    - CSS
---

# CSS

background 图片填充满背景，可以使用
```css
    background-size: 100% 100%;
```

css实现禁止文本被选中，无法复制，文字不被选中，一般情况在css中直接加一句：
```css
    user-select:none;

    /* 兼容性 */
    -webkit-user-select:none;   /*   webkit浏览器   */ 
    -moz-user-select:none;      /*      火狐        */ 
    -ms-user-select:none;       /*      IE10        */ 
    user-select:none;
```