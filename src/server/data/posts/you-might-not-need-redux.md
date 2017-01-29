> 原文链接：[You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367#.a98d3x6e7)

人们常常在正真需要 Redux 之前，就选择使用它。“如果不使用 Redux，我们的应用无法扩展怎么办？”应用接入 Redux 之后，开发者就开始头疼了。“为什么为了开发一个简单的功能需要创建 3 个文件？”为什么！

![为什么！(配图译者加)](https://o7nu3cbe9.bkt.clouddn.com/blog/you-might-not-need-redux/wtf.png)

人们痛苦地抱怨 Redux, React, FP, 不可变数据和一些别的东西，但我理解他们。那些不需要一系列代码来更新应用状态的方法自然比使用 Redux 更为简单。这说的没错，设计上也是如此。

Redux 提供了一种权衡。它要求你：

* 用简单的对象和数组来描述应用状态
* 用简单对象来描述应用中的变更
* 用纯函数来描述处理变更的逻辑

无论是不是 React 应用，这些限制都不是创建一个应用所必须的。事实上，这些都是非常强的约束，在把它们加入应用之前，你应当慎重考虑。

你有没有一些好的理由来使用 Redux？

当然是有的。这些限制吸引我是因为它同时也能够使应用拥有以下的特性：

* [持久化应用状态到 LocalStorage，之后应用可以根据该状态启动。](https://egghead.io/lessons/javascript-redux-persisting-the-state-to-the-local-storage?course=building-react-applications-with-idiomatic-redux)（视频预警）
* [服务器初始化应用状态，客户端直接根据该状态启动。](http://redux.js.org/docs/recipes/ServerRendering.html)
* [序列化用户操作，并将它们连同应用状态的快照一同添加到错误报告中，使得产品开发人员能够通过重放用户操作来重现错误。](https://github.com/dtschust/redux-bug-reporter)
* [无需要对代码做巨大的修改，就能通过网络传递简单的 Action 对象来实现协作环境。](https://github.com/philholden/redux-swarmlog)
* [无需要对代码做巨大的修改，就能实现撤销或重做。](http://redux.js.org/docs/recipes/ImplementingUndoHistory.html)
* [在开发环境中，可以在应用状态历史中旅行，并且当代码修改时，会根据操作历史重新计算当前状态。](https://github.com/gaearon/redux-devtools)
* [开发工具提供了全面的检查和控制能力，使产品开发人员能为他们的应用构建自定义工具。](https://github.com/romseguy/redux-devtools-chart-monitor)
* [当 UI 变更时，可以重用大部分业务逻辑。](https://www.youtube.com/watch?v=gvVpSezT5_M&feature=youtu.be&t=11m51s)（视频预警）

如果，你正在开发一个[可扩展的终端](https://hyperterm.org/)、[JavaScript 调试器](https://hacks.mozilla.org/2016/09/introducing-debugger-html/)，或是[某些类型的应用](https://twitter.com/necolas/status/727538799966715904)，那么，Redux 也许值得一试。至少，它是值得考虑的。（顺便说一句，[Elm](https://github.com/evancz/elm-architecture-tutorial) 和 [Om](https://github.com/omcljs/om) 并不是新技术。）

然而，如果你只是学习 React，那么，Redux 并不是你的首选。

与之相反，你该看看[理解 React](https://facebook.github.io/react/docs/thinking-in-react.html)。当你有真正的需要或想玩一些新东西的时候，才去尝试 Redux。然而，就像你使用其他强限制的工具一样，谨慎地选择是否使用它。

如果，你觉得用 Redux 的方式编码有压力，那可能意味着你或你的伙伴对此太较真了。Redux 只是你工具箱中的[一件工具](https://www.youtube.com/watch?v=xsSnOQynTHs)，[一种尝试](https://www.youtube.com/watch?v=uvAXVMwHJXU)。

最后，记住你可以将 Redux 的理念运用到你的应用中，但不使用 Redux。试想一下，一个拥有本地状态的 React 组件：

```JavaScript
import React, { Component } from 'react';

class Counter extends Component {
  state = { value: 0 };

  increment = () => {
    this.setState(prevState => ({
      value: prevState.value + 1
    }));
  };

  decrement = () => {
    this.setState(prevState => ({
      value: prevState.value - 1
    }));
  };
  
  render() {
    return (
      <div>
        {this.state.value}
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
      </div>
    )
  }
}
```

这是非常合理的。认真地说，它值得重复使用。

> 本地状态是好的。

Redux 提供的权衡是通过增加中间环节来将“发生了什么”和“该如何变化”之间进行解耦。

这样做是不是总是正确的哪？不，这是一种权衡。

比如，我们可以从组件中将 reducer 抽出：

```JavaScript
import React, { Component } from 'react';

const counter = (state = { value: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { value: state.value + 1 };
    case 'DECREMENT':
      return { value: state.value - 1 };
    default:
      return state;
  }
}

class Counter extends Component {
  state = counter(undefined, {});
  
  dispatch(action) {
    this.setState(prevState => counter(prevState, action));
  }

  increment = () => {
    this.dispatch({ type: 'INCREMENT' });
  };

  decrement = () => {
    this.dispatch({ type: 'DECREMENT' });
  };
  
  render() {
    return (
      <div>
        {this.state.value}
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
      </div>
    )
  }
}
```

发现没有，我们不必运行 npm install 就能使用 Redux。酷！

状态组件能不能也这样做？可能不行。也就是说，除非你有打算从额外的中间环节中受益。在当前这个时代，想法才是关键。

Redux 库它本身只是一系列的助手将 reducers “挂载”到全局唯一的 store 对象上。你可以根据你的喜好来选择是尽可能少，或尽可能多得使用 Redux。

但是，如果你付出了一些，确保你同时也能获得一些回报。

译者注：如果你对本文感兴趣，你或许也会对这篇[文章](https://medium.freecodecamp.com/where-do-i-belong-a-guide-to-saving-react-component-data-in-state-store-static-and-this-c49b335e2a00)感兴趣。