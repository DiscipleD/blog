> 系列文章：
> 
> 1. [Service Workers 和离线缓存](https://discipled.me/posts/service-workers)
> 2. [Notification with Service Workers push events](https://discipled.me/posts/notification-with-sw-push-events) 
> 3. PWA：添加应用至桌面及分享(本文)

继上两篇[离线缓存](https://discipled.me/posts/notification-with-sw-push-events)和[发送通知](https://discipled.me/posts/service-workers)之后，这篇是 PWA([progressive web apps](https://developer.mozilla.org/en-US/docs/Web/Apps/Progressive)) 相关的第三篇，也是计划中的最后一篇。

这篇将讲述如何为应用添加两个小功能——添加应用至桌面和分享。虽然，这两个功能实现起来相当简单，可以说是没有什么代码量，但是，不要小看了这两个小功能，它们有可能会改变大格局。

本篇主要包含以下内容：

* [添加应用至桌面](#add-to-home-screen)
* [Web Share API](#web-share-api)
* [Bullshit or Prediction](#bullshit-or-prediction)

<a name="add-to-home-screen"></a>
## 添加应用至桌面
如果，你想要为你的网站添加添加到桌面这个功能，那么，你的网站只需满足以下 3 项就足够了：

* 包含一个 `manifest.json` 文件，其中包含 `short_name` 以及 `icons` 字段
* 包含 service sorkers
* 使用 HTTPS（这个好像是废话，既然使用了 service workers，那肯定已经基于 https了）

除此之外，chrome 会替你处理。

从上面 3 点可以看到，如果你的应用已经是个 PWA 应用的话，那么，第二，第三点就已经满足了，添加至桌面的功能其实只需为项目添加一个描述性的配置文件 `manifest.json` 就可以了。

那 `manifest.json` 这东西到底是啥？

它是 PWA 的一部分，是一个 JSON 格式的文件用来描述应用相关的信息，目的是提供将应用添加至桌面的功能，从而使用户可以无需下载就可以如应用一般从桌面打开 web 应用，大大增强用户体验和粘性。

[manifest](https://w3c.github.io/manifest/) 正处于 W3C 的草案阶段，并且 Chrome 和 Firefox 已经实现了这个功能，微软系也在开发中，只剩苹果系还在考虑。（大致和 service workers 的进程一样）

知道了 manifest 是什么，接着就来看一下它怎么用，也就是可以配置哪些字段：

* `short_name`: 应用展示的名字
* `icons`: 定义不同尺寸的应用图标
* `start_url`: 定义桌面启动的 URL
* `description`: 应用描述，可以参考 meta 中的 description
* `display`: 定义应用的显示方式，有 4 种显示方式，分别为：
	* `fullscreen`: 全屏
	* `standalone`: 应用
	* `minimal-ui`: 类似于应用模式，但比应用模式多一些系统导航控制元素，但又不同于浏览器模式
	* `browser`: 浏览器模式，默认值
* `name`: 应用名称
* `orientation`: 定义默认应用显示方向，竖屏、横屏
* `prefer_related_applications`: 是否设置对应移动应用，默认为 `false`
* `related_applications`: 获取移动应用的方式
* `background_color`: 应用加载之前的背景色，用于应用启动时的过渡
* `theme_color`: 定义应用默认的主题色
* `dir`: 文字方向，3 个值可选 `ltr`(left-to-right), `rtl`(right-to-left) 和 `auto`(浏览器判断)，默认为 `auto`
* `lang`: 语言
* `scope`: 定义应用模式下的路径范围，超出范围会已浏览器方式显示

需要注意的是自 `background_color` 开始的属性只有[部分浏览器支持](https://developer.mozilla.org/en-US/docs/Web/Manifest)。

如果，你不知如何设置这些值，你可以试一试 [Manifest Generator](http://brucelawson.github.io/manifest/)，它会一步步指引你生成一个包含应用主要信息的 `manifest.json` 文件。

除了以上列举的这些值，可能还包含其他一些某些浏览器特定的值，比如[上一篇](https://discipled.me/posts/notification-with-sw-push-events)中提到的 `gcm_sender_id`, `applicationServerKey` 用于 chrome 下订阅服务器消息。

下面就是项目 `manifest.json` 最终的样子。

```
// manifest.json
{
  "dir": "ltr",
  "lang": "en",
  "name": "D.D Blog",
  "scope": "/",
  "display": "standalone",
  "start_url": "/",
  "short_name": "D.D Blog",
  "theme_color": "transparent",
  "description": "Share More, Gain More. - D.D Blog",
  "orientation": "any",
  "background_color": "transparent",
  "related_applications": [],
  "prefer_related_applications": false,
  "icons": [{
    "src": "assets/img/logo/size-32.png",
    "sizes": "32x32",
    "type": "image/png"
  }, {
    "src": "assets/img/logo/size-48.png",
    "sizes": "48x48",
    "type": "image/png"
  } //...
  ],
  "gcm_sender_id": "...",
  "applicationServerKey": "..."
}
```

生成后的文件可以通过 [Web Manifest Validator](https://manifest-validator.appspot.com/) 进行验证。验证通过后，把它加入到项目，再次访问就会有添加到桌面的提示。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/pwa-installable-and-share/add-to-home-screen.jpeg)

确定之后就能在桌面上看到了应用图标了。失手点了关闭也没有关系，可以通过 chrome 右上角的 `...` -> `Add to Home sceen` 手动添加。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/pwa-installable-and-share/home-screen.jpeg)

点击添加桌面后，如果发现桌面没有应用图标，确认 chrome 是否有添加桌面快捷方式的权限。

另外，通过[媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/CSS/%40media/display-mode)可以根据不同的 `display` 模式来应用不同的 CSS 样式。

还有一点需要特别注意，用户将应用添加到桌面后，你修改 `minifest.json` 文件将不会生效，除非用户重新将它添加到桌面，所以，尽量还是一步到位。

如果这篇到这里就结束就未免有点太短了，有点不太符合我有事没事往长里写的风格。前一阵正好看到一篇关于 web 分享 API 的[文章](https://github.com/xitu/gold-miner/blob/master/TODO/why-do-we-need-a-new-api.md)，虽然，它不属于 PWA 的一系列技术中，但它实现的功能和理念与 PWA 相当相似——渐进式地提供功能。这里就放在一起讲一讲，也顺便给自己的博客添加这个功能。

<a name="web-share-api"></a>
## Web Share API
Web Share API 和 PWA 一样是一项由古哥提出的[草案](https://github.com/WICG/web-share)，现还未被纳入 W3C。通过 Web Share API，用户可以方便地将内容或数据分享到应用中。

不过，现在只有安卓 Chrome 55 以上支持 Web Share API。另外，要使用分享功能，还要满足以下几点：

* 网站必须基于 HTTPS
* 注册 [Origin Trial](https://github.com/jpchase/OriginTrials/blob/gh-pages/developer-guide.md)，并将生成的 token 加入页面 meta 中
* 提供 `text` 或 `url` 中的一项，且值必须为字符串
* 分享事件必须由用户事件触发

满足了这些剩下的就很简单了，只需监听用户事件，然后将需要分享的内容传递给 Web Share API 就可以了。

```
// CommonService.js
export const isSupportShareAPI = () => !!navigator.share;

export const sharePage = () => {
	navigator
		.share({
			title: document.title,
			text: document.title,
			url: window.location.href
		})
		.then(() => console.info('Successful share.'))
		.catch(error => console.log('Error sharing:', error));
};
```

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/pwa-installable-and-share/web-share.jpeg)

如果，你的网站设有[元数据](https://discipled.me/posts/structure-data)，那么，分享的内容可以从网页元数据中获取。

由于，Web Share 是由 chrome 团队单方面提出，即使是在 chrome 下也是实验性支持，之后是否会永久支持尚未定论，不排除以后不再支持的可能。

这次分享的两个功能：添加到桌面和分享至应用就这样搞定了，加之前两次分享的离线缓存以及推送通知，就完成了现有 PWA 应用所包含的全部功能。

<a name="bullshit-or-prediction"></a>
## Bullshit or Prediction
总体来说，实现 PWA 的功能并不困难，甚至可以说是简单。但就如同文章之初所说，这可能是一个影响移动端格局的技术。在此之前，web 技术只用应用于浏览器中，无论做什么之前都得先打开浏览器。然而，PWA 所提供添加至桌面、推送消息及离线缓存这些功能，使得对用户来说网页应用和移动应用真的是分不清楚，也不必分清楚...

当然，要使用户有使用应用的感觉，这里就得提一提另一个东西，那就是设计。在将网站转换为 PWA 的同时，这个转变不应只发生在 JS 方面，用户感受最明显的还是网站的外观，也就是用户界面。界面设计也应随着网站转换成 PWA 而进行重新设计，从而给用户真正带来类应用的体验。我个人认为如果 PWA 顺利推行，那么，网站的界面设计同时也会迎来一次巨大革新，就如同之前 jsp 到单页应用般巨大的改变。

不过，这里还是得浇一盆冷水，鉴于我国网络现状，我同[这篇回答](https://www.zhihu.com/question/46690207)中的观点基本一致，就我国苹果机的占比来说，如果苹果不支持 PWA，那么，它也就只有自己拿来玩玩了。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/pwa-installable-and-share/ditou.jpg)

倘若，苹果也加入到 PWA 的行列，浏览器兼容性不再成为障碍时，JS 必然会正真改变前端与移动端之间的格局，再加之 [AOT(ahead-of-time)](http://asmjs.org/spec/latest/) 与 [WebAssembly](http://webassembly.org/) 为 JS 带来的性能上的突破，JS 将撼动所有领域，从移动端（PWA），到[桌面应用](https://github.com/electron/electron)，[物联网](https://www.postscapes.com/javascript-and-the-internet-of-things/)，[VR](https://github.com/mrdoob/three.js)，[AR](https://github.com/aframevr/aframe)，[游戏](http://www.jianshu.com/p/0469cd7b1711)，乃至[人工智能](https://github.com/karpathy/convnetjs)[等等](https://www.zhihu.com/question/20796866)，画美不看。

妄言或许会成预言。

> Atwood's Law: any application that can be written in JavaScript, will eventually be written in JavaScript.

我们正处于一个前端最好的时代，未来可期...

扯了这么多，最后当然还是希望对本人博客有兴趣的小伙伴可以试一试这次分享的两个功能，把我的博客添加到桌面并分享给自己的小伙伴们。🤗

支持离线查看噢（得先访问过），没网的时候也能涨姿势了哪...(不用连啥花生 wifi 之类的了[手动滑稽])