> 本文不包含 Vue 2.0 所有新特性，如 SSR 等，本文并没有涉及，本文只包含[个人博客项目]((https://github.com/DiscipleD/blog))升级中所遇到的经验分享，如有兴趣，可以查看 Vue 2.0 [changes log](https://github.com/vuejs/vue/issues/2873)。

### 前言
> 这节净是些唠叨，只想看升(tian)级(keng)的可直接跳过。

从去年年底开始写博客，那时对怎么搞个博客网站一窍不通，看别人用 [Github Pages](https://pages.github.com/) 写博客挺赞的，就也想搞个玩玩。技术选型时，在 [jekyll](https://jekyllrb.com/) 和 [hexo](https://hexo.io/zh-cn/) 中选择了前者，或许你会问为什么？估计当时大脑的供氧量不足了吧...

于是，我的博客就这么诞生了。（jekyll 版的博客已经废弃了，如果你有兴趣，可以查看之前的[提交](https://github.com/DiscipleD/DiscipleD.github.io/commits/master)）

可是，用久了就发现并不怎么好用，虽然支持 markdown，可代码块要转换成 highlighter 标签；其次，[主题](https://github.com/aron-bordin/neo-hpstr-jekyll-theme)模板是挺好看，可换成中文字杂就那么别扭哪；还有，对 jekyll 的模板又不熟，自定义也不方便。

年初有一天，突然想到自己也是搞技术的，为啥不自己搭一个博客网站哪？对，顺带还能学学新技术，何乐而不为。又到了技术选型的时候了，这次摆在我面前又有 2 个选择，[React](https://facebook.github.io/react/) 和 [Vue](https://vuejs.org/)，这次我选择了后者。

Why？因为，后者更轻量级，也更贴近我熟悉的 [Angular](https://angularjs.org/) 的语法，还有，那时网上就有说今年 4 月 Vue 会升级到 2.0 和 Vue 兼具 React 和 Angular 的优点等等。（好吧，老实说，不选 React 只是因为不喜欢 JSX 而已。-_-||）

So，我就用 Vue 1.10+ 搭建了自己的新博客——[Disciple.Ding Blog](http://discipled.daoapp.io/)(点这里看[源码](https://github.com/DiscipleD/blog))，并渐渐地往里添加一些新学到的东西，[ES6](https://babeljs.io/docs/learn-es2015/), [webpack](http://webpack.github.io/docs/), [docker](https://www.docker.com/) 等，并在 [DAOcloud](https://www.daocloud.io/) 上发布了。(免费用了人家那么久的服务，在这里做个硬广也是应该的，DAOcloud 的确很好用，特别和 Github 绑定之后能自动构建，应用更新也及其简单，只是有个缺点就是有带宽限制。)

在不久之前，Vue 如约发布了 2.0 版本。正如计划之初，博客 Vue 的版本也将升级到 2.0。

说了那么多，再不进入正题就要变成标题党了。好，那就开始我们的升(cai)级(keng)之旅。

### 升(tian)级(keng)之旅
首先，升级依赖。

```Bash
npm install vue@next vue-router@next --save
```

#### import vue
顺利安装完成并按 [changelog](https://github.com/vuejs/vue/issues/2873) 做了修改之后，启动项目也正常，当我兴致勃勃地打开 Browser，驾轻就熟地输入 localhost，并自然而然地按下 Enter，一切水到渠成。

然而，迎接我的竟是一片白板，控制台里赫然映着一串红字。

> [Vue warn]: You are using the runtime-only build of Vue where the template option is not available. Either pre-compile the templates into render functions, or use the compiler-included build. (found in root instance)

What? template 选项不能用了，changelog 没提到啊？但 [vue-router](https://github.com/vuejs/vue-router/tree/43183911dedfbb30ebacccf2d76ced74d998448a/examples) 的例子中都在用啊，什么鬼？甚至我将代码全部替换成例子中的代码依旧无法运行，但在 vue-router 项目里就能跑，什么鬼啊！

但是，我并不妥协，分别打断点运行，发现两者竟然跑的不是同一段代码，纳尼！

```JavaScript
import vue from 'vue'
```
同样的 `import` 语句，却有不一样的结果，vue-router 中引的是 vue.js，而在我的项目中引的竟然是 vue.common.js...common...mon...n...

![懵逼](http://o7nu3cbe9.bkt.clouddn.com/blog/troubleshooting-of-upgrading-vue/mengbi.jpg)

为什么会引 vue.common.js，`from 'vue'` 不该引的是 vue.js 么？这就要引入另一个知识点：package.json。

package.json 中的 `main` 属性决定了，当项目被引入时，输出的是哪个文件，而 vue 的 package.json 中的 `main` 指向的是 `dist/vue.common.js`。

> 福利时间：推荐一个网站 [json.is](http://json.is/)，它对 package.json 里的每条属性都有详细的解释。

找到了问题产生的原因，那么解决也就轻而易举了。

```JavaScript
import vue from 'vue/dist/vue.js'
```

每次引用 vue 的时候都要写那么长，一点都不优雅，而且为什么 vue-router 的例子可以用啊？

我要一探究竟。确认了 vue-router 中依赖的 vue 的 package.json 文件中的 `main` 字段指向的也是 `dist/vue.common.js`。那就只有一个可能了，webpack 对引入做了处理，查看 webpack.config.js

```JavaScript
module.exports = {
	// 省略...
	resolve: {
		alias: {
			'vue': 'vue/dist/vue.js'
		}
	},
	...
```

果然啊~他用 webpack 的别名功能把 `vue/dist/vue.js` 命名成了 vue，防不胜防。

在自己项目的 wepack.config.js 里同样给 vue 起别名，这样就又能愉快地使用 `import vue from 'vue'` 了。

你是不是以为这样就结束了？不，对待一个问题要刨根问底，不能不求甚解。

**为什么 vue 默认导出的是 vue.common.js，它和 vue.js 的区别在哪里，又有什么关系？**

这个问题在囧克斯的[博客](http://jiongks.name/blog/code-review-for-vue-next/)中有提到。

> Vue 最早会打包生成三个文件，一个是 runtime only 的文件 vue.common.js，一个是 compiler only 的文件 compiler.js，一个是 runtime + compiler 的文件 vue.js。

也就是说，`vue.js = vue.common.js + compiler.js`，而如果要使用 `template` 这个属性的话就一定要用 compiler.js，那么，引入 vue.js 是最恰当的。

第一句代码就把我坑那么久，后面还会有多少坑哪？

#### 路由升级
vue-router 的升级并不困难，参照 [Releases Note](https://github.com/vuejs/vue-router/releases/tag/v2.0.0-beta.1) 上的注释修改应该没有什么大问题，主要的变化有两点：

1. 路由配置从一系列的方法调用，变成了传递一个配置对象
2. 原先的 `v-link` 指令，变成了 `router-link` Component，路径指向用 `to` 属性

正当你以为会一路顺风顺水，轻松升级路由完成的时候，现实总会给你当头一棒。

之前博客的 vue-router 中使用了 `beforeEach` 和 `afterEach` 方法，根据 [Release Note](https://github.com/vuejs/vue-router/releases/tag/v2.0.0-beta.1) 

> * router.beforeEach (replaced by the beforeEach option)
> * router.afterEach (replaced by the afterEach option)

行，那我把它改到配置里

```JavaScript
const ROUTER_SETTING = {
	routes: [
		// 省略...
	],
	beforeEach: () => { /* some function */ },
	afterEach: () => { /* some function */ }
}
```
But, not work. What's wrong?

难道我哪里写错了？又经过我一番谷哥和查阅文档之后，发现在下一个版本的 [Release Note](https://github.com/vuejs/vue-router/releases/tag/v2.0.0-beta.2) 中有这么一段

> * beforeEach and afterEach are reverted as router instance methods (options removed). This makes it more convenient for plugins/modules to add hooks after the router instance has been created.

好吧，它又被恢复回路由实例的方法了。那么，改回去

```JavaScript
const router = new VueRouter(ROUTER_SETTING);

router
	.beforeEach(() => { /* some function */ })
	.afterEach(() => { /* some function */ });
```
OK，这样总好了吧。然而，并没有...console 中报出无法从 `undefined` 中读取 `afterEach`，好吧，我才这应该是 `beforeEach` 中没有像之前一样返回路由对象，所以不能链式调用。

```JavaScript
class VueRouter {
	// 省略...
	beforeEach (fn: Function) {
		this.beforeHooks.push(fn)
	}
	
	afterEach (fn: Function) {
		this.afterHooks.push(fn)
	}
	// 省略...
}
```

看一眼源码，果然如此。

那再将之前的代码稍作修改就可以了。

```JavaScript
const router = new VueRouter(ROUTER_SETTING);

router.beforeEach(() => { /* some function */ });
router.afterEach(() => { /* some function */ });
```
不过，不能链式调用似乎没之前的优雅了哪~

最后，提一下 vue-router 2.0 里所有的 hook（就像之前的 `beforeEach`, `afterEach`，以及每个路由状态中的 `beforeEnter`, `beforeRouteLeave`等）都具有相同的参数签名，这在 [Release Note](https://github.com/vuejs/vue-router/releases/tag/v2.0.0-beta.1) 中也有提到。

```JavaScript
fn (toRoute, redirect, next) {
	// toRoute: {Object} 当前路由对象
	// redirect: {Function} 调用跳转至另一路由
	// next: {Function} 调用继续当前路由跳转
	// 什么都不做，则取消当前跳转
}
```

路由升级完成后，如果控制台没有什么报错，那么，路由可以相互切换了，那些不依赖数据读取的组件已经可以正常显示了。

那些依赖数据读取的组件哪？

这就要提到组件的**生命周期钩子（即 lifecycle hooks）**。

#### Lifecycle hooks
**生命周期钩子**应该算 vue 这次升级中 broken changes 最多的一部分了，对照 1.0 的[文档](https://vuejs.org/api/#Options-Lifecycle-Hooks)和 [release note](https://github.com/vuejs/vue/issues/2873)，作了下面这张表

vue 1.0+ | vue 2.0 | Description
:---: | :---: | ---
init | beforeCreate | 组件实例刚被创建，组件属性计算之前，如 data 属性等
created | created | 组件实例创建完成，属性已绑定，但 DOM 还未生成，`$el` 属性还不存在
beforeCompile | beforeMount | 模板编译/挂载之前 
compiled | mounted | 模板编译/挂载之后
ready | mounted | 模板编译/挂载之后（不保证组件已在 document 中）
- | beforeUpdate | 组件更新之前
- | updated | 组件更新之后
- | activated | for `keep-alive`，组件被激活时调用
- | deactivated | for `keep-alive`，组件被移除时调用
attached | - | 不用了还说啥哪...
detached | - | 那就不说了吧...
beforeDestory | beforeDestory | 组件销毁前调用
destoryed | destoryed | 组件销毁后调用

知道了 hooks 升级前后的对应关系，那么升级起来就轻而易举了，改改组件的属性名就可以了。

那么，改完属性名是不是就完成了？然而并没有。

因为，在 vue 1.0+ 中，如果一个组件和路由相关，那么，它就可能不单单有自己组件的 lifecycle hooks，它还会有基于 vue-router 的 lifecycle hooks。

而在 vue 2.0 中，**router lifecycle hooks 全部被移除了**，因为，这些 hooks 可以通过其他的方式来代替，这样不但简化了配置，还不用在组件中去处理路由相关的业务，降低了耦合。那这些 hooks 该如何替换，我们接下来就来看一下。

* `activate` & `deactivate`：使用组件自身的 lifecycle hook 替代
* `data`：通过组件 `watch` 属性来监听当前路由 `$route` 的变化
* `canActivate`：由路由属性 `beforeEnter` 来代替
* `canDeactivate`：由路由属性 `beforeRouteLeave` 来代替
* `canReuse`：去除

那个这个是不是也直接改改属性名就好了哪？

恩，差不错。不过需要注意的是，如果原先 hooks 中使用了有关路由信息的 `transition` 参数是肯定不能用了。比如，根据路由参数来进行查询，原先通过 `transition.to.params` 获取路由参数，现在就要通过刚刚提到的**当前路由对象** `this.$route.params` 来获取。

在升级这里的过程中，还遇到一个问题：当用户输入的 URL 满足路由匹配，但根据路由参数无法获得正确的文章时，我想让路由直接跳转到首页。

在 1.0 版本中，我通过 `transition.redirect('/');` 就轻松的回到了首页，由于 2.0 中没有 `transition` 参数，而 `$route` 只包含当前路由的信息，并不包换路由切换的操作。那该怎么做哪？再一次谷哥和查阅文档，然而一无所获。

![i choose death](http://o7nu3cbe9.bkt.clouddn.com/blog/troubleshooting-of-upgrading-vue/i-choose-death.jpg)

最后在 vue-router 的例子中找到了解决问题的钥匙——`$router`。

`$router` 返回的是整个项目路由的实例，它是只读的。于是，刚刚那个问题就可以通过 `this.$router.replace('/');` 来解决。

这里还有一点，在 1.0 版本中组件配置 route 属性时还可以设置一个叫 `waitForData` 的属性。这个在 2.0 中，我还没有找到直接的替换方式，不过，我在整个组件上添加 `v-if` 来处理。从理论和效果的角度上讲，`v-if` 是可以替代原先的 `waitForData` 属性，就似乎不那么优雅。

剩余其他小点，看控制台报错信息，然后查查 [Release Note](https://github.com/vuejs/vue-router/releases/tag/v2.0.0-beta.1) 都能轻松处理啦~

> 至此，我的整个 [Blog](http://discipled.daoapp.io/) 也升级完成了，欢迎来访。（查看源码戳[这里](https://github.com/DiscipleD/blog)）

### 写在最后
如果现在再让我选一个技术来搭博客的话，我会选 React。为啥？

因为 vue 我已经玩过啦，哈哈哈~

最后，借用外国网友的一句话：

> I'm constantly rewriting / refactoring this silly little blog using the latest and buzziest tech, so that I can stay up to date on these libraries and frameworks. 

这也是我自己搭博客，而不是直接使用博客系统的主要原因。

最后的最后，安利下自己的 [Blog](http://discipled.daoapp.io/)，以及 [Source Code](https://github.com/DiscipleD/blog)。

欢迎交流，喷子绕道。