继[上一篇](http://discipled.me/posts/ssr)使用 SSR 来优化搜索引擎之后，为了进一步提高自己的网（zhi）站（ming）排（du）名，就打算进一步优化 SEO。之前有听[朋友](https://github.com/arzyu)提到[结构化数据](https://developers.google.com/search/docs/guides/intro-structured-data)对 SEO 有帮助，便去了解了一下，果然是个好东西。

## 什么是结构化数据
简单来说，结构化数据就是按一定的结构产生的一系列描述你网站内容的信息，它能帮助搜索引擎的爬虫更好地了解你网页中所要展现的内容，并在搜索结果中有更丰富得展现，而非千篇一律的链接。

不仅如此，结构化数据的设置方式也相当简单，主要分为 3 种：[JSON-LD](http://json-ld.org/),  [Microdata](https://www.w3.org/TR/microdata/) 和 [RDFa](https://rdfa.info/)。

它们又分为 2 派，Microdata 和 RDFa 是通过给 html 标签加属性的方式来设置结构化数据，而 JSON-LD 是通过给页面添加 JavaScript 标签的方式自成一派。

## Microdata, RDFa 孰优孰劣
既然，Microdata 和 RDFa 都是通过同样的方式生成结构化数据，那么，自然就会比较它俩的优劣。

尽管，它俩总体来说区别不大，并且 [Google Search](https://developers.google.com/search/docs/guides/intro-structured-data) 和 [Schema.org](http://schema.org/) 默认的 DEMO 都是 Microdata 格式，但是，RDFa Lite 还是更胜一筹，起决定性的因素是 [W3C 标准](https://www.w3.org/standards/)。[RDFa Lite](https://www.w3.org/TR/rdfa-lite/#the-attributes) 已被收录进了 W3C 的标准，而 [Microdata](https://en.wikipedia.org/wiki/Microdata_(HTML)) 却没有。

![](https://o7nu3cbe9.bkt.clouddn.com/blog/structure-data/no-compare-no-hurts.jpg)

更详细的对比可以参考这个[问题](http://stackoverflow.com/questions/8957902/microdata-vs-rdfa)的高票回答。

也正如上面回答中提到的，Microdata, RDFa 的孰优孰劣，并不是选边站队，也不像 Angular, React, Vue 之间的有我没他，你可以在你的网站上同时使用这两种不同的方法去实现结构化数据，甚至还可以用上 JSON-LD。

这里主要谈谈 RDFa Lite。

RDFa Lite， 它的结构也很简单，只需在特定的 HTML 元素上添加一些特定的属性就可以了。就像这样

```HTML
<p vocab="http://schema.org/" typeof="Person">
   My name is
   <span property="name">Manu Sporny</span>
   and you can give me a ring via
   <span property="telephone">1-800-555-0199</span>
   or visit 
   <a property="url" href="http://manu.sporny.org/">my homepage</a>.
</p>
```

上面这段 html 就告诉了搜索引擎这段描述的是一个人的信息。其中，`vocab`, `typeof` 和 `property` 就是特定的属性，而 RDFa Lite 的基础属性已就这 3 个。

`vocab` 是 vocabulary 的简写，顾名思义是词汇表，用来表示机器能够识别的结构化数据的类型库，比如上例中的 Person。

还有哪些可以使用的类型哪？

## Schema.org
Schema.org 是由 Google, Microsoft, Yahoo 和 Yandex 共同赞助，为了创建、维护和促进结构化数据在互联网等场景下的应用，而成立的一个社区组织。它可以被之前提到的 3 种设置结构化数据的方式所使用。

Schema.org 包含 583 种类型（`typeof`），以及 846 个属性（`property`），[点击查看全部类型](http://schema.org/docs/full.html)。

知道了语法和词库，根据自己的网站内容就可以设置属于自己网站的结构化数据了。

## 测试
假设，已经在网站上完成了结构化数据的添加，怎么知道添加的正确与否？

谷哥提供了一个简单的[工具](https://search.google.com/structured-data/testing-tool/u/0/)，只需填上网站的地址或 html 代码就可以知道添加结构化数据是否成功，是否有错误。

![Structure data Test](https://o7nu3cbe9.bkt.clouddn.com/blog/structure-data/structure-data-test.jpg)

点击右边的任何一项，测试工具都会自动定位到设置该属性的位置并高亮显示。

至此，可以算完成了。

> 福利：WordPress 用户有现成的结构化数据[插件](https://srd.wordpress.org/plugins/schema-app-structured-data-for-schemaorg/)可以使用，真是开森。

## 最后
结构化数据不仅仅可以提高搜索排名，美化搜索结果。它还能够被其他一些应用所读取使用，比如：[Gmail](https://developers.google.com/gmail/markup/overview), Facebook, Twitter 等，甚至还可以是 Siri，可穿戴设备，或是车载导航系统。

看到这里，是不是冒出了很多想法，不要犹豫，开始尝试吧~

### 题外话
最近 DAOCloud 上服务起一天就被停了，停还不给提醒，好恶心，一毁原先的好印象，到年底原 DAOCloud 上的应用就不再维护了。

个人博客已经从 DAOCloud 搬到自己新买的域名 [discipled.me](http://discipled.me)。

> 如何省钱地买域名可以参考知乎上的这个[回答](https://www.zhihu.com/question/19551906/answer/31986656)。  
> 当然，不差钱的可以直接点[这里](https://www.domcomp.com/?refcode=5838446c1700002750e1f877)，童叟无欺。

由于，刚换域名，没 google 索引，也不知道这次加的结构化数据有没有效果 (￣▽￣) ~

今天冬至，吃肉去...ㄟ(▔,▔)ㄏ
