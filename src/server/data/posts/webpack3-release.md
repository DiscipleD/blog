在之前的[文章](https://discipled.me/posts/upgrade-to-webpack2)里，就提到了因为年前版本回退的原因，我特意推迟了升级 webpack，就怕它又搞什么大新闻。

然而，没想到还是中了圈套，webpack2 坚挺了还不到半年，就迎来了它的替代者。

就在一周前 [webpack3 正式版发布了](https://medium.com/webpack/webpack-3-official-release-15fd2dd8f07b)！

这次版本升级的主要原因有以下几点：

* webpack 内部实现变化
* 新增了模块串联功能。之前，webpack 会为每个模块创建各自的闭包，使用串联功能将模块连接到一起后，就只需为这真个模块创建一个单独的闭包，从而减少不必要的代码
* 增加动态加载注释，即可为动态加载定义 chunk 名

最最最重要的一点是不用修改任何配置就能从 webpack2 升级至 webpack3，这总算让我上个月的升级没有白费，至少 98% 的用户是这样。

既然，不用改代码就能升级，又能大幅减小输出文件大小，那就升一波看看效果。先看一眼升级前的打包结果，

![before update](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/webpack3-release/before-update.png)

现在，通过 npm 命令默认安装的已经是 3.0.0 的版本。升级的话，因为是大版本，所以别忘了先改 package.json 里面的依赖版本。

升级之后直接跑命令，顺利打包。（谢天谢地，不是那 2%。）

![after update](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/webpack3-release/after-update.png)

只是多了一个 warning。

```JavaScript
DeprecationWarning: Chunk.modules is deprecated. Use Chunk.getNumberOfModules/mapModules/forEachModule/containsModule instead.
```

这是由一些 webpack plugin 引起的，比如：`extract-text-webpack-plugin` 等。不过，不用理它。首先，它不影响打包，其次，已经有人提了 [pr](https://github.com/webpack-contrib/extract-text-webpack-plugin/pull/543)。

结果看上去是不是和之前基本一样？不要着急，那是因为还没有用上模块串联的功能。开启模块串联的功能需要在配置中简单的加一个 plugin。

```JavaScript
	plugins: [
		// ...
		new webpack.optimize.ModuleConcatenationPlugin()
	]
```

再看一眼结果，

![build with module concatenation plugin](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/webpack3-release/build-with-module-concatenation-plugin.png)

什么~app.js 只小了 3 kb（5%），广告果然都是骗人的，不管国内还是国外...😔（难道姿势不对，升级了的朋友都说说小了多少）

这样 webpack 3 升级就完成了，也用上了新特性，总得来说这次升级在文件大小以及打包时间上还是有所优化的，再加之升级的 effort 几乎为 0，还是非常值得一试的。

PS：ESlint 也发布了 [4.0 版本](http://eslint.org/blog/2017/06/eslint-v4.0.0-released)。
（前端界一个个都是版本大佬）

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/webpack3-release/dalao.gif)