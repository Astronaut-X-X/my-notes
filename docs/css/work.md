---
lang: zh-CN
title: CSS
description: CSS 工作中使用到的

search: true
tag:
    - CSS
---

# CSS

> background  

background 图片填充满背景，可以使用
```css
    background-size: 100% 100%;
```

> user-select

user-select css实现禁止文本被选中，无法复制，文字不被选中，一般情况在css中直接加一句：
```css
    user-select:none;

    /* 兼容性 */
    -webkit-user-select:none;   /*   webkit浏览器   */ 
    -moz-user-select:none;      /*      火狐        */ 
    -ms-user-select:none;       /*      IE10        */ 
    user-select:none;
```

> pointer-events

pointer-events CSS 属性指定在什么情况下 (如果有) 某个特定的图形元素可以成为鼠标事件的 target (en-US)。
```css
    /* Keyword values */
    pointer-events: auto;
    pointer-events: none;
    pointer-events: visiblePainted; /* SVG only */
    pointer-events: visibleFill;    /* SVG only */
    pointer-events: visibleStroke;  /* SVG only */
    pointer-events: visible;        /* SVG only */
    pointer-events: painted;        /* SVG only */
    pointer-events: fill;           /* SVG only */
    pointer-events: stroke;         /* SVG only */
    pointer-events: all;            /* SVG only */

    /* Global values */
    pointer-events: inherit;
    pointer-events: initial;
    pointer-events: unset;

```
当此属性未指定时，visiblePainted值的相同特征适用于 SVG（可缩放矢量图形）内容。  