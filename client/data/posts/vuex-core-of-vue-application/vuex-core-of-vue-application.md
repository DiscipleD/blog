> 系列文章:
> 1. [Vue 2.0 升（cai）级（keng）之旅](http://discipled.daoapp.io/#/posts/troubleshooting-of-upgrading-vue)
> 2. Vuex — The core of Vue application (本文)

> 当今，谈到状态管理首先想到的肯定是 Redux，而随着 Vue 2.0 的发布，Vuex 也伴随着推出了最新版，本文就带你对照 Redux 来看看刚刚出炉的 Vuex 2.0。
> 
> 有关 Redux 的基础概念在本文中会简要略过，如再一一赘述篇幅就太长了，不了解的可以看一下本人之前写的有关 Redux 的两篇文章：
> 
> 1. [Redux 入门](http://discipled.daoapp.io/#!/posts/getting-started-with-redux)
> 2. [Redux 进阶](http://discipled.daoapp.io/#/posts/redux-advanced)

### 为什么说 Vuex 是 Vue 应用的核心？
众所周知，一个应用的外观可以千变万化，但无论如何变化，它都需要一样东西去支撑，那就是——**数据**。这个数据是广义上的，可以是数据库中的数据，也可以是当前应用所处的状态，甚至可以是 [WebRTC](https://webrtc.org/), [Web Bluetooth](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web) 等一系列实时数据。

> 在 vue 应用中，vuex 就充当了**数据**提供者的角色，vue 则只需要关注页面的展示与交互。

既然，明确了以 vuex 为核心，那么就来看看如何在 vue 应用中使用 vuex？

随着 Vue 2.0 的发布，Vuex 在近期也随之推出 2.0 版。在[上一篇文章](http://discipled.daoapp.io/#/posts/troubleshooting-of-upgrading-vue)中有提到作者的博客是用 vue 2.0 搭建的，但之前并没有添加 vuex，现在正可以借此机会将 vuex 添加到项目中。

本文将介绍 Vuex 2.0 的同时，分享一些本人在这个过程中的一些心得。

首先，当然是核心的核心 Store。

### Store
Store 用来存放整个应用的 state。

那怎么建立 store 哪？由于，Vuex 2.0 刚刚推出，最新的 API 还得看 [Release Note](https://github.com/vuejs/vuex/releases)。

创建一个 Store 非常简单只需 `new Vuex.Store({ ...options })`，其中，`options` 可以是一下几种：

* state `Object`：存放应用状态
* actions `Object`：注册 `action`
* mutations `Object`：注册 `mutation`
* getters `Object`：注册 `getter`
* modules `Object`：注册 `module`
* plugins `Array<Function>`：注册中间件
* strict `Boolean`：是否开启严格模式，严格模式下所有对 state 的变化必须通过 `mutation` 来修改，反之抛出异常，默认不开启。

或许你不了解这些属性的含义，没关系，之后每个还会分别解释。

明白了属性的含义，那么创建一个 store 的代码就可能会是这样

```JavaScript
// store.js
import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/logger';

import blog from './module/blog';

// 在 Vue 中，注册 Vuex
Vue.use(Vuex);

export default new Vuex.Store({
	state: {},
	plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
	modules: {
		blog
	}
});
```
store 创建完成之后，就可以在根组件中使用了。

```JavaScript
import Vue from 'vue';
import store from '../vuex';
import router from './router';
import './blog';

new Vue({
	store,
	router,
	template: '<blog></blog>'
}).$mount('#app');
```

个人看来，一个状态管理的应用，无论是使用 vuex，还是 redux，最困难的部分是在 store 的**设计**。

> 究竟该如何设计一个 store，是根据组件的结构层次设计对应的 store，还是根据应用数据来设计 store？

由于，store 是存放整个应用状态的地方，所以，起初我认为应该是前者按组件的层次结构去设计。这样 store 中分别保存着每个组件的状态，这对大型项目来说或许会造成大量的冗余数据存储在 store 中，以及一些重复的工作，但这也提供了简洁鲜明的层次结构，增强了项目的可维护性，这对大型项目来说更至关重要。

但伴随着写项目时的思考，我渐渐推翻了之前的想法。

假设这样一个场景，项目中有两个互不相关的组件，但它们俩却依赖同一份数据源。如果，这时采用之前的设计方法，那么这同一份数据源会被存放在 store 的两个不同的位置。那么此时，如果一个组件需要对数据源进行操作的话，它不但需要修改自己组件对应的 state，同时还要发起 action 来修改另一个组件的 state，这恰恰违背了组件的单一性。

然而，使用应用数据来设计 store 就不会有这样的问题。鉴于这个原因，我现在更倾向于第二个理念来设计整个应用的 store。

所以，当项目开始时，要考虑到整个应用的数据模型来设计 store 真是相当麻烦啊。

谈完了 store，就再一个个来看刚刚创建 store 时所提到的属性，state 就是用来保存状态的，没啥好说的，直接来看看第二个 `actions`。

### Actions
`actions` 是一个对象，key 就是 action 的名字，value 就是对应的 action。此处的 action，无论从名字，还是作用都和 redux 中的 action 相同，用于激发 state 的变更。但是，它们的用法却不相同。

Redux 中的 action 需要返回一个 JS 对象，即使加了 thunk 中间件之后，能够返回一个函数，但这个函数最终返回的还是一个 JS 对象，最后通过，`store.dispatch` 该对象来触发 state 的变更。

然而，Vuex 中的 action 它本身就是一个方法，并且这个方法并不需要任何的返回，而是，通过 `store.commit` 来触发 `mutation`。

> Vuex 2.0 中，已将原先的 `store.dispatch` 改名为了 `store.commit` 来触发 `mutation`。  
> Vuex 2.0 中，并没有移除 `store.dispatch`，而是改为用于触发 `action`。

所有 action 方法接受当前 store 的实例作为第一个参数，调用传递的参数会作为第二个参数传入（暂不支持多参数）。

### Mutations
`mutations ` 也是一个对象，同 `actions` 类似，key 就是 mutation 的名字，value 就是对应的 mutation。

mutation 用于更新应用的 state。Redux 中虽然没有 mutation 这个词，但从上面的解释就明白，这同 redux 中的 reduce 起着相同的作用。

但两者在写法上又有着不同，由于 vuex 中的 `mutations` 是一个对象，并借用 ES6 对象方法可以**使用变量**和**省略**的特点，调用 `mutation` 可以直接通过命名找到相应的处理方法，这使得它比 redux 的一系列 switch/case 语句要更简单、更优雅。

更大的不同之处在于 redux 的 reduce 是要求返回一个新的 state，而 vuex 就如它的命名 mutations（变异）是对当前 state 进行操作，而不能返回一个新的 state，这里就和 FP 的理念有所冲突了。

```JavaScript
// mutations.js
export default {
	// work
	[LOAD_SOCIAL_LINK](state = {}, mutation = {}) {
		state.socialLinkList = mutation.payload
			.filter(item => !!item.link)
			.map(item => ({
				...item,
				svgPath: svgPath + '#' + item.name
			}));
	}
	
	// not work
	[LOAD_SOCIAL_LINK](state = {}, mutation = {}) {
		state = {
			...state,
			socialLinkList: mutation.payload
				.filter(item => !!item.link)
				.map(item => ({
					...item,
					svgPath: svgPath + '#' + item.name
				}))
		};
	}
};
```

单就这点来看，redux 略胜一筹。

### Getters
`Getters` 也是一个对象，用于注册 getter，每个 getter 都是一个 `function` 用于返回一部分的 state。

getter 方法接受 state 作为第一个参数，一个简单的 `getters` 就可能是这样：

```JavaScript
export default {
	// 省略...
	getters: {
		socialLinkList: state => state.socialLinkList
	}
};
```

> 掌握了 Store, Actions, Mutations 以及 Getters 这几个概念，那你就掌握了 vuex 的核心，已经完全可以创建一个完整的 store，并可以使用了。

但随着项目的增长，你会发现将 Actions, Mutations, Getters 全都写在一起非常难以维护，这时你会想念 Redux 中将 state 划分处理的 `combineReducers`。

![Wake up!](http://o7nu3cbe9.bkt.clouddn.com/blog/vuex-core-of-vue-application/wake_up.jpeg)

醒醒！别想 Redux 啦，Vuex 也可以划分处理 state 树，它就是接着就要提到的 `modules`。

### Modules
`Modules` 的作用就如它的名字，划分模块。

它的属性也是一个对象，key 是对应的 module 名，在 state 中会创建相应的 key，而 value 是一个用于配置如何创建 module 的对象，该对象的属性基本同创建 store 时的 `options` 对象一样，只少了最后 2 个还没有讲到的属性 `plugins` 和 `strict`。这两者是不是有什么关系哪？

```JavaScript
class Store {
  constructor (options = {}) {
    // 省略...
    
    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters
    installModule(this, state, [], options)
    
    // 省略...
  }
```
从 vuex 创建的源码中可以看到，其实，store 它本身就是一个 module。

既然，`modules` 中能配置 `modules` 那就意味着：模块是可以嵌套的。那么，使用 `modules` 就可以将 state 划分为各个模块，同 `combineReducers` 一样可以化繁为简，这对中大型项目来说必不可少。

一个 module 的定义就可以是这样。

```JavaScript
// nav module
import mutations from './mutations';
import actions from './actions';

export default {
	state: {},
	getters: {
		navList: state => state.navList
	},
	actions,
	mutations
};
```

> 警报！前方第 6 行有坑，请速速绕行。

第 6 行？

`state: {},` 初始化 state 能有什么问题啊？

当你运行你的应用的时候，你会发现，如果 navList 的变化是由一个同步的方法返回的就没有问题，但如果，它是通过异步方法返回的，你会发现虽然控制台上的 mutation log 输出正确，但你的组件中并没有得到正确的值。

![What happened?](http://o7nu3cbe9.bkt.clouddn.com/blog/vuex-core-of-vue-application/question.jpeg)

因为，当 action 调用之后会计算一次 getter，如果是同步的，那么此时 getter 的 state 中已经保存着最新的数据。

但如果是异步的，那么此时 getter 中的 state 是一个空对象，那么上例中的 `state.navList` 就会返回一个 `undefined`。然而，`undefined` 就不会进入 vue 的 watch 系统，所以当异步请求结束后，即使 state 中对应字段变为了目标值，但也不会再调用 getter 了，组件中的值自然也不会更新了。

那怎么解决哪？那就是给 state 中的每个属性设初始值，这样在第一次计算 getter 的值时就会返回对应的初始值，而这个初始值是在 vue 的系统中的，所以当异步请求结束后调用 mutation 改变 state 中对应的值后，getter 会自动触发更新，此时，组件中对应的值也就被修改了。

所以，一定要记得：

> 为每个属性设置初始化 state ！！！

> 为每个属性设置初始化 state ！！！

> 为每个属性设置初始化 state ！！！

重要的话，说三遍！！！

> 最后，在使用 `modules` 还需要注意，在不同 `modules` 下，注册的 action 或 mutation 的名字重复并不会报错，但都会被调用，所以要**注意命名**。

好，`modules` 讲完了，继续看下一个属性 `plugins`。

### Plugins
vuex 自 1.0 版开始就将原先的 `middlewares` 替换成了 `plugins`。也就是说，现在使用的 `plugins` 就是中间件。

`plugins` 的参数终于同之前的有所不同了，是一个数组，数组中的每一项都是一个方法，方法接受一个参数就是当前 store 的实例。

```JavaScript
	// vuex source code: apply plugins
	plugins.concat(devtoolPlugin).forEach(plugin => plugin(this))
```

vuex 中间件的编写理解起来也十分容易，就是通过 `store.subscribe` 来订阅 mutation 的变化，这比 redux 中间件的工作原理更容易理解。

最后的 `strict` 属性之前已经提到了，就是用来设置时候开启严格模式的，严格模式下，state 只能通过 mutation 来修改。

至此，创建 vuex store 的所有属性都讲完了，store 也就完成了，那么，vue 的组件该如何和 vuex 的 store 链接起来哪？

### 连接到组件
vuex 1.0 之前如何将 vuex 连接到组件在这里就不说了，有兴趣可以上[官网](http://vuex.vuejs.org/en/index.html)上看看。

主要来看看如何使用 vue 2.0 新增的 4 个 helper 方法**优雅**地将 vuex 连接到组件。

![](http://o7nu3cbe9.bkt.clouddn.com/blog/vuex-core-of-vue-application/move_back.jpeg)

这 4 个 helper 方法，分别是：

* mapState
* mapMutations
* mapGetters
* mapActions

常言道：口说无凭。

我们就来看一个博客升级中的简单例子，没有加入 vuex 前，本人博客的首页是这样设定的：

```JavaScript
// home.js
import Vue from 'vue';

import PostService from '../../../common/service/PostService';

import img from '../../../assets/img/home-bg.jpg';
import template from './home.html';

const Home = Vue.extend({
	template,
	data: () => {
		return {
			header: {
				img,
				title: 'D.D Blog',
				subtitle: 'Share More, Gain More.'
			},
			postList: []
		};
	},
	created() {
		const postService = new PostService();
		postService.queryPostList().then(({postList}) => (this.postList = postList));
	}
});
```

这里我们回顾一下之前的所讲，为 home 组件创建对应的 store module。

```JavaScript
// index.js
// mutation types
const INIT_HOME_PAGE = 'INIT_HOME_PAGE';
const LOAD_POST_LIST = 'LOAD_POST_LIST';

// actions
const initHomePage = ({dispatch, commit}) => {
	commit(createAction(INIT_HOME_PAGE, {
		header: {
			image,
			title: 'D.D Blog',
			subtitle: 'Share More, Gain More.'
		}
	}));
	dispatch('loadPostList');
};

const loadPostList = ({commit}) => {
	new PostService().queryPostList()
		.then((result = {}) => {
			commit(createAction(LOAD_POST_LIST, {
				postsList: result.postsList
			}));
		});
};

const actions = {initHomePage, loadPostList};

// mutations
const mutations = {
	[INIT_HOME_PAGE](state = {}, mutation = {}) {
		state.header = mutation.payload.header;
	},

	[LOAD_POST_LIST](state = {}, mutation = {}) {
		state.postsList = mutation.payload.postsList;
	}
};

export default {
	state: {
		header: {},
		postsList: []
	},
	getters: {
		postsList: state => state.postsList
	},
	actions,
	mutations
};
```

```
const createAction = (typeName = '', data = '') => ({ type: typeName, payload: data });
```
这里的 `createAction` 是自己创建的一个简单函数，用于格式化 `mutation` 获得的参数，这并不是必须的，vuex 的 `commit` 方法是接受参数为 `(type, data)` 的。

OK。对应的 store module 也创建好了，就来改组件吧。

首先，应用的状态都来自于 store，那么组件中的 `data` 属性自然就不用了，直接删除。爽~

```JavaScript
const Home = Vue.extend({
	template,
	created() {
		const postService = new PostService();
		postService.queryPostList().then(({postList}) => (this.postList = postList));
	}
});
```

其次，原先在 created hooks 里直接去查数据，现在用了 vuex 自然要通过调用 action 来获取数据，这里就要用到 4 大金刚之一——`mapActions` 来获取 vuex 中设定好的 action。

`mapActions` 接受一个数组或对象，根据相应的值将对应的 action 绑定到组件上。

```JavaScript
import {mapActions} from 'vuex';

const Home = Vue.extend({
	template,
	methods: mapActions(['initHomePage']),
	created() {
		this.initHomePage();
	}
});
```

数据拿到了，怎么绑定到组件上哪？这就可以用到另两个 helper：`mapState` 和 `mapGetters`。

`mapState` 和 `mapGetters` 同样接受一个数组或对象，并根据相应的值将 store 中的 state 或 getter 绑定到组件上。

```JavaScript
import vue from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';

import template from './home.html';

const Home = vue.extend({
	template,
	computed: {
		...mapState({
			header: state => state.home.header
		}),
		...mapGetters(['postsList'])
	},
	methods: mapActions(['initHomePage']),
	created() {
		this.initHomePage();
	}
});
```

哈哈，这样模板不用改变一分一毫，升级就完成啦~

是不是很简洁，很优雅~

![](http://o7nu3cbe9.bkt.clouddn.com/blog/vuex-core-of-vue-application/handsome.jpg)

### 容器组件和展示组件
容器组件和展示组件这个概念在 [Redux 入门](http://discipled.daoapp.io/#/posts/getting-started-with-redux)一文中已有提到。然而，这个概念并不只服务于 react，在 vue 中也可以用到。

简单来说，容器组件就是用于包裹展示组件的组件，它和界面展示无关，它负责数据的获取和传递，之前的 home 组件就是一个容器组件，再来看看它的 template，你会发现它除了根元素以外，不包含其他任何的 html 标签。

```Html
<section>
	<!-- Content Header -->
	<content-header :board-img="header.image" :title="header.title" :subtitle="header.subtitle"></content-header>

	<!-- Main Content -->
	<main-content>
		<post-list :post-list="postsList"></post-list>
	</main-content>
</section>
```

与此相反的是，展示组件单单用于展示，自己不获取任何数据，数据都通过 `props` 传递，比如 content-header。

```JavaScript
const template = `<header class="intro-header" :style="{ backgroundImage: 'url(' + boardImg + ')' }">
	<div class="container">
		<div class="row">
			<div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
				<div class="site-heading">
					<h1>{{ title }}</h1>
					<hr class="small">
					<span class="subheading">{{ subtitle }}</span>
				</div>
			</div>
		</div>
	</div>
</header>`;

export default Vue.component('contentHeader', {
	template,
	props: {
		boardImg: {
			type: String,
			default: _defaultImg
		},
		title: {
			type: String,
			required: true
		},
		subtitle: {
			type: String
		}
	}
});
```

这样明确地区分容器组件和展示组件会使得项目结构变得更清晰，追踪 bug ，以及维护也变得轻而易举。

### 管理路由
是不是觉得这样就完了？

No, No, No. 路由系统还没处理，那么如何将 vue-router 纳入到 vuex 的管理中哪？

这里又得感谢尤大大为我们造好了一个小工具 **[vuex-router-sync](https://github.com/vuejs/vuex-router-sync)**。

首先，安装

```Bash
npm install vuex-router-sync@next --save
```

然后，在项目初始化的时候将 router 同 store 联系起来就行，简单到都不知道说啥好。

不知道说啥，就说说原理，看看源码吧。

这个工具的原理也非常好理解，主要是 2 点：

一是，给 vuex 的 store 注册一个 router 的 module。

```JavaScript
function patchStore (store) {
  // 略...
  var routeModule = {
    mutations: {
      'router/ROUTE_CHANGED': function (state, to) {
        store.state.route = to
      }
    }
  }

  // add module
  if (store.registerModule) {
    store.registerModule('route', routeModule)
  } else if (store.module) {
    store.module('route', routeModule)
  } else {
    store.hotUpdate({
      modules: {
        route: routeModule
      }
    })
  }
}
```
另一个，就是使用 vue-router 的 afterEach hooks 来触发 mutation。

```JavaScript
exports.sync = function (store, router) {
  patchStore(store)
  store.router = router

  var commit = store.commit || store.dispatch
  // 略...
  
  // sync store on router navigation
  router.afterEach(function (transition) {
    if (isTimeTraveling) {
      isTimeTraveling = false
      return
    }
    var to = transition.to
    currentPath = to.path
    commit('router/ROUTE_CHANGED', to)
  })
}
```
项目中使用：

```JavaScript
import { sync } from 'vuex-router-sync';
import store from '../vuex';
import router from './router';

sync(store, router);

new Vue({
	store,
	router,
	template: '<blog></blog>'
}).$mount('#app');
```

OK，这样就大功告成了。

### 写在最后
加入了 vuex 后，我的博客终于让 vue 它们一家子（vue + vuex + vue-router）团圆了。

总的来看，vuex 同 vue 一样使用起来相当方便，集成了许多方法，但似乎缺少了 redux 的那份优雅，而我喜欢比较优雅的...（看在全篇我都在安利 vue 的情面上，尤大大请不要打我~）

![逃~](http://o7nu3cbe9.bkt.clouddn.com/blog/vuex-core-of-vue-application/run.jpg)

PS: 一下把 vuex 有关的一股脑都过了，可能过得太快，如有不明白的就留言吧。

最后的最后，当然是继续安利下自己的 [Blog](http://discipled.daoapp.io/)，以及 [Source Code](https://github.com/DiscipleD/blog)。
