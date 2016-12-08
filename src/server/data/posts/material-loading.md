![material loading](http://o7nu3cbe9.bkt.clouddn.com/blog/material-loading/material-loading.gif)

相信这个 loading 的标志大家都很熟悉，是不是很和谐？

![对着发呆...](http://o7nu3cbe9.bkt.clouddn.com/blog/material-loading/trance.jpg)

额...有毒，看得停不下来。既然，那么神奇，我就好奇地研(goo)究(gle)了一下。

原来它是 [Material Design Progress](https://material.google.com/components/progress-activity.html#progress-activity-types-of-indicators)（谷歌网站，你懂得）的一种 —— Circular。

在研究的过程中，发现有大神用 CSS + SVG 在 [codePen](https://codepen.io/jczimm/pen/vEBpoL) 上实现了它。接着，就一步步来看这个魔性的 loading 是如何实现的。

## SVG
既然，它是一个页面元素，那么，就先看看它的 dom 结构。

```HTML
<div class="loader">
	<svg class="circular" viewBox="0 0 50 50">
		<circle cx="25" cy="25" r="20" fill="none"/>
	</svg>
</div>
```

可以看到，结构很简单，是一个 `div` 标签包裹一个 `svg` 标签（`circle` 是 `svg` 中的一个预定义形状，后面再讲）。`div` 大家都很熟悉，那么，`svg` 是什么哪？

> 可缩放矢量图形（英语：Scalable Vector Graphics，SVG）是一种基于可扩展标记语言（XML），用于描述二维矢量图形的图形格式。SVG由W3C制定，是一个开放标准。 ——[wikipedia](https://zh.wikipedia.org/wiki/%E5%8F%AF%E7%B8%AE%E6%94%BE%E5%90%91%E9%87%8F%E5%9C%96%E5%BD%A2)

同其他图像格式相比，svg 的主要优势在于：它是可伸缩的，即缩小、放大都不会影响显示的质量。

知道了，svg 标签是什么，那其中的 viewBox 属性又是用来干什么的？

### viewBox
> The viewBox attribute allows you to specify that a given set of graphics stretch to fit a particular container element. ——[MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox)

我的理解就是，选中 svg 中的一部分作为内容的显示区域来进行放大或缩小来适应整个 svg 的大小。（如果还是不太明白的，可以查看张鑫旭大神的[文章](http://www.zhangxinxu.com/wordpress/2014/08/svg-viewport-viewbox-preserveaspectratio/)，形象生动）

viewBox 的值是 4 个数字并用逗号分割，分别对应原 svg 图的 x 坐标，y 坐标，宽度，高度。通过这 4 个值就能在原 svg 图中划出一个矩形，然后将它缩放至现有 svg 的大小。

### circle
明白了 `svg` 是用于描述图形，那该如何将图形画于其中哪？

`svg` 提供了一些预定义形状，除了之前用到的 `circle`，还有：

* [矩形 &lt;rect&gt;](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect)
* [椭圆 &lt;ellipse&gt;](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/ellipse)
* [线 &lt;line&gt;](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line)
* [折线 &lt;polyline&gt;](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polyline)
* [多边形 &lt;polygon&gt;](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polygon)
* [路径 &lt;path&gt;](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path)

这里只用到了 [`circle`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle)，对其他有兴趣的可以直接点链接了解。

`circle` 的属性很简单，`cx`, `cy` 和 `r`，对应圆心的 x 坐标，y 坐标和半径。

那例子中的就是画一个以 （25, 25）为圆心，半径为 20 的圆。

```HTML
<circle cx="25" cy="25" r="20" fill="none"/>
```

`fill` 属性用来填充，这里 `fill="none"` 就是没有填充色。

ok。这样圆就完成了，但如果你也在一边尝试的话会发现，界面上依旧是一片空白。

别着急，刚刚只是前戏，正戏现在才开始。

![](http://o7nu3cbe9.bkt.clouddn.com/blog/material-loading/666.jpg)

### stroke
从最初的图中可以看到，并不是要画一个圆，而是画一段线，这段线围绕一个圆来运动。

画好了圆，给它加上外边线不就有了一个围绕圆的线了么，这就要用到 `stroke`。

> The stroke attribute defines the color of the outline on a given graphical element. The default value for the stroke attribute is none. ——[MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke)

也就是给图形的外线框添加颜色。

```HTML
<circle cx="25" cy="25" r="20" fill="none" stroke="#106CFA"/>
```

这时，你就能看到一个蓝色的细环了。但是，太细了，可以通过 `stroke-width` 调整。

> the stroke-width attribute specifies the width of the outline on the current object. Its default value is 1. If a <percentage> is used, the value represents a percentage of the current viewport. If a value of 0 is used the outline will never be drawn. ——[MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width)

刚才，觉得太细就是因为 `stroke-width` 的默认值是 1。这里将 `stroke-width` 设定成 5%，使用百分比的好处是：当它做成组件后，只需控制 svg viewport 的大小，线宽会自动调整粗细。

于是，代码又变成了这样

```HTML
<circle cx="25" cy="25" r="20" fill="none"
		stroke="#106CFA" stroke-width="5%" />
```

loading 中的线段并不是一直保持环装，而是长短会变化，这该如何控制哪？

答案是：[`stroke-dasharray`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray)。

> the stroke-dasharray attribute controls the pattern of dashes and gaps used to stroke paths. ——[MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray)

也就是说，它是用来一组值来表示设置环绕在形状外部的虚线间隔。当这组值是偶数时，那么，它就分别表示线段长，间距长...，并以此类推。当它为奇数时，系统会默认追加相同的设置到末尾，使它成为偶数，然后再按偶数时的处理方式，如 5,3,2 就是 5,3,2,5,3,2。

你会想，虚线和 loading 有啥关系，loading 是一条线啊？没错，一开始我也是这样想的。

但，大神就想到了，如果将虚线的第一部分设定的足够长，那么它在可视范围内就是一条实线。于是，通过控制第一段实线的长度，也就控制了整条线段的长度。

因为，线段变长变短是一个过程，这就要用到动画。

```SCSS
.loader{
  // 省略...
  circle{
    animation: circle-dash 2s ease-in-out infinite;
  }
}

@keyframes circle-dash{
  0% {
    stroke-dasharray: 1, 125;
  }
  100% {
    stroke-dasharray: 125, 125;
  }
}
```

这时，你就能看到线段周而复始地从一根细线变为一个圆圈。但这有突然闪屏的感觉，和所要的结果不同，再修改一下动画，让线段成为圆圈后再退回成一根细线。

```SCSS
@keyframes circle-dash{
  0% {
    stroke-dasharray: 1, 125;
  }
  50% {
    stroke-dasharray: 125, 125;
  }
  100% {
    stroke-dasharray: 1, 125;
  }
}
```

是不是和结果越来越像了，但还是不对，loading 中的线段没有给人有倒退的感觉，那该如何做？

那就要使用 `stroke-dashoffset`，通过设定该属性线段的开始位置，来作出线段在不断前行的假象。

> the stroke-dashoffset attribute specifies the distance into the dash pattern to start the dash. ——[MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dashoffset)

再修改一下，刚刚的动画。

```SCSS
@keyframes circle-dash{
  0% {
    stroke-dasharray: 1, 125;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 100, 125;
    stroke-dashoffset: -25px;
  }
  100% {
    stroke-dasharray: 100, 125;
    stroke-dashoffset: -125px;
  }
}
```

这次感觉是不是很相像了，只是现在它的开口一直处于一个位置，就没什么魔性了。可以通过让整个圆形旋转起来，这样圆的开口的位置也就会不断变化了。

```SCSS
.circular{
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

Finish！来看看最后的结果。

<iframe height='265' scrolling='no' src='//codepen.io/discipled/embed/XjbNvW/?height=265&theme-id=0&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/discipled/pen/XjbNvW/'>Loading of Material Design</a> by Disciple_D (<a href='http://codepen.io/discipled'>@discipled</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

![](http://o7nu3cbe9.bkt.clouddn.com/blog/material-loading/interview.jpeg)

`stroke` 还有几个其他相关的属性，比如，[`stroke-linecap`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap) 可以用来改变线头的形状，其他还有 [stroke-linejoin](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin), [stroke-miterlimit](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit), [stroke-opacity](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-opacity)。

### 最后
模拟 Material Design 的 loading 就这样完成了，并应用到了我的[博客](http://discipled.me/)中，比如，首页的文章列表的懒加载。

> 最近，因工作需要搭了一个 React 全家桶 + Ant.Design 的脚手架，有兴趣的可以[看看](https://github.com/DiscipleD/react-redux-antd-starter)。

最后不得不吐槽一句，React + Redux 相对于 vue 2 + vuex 用起来真心累...