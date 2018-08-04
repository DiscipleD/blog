> TL;DR 一个工具包通过 npm 发布时，建议使用 `.npmignore` 忽略项目中的 `.babelrc` 相关设置文件。

为什么要这样设置，且听我娓娓道来。故事的起因是这样的...

公司的一个项目在打包发布时，遇到了 babel plugin 依赖未找到的错误。通过错误信息很快定位到了引起编译错误的依赖包，很不幸这个包是我发布的...

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/trouble-with-babelrc/carry-pot.jpg)

同事找到我时，我当然很(shuai)硬(guo)气，依赖我肯定写全了，别的项目也用得好好的，是不是你姿势不对啊~

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/trouble-with-babelrc/deny-treble.jpg)

既然错误已经产生了，当然先要解决问题。

首先，肯定是想复现场景。本地下载项目，安装依赖，运行得很顺畅。稳~

然而，在 CI 环境下打包还是出错，相比本地环境，CI 上是生产环境，而本地不是，那是不是环境的问题造成的哪？babel 的插件一般设置在 `package.json` 的 `devDependencies` 中，生产环境的确不会安装 `devDependencies`，似乎找到了原因。

但又仔细一想，事实并不是这样。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/trouble-with-babelrc/matter-complicated.jpg)

作为一个工具依赖包，项目引用的是打包后的文件，不需要再次安装依赖、打包。所以，问题不是在生产环境没有安装 `devDependencies` 上。

那问题究竟再哪里？再回头看报错信息，是未找到 babel 的插件，`devDependencies` 中的依赖有那么多，为什么只有这个依赖出了问题，是不是和这个插件有关？研究了半天，得出个结论插件稳得不行，问题究竟出在哪里？感觉走进了一个死胡同，这时就得回到出发点换条路走一走。

之前一直在思考包安装上的问题，但就同之前提到的，在生产环境是直接依赖打包后的文件，那么问题来了，babel 为什么还要安装这个插件？真相渐渐浮出了水面。

babel 插件的设置是在 `.babelrc` 中，项目在生产环境打包时一定是引用到了公共包的 `.babelrc`。根据 babel 的文档，`.babalrc` 的[应用规则](https://babeljs.io/docs/en/babelrc)是从当前编译的文件往上查找最近的 `.babalrc` 文件。

至此，一切都清楚了。项目在生产环境打包时，会 babel 编译工具包的代码，而此时编译代码时参照的 `.babelrc` 文件是工具包自带的。同时，项目中的 `.babelrc` 设置同工具包中的 `.babelrc` 插件设置不一致引起的。

从上面可以看到，其中有两方面的原因引起了这个问题。

1. 重复打包：项目中对已打过包的文件又进行了一次 babel 的编译
2. `.babelrc` 文件不一致

找到了问题产生的原因，解决就很容易了，对应的解决方案也有两个。

1. 避免重复打包：在项目的 babel-loader 中 `exclude` 工具包
2. 通过 `.npmignore` 不上传工具包中的 `.babelrc` 文件，项目打包时就会直接使用项目的 `.babelrc` 文件

第一套方案虽然看起来是**最正确的选择**，但是它增加了工具接入方的接入成本，侵入了项目接入方的打包代码。

第二套方案看起来是一种 hack，但或许是**最好的选择**。因为，它对工具包的接入方来说是无感的。同时，工具包发布的是打包之后的文件，所以即使不上传 `.babelrc` 文件对工具包来说也是完整的。

额外提一下，babel 7 对 `.babelrc` 的查询策略会有变更，会根据文件层级 merge `.babelrc` 设置，但对 `exclude` 之后的文件应该也没有影响。

参考资料：

1. [Babel doc](https://babeljs.io/docs/en/babelrc)
2. [Babel next doc](https://babeljs.io/docs/en/next/babelrc)