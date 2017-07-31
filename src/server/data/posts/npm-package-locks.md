上一篇文章中提到了几个前端界的版本大佬，这不，上个月 Node 又发布了 [8.0 版本](https://nodejs.org/en/blog/release/v8.0.0/)。

Node 8 这次升级有哪些令人眼前一亮的新特性？

* 新增了 [Node.js API (N-API)](https://nodejs.org/api/n-api.html)
* 新增了 `util.promisify()`，用于将原有的 callback 形式的函数 Promise 化（相信是个神器...）

不过，这些都不是今天的重点，今天的主角另有其人。

## Npm 5
最近，正好有一个小项目需要用到 node 服务，也就正好升级一波尝尝鲜。

Node 的升级通常会伴随着 npm 的升级，这次也没有例外。升级至 node 8 以后，npm 也自动升级至了 5。

一开始也没有在意，但当安装完依赖之后，我们的主角登场了...

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/npm-package-locks/debut.gif)

项目下面多了一个文件 `package-lock.json`。

心中瞬间迸发出一个想法：窝艹，这不是 [yarn](https://github.com/yarnpkg/yarn) 嘛~

赶紧学习一波看看。

这不看不知道，一看才发现这次 npm 5 还是有着许多的[变化](http://blog.npmjs.org/post/161081169345/v500)。

首先，重写了 cache，不推荐手动清除 npm cache。以前那种安装不成功，跑下 `npm cache clean`，再来一次的日子一去不复返了~

其次，一个小帮助。现在 `install` 后，会将依赖直接添加到 `package.json` 文件中，也就是默认添加 `--save` 参数。

最大的变化就是引入了 package lock 这个新特性。剩下一些没用到过，也就不乱说了。

## Npm package locks
相信童鞋们多多少少遇到过，一个项目在自己机器上跑得好好的，又来一个新同事，或另一台机器安装项目就跑出问题的情况。调查了半天发现，原来是某个依赖包安装的版本不一致引起的。这或许可以怪你，谁让你不在 `package.json` 里把版本号定死的。（定死版本号同样也会带来升级库文件不方便的问题。）

以后，你就不必再为此操心了。因为，npm 引入了 [package locks](https://docs.npmjs.com/files/package-locks)。

Npm 5 之后使用 `npm install`，npm 不再是直接根据 `package.json` 中定义的依赖版本进行安装，而是先去尝试查看 `package-lock.json` 文件。如果 `package-lock.json` 文件不存在，则仍像之前一样按 `package.json` 安装，并同时自动生成 `package-lock.json` 文件。反之，则就根据文件中保存的依赖版本信息进行安装。

这样就能保证，每次安装都会得到相同的依赖树，也就再也不会发生之前那种情况了。

### `package-lock.json`
`package-lock.json` 是一个安装依赖时，由 npm 自动生成的一个文件，里面保存的是依赖的版本信息，以及依赖之间的树状关系。当所安装的依赖不存在于 `package-lock.json` 文件中时，npm 会自动修改该文件。

既然，它用于记录依赖树，那么，为了保证团队各成员之间使用相同的依赖树，它需要被提交到代码仓库。与此同时，它的改动也代表了项目依赖版本的改动，同样 npm 建议将 `package-lock.json` 的修改单独进行提交。

除此以外，使用 `package-lock.json` 还需注意以下几点：

* 只能存放于项目根目录，其他位置无效
* 不随包一同发布
* 与 `npm-shrinkwrap.json` 同时使用时，`npm-shrinkwrap.json` 优先级更高

提到了 `npm-shrinkwrap.json`，自然也要了解一下。

### `npm-shrinkwrap.json`
`npm-shrinkwrap.json` 是通过命令 `npm shrinkwrap` 生成。

它与 `package-lock.json` 有着同样的数据结构。不同之处在于，它没有刚刚 `package-lock.json` 所提到的这些限制。

所以，`npm-shrinkwrap.json` 的使用场景是用于定义发布包所需的确切依赖版本信息。与之相反，`package-lock.json` 的使用场景就是用于定义协同开发时，项目所安装的依赖版本信息。

最后，还是强烈推荐将 node 升级到 8，这样就能用到 npm package locks 这个功能啦。

PS: 快写完了发现一篇相同主题的好文：[npm5 新版功能特性解析及与 yarn 评测对比](https://cloud.tencent.com/community/article/171211)。（和大佬一比，高下立见😞还是要多学习...）

7 月都不知道干了点啥，忙忙碌碌地就过了...（差点就坏了规矩，警醒~）