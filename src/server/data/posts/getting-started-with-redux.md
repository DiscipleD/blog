> 系列文章:
> 1. Redux 入门(本文)
> 2. [Redux 进阶](http://discipled.me/posts/redux-advanced)
> 3. [番外篇: Vuex — The core of Vue application](http://discipled.me/posts/vuex-core-of-vue-application)

状态管理，第一次听到这个词要追溯到去年年底。那时，[Flux](https://facebook.github.io/flux/) 红透半边天，而 [Reflux](https://github.com/reflux/refluxjs) 也是风华正茂。然而，前一阵一直在忙其他的事，一直没时间学学这两个库，到现在 [Redux](http://redux.js.org/) 似乎又有一统天下的趋势。

那就来看看，Redux 是凭借什么做到异军突起的。

### What's Redux
Redux 是一个 JavaScript 应用状态管理的库，它帮助你编写行为一致，并易于测试的代码，而且它非常迷你，只有 2KB。

Redux 有一点和别的前端库或框架不同，它不单单是一套类库，它更是一套方法论，告诉你如何去构建一个状态可预测的应用。

### Why using Redux
随着单页应用变得越来越复杂，前端代码需要管理各种各样的状态，它可以是服务器的响应，也可能是前端界面的状态。当这个状态变得任意可变，那么你就可能在某个时间点失去对整个应用状态的控制。

Redux 就是为了解决这个问题而诞生的。

简短地说，Redux 为整个应用创建并管理一棵状态树，并通过限制更新发生的时间和方式，而使得整个应用状态的变化变得可以被预测。

除此之外，Redux 有着一整套丰富的生态圈，包括教程、中间件、开发者工具及文档，这些都可以在[官方文档](http://redux.js.org/docs/introduction/Ecosystem.html)中找到。

### How to use Redux
#### 三大原则
在使用 Redux 之前，你必须要谨记它的三大原则：单一数据源、`state` 是只读的和使用纯函数执行修改。

* 单一数据源

	> 整个应用的 `state` 都被储存在一棵树中，并且这棵状态树只存在于**唯一**一个 `store` 中。
	
	这使得来自服务端的 `state` 可以轻易地注入到客户端中；并且，由于是单一的 `state` 树，代码调试、以及“撤销/重做”这类功能的实现也变得轻而易举。
* 只读的 `state`

	> 唯一改变 `state` 的方法就是触发 `action`，`action` 是一个用于描述已发生事件的普通对象。
	
	这就表示无论是用户操作或是请求数据都不能直接修改 `state`，相反它们只能通过触发 `action` 来变更当前应用状态。其次，`action` 就是普通对象，因此它们可以被日志打印、序列化、储存，以及用于调试或测试的后期回放。
* 使用纯函数执行修改

	> 为每个 `action` 用**纯函数**编写 `reducer` 来描述如何修改 `state` 树
	
	或许你是第一次听到纯函数这个概念，但它是函数话编程的基础。
	
	纯函数在[维基百科](https://en.wikipedia.org/wiki/Pure_function)上的解释简单来说是满足以下两项：
	1. 函数在有相同的输入值时，产生相同的输出
	2. 函数中不包含任何会产生副作用的语句
	
	在这里，`reducer` 要做到**只要传入参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用，没有 API 请求、没有变量修改，只进行单纯执行计算。**
	
知道了三大原则之后，那就可以开始了解如何创建一个基于 Redux 的应用。

#### Action
就如之前提到的，`action` 是一个描述事件的简单对象，它是改变 `store` 中 `state` 的唯一方法，它通过 `store.dispatch()` 方法来将 `action` 传到 `store` 中。

下面就是一个 `action` 的例子，它表示添加一个新的 todo 项。

```JavaScript
const ADD_TODO = 'ADD_TODO'
// action
{
  type: ADD_TODO,
  text: 'Build my first Redux app'
}
```
可以看到 `action` 就是一个简单的 JavaScript 对象。

用一个字符串类型的 `type` 字段来表示将要执行的动作，`type` 最好用常量来定义，当应用扩大时，可以使用单独的模块来存放 `action`。

除了 `type` 字段外，`action` 对象的结构完全由你自己决定（也可以借鉴 [flux-standard-action](https://github.com/acdlite/flux-standard-action) 来构建你的 `action`）。

在现实场景中，`action` 所传递的值很少会是一个固定的值，都是动态产生的。所以，要为每个 `action` 创建它的工厂方法，工厂方法返回一个 `action` 对象。

上面的那个例子就会变为：

```JavaScript
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}
```
`Action` 的创建工厂可以是异步非纯函数。牵扯到异步的问题内容就比较多，放到下一篇再分享了。

#### Reducer
`Action` 只是一个描述事件的简单对象，并没有告诉应用该如何更新 `state`，而这正是 `reducer` 的工作。

在 Redux 应用中，所有的 `state` 都被保存在一个单一对象中。所以，建议在写代码前先确定这个对象的结构。如何才能以最简的形式把应用的 `state` 用对象描述出来？

在设计过程中，你会发现你有时需要在 `state` 中存储一些如 UI 的 `state`，尽量将应用数据和 UI `state` 分开存放。

```JavaScript
{
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

**注意：**在处理复杂应用时，建议尽可能地把 `state` 范式化，把所有数据放到一个对象里，每个数据以 ID 为主键，不同实体或列表间通过 ID 相互引用数据，这种方法在 [normalizr](https://github.com/paularmstrong/normalizr) 文档里有详细阐述。

现在我们已经确定了 `state` 对象的结构，就可以开始开发 `reducer`。`reducer` 是一个纯函数，它接收旧的 `state` 和 `action`，返回新的 `state`，就像这样

```JavaScript
(previousState, action) => newState
```
还记不记得**三大原则**？

没错，最后一点**使用纯函数进行修改**，所以，**永远不要**在 `reducer` 里做这些操作：

* 修改传入的参数（即之前的 `state` 或 `action` 对象）
* 执行有副作用的操作，如 API 请求或路由跳转
* 调用非纯函数，如 `Date.now()` 或 `Math.random()` 等

将这些铭记于心后，就能创建对应之前 `action` 的 `reducer` 了。

```JavaScript
const initialState = {
  todos: []
}

function todoApp(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      }
    default:
      return state
  }
}
```
**注意：**

1. 不要修改传入的 `state`，否则它就不是个纯函数
2. 在遇到未知 `action` type 的时候，默认返回之前的 `state`

这样一个 `reducer` 就创建好了，是不是很简单？多个 `action` 也是如此，我们再来添加一个

```JavaScript
case TOGGLE_TODO:
  return {
    ...state,
    todos: state.todos.map((todo, index) => {
      if (index === action.index) {
        return {
          ...todo,
          completed: !todo.completed
        } // 时刻谨记不要修改 state，保证 reducer 是纯函数
      }
      return todo
    })
  }
```

从例子中可以发现，当对 `state` 的一部分进行操作时，不会影响 `state` 的其他部分，但仍需复制 `state` 树的其他部分。当项目的规模成长时，`state` 树的层次也会随之增长，对树深层节点的操作将会带来大量的复制。

此时，我们就可以将这些相互独立的 `reducer` 拆分开来，我们之前的例子就可以改成这样(官网的例子更能体现这一点，为了缩减篇幅我这里省略了另一个 `reducer`)。

```JavaScript
// todos reducer
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return {
            ...todo,
            completed: !todo.completed
          } // 时刻谨记不要修改 state，保证 reducer 是纯函数
        }
        return todo
      })
    default:
      return state
  }
}

