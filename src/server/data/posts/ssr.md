> 系列文章:
> 
> 1. [Vue 2.0 升（cai）级（keng）之旅](http://discipled.me/posts/troubleshooting-of-upgrading-vue)
> 2. [Vuex — The core of Vue application](http://discipled.me/posts/vuex-core-of-vue-application)
> 3. From SPA to SSR (本文)

个人博客之前已经将 vue-router 的模式改为了 `history`，即 url 中不包含 `hash`，再通过将所有的静态请求转发到 index.html，使它看上去似乎像一个静态多页的网站。

然而，它其实和其他的 SPA (Single Page Application 单页应用)来说没有任何的区别，最终是通过前端的路由去控制页面的显示。单页应用虽然在交互体验上比传统多页更友好，但它也有一个天生的缺陷，就是对搜索引擎不友好，不利于爬虫爬取数据。

正所谓成也萧何，败也萧何。

讲人话就是，搜索引擎搜不到我的博客啊~哭...

那什么对搜索引擎和爬虫友好的哪？答案就是静态页，而非浏览器渲染，这就需要服务器直接渲染，也就 SSR(Server Side Render)。

![当然不是这个 SSR](https://o7nu3cbe9.bkt.clouddn.com/blog/ssr/ssr.jpg) 

SSR，服务器渲染。简单来说就是，服务器将每个要展示的页面都运行完成后，将整个相应流传送给浏览器，所有的运算在服务器端都已经完成，浏览器只需要解析 HTML 就行。

说起来简单，那到底该如何着手将项目改造成 SSR，和曾经的多页又有什么区别哪？既然自己在 SSR 方面是个小白，自然要先从查资料看文档入手，Vue 2.0 的文档中有一章就是关于 [SSR](https://vuejs.org/v2/guide/ssr.html)。

看了文档之后，它给了我一个新思路，可以在无须大幅修改原先代码的情况下做到 SSR，又不失单页良好的体验。

听上去很酷是不是，具体怎么做继续看下去。

## SSR Architecture

一个普通的单页应用通常是通过 webpack 将源代码打包后插入到 html 中，当页面请求时，返回 html 再加载打包后的 js 文件，也就是下图中的 Application Code，Webpack build 和 browser 这三大块。

![SSR Architecture](https://o7nu3cbe9.bkt.clouddn.com/blog/ssr/ssr-architecture.png)

剩下的那几部分就是 SSR 需要额外新加的部分，一个个来看。

### Server entry & Client entry

Server entry & client entry 两者的有共同的词尾 entry，对应的是 webpack.config 中的 entry，即打包入口文件，也就是分别代表服务器端所运行代码的入口和浏览器端所运行代码的入口文件。

入口文件自然不用多复杂。

* server entry: 根据路由状态，返回渲染完成后相应的组件
* clinet entry: 将应用直接挂载到 DOM 上

OK。它俩的事就做完啦，是不是很简单。

### Webpack build

有了不同的 entry，打包的内容也有不同，自然就要两套配置。

配置 webpack 的配置文件的确很麻烦，但有个好消息就是原先的打包文件不需要修改，只需加一个 server 端的配置文件就可以了。server 端的配置文件也相当简单，基本可以沿用客户端的配置，改改 `entry` 和 `output` 基本就差不多了。

不过，有一点要注意，一定要将 `target` 属性设置成 `node`，不然打包完了也没法在 node 环境下跑。还可以将所有依赖都设置成 `externals`（跑在服务器本地嘛，依赖自然都拿得到），这只是个优化点，不加也没有任何问题。

有了配置文件，也就能生成 Server Bundle 了，只剩下最后一块 Bundle Renderer 了。

### Bundle Renderer

到这里才要用上 vue 为支持 ssr 所依赖的库 `vue-server-renderer`。

通过 `vue-server-renderer` 提供的 [API](https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md) 就能容易地根据 url 生成对应的组件树，然后将它返回给客户端。

这里要注意，因为用的是 webpack 打包后的文件，所以只能用 `createBundleRenderer` 而不能用 `createRenderer` 来创建 renderer。

创建 renderer 的时候还可以为它配置 cache，方法在 [README](https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md) 中也写得很清楚了，由于我个人博客的场景不适合添加 cache 就没有添加。

这样从 SPA 到 SSR 的变更就完成了，通过浏览器访问看看是不是已经将页面整个返回了。

### Tips

* 遇到控制台 ⚠️

> The client-side rendered virtual DOM tree is not matching server-rendered content. 

当然，可能是你的标签不对应，也有可能是 text node 中的空格字符长度不对应，我个人遇到的都是空格不对应造成的问题，很是尴尬（可能是使用 template 语法造成的）...

* Memory-fs

在开发环境下，由于使用服务器渲染，自然不能使用 webpack-dev-server，而是要用 webpack-dev-middleware。然而，webpack-dev-middleware 所创建的文件都是在内存里的，server 就无法读到 server bundle 文件，这里就要用到 [memory-fs](https://github.com/webpack/memory-fs) 来从内存中读文件。

* KOA 2

用 koa 2 作为服务器时，在 `renderToString` 或 `renderToStream` 时，记得外面要加 `await`，否则，程序就不等组件渲染好，就直接跑下个 middleware 去了。

(奉劝大家不要用 koa 作 SSR 服务器，koa 和 webpack-dev-middleware 天生水土不服，不要问我为什么~😭)

* document

在 Server 端渲染时，node 环境下是没有 document 对象的。当一个界面的显示依赖于 document 对象（比如，页面滚动监听事件），那么，在 node 端运行时就会报错。

这时，有两个解决的办法。

1. 根据运行时的环境变量，通过添加逻辑来判断是否依赖 document
2. 使用 jsdom mock document 对象（个人偷懒的做法）

当然，从设计的角度移除对 document 的依赖就最好啦。

* $root._isMounted：组件中可以用这个参数来判断应用是否为第一次挂载

### 完成
这样当浏览器请求时，返回的页面是服务器渲染之后的，浏览器解析后，页面仍就是一个单页应用。

最后，看效果的戳[这里](http://discipled.me/)，看代码的戳[这里](https://github.com/DiscipleD/blog)，原先 SPA 的代码依旧保留在了 [SPA 分支](https://github.com/DiscipleD/blog/tree/SPA)。

对 Vue SSR 有兴趣的童鞋，一定要看看 [vue hackernews 2.0](https://github.com/vuejs/vue-hackernews-2.0)，大神的水准比我可是高多了。

最后的最后，吐槽下 Daocloud，最近老挂我服务器，枉我一直为它说好话。

自己写完，看看感觉好简单，为什么还搞了那么久...

![](https://o7nu3cbe9.bkt.clouddn.com/blog/ssr/transfixed.jpg)

常言道：饭不能一日不吃，博客不能一月不发...差点就破例了（🏃
