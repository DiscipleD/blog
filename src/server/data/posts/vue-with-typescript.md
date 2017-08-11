* [前言](#preface)
* [安装 TypeScript](#install)
* [tsconfig.json 配置](#tsconfig)
* [Tslint](#tslint)
* [Vue 中使用 typescript 需要注意的问题](#problems-with-vue)
* [其他问题](#other-problems)
* [最后](#conclusion)

<a name="preface"></a>
## 前言
大家一听到 ts 是强类型语言，想到 js 要像其他语言那样定义变量类型就头疼，心里多少有些抵触情绪。起初我也是这样认为的，写的时候的确也是这样。但在另一方面，它强大的静态分析功能会使你所写的代码更健壮，从而大大减少 bug 的发生概率，将 bug 掐死在摇篮里。

这样的好东西就想尝试着把它用到自己的项目里。可当要将 ts 加入到现有的 vue 项目中时，突然有无从下手的感觉，总感觉 ts 的类型和 vue 绑定数据的方式无法有效地结合起来。同时，印象中一直听到的都是 react 和 angular 的项目在使用 ts，还没有听说哪个成功的 vue 项目是用 ts 开发的。（[element](https://github.com/ElemeFE/element) 也不是。）

那是不是 vue 就不能同 ts 一起用哪？一度我也这样怀疑过，不过搜了波资料之后，发现 vue 官网已经给出了如何整合 ts 的[教程](https://vuejs.org/v2/guide/typescript.html)。微软这边也有个 [TypeScript-Vue-Starter](https://github.com/Microsoft/TypeScript-Vue-Starter)，但是，这个 starter 也无法解决组件属性上的类型检测。这令 ts 类型检测的能力大大降低，而 vue 则是推荐另一个官方工具 [vue-class-component](https://github.com/vuejs/vue-class-component) 来解决这个问题。

扯了那么多，总结一句话就是：TS 和 Vue 能搞。

那么，下面直接开搞。

<a name="install"></a>
## 安装 TypeScript
首先，自然是安装，typescript 和其他依赖没有什么不同，直接通过 npm 安装就可以了。因为项目之前用的是 webpack，所以还要装上另外两个 loader：[`awesome-typescript-loader`](https://github.com/s-panferov/awesome-typescript-loader) 和 [`source-map-loader`](https://github.com/webpack-contrib/source-map-loader)。

```Bash
npm i typescript awesome-typescript-loader source-map-loader -S
```

有了 loader 那么让 webpack 去管理 ts 的文件也就轻而易举了。别忘了在 `resolve` -> `extensions` 中添加 `.ts`，让 webpack 能够识别以 ts 结尾的文件。

```JavaScript
// ...
	resolve: {
		// ...
		extensions: [".ts", ".js", ".json"]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "awesome-typescript-loader"
			},
			// ...
		]
	}
// ...
```

这样 webpack 的配置就完成了，接着在根目录下添加 `tsconfig.json` 文件来配置 ts。

<a name="tsconfig"></a>
## 配置 tsconfig.json
`tsconfig.json` 所包含的属性并不多，只有 7 个，ms 官方也给出了它的[定义文件](http://json.schemastore.org/tsconfig)。但看起来并不怎么舒服，这里就翻译整理一下。（若有误，还请指出）

* `files`: 数组类型，用于表示由 ts 管理的文件的具体文件路径
* `exclude`: 数组类型，用于表示 ts 排除的文件（2.0 以上支持 Glob）
* `include`: 数组类型，用于表示 ts 管理的文件（2.0 以上）
* `compileOnSave`: 布尔类型，用于 IDE 保存时是否生成编译后的文件
* `extends`: 字符串类型，用于继承 ts 配置，2.1 版本后支持
* `compilerOptions`: 对象类型，设置编译的选项，不设置则使用默认配置，配置项比较多，后面再列
* `typeAcquisition`: 对象类型，设置自动引入库类型定义文件(`.d.ts`)相关，该对象下面有 3 个子属性分别是：
	* `enable`: 布尔类型，是否开启自动引入库类型定义文件(`.d.ts`)，默认为 `false`
	* `include`: 数组类型，允许自动引入的库名，如：["jquery", "lodash"]
	* `exculde`: 数组类型，排除的库名

如不设定 `files` 和 `include`，ts 默认是 `exclude` 以外的所有的以 `.ts` 和 `.tsx` 结尾的文件。如果，同时设置 `files` 的优先级最高，`exclude` 次之，`include` 最低。

上面都是文件相关的，编译相关的都是靠 `compilerOptions` 设置的，接着就来看一看。

属性名 | 值类型 | 默认值 | 描述 
--- | --- | --- | --- 
allowJs | boolean | false | 编译时，允许有 js 文件
allowSyntheticDefaultImports | boolean | module === "system" | 允许引入没有默认导出的模块
allowUnreachableCode | boolean | false | 允许覆盖不到的代码
allowUnusedLabels | boolean | false | 允许未使用的标签
alwaysStrict | boolean | false | 严格模式，为每个文件添加 "use strict"
baseUrl | string | | 与 `path` 一同定义模块查找的路径，详细参考[这里](http://www.typescriptlang.org/docs/handbook/module-resolution.html#base-url) 
charset | string | "utf8" | 输入文件的编码类型 
checkJs | boolean | false | 验证 js 文件，与 `allowJs` 一同使用
declaration | boolean | false | 生成 `.d.ts` 定义文件
declarationDir | string | | 生成定义文件的存放文件夹（2.0 以上）
diagnostics | boolean | false | 是否显示诊断信息
downlevelIteration | boolean | false | 当 `target` 为 ES5 或 ES3 时，提供对 `for..of`，解构等的支持
emitBOM | boolean | false | 在输出文件头添加 utf-8 (BOM)字节标记
emitDecoratorMetadata | boolean | false | 详见 [issue](https://github.com/Microsoft/TypeScript/issues/2577)
experimentalDecorators | boolean | false | 允许注解语法
forceConsistentCasingInFileNames | boolean | false | 不允许不同变量来代表同一文件
importHelpers | | boolean | false | 引入帮助（2.1 以上）
inlineSourceMap | boolean | false | 将 source map 一同生成到输出文件中
inlineSources | boolean | false | 将 ts 源码生成到 source map 中，需要同时设置 `inlineSourceMap` 或 `sourceMap`
isolatedModules | boolean | false | 将每个文件作为单独的模块
jsx | string | "preserve" | jsx 的[编译方式](http://www.typescriptlang.org/docs/handbook/jsx.html)
jsxFactory | string | "React.createElement" | 定义 jsx 工厂方法，`React.createElement` 还是 `h`（2.1 以上）
lib | string[] | | 引入库定义文件，可以是["es5", "es6", "es2015", "es7", "es2016", "es2017", "esnext", "dom", "dom.iterable", "webworker", "scripthost", "es2015.core", "es2015.collection", "es2015.generator", "es2015.iterable", "es2015.promise", "es2015.proxy", "es2015.reflect", "es2015.symbol", "es2015.symbol.wellknown", "es2016.array.include", "es2017.object", "es2017.sharedmemory", "esnext.asynciterable"]（2.0 以上）
listEmittedFiles | boolean | false | 显示输入文件名
listFiles | boolean | false | 显示编译输出文件名
locale | string | 随系统 | 错误信息的语言
mapRoot | string | | 定义 source map 的存放位置
maxNodeModuleJsDepth | number | 0 | 检查引入 js 模块的深度，需同 `allowJs` 一同使用
module | string | | 指定模块生成方式，["commonjs", "amd", "umd", "system", "es6", "es2015", "esnext", "none"]
moduleResolution | string | | 指定模块解析方式，["classic" : "node"]
newLine | string | 随系统 | 行位换行符，"crlf" (windows) 或 "lf" (unix)
noEmit | boolean | false | 不显示输出
noEmitHelpers | boolean | false | 不在输出文件中生成帮助
noEmitOnError | boolean | false | 出错后，不输出文件
noFallthroughCasesInSwitch | boolean | false | `switch` 语句中，每个 `case` 都要有 `break`
noImplicitAny | boolean | false | 不允许隐式 `any`
noImplicitReturns | boolean | false | 函数所有路径都必须有显示 `return`
noImplicitThis | boolean | false | 不允许 `this` 为隐式 `any`
noImplicitUseStrict | boolean | false | 输出中不添加 "use strict"
noLib | boolean | false | 不引入默认库文件
noResolve | boolean | false | 不编译三斜杠或模块引入的文件
noUnusedLocals | boolean | false | 未使用的本地变量将报错（2.0 以上）
noUnusedParameters | boolean | false | 未使用的参数将报错（2.0 以上）
outDir | string | | 定义输出文件的文件夹
outFile | string | | 合并输出到一个文件
paths | object | | 与 `baseUrl` 一同定义模块查找的路径，详细参考[这里](http://www.typescriptlang.org/docs/handbook/module-resolution.html#base-url) 
preserveConstEnums | boolean | false | 不去除枚举声明
pretty | boolean | false | 美化错误信息
reactNamespace | string | "React" | 废弃。改用`jsxFactory`
removeComments | boolean | false | 去除注释
rootDir | string | 当前目录 | 定义输入文件根目录
rootDirs | string [] | | 定义输入文件根目录
skipDefaultLibCheck | boolean | false | 废弃。改用 `skipLibCheck`
skipLibCheck | boolean | false | 对库定义文件跳过类型检查（2.0 以上）
sourceMap | boolean | false | 生成对应的 map 文件
sourceRoot | string | | 调试时源码位置
strict | boolean | false | 同时开启 `alwaysStrict`, `noImplicitAny`, `noImplicitThis` 和 `strictNullChecks` (2.3 以上)
strictNullChecks | boolean | false | `null` 检查（2.0 以上）
stripInternal | boolean | false | 不输出 JSDoc 注解
suppressExcessPropertyErrors | boolean | false | 不提示对象外属性错误
suppressImplicitAnyIndexErrors | boolean | false | 不提示对象索引隐式 any 的错误
target | string | "es3" | 输出代码 ES 版本，可以是 ["es3", "es5", "es2015", "es2016", "es2017", "esnext"]
traceResolution | boolean | false | 跟踪模块查找信息
typeRoots | string [] | | 定义文件的文件夹位置（2.0 以上）
types | string [] | | 设置引入的定义文件（2.0 以上）
watch | boolean | false | 监听文件变更

一般情况下，tsconfig.json 文件只需配置 `compilerOptions` 部分。

```Json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "module": "es2015",
    "removeComments": true,
    "preserveConstEnums": true,
    "sourceMap": true,
    "strict": true,
    "target": "es5",
    "lib": [
      "dom",
      "es5",
      "es2015"
    ]
  }
}
```

其中，`allowSyntheticDefaultImports` 是使用 vue 必须的，而设置 `module` 则是让模块交由 webpack 处理，从而可以使用 webpack2 的摇树。另外，加上`allowJs`，这样就可以一点点将现有的 js 代码转换为 ts 代码了。

如果，你在 webpack 中设置过 `resolve` -> `alias`，那么，在 ts config 中也需要通过 `baseUrl` + `path` 的方式来定义模块查找的方式。

<a name="tslint"></a>
## Tslint
同 js 一样，ts 也有自己的 lint —— `tslint`。

```Bash
npm i tslint tslint-loader -S
```

之前项目是通过 webpack 打包的，所以一并把 `tslint-loader` 也装上，并修改 webpack loader 的配置。

```
// ...
	{
		test: /\.tsx?$/,
		enforce: 'pre',
		loader: 'tslint-loader'
	},
// ...
```

同时，在项目目录下添加 `tslint.json` 文件。

```JSON
{
  "extends": "tslint:recommended",
  "rules": {
    // ...
  }
}
```

有些[推荐的配置](https://github.com/palantir/tslint/blob/master/src/configs/recommended.ts)和自己的习惯不太一样，可以通过 `rules` 去自定义（[查看所有规则](https://palantir.github.io/tslint/rules/)）。

tslint 默认都是警告类型，这样对做迁移也比较方便，也可以在配置中将提示类型从警告改为错误。

配置差不多完了，剩下就是码代码了。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/vue-with-typescript/play.gif)

<a name="problems-with-vue"></a>
## Vue 中使用 typescript 需要注意的问题
### 定义组件
`this` 在 vue 组件中非常常见，但 vue 组件的申明方式无法让 typescript 了解组件实例所包含的属性。

```JavaScript
export default Vue.component('blog', {
	template,
	created() {
		this.loadBrowserSetting();
		this.loadNavList();
		this.loadSocialLink();
	},
	computed: mapGetters(['isDesktop', 'navList', 'socialLinkList', 'title']),
	methods: mapActions(['loadBrowserSetting', 'loadNavList', 'loadSocialLink']),
	watch: {
		'title': function() {
			setBlogTitle(this.title);
		}
	}
});
```
所以，就需要通过继承 vue 提供的 `ComponentOptions` 接口来申明组件所用到的每个属性，比如 `methods`, `getter` 中的属性等。

```TypeScript
export interface IBlogContainer extends Vue {
	title: string;
	loadBrowserSetting: () => void;
	loadNavList: () => void;
	loadSocialLink: () => void;
}

export default Vue.component('blog', {
	template,
	created() {
		this.loadBrowserSetting();
		this.loadNavList();
		this.loadSocialLink();
	},
	computed: mapGetters(['isDesktop', 'navList', 'socialLinkList', 'title']),
	methods: mapActions(['loadBrowserSetting', 'loadNavList', 'loadSocialLink']),
	watch: {
		title() {
			setBlogTitle(this.title);
		},
	},
} as ComponentOptions<IBlogContainer>);
```

看上去还不错？但这还不是最终的方案，可以更好，那就是一开始提到的 [vue-class-component](https://github.com/vuejs/vue-class-component)。

`vue-class-component` 既可以用于 ts，也能够用于 js。它都让你的组件定义文件变得相当清晰。将生命周期函数，`data`, `methods` 中的方法直接定义在 class 上，而将其他的组件 `options` 传入注解中就可以了。

```TypeScript
@Component({
	computed: mapGetters(['isDesktop', 'navList', 'socialLinkList', 'title']),
	methods: mapActions(['loadBrowserSetting', 'loadNavList', 'loadSocialLink']),
	template,
	watch: {
		title() {
			setBlogTitle((this as BlogContainer).title);
		},
	},
})
class BlogContainer extends Vue {
	public title: string;
	public loadBrowserSetting: () => void;
	public loadNavList: () => void;
	public loadSocialLink: () => void;

	public created() {
		this.loadBrowserSetting();
		this.loadNavList();
		this.loadSocialLink();
	}
}

export default Vue.component('blog', BlogContainer);
```

需要注意的是，全局组件还是需要在最后调用 `Vue.component` 语法来声明一下。

### 服务器渲染组件服务器端获取数据
Vue 服务器渲染会为某些需要动态获取数据的组件添加额外的方法，并在服务端接受到请求后调用，这个方法的名字可以是任意的（通常是 `preFetch` 或 `asyncData`）。同样的，它并没有在 vue 的定义文件中被定义，所以，需要各自去定义它。

在同一个项目中，组件获取数据的方法是相同的，所以可以扩展现有的 vue 的类型定义，而不用一遍遍的重复申明。

```TypeScript
// vue.d.ts
import Vue from 'vue';
import { Store } from 'vuex';
import VueRouter from 'vue-router';

import { IRootState } from 'vuexModule/index';

declare global {
  interface Window {
    __INITIAL_STATE__: any
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    preFetch?: (store: Store<IRootState>, router?: VueRouter) => Promise<any>
  }
}
```

同样的方法也可以用来扩展浏览器的定义文件，比如一些尝试性的 API。

```TypeScript
// pwa.d.ts
interface ShareInfo {
    title: string,
    url?: string,
    text?: string
}

interface Navigator {
    readonly share: (o: ShareInfo) => Promise<void>
}
```

再回到刚刚的组件服务器端获取数据。

众所周知，在使用 vuex 管理的系统获取数据通常使用的是调一个 action 方法，然而，action 将变动传递到 mutation。其中，action 需要接受一个对象作为参数，其中包含了 `commit` 和 `dispatch` 方法。在 Redux 中，这个参数是 store，但在 vue 中，它的类型是 `ActionContext<S, R>`。

同时，可以看到刚刚的 `preFetch` 方法的签名是 `store` 和 `router`。尽管，`store` 中也包含 `commit` 和 `dispatch` 方法，但它的类型是 `Store<R>`。这可以在原先的 js 中顺利运行，但在 ts 中，类型不同是会报错的。所以，这时你需要一个中间方法将传入的 `Store<R>` 类型转换为 `ActionContext<S, R>`。

这里推荐大家借鉴 [vuex-typescript](https://github.com/istrib/vuex-typescript) 中 `getStoreAccessors` 的实现方法。(自己写得不太好，不够通用，就不贴出来了)

### 服务端渲染永远返回新实例
在之前一篇关于 [vue 2.3 SSR 升级手册](https://discipled.me/posts/upgrade-ssr-of-vue)中有提到过，

> 因为 node 端服务启动后，vue 的实例就被初始化完成，所有的请求会公用这同一个实例，这就可能造成混乱。所以为每个请求返回一个新的 vue 的实例是一个比较好的处理方法，router 和 store 同样适用这个道理。

的确，我也这样做了。但在这次升级过程中，我还是发现了原先的一个 bug，甚至可以说是大 issue。

先来看一眼，原先的代码

```JavaScript
// vuex/index.js
import modules from './module';

Vue.use(Vuex);

const createStore = () =>
	new Vuex.Store({
		modules,
		strict: true
	});

export default createStore;
```

是不是觉得没问题？返回的是一个方法，方法每次调用会返回一个新的 store 对象。的确！

继续看下去

```JavaScript
// vuex/module/index.js
import browser from './browser';
import home from './home';
import aboutMe from './about-me';
import post from './post';
import site from './site';
import tags from './tags';

export default {
	browser,
	site,
	aboutMe,
	home,
	post,
	tags
};
```

是不是发现什么了？没错。问题就在于，`store` 的确是新的对象了，但 `modules` 因为是对象引用的关系，所以永远是同一个。以此类推，`modules` 下面的每个模块也有着同样的问题。

> 记住：在服务器渲染中，总是通过方法返回新的实例。

<a name="other-problems"></a>
## 其他问题
### IDE
首先，最直观的体会就是 webstorm 对 typescript 的支持非常差，代码提示做的还不错，但类型检测，错误提示等等可以说是几乎没有。而同是微软出品的 vscode，自然在这些方面都有着良好的表现。

> VScode，你值得拥有。

PS：没用过的童鞋可以用一下试试，真的好用。（用下来除了 git 操作比 ws 用起来麻烦一点，其他都很棒，墙裂安利...）

### 引入 `.ts` 以外类型的文件
在 webpack 中可以引入各式各样的文件，只要你装了相应的 loader，比如 `json`, `scss`, `jpg` 文件等等。但这些文件在 ts 里引入时，就有问题了，ts 的模块是无法理解这些文件的，ts 的模块只负责对 `.tsx?` 或 `.jsx?` 文件类型的编译。

这时可以添加一个定义文件来 hack 它。

```TypeScript
// support-loader.d.ts
declare module "*.json" {
    const value: any;
    export default value;
}

declare module "*.html" {
    const value: any;
    export default value;
}

declare module "*.jpg" {
    const value: any;
    export default value;
}
// ...
```

### `process.env`
大家肯定很熟悉 `process.env` 这个变量，这里也就不多解释了。虽然大家都熟悉它，但 ts 不了解它，不知道它是什么类型，所以会报错。

遇到这个问题，可以通过安装 `@types/node` 来解决。

```Bash
npm install @types/node
```
Typescript 2.0 之后，ts 通过 npm 来安装类定义文件（@types）。

Ts 会默认读取项目下 node_modules 下面的 @types 中的类定义文件，也可以通过之前提到的 `tsconfig.json` 中的 `typeRoots` 和 `types` 属性就行修改。

`typeRoots` 用于修改查找定义文件的位置，而 `types` 则是选择引入哪些定义文件，不填则默认不设限制，即 `typeRoots` 下所有定义文件。

### export default 无法同 ES6 对象字面量增强同时使用
ES6 中新增了一个特性是对象字面量的键可以为一个变量或一个表达式，像这样

```JavaScript
{
	[key]: 'something'
}
```

当它同 ES 6 模块的默认导出同时使用时，`babel-loader` 工作正常，但在 `awesome-typescript-loader` 这里就出了问题。

> You may need an appropriate loader to handle this file type.

直接 export 动态对象字面量就会报错，但将它们拆分开来就可以了。（不是很理解其中的原因，还望大神解惑）

```JavaScript
// error...
export default {
	[SomeAction](state) { /* ... */ }
}

// compile success
const mutations = { [SomeAction](state) { /* ... */ } };

export default mutations;
```

> ps: `typescript` 版本为 2.4.1，`awesome-typescript-loader` 版本为 3.2.1。

至此，客户端升级至 typescript 就完成了。（服务端因为类型定义的问题没有全部转换完成，还得再琢磨琢磨。）

<a name="conclusion"></a>
## 最后
总的来说，就如本文最初讲，ts 从数据类型、结构入手，通过静态类型检测来增强你代码的健壮性，从而避免 bug 的产生。

与此同时，vue 也有解决方案（[vue-class-component](https://github.com/vuejs/vue-class-component)）可以与 ts 结合得非常棒。