// main reducer
function todoApp(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
    case TOGGLE_TODO:
      return {
        ...state,
        todos: todos(state.todos, action)
      }
   default:
      return state
  }
}
```
这就是所谓的 `reducer` 合成，它是开发 Redux 应用的基础。

**注意：**每个 `reducer` 应当只负责管理全局 `state` 中它负责的一部分；并且，每个 `reducer` 的 `state` 参数分别对应它管理的那部分 `state`。

由于，每个 `reducer` 应当只负责管理全局 `state` 中它负责的一部分，那么上面的 main `reducer` 就能改为

```JavaScript
// main reducer
function todoApp(state = initialState, action) {
  return {
    todos: todos(state.todos, action)
  }
}
```
最后，Redux 提供了 `combineReducers()` 工具类，它能帮我们减少很多重复的模板代码。

`combineReducers()` 就像一个工厂，它根据传入对象的 key 来筛选出 `state` 中 key 所对应的值传给对应的 `reducer`，最终它返回一个符合规范的 reducer 函数。 

最终，我们的 main `reducer` 就变为

```JavaScript
// main reducer
const todoApp = combineReducers({
  todos // 等价于 todos: todos(state.todos, action)
})
```
随着应用的膨胀，你可以将拆分后的 `reducer` 放到不同的文件中, 以保持其独立性。然后，你的代码就可以变成这样...

```JavaScript
import { combineReducers } from 'redux'
import * as reducers from './reducers'

const todoApp = combineReducers(reducers)

export default todoApp
```

![](https://o7nu3cbe9.bkt.clouddn.com/blog/getting-started-with-redux/to_heaven.jpeg)

#### Store
`Store` 用来存放整个应用的 `state`，并将 `action` 和 `reducer` 联系起来。它主要有以下几个职能：

* 存储整个应用的 `state`
* 提供 `getState()` 方法获取 `state`
* 提供 `dispatch(action)` 方法更新 `state`
* 提供 `subscribe(listener)` 来注册、取消监听器

根据已有的 `reducer` 来创建 `store` 非常容易，只需将 `reducer` 作为参数传递给 `createStore()` 方法。

```JavaScript
import { createStore } from 'redux'
import todoApp from './reducers'
let store = createStore(todoApp)
```
这样，整个应用的 `store` 就创建完成了。虽然还没有界面，但我们已经可以测试数据处理逻辑了。

```JavaScript
import { addTodo, toggleTodo } from './actions'

