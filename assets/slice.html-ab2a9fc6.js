import{_ as s,M as r,p as l,q as d,R as e,t as n,N as i,a1 as c}from"./framework-efe98465.js";const o={},v=c(`<h2 id="golang-slice" tabindex="-1"><a class="header-anchor" href="#golang-slice" aria-hidden="true">#</a> Golang Slice</h2><blockquote><p>文章中可能存在某些错误，欢迎提交 RP Issues 指出，感谢您的阅读！</p></blockquote><hr><p>Golang的切片，是在数组的基础上封装了一层。创建时可以初始化数组长度，容量。<br> 长度是指切片内数组中存放的数据的个数，容量是指切片内数组的长度。 当切片需要存放的数据大于容量时，切片会自动扩容。值得注意的是， 在1.8之前切片的扩容的阈值是1024，即容量小于1024时，切片容量不足以存放数据时， 切片生成一个新的数组长度是之前的2倍，并将旧数组数据拷贝到新数组。 当容量大于1024时，扩容的倍数变为1/4倍。若仍然以2倍的速度扩容，并不是很好，可能导致很大内存的浪费。 在1.8及1.8之后扩容的阈值修改成了256。</p><p>在Golang中只存在方法中只存在两种参数的传递，一种是值传递，一种是引用传递。 当形参为指针类型时为值传递，形参为非指针类型为值传递。 引用类型传递参数时也是值传递，实例会被复制一份</p><p>例如：</p><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>type Person struct {
	Name string
}

func ChangeName(p Person) {
    p.Name = &quot;new_name&quot;
}

func ChangeNamePointer(p *Person) {
    p.Name = &quot;new_name_point&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述例子中，新建一个Person实例分别调用 ChangeName 和 ChangeNamePoint， 其中 ChangeName 不会改变 Person 实例的 Name ，而 ChangeNamePointer 会改变实例的 Name， 这是基础的传参的知识， 如果结构体内部存在指针变量，就有所不同</p><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>type Person struct {
	Name     string
	NickName *string
}

func ChangeName(p Person) {
    p.Name = &quot;new_name&quot;
    *p.NickName = &quot;new_nick_name&quot;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述例子中，Person 的实例调用 ChangeName 后，实例的 Name 不会改变，而 NickName 会发生改变 当形参传递时，会把实参的值完成拷贝一份给形参，Person 中的 NickName 存放的时字符串的指针， 复制后仍然存在指针，在方法中修改指针指向的数据，实参的 NickName 也会发生改变。 Go的切片是一个如下个结构体</p><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>type slice struct {
	array unsafe.Pointer
	len   int
	cap   int
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码是 go 1.9 中的 runtime/slice.go 中的 slice 结构体。 slice 中一个 array 是 unsafe.Pointer 类型，指向数据部分，</p><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>var array = []int{1, 2, 3}

func ChangeArray(arr []int) {
    arr[0] = 4
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>按照上述逻辑，在调用 ChangeArray 后，切片 array 中的第一个元素会被修改为 4 实际上形参 arr 和实参 array 是不同的两个实例。但内部的 unsafe.Poniter 指向统一个数组。</p><div class="language-golang line-numbers-mode" data-ext="golang"><pre class="language-golang"><code>var array = make([]int, 4, 4)

func ChangeArray(arr []int) {
    arr = append(arr, 5)
    arr[0] = 6
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但上述例子中 array 的第一个元素不会被修改为 6 ，原因是切片发生了扩容， 扩容后切片内的 array 指向的是一个新的数组。</p><p>这是在使用切片传值时，需要注意的。</p>`,17),t={href:"https://golang.google.cn/doc/effective_go#slices",target:"_blank",rel:"noopener noreferrer"},u={href:"https://jincheng9.github.io/",target:"_blank",rel:"noopener noreferrer"};function m(g,p){const a=r("ExternalLinkIcon");return l(),d("div",null,[v,e("p",null,[n("官方博文中有详细的切片介绍。"),e("a",t,[n("Link"),i(a)]),e("a",u,[n("Link"),i(a)])])])}const h=s(o,[["render",m],["__file","slice.html.vue"]]);export{h as default};
