# Vue v2.3.0 ssr 升级手册
不久前，vue 升级至了 2.3.0 版本，是一个 minor 的版本。[该版本](https://github.com/vuejs/vue/releases/tag/v2.3.0)除了一些组件功能的优化之外，主要是升级 vue 的 ssr 功能，甚至于为之建立了一个独立的 [Git Book](https://ssr.vuejs.org/en/)。

我的博客之前用的就是 ssr，这次升级自然也是要尝试一把。ssr 的优势和实现在这里就不再赘述了，不太了解的可以看[之前的文章](https://discipled.me/posts/ssr)，这里主要还是来看看升级的变化之处。

升级的第一件事自然就是先升级依赖，将 vue, vue-server-renderer 等依赖的版本升级至最新 `npm up -S`（作者 vue 的版本为 v2.3.3）。升级之后，直接启动服务看看，应该是没有问题的，文档也提到可以使用之前的配置，但建议改为新版本的方式。

虽然，依赖升级之后同样能运行，但还是来看看有哪些提升或变化的地方？

### Renderer Create Options
更新之后，在创建 renderer 时可以为它添加配置，其中的 `template` 属性可以为我们省去之前的许多繁杂的小工作，比如：

* 在 html 中使用 `<!--vue-ssr-outlet-->`，renderer 会自动将 app 生成的 html 插入此处，而不用自己再进行替换操作
* 将 `context.state` 插入到 html 中，并自动使用 [serialize-javascript](https://github.com/yahoo/serialize-javascript) 进行转义来防止 XSS 攻击
* 直接通过 `cache` 属性配置组件缓存

以上这些都是在之前版本中常被使用到的，剩下一些 `clientManifest`, `inject`, `runInNewContext` 等新增的东西后面会再提到。

### Lifesycle & data prefetch
由于在 ssr 阶段不会有一系列的变更，所以更新之后 vue 在 ssr 阶段只会执行 `beforeCreate` 和 `created` 这个两个生命周期函数。

相信你一定会问那如果遇到异步请求该怎么办哪？这里同之前并没有变化，仍旧是通过设置组件的自定义方法来获取数据，最终通过 vuex 将数据传递回客户端。没什么变化就不展开了，不清楚的可以看一下[文档](https://ssr.vuejs.org/en/data.html)，写得已经相当详细了。

不过此处有一点优化，由于数据已经在服务器端已准备完成，客户端就无需再像服务器端发送异步请求，而是可以直接从 store 中获取数据。

### 代码结构与同构
文档的[这一节](https://ssr.vuejs.org/en/structure.html)在内容上和之前的文档基本没有区别，不过其中提到一点指出了我原有代码的不足之处，也给了我不少启发。

通常大家的 app.js 会是这样

```JavaScript
// 省略其他依赖...
import store from './vuex';
import router from './router';

sync(store, router);

const app = new Vue({
	store,
	router,
	render: h => h(/* ... */)
});

export {app, router, store};
```

这看上去并没有任何问题。在平时的浏览器环境中，每次刷新页面都会重新加载一次文件，是一个全新的环境（或沙盒）。但当同构了代码之后，服务器端同样运行这段代码时，就可能出现问题。

因为 node 端服务启动后，vue 的实例就被初始化完成，所有的请求会公用这同一个实例，这就可能造成混乱。所以为每个请求返回一个新的 vue 的实例是一个比较好的处理方法，router 和 store 同样适用这个道理。

```JavaScript
// 省略其他依赖...
import createStore from './vuex';
import createRouter from './router';

const createApp = () => {
	const store = createStore();
	const router = createRouter();

	sync(store, router);

	const app = new Vue({
		store,
		router,
		render: h => h(/* ... */)
	});

	return {app, router, store};
};

export default createApp;
```

虽然，我至今还没有遇到过实例冲突的问题，不过我还是觉得文档说的很有道理，可能会发生这样的情况。多个实例会克服冲突的问题，但它同时也增加服务器的负担。

这样处理之后，就可能将之前提到的 `runInNewContext` 配置设为 `false`，默认为 `true` 会为每个 bundle 创建新的上下文。

### Webpack build plugin
升级的最大变化在于对 webpack 提供更强大的支持，在 `vue-server-renderer` 包中新增了两个 webpack plugin: `server-plugin` 和 `client-plugin`，分别用于服务器端和客户端。

`server-plugin` 会默认创建一个名为 `vue-ssr-server-bundle.json` 的文件，用于作为 `createBundleRenderer` 的第一个参数。不过，还是建议定义一个 `output.filename`，这样在读取 bunldle 时也能直接从配置中获取。

上面这点上一个版本就能做到，使用 `server-plugin` 的好处是在于，它提供 `source-map` 和 `hot-reload` 的功能。不过，本人之前用的 webpack-middleware 似乎也支持 `hot-reload`，再加之这个 plugin 同 webpack-middleware 结合起来有问题，容我后面再仔细研究一下...

如果你使用过升级之前 vue ssr 的功能，那你肯定会对一系列有关 html 的操作有映象，比如替换 html，插入 state 等。现在，有了 `client-plugin` 它就能代替原有的 `html-webpack-plugin` 来生成 html，并把之前那些繁杂的事都替你处理了。

上面这些对已经实现 ssr 的你可能不是很有吸引力，不过，下面这点可能会让你感兴趣。这个插件还自带为你的 ccs 或 js 添加 `preload` 和 `prefetch` 功能，它可以加快你网站的加载速度，如果你还不清楚 `prefetch` 和 `preload` 是什么的话，可以先读一下[这篇文章](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)。

如果你使用的是 webpack-server，那么，你按文档上的例子来应该没什么问题。但如果你和我一样使用的是 webpack-middleware，那么，这里还是有些别扭的，需要和之前一样每次 plugin 生成后去重新构建 renderer。

```JavaScript
clientCompiler.plugin('done', () => {
	const clientManifestFileName = '/vue-ssr-client-manifest.json';
	const filePath = path.join(clientConfig.output.path, clientManifestFileName);
	const options = {
		clientManifest: JSON.parse(expressDevMiddleware.fileSystem.readFileSync(filePath, 'utf-8'))
	};
	createRenderer(mfs.readFileSync(outputPath, 'utf-8'), options);
});
```

还有文件读出来的是 string，你要将它转换为对象。其他基本的配置按文档上的来就行，遇到问题的可以参考下我的[代码](https://github.com/DiscipleD/blog)。

吹了这么多，不足之处还是得指出来，`client-plugin` 还不能像 `html-webpack-plugin` 监听 html 文件，每次修改 html 都得手动重启服务有点麻烦，可以优化一波...

升级所要注意的就差不多就这些了。还有一点，之前 vue 推荐使用 `renderToStream` 来返回页面，如果组件生命周期中有请求的话，使用 stream 可能导致组件还未构建完成就已经发送。所以，更新之后 vue 推荐使用 `renderToString`。

## 结尾
vue 的确是非常紧跟潮流，就像这次加入的 `preload` 和 `prefetch` 功能，但因开发团队人员太少（相对于 react 和 angular），导致版本并不是很稳定。

如果，你问我 vue 好不好？我会说，好。  
如果，你问我要不要学 vue？我会说，学。  
如果，你问我 vue 能不能上生产？我的建议是，不如咋们半年后再谈...

------------------------------------------

外公，一路走好...
