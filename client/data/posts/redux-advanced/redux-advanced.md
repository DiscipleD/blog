在之前的[文章](http://discipled.daoapp.io/#!/posts/getting-started-with-redux)中，我们已经了解了 Redux 到底是什么，用来处理什么样的问题，并创建了一个简单的 [TodoMVC Demo](https://github.com/DiscipleD/angular-redux-todoMVC)。但是，我们同样遗留了一些问题没有处理，比如：异步处理、中间件、模板绑定等，这些问题我们将在这篇文章中通过一个简单的天气预报 Demo 来一一梳理（[查看源码点这里](https://github.com/DiscipleD/Redux-demo/tree/master/src/weather-forecast)）。

![Demo preview](http://o7nu3cbe9.bkt.clouddn.com/blog/redux-advanced/weather-forecast-demo.png)

在开始新的内容之前，先快速回顾一下[上一篇](http://discipled.daoapp.io/#!/posts/getting-started-with-redux)的内容。

### Action, Reducer & Store
创建一个基于 Redux 状态管理的应用时，我们还是从创建 Redux 的核心开始。

首先，建立 Action。假设，发出请求和收到请求之间有一个 loading 的状态，那么，我们将查询天气这个行为划分为 2 个 action，并为此创建 2 个工厂函数。

```JavaScript
export const QUERY_WEATHER_TODAY = 'QUERY_WEATHER_TODAY'
export const RECEIVE_WEATHER_TODAY = 'RECEIVE_WEATHER_TODAY'

export function queryWeatherToday(city) {
	return {
		type: QUERY_WEATHER_TODAY,
		city
	}
}

export function receiveWeatherToday(weatherToday) {
	return {
		type: RECEIVE_WEATHER_TODAY,
		weatherToday
	}
}
```
然后，为 Action 创建相应的 Reducer，不要忘了 Reducer 必须是一个纯函数。

```JavaScript
export default function WeatherTodayReducer(state = {}, action) {
	switch (action.type) {
		case QUERY_WEATHER_TODAY:
			return { load: true, city: action.city }
		case RECEIVE_WEATHER_TODAY:
			return { ...state, load: false, detail: action.weatherToday}
		default:
			return state
	}
}
```
最后是 Sotre。

```JavaScript
import { createStore } from 'redux'
import WeatherForecastReducer from '../reducers'
import actions from '../actions'

let store = createStore(WeatherForecastReducer)
// Log the initial state
console.log('init store', store.getState())

store.dispatch(actions.queryWeatherToday('shanghai'))

console.log(store.getState())

store.dispatch(actions.receiveWeatherToday({}))

console.log(store.getState())

export default store
```
启动应用之后，就能在控制台中看到一下的输出。

![控制台输出](http://o7nu3cbe9.bkt.clouddn.com/blog/redux-advanced/base_redux_console.png)

回顾了之前的内容以后，那我们就进入正题，来看一些新概念。

### 中间件
相信大家对中间件这个词并不陌生，Redux 中的中间件和其他的中间件略微有些不同。它并不是对整个 Redux 进行包装，而是对 `store.dispatch` 方法进行的封装，是 action 与 reducer 之间的扩展。

[Redux 官网](http://redux.js.org/docs/advanced/Middleware.html)一步一步详细地演示了中间件产生的原因及其演变过程，在此我就不再多做赘述了。

中间件在真正应用中是必不可少的一环，或许你不需要写一个中间件，但理解它会对你运用 Redux 编写代码会有很大的帮助。

### 异步请求
在上一篇文章中有提到，为了保证 reducer 的纯净，Redux 中的异步请求都是由 action 处理。

但是，reducer 需要接收一个普通的 JS 对象，action 工厂返回一个描述事件的简单对象，那我们的异步方法该怎么处理哪？这就需要我们刚才提到的中间件来帮忙了，添加 [redux-thunk](https://github.com/gaearon/redux-thunk) 这个中间件，使我们的 action 得到增强，使得 action 不单能返回对象，还能返回函数，在这个函数中还可以发起其他的 action。

其实，redux-thunk 这个中间件也没有什么特别之处，在 [Redux 官网](http://redux.js.org/docs/advanced/Middleware.html)的案例最后已经简单地实现了它。

```JavaScript
/**
 * 虽然，中间件是对 store.dispatch 的封装，但它是添加在整个 store 上
 * 所以，函数能传递 `dispatch` 和 `getState` 作为参数
 *
 * redux-thunk 的逻辑就是判断当前的 action 是不是一个函数，是就执行函数，不是就继续传递 action 给下一个中间件
 */
const thunk = store => next => action =>
  typeof action === 'function' ?
    action(store.dispatch, store.getState) :
    next(action)
```
于是，我们就修改一下之前的 action，给它添加一个异步请求。

```JavaScript
export const QUERY_WEATHER_TODAY = 'QUERY_WEATHER_TODAY'
export const RECEIVE_WEATHER_TODAY = 'RECEIVE_WEATHER_TODAY'

const queryWeatherToday = city => ({
	type: QUERY_WEATHER_TODAY,
	city
})

const receiveWeatherToday = weatherToday => ({
	type: RECEIVE_WEATHER_TODAY,
	weatherToday
})

export function fetchWeatherToday(city) {
	return dispatch => {
		dispatch(queryWeatherToday(city))

		return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${CONFIG.APPID}`)
			.then(response => response.json())
			.then(data => dispatch(receiveWeatherToday(data)))
	}
}
```

既然，我们用了中间件，那就要在 createStore 的时候装载中间件。

```JavaScript
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import WeatherForecastReducer from '../reducers'
import actions from '../actions'

const loggerMiddleware = createLogger()

const store = createStore(
	WeatherForecastReducer,
	applyMiddleware(
		thunkMiddleware,
		loggerMiddleware
	)
)

store.dispatch(actions.fetchWeatherToday('shanghai'))

export default store
```

这时，再看看应用的控制台。

![添加中间件后，控制台输出](http://o7nu3cbe9.bkt.clouddn.com/blog/redux-advanced/middleware_redux_console.png)

OK，Redux 核心的功能我们基本完成，我们继续看看如何将它同界面绑定在一起。

### 模板绑定
官网的例子都是 Redux 搭配 React，用的是 [react-redux](https://github.com/gaearon/react-redux)；然而，本文一直是以 Angular 来写的例子，所以，这里就用到另一个 redux 生态圈中的项目 [angular-redux](https://github.com/angular-redux)。它其中包含了 2 个不同的库，ng-redux 和 ng2-redux，分别对应 Angular 1.x 和 Angular 2 两个版本。

当然，我们这里使用 [ng-redux](https://github.com/angular-redux/ng-redux)。之前那些章节和官网讲述的可能相差不大，但这部分就有所区分了。

react-redux 提供一个特殊的 React 组件 `Provider`，它通过 React [Context](https://facebook.github.io/react/docs/context.html) 特性使每个组件不用显示地传递 store 就能使用它。

ng-redux 当然不能使用这种方式，但它可以使用 angular 自己的方式——依赖注入。

ng-redux 是一个 `provider`，它包含了所有 Redux store 所有的 API，额外只有 2 个 API，分别是 `createStoreWith` 和 `connect`。

其中，`createStoreWith` 显而易见是用来创建一个 store，参数同 Redux 的 `createStore` 方法差不多，原有创建 store 的方法就用不到了，之前的 store.js 也就被合并到了应用启动的 index.js 里。

```JavaScript
import angular from 'angular'
import ngRedux from 'ng-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import './assets/main.css'
import WeatherForecastReducer from './reducers'
import Components from './components'

const loggerMiddleware = createLogger()

angular.module('WeatherForecastApp', [ngRedux, Components])
	.config($ngReduxProvider => {
		$ngReduxProvider.createStoreWith(
			WeatherForecastReducer,
			[thunkMiddleware, loggerMiddleware]
		)
	})
```
这样应用的 store 就建立好了。

另一个 API `connect` 的用法同 react-redux 的 `connect` 方法差不多，用于将 props 和 actions 绑定到 template 上。

API 签名是 `connect(mapStateToTarget, [mapDispatchToTarget])(target)`。

其中，`mapStateToTarget` 是一个 `function`，`function` 的参数是 state，返回 state 的一部分，即 select；`mapDispatchToTarget` 可以是**对象或函数**，如果是对象，那么它的每个属性都必须是 actions 工厂方法，这些方法会自动地绑定到 `target` 对象上，也就是说，如果用之前定义好的 action，这边就不需要做任何的修改；如果是函数，那么这个函数会被传递 dispatch 作为参数，而且这个函数需要返回一个对象，如何 dispatch action 就由你自己设定，同时这个对象的属性也会绑定到 `target` 对象上。

最后的 `target` 就是目标对象了，也可以是函数，如果是函数的话，前面所传的 2 个参数会作为 `target` 函数的参数。

好了，扯了这么多概念，估计你也晕了。
Talk is sxxt，show me the code!

```JavaScript
// query-city/controller.js
import actions from '../../actions'

export default class QueryCity {
	constructor($ngRedux, $scope) {
		const unsubscribe = $ngRedux.connect(null, actions)(this)
		$scope.$on('$destroy', unsubscribe)
	}
}

// today-weather-board/controller.js
export default class TodayWeatherBoardCtrl {
	constructor($ngRedux, $scope) {
		const unsubscribe = $ngRedux.connect(this.mapStateToThis)(this);
		$scope.$on('$destroy', unsubscribe);
	}

	mapStateToThis(state) {
		return {
			weatherToday: state.weatherToday
		};
	}
}
```
这样，controller 是不是变得很简洁？

![上天咯](http://o7nu3cbe9.bkt.clouddn.com/blog/redux-advanced/go_to_heaven.png)

Weather Forecast 部分基本和之前的部分相同，唯一的一处小修改就是把 QueryCity 控制器里添加一个方法，在方法里调用 2 个不同的 action 来替换之前按钮上直接绑定的 action。

于是，我们的天气预报应用就成了这样。

![应用预览](http://o7nu3cbe9.bkt.clouddn.com/blog/redux-advanced/connect_template.png)

### 路由切换
一个真实的项目肯定会用到路由切换，路由状态也是应用状态的一部分，那么它也应当由 Redux 来统一管理。

谈到 Angular 的路由，那必须提到 ui-router。那 ui-router 怎么整合到由 Redux 管理的项目中哪？答案是：[redux-ui-router](https://github.com/neilff/redux-ui-router)。

使用 redux-ui-router 同样也有 3 点要注意：

* 使用 store 来管理应用的路由状态
* 使用 action 代替 $state 来触发路由的变更
* 使用 state 代替 $stateParams 来作为路由参数

记住这些就可以动手开工了。首先，安装依赖：

```Bash
npm install angular-ui-router redux-ui-router --save
```
这里有一点要注意，redux-ui-router 虽然依赖 angular-ui-router，但它不会帮你自动安装，需要你自己额外手动安装，虽然你项目里不需要引入 angular-ui-router 模块。

安装完依赖之后，就把它引入到我们项目中，项目的 index.js 就变为了

```JavaScript
import angular from 'angular'
import ngRedux from 'ng-redux'
import ngReduxUiRouter from 'redux-ui-router'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import './assets/main.css'
import { current, forecast } from './Router'
import App from './app/app'
import WeatherForecastReducer from './reducers'
import Components from './components'

const loggerMiddleware = createLogger()

angular.module('WeatherForecastApp', [ngReduxUiRouter, ngRedux, App, Components])
	.config(($urlRouterProvider, $stateProvider) => {
		$urlRouterProvider
			.otherwise('/current')

		$stateProvider
			.state('current', current)
			.state('forecast', forecast)
	})
	.config($ngReduxProvider => {
		$ngReduxProvider.createStoreWith(
			WeatherForecastReducer,
			[thunkMiddleware, loggerMiddleware, 'ngUiRouterMiddleware']
		)
	})
```
项目中只需引入 `ngReduxUiRouter` 模块，而不用再引入 ui-router 模块到应用中。ui-router 的路由声明就不在这里赘述了，网上的资料也是大把大把的。

接着，将 `'ngUiRouterMiddleware'` 添加到中间件中，这样距离完工就只剩最后一步了。

那就是修改主 Reducer 文件，将路由的 Reducer 合并到主 Reducer中，

```JavaScript
import { combineReducers } from 'redux'
import { router } from 'redux-ui-router'
import weatherToday from './WeatherToday'
import weatherForecast from './WeatherForecast'

export default combineReducers({
	weatherToday,
	weatherForecast,
	router
})
```

OK，大工告成。现在，如果你刷新界面就应该能看到控制台中已经输出了 `type` 为 `@@reduxUiRouter/$stateChangeStart` 和 `@@reduxUiRouter/$stateChangeSuccess` 的 action log。此时，如果页面上使用 `ui-sref` 来切换应用路由状态的话，同样也能看到 redux-logger 输出的日志。

在这个 Demo 里，我就不直接使用 `ui-sref`，而是用例子来说明刚刚提到的 3 点中的第二点：**使用 action 代替 $state 来触发路由的变更**。

```JavaScript
import { stateGo } from 'redux-ui-router'

export default class NavBarCtrl {
	constructor($ngRedux, $scope) {
		const routerAction = { stateGo }
		const unsubscribe = $ngRedux.connect(this.mapStateToThis, routerAction)(this)
		$scope.$on('$destroy', unsubscribe)
	}

	mapStateToThis(state) {
		return {
			router: state.router
		}
	}
}
```

从代码中可以看到，先从 redux-ui-router 里引入了 `stateGo` 方法，然后通过上一节所说的模板绑定，将这个方法绑定到当前的模板上，于是在模板中就可以使用 `$ctrl.stateGo()` 方法来跳转路由。

那为什么说这就满足了刚刚的第二点哪？查看[源码](https://github.com/neilff/redux-ui-router/tree/master/src)就可以发现，redux-ui-router 提供的 `stateGo(to, params, options)`等 API 也只是个再普通不过的 action 工厂方法，返回一个特定 type 的 action。

路由的切换是在之前添加的中间件中，做了一个类似 reducer 的处理，根据不同的 action type 触发不同的路由事件。

举一反三，通过模板绑定我们可以获得当前应用的 state。那么，我们同样可以用过调用 `$ctrl.stateGo()` 等方法给路由切换添加参数来做到**使用 state 代替 $stateParams 来作为路由参数**。

顺便说一句，redux-ui-router 似乎还没有支持 angular-ui-router 中的 View Load Events，如果你看懂了我刚刚所说的，那么 pr 走起。

### 写在最后

一不小心写了那么长，文笔又不是很好，不知有多少人看完了，希望大家都有所收获。

其中，也有不少细节也没有细说，有疑问的就留言吧。

在学习的过程中发现还有不少相关的知识可以扩展，应该还会有下一篇。

最后，最重要的当然是附上[源码](https://github.com/DiscipleD/Redux-demo/tree/master/src/weather-forecast)。