// 打印初始状态
console.log(store.getState())

// 注册监听器，在每次 state 更新时，打印日志
const unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

// 发起 actions
store.dispatch(addTodo('Learn about actions'))
store.dispatch(addTodo('Learn about reducers'))
store.dispatch(addTodo('Learn about store'))
store.dispatch(actions.toggleTodo(0))
store.dispatch(actions.toggleTodo(1))

// 停止监听
unsubscribe();
```
运行代码，控制台中就能看到下面的输出。

![控制台输出](https://o7nu3cbe9.bkt.clouddn.com/blog/getting-started-with-redux/redux_console_output.png)

### Data flow
时刻谨记一点：**严格的单向数据流是 Redux 架构的设计核心**。

也就是说，对 `state` 树的任何修改都该通过 `action` 发起，然后经过一系列 `reducer` 组合的处理，最后返回一个新的 `state` 对象。

### Take a try with Angular
之前的举例已经将 redux 最基本的一套生命周期处理展示完毕了，但没有个界面显示总是不那么令人信服。Redux 官网的例子是将 Redux 同 React 一起使用，但如同一开始说的，Redux 更是一套方法论，它不单可以和 React 一同使用，也可以和 Angular 等其他框架一同使用。

虽然，同官网用的是不同的框架，但概念是相通的。

首先，页面都是由组件构成，组件又分为两大类：**容器组件（Smart/Container Components）**和**展示组件（Dumb/Presentational Components）**。

|  | 容器组件 | 展示组件 |
| --- | :---: | :---: |
| 目的 | 数据处理，state 更新 | 界面展示 |
| 受 redux 影响 | 是 | 否 |
| 数据来源 | `store.subscribe()` | 组件属性传递 |
| 修改数据 | `store.dispatch()` | 调用通过组件属性传递的方法 |

简单来说，容器组件就是通过 `store.subscribe()` 这个方法监听 `store` 中 `state` 的变化，而展示组件，就是平常使用的普通的组件，只有一点需要注意的是，所有数据修改都是通过父组件中传递下来的 `store.dispatch()` 方法来修改。

可以说，容器组件是整个界面显示的核心。

```JavaScript
// todos/index.js
import angular from 'angular'
import template from './todos.html'
import controller from './todos'

const todoContainer = {
	controller,
	template
}

export default angular.module('todoContainer', [])
	.component('todoContainer', todoContainer)
	.name
	
// todos/todos.js
import store from '../../store'
import actions from '../../actions'

export default class TodosContainController {

	$onInit() {
		// 注册监听器，在每次 state 更新时，更新页面绑定内容
		this.unsubscribe = store.subscribe(() => {
				console.log(store.getState())
				this.todos = store.getState().todos
		})
	}

	addTodoItem(text) {
		store.dispatch(actions.addTodo(text))
	}

	toggleTodoItem(index) {
		store.dispatch(actions.toggleTodo(index))
	}

	$onDistory() {
		// 销毁监听器
		this.unsubscribe()
	}
}	

// todos/todos.html
<div>
	<add-todo add-todo-fn="$ctrl.addTodoItem(text)"></add-todo>
	<todo-list todo-list="$ctrl.todos" toggle-todo-fn="$ctrl.toggleTodoItem(index)"></todo-list>
</div>
```

Redux 官网并不建议直接这样使用 `store.subscribe()` 来监听数据的变化，而是调用 React Redux 库的 `connect()` 方法，因为 `connect` 方法做了许多性能上的优化。相对于 Angular，也有 [ng-redux](https://github.com/angular-redux/ng-redux) 和 [ng2-redux](https://github.com/angular-redux/ng2-redux) 提供了相同的方法。

鉴于展示组件与 redux 并没有太大的相关，就不在这里赘述了，有兴趣可以去 [github](https://github.com/DiscipleD/angular-redux-todoMVC) 上查看。

至此，一个简单的基于 Angular 并运用 Redux 的 todo MVC 应用就完成了。

### 最后
如果你熟悉 Flux，那么这篇图文并茂的[文章](https://github.com/jasonslyvia/a-cartoon-intro-to-redux-cn)获取会对你有很大的帮助。

如果你是和我一样直接接触 Redux，那[官方文档](http://redux.js.org/)是你的首选。

当然，你一定得看看 Redux 作者 Dan Abramov 自己录制的[视频](https://egghead.io/courses/getting-started-with-redux)，它会对你理解 Redux 有极大的帮助。
