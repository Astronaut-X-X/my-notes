import{_ as n,p as a,q as s,a1 as e}from"./framework-efe98465.js";const t={},i=e(`<h1 id="javascript" tabindex="-1"><a class="header-anchor" href="#javascript" aria-hidden="true">#</a> JavaScript</h1><h3 id="项目中遇到的问题" tabindex="-1"><a class="header-anchor" href="#项目中遇到的问题" aria-hidden="true">#</a> 项目中遇到的问题</h3><p>需求：读取上传的图片并校验图片的尺寸大小</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>
<span class="token keyword">let</span> img <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Image</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// file: blob object data</span>
<span class="token keyword">let</span> url <span class="token operator">=</span> <span class="token constant">URL</span><span class="token punctuation">.</span><span class="token function">createURLObject</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span>

img<span class="token punctuation">.</span><span class="token function-variable function">onload</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span><span class="token punctuation">{</span>
    
<span class="token punctuation">}</span>

img<span class="token punctuation">.</span>src <span class="token operator">=</span> url<span class="token punctuation">;</span>




</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),c=[i];function p(l,o){return a(),s("div",null,c)}const d=n(t,[["render",p],["__file","note.html.vue"]]);export{d as default};
