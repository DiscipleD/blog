> 本文主要讲述如何将 webpack 版本升级至 v2.2.x，如果你还不了解 webpack，那么推荐你先一下这篇[文章](https://blog.madewithenvy.com/getting-started-with-webpack-2-ed2b86c68783)。

今年年初，webpack 2.2.0 版本正式发布，还记得那时已有很多文章来介绍 webpack 2。 但经历过之前，先将默认安装升级至 2.0.x-beta 又退回 1.x 的我来说，吃一堑长一智，便决定再观察看看。

经过这几个月的时间，并没有什么大新闻发生，应该不会再闹乌龙了，便把公司项目和自己博客都试着升级一波看看效果。

## 为什么要升级至 Webpack2
你可能会问 webpack1 用得好好的为啥要去升级成 webpack 2 哪？有啥好处？是不是又在瞎折腾了？

当然不是在瞎折腾，因为 webpack2 最大一个好处就是 Tree Shaking(摇树)，这也是年初 webpack2 火了一把的最大原因。

使用 webpack2 还有没有其他好处哪？当然是有的。

除了 Tree Shaking 之外，webpack2 还支持了 ES6 的模块语法，单就这一点已经不需要 babel 了，当然如果你要用其他一些新特性，还是得加入 babel-loader。

与此同时，webpack2 还支持使用 `System.import` 来动态加载模块。不过，使用此功能时要注意，对不支持 `Promise` 的浏览器需要添加 polyfill。

再加之，webpack 已经正式弃用 webpack1，也就不再维护了。从长期的角度考虑，升级到 webpack2 也更加稳妥。

知道了为啥升级，接着就来看看如何升级。

## 主要变化和注意点
如何从 v1 升级至 v2，webpack 官网的[升级手册](https://webpack.js.org/guides/migrating/#uglifyjsplugin-sourcemap)已经介绍的非常详细了，基本先过一遍，然后遇到问题再搜索一下就能搞定。（英文不好的童鞋也不用担心，已经有人翻译了[中文版](https://segmentfault.com/a/1190000008181955)）

这里就不再一一赘述升级变更点了，主要按常用功能整理、分享一下 webpack2 升级后的变化，以及一些升级时遇到的问题。

首先，来看看升级前的配置文件。（由于篇幅原因省略了一些重复性的配置，有兴趣的可以到 Github 上[查看详细内容](https://github.com/DiscipleD/blog/commits/master/config/webpack/base.js)）

```JavaScript
// base.js
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SOURCE_PATH = path.join(__dirname, '../../src');
const DIST_PATH = path.join(__dirname, '../../build/client');

const webpackConfig = {
	// http://mp.weixin.qq.com/s?__biz=MzI3NTE2NjYxNw==&mid=2650600472&idx=1&sn=d4bf85c1bb26a32aff144e81d652582f
	devtool: 'source-map',
	output: {
		path: DIST_PATH,
		publicPath: '/'
	},
	resolve: {
		alias: {
			'vue': 'vue/dist/vue.js',
			'assets': SOURCE_PATH + '/client/assets',
			// 省略其他 alias...
		},
		extensions: ['', '.js']
	},
	eslint: {
		configFile: '.eslintrc',
		emitWarning: true,
		emitError: true,
		formatter: require('eslint-friendly-formatter')
	},
	postcss: [autoprefixer({browsers: ['last 2 versions']})],
	plugins: [
		new ExtractTextPlugin('style-[contenthash:8].css'),
		new webpack.NoErrorsPlugin()
	],
	module: {
		preLoaders: [
			{
				test: /[^(\.min)]\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules/,
				include: SOURCE_PATH
			}
		],
		loaders: [
			{
				test: /[^(\.min)]\.js$/,
				loaders: ['babel'],
				exclude: /node_modules/,
				include: SOURCE_PATH
			},
			{
				test: /\.html$/,
				loader: 'html',
				query: {interpolate: true},
				exclude: /node_modules/,
				include: SOURCE_PATH
			},
			{
				test: /\.(sc|c)ss$/,
				// extract css file from js file, that will reduce the js file size and optimize page loading.
				// but it will increase the package time, so it should be only used in build file.
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
				// loaders: ['style', 'css', 'postcss', 'sass']
			},
			// 省略其他 loader...
		]
	}
};
```

由于之前博客已[升级成同构应用](https://discipled.me/posts/ssr)，webpack 的配置被分为了客户端和服务器端两套，上面这个文件便是两套配置中共通的部分。除了没有设置 `entry`，一个基本的 webpack 配置就同它差不多，升级 webpack2 也不需要修改 `entry`，也就正好不用列出了。

接着就一个个来看，这些基本、常用的配置属性，有哪些不要改，有哪些要改的。

一开始就是个好消息，两个属性 `devtool` 和 `output` 和原有保持一致不用修改。

### resolve
接着是 `resolve`，`resolve` 的变化也不大，主要是其中两个字段的变化，`root` 和 `extensions`。

* `root` 改为了 `modules`，用于设置 webpack 查询模块的路径，默认是 `["node_modules"]`。  
同时，搜索模块的优先级与数组的顺序有关，越靠前的越先匹配，比如 `[path.resolve(__dirname, "src"), "node_modules"]`，此时，webpack 查找模块时会优先查找本地 src 下的模块，查不到再到 `node_modules` 中查找。
* `extensions`，用于设置 webpack 处理的扩展名，默认值为 `[".js", ".json"]`。  
这里就牵扯到 2 个变更点：
	1. 升级后就不用像 v1 一样添加一个空字符串 `""` 了；
	2. v2 自带 `json-loader` 来处理 `json` 类型的文件，而不须我们自己手动引入。  

这两个配置大部分情况下使用默认值（不配置）就可以了。但在 react 或 vue 的项目中，可能需要在 `extensions` 中添加 `.jsx` 或 `.vue`。 

接着两个是 `eslint` 和 `postcss`，属于自定义属性，在 webpack2 中不支持自定义属性，需要挪到各自的 `loader` 中进行配置。

既然，遇到了 `loader` 相关，下一步就先升级 `loader`。

### module
在 webpack 中，`module` 下不再有 `preLoaders`, `loaders` 或 `postLoaders` 统一都变成了 `rules`，如需要替换 `preLoaders` 或 `postLoaders` 则需通过设置 `rules.enforce` 属性。

同时，webpack2 不再支持 `loaders`，改为 `rules.use`，`loader` 属性可以继续使用。`loader` 相关的配置，可以通过 `rules.use.options` 设置。

还有一点，在 webpack2 中，已不再默认给 loader 添加 `-loader` 后缀，不过还可以通过将 `resolveLoader` 设置为 `moduleExtensions: ["-loader"]` 来给 loader 添加默认后缀。不过，webpack 官方是不推荐这么作的。

这部分可以算是 webpack2 升级过程中改动量最多的地方了。但别担心，这只是个有点麻烦，细心一点就能解决的问题。

还剩下最后一个部分，`plugin` 在来看一下它的变化。

### plugin
`plugin` 部分 webpack2 有着一下这些变化：

* 新增 `LoaderOptionsPlugin`，用于设置全局的 `loader` 和 `plugin` 属性
* 默认引入 `OccurrenceOrderPlugin`，也就是可以删了原先的这个配置
* `DedupePlugin` 也被移除
* `NoErrorsPlugin` 重命名为 `NoEmitOnErrorsPlugin`
* `UglifyJsPlugin` 不再默认压缩 js，需在 `LoaderOptionsPlugin` 配置 `minimize: true`

这样升级就基本完成了，再来看一下修改后的配置文件。

```
// base.js
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SOURCE_PATH = path.join(__dirname, '../../src');
const PUBLIC_PATH = '/';
const DIST_PATH = path.join(__dirname, '../../build/client');

const webpackConfig = {
	// http://mp.weixin.qq.com/s?__biz=MzI3NTE2NjYxNw==&mid=2650600472&idx=1&sn=d4bf85c1bb26a32aff144e81d652582f
	devtool: 'source-map',
	output: {
		path: DIST_PATH,
		publicPath: PUBLIC_PATH
	},
	resolve: {
		alias: {
			'vue': 'vue/dist/vue.js',
			'assets': SOURCE_PATH + '/client/assets',
			// 省略其他 alias...
		}
	},
	plugins: [
		new ExtractTextPlugin('style-[contenthash:8].css'),
		new webpack.NoEmitOnErrorsPlugin()
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'eslint',
				enforce: 'pre',
				exclude: /node_modules/,
				options: {
					emitWarning: true,
					emitError: true,
					formatter: require('eslint-friendly-formatter')
				}
			},
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/
			},
			{
				test: /\.html$/,
				loader: 'html?interpolate',
				exclude: /node_modules/
			},
			{
				test: /\.(sc|c)ss$/,
				// extract css file from js file, that will reduce the js file size and optimize page loading.
				// but it will increase the package time, so it should be only used in build file.
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						'css-loader?sourceMap',
						{
							loader: 'postcss-loader?sourceMap',
							options: {
								plugins: () => [autoprefixer({browsers: ['last 2 versions']})]
							}
						},
						'sass-loader'
					]
				})
			},
			// 省略其他 loader...
		]
	}
};
```

不要以为这就完了，勿忘初心。这只是成功升级了 webpack，还没用上 Tree Shaking 哪。

### Tree Shaking & Module
想要使用 webpack2 的 tree shaking 就需要让 webpack 来管理模块之间的加载，而不是让 `babel-loader` 去处理。

不过，这修改起来也很简单，只需修改 babel 的配置文件 `.babelrc`，将原先的 `es2015` 改为 `["es2015", { "modules": false }]` 就可以了。

在公司项目升级 webpack 修改模块引入方式时，还遇到过 `Module build failed: some file... TypeError: Cannot read property '0' of null` 这样一个问题，折腾了半天。最后发现是原先的 `babel-plugin-antd` 报出的问题，升级成 `babel-plugin-import` 就解决了.

> 升级 webpack 后，记得同时升级所用到的 loader 和 plugin。

这样升级基本完成了，对比一下升级前后的打包结果。

![build with webpack1](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/upgrade-to-webpack2/build-with-webpack1.png)

![build with webpack2](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/upgrade-to-webpack2/build-with-webpack2.png)

可以看到，app.js 小了不到 8kb，减小了 10%，而 common.js 反而大了 12kb，都没改代码啊~[捂脸]

总得来说，将 webpack 从 v1 升级至 v2，主要修改 `resolve`, `module` 和 `plugin` 这 3 个属性，而且主要是一些字段名的修改，整体结构上没有大的变化，升级还是比较简单的，是个耐心活。

至此，博客 2 代成员（vue2 和 koa2）中又多了一位 webpack2...😂

> 相关阅读：[Why Webpack 2's Tree Shaking is not as effective as you think](https://advancedweb.hu/2017/02/07/treeshaking/)