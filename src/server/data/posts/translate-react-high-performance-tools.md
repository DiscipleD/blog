> 原文链接：[High Performance React: 3 New Tools to Speed Up Your Apps](https://medium.freecodecamp.org/make-react-fast-again-tools-and-techniques-for-speeding-up-your-react-app-7ad39d3c1b82)

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/translate-react-high-performance-tools/banner.png)

React 应用通常非常快，但一些小疏忽同样会造成性能问题。缓慢地组件装载，深层的组件树，以及不必要的渲染很快会使应用感觉上变慢。

幸运的是，有一些工具能够诊断性能问题，其中一些甚至是 React 自带的。在本文中，我将介绍一些加速 React 的工具和技术。每一部分都有一个有趣的例子。

## 工具 1：The Performance Timeline
React 15.4.0 推出了一个新特性：性能时间轴。它使你能够确切地知道组件挂载、更新和卸载的时间，以及用可视化的方式让你了解相关组件的生命周期。

注意：由于，它使用了尚未在所有浏览器中实现的 [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API)，所以到现在为止，这个特性只能在 Chrome, Edge 和 IE 下工作。

### 如何使用
1. 打开应用，并在地址栏中添加 `react_perf` 查询参数。如：`http://localhost:3000?react_perf`
2. 打开 Chrome 的开发者工具的 Performance（性能）选项卡，点击 Record（录制）
3. 运行你想要分析的动作
4. 停止录制
5. 查看运行结果

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/translate-react-high-performance-tools/performance-timeline.png)

### 理解结果
每个色条显示一个组件正在执行某项工作。由于 JavaScript 是单线程的，所以每当一个组件挂载或渲染，它会阻塞主线程并阻止其他的代码运行。

中括号中的文字，像 [update]，描述了组件正处于生命周期的哪一部分。时间轴会根据不同的生命周期分解成各段，使你了解每个周期所消耗的时间，如 [componentDidMount], [componentWillReceiveProps], [ctor]（构造器）和 [render]。

堆叠的条表示组件树。虽然在 React 中通常有着较深的组件树，但当你试图优化一个经常挂载的组件时，它可以帮助减少包装组件的数量，从而减少性能和内存上的消耗。

有一点需要注意，时间轴工具是用于开发环境的 React 工具。事实上，性能时间轴它本身就会拖慢你的应用。但不必担心这个，因为它不会对生产环境造成影响，并且组件与组件之间相对的时间消耗是准确的。

### 例 1
为了演示，我修改了 TodoMVC 应用使它有一些严重的性能问题。你可以在[这里试试看](https://perf-demo.firebaseapp.com/?react_perf)。（需科学上网）

先打开 Chrome，切换到 `Performance` 选项卡，点击开始录制。接着，添加一个待办事项，然后停止录制，查看结果。试试看看是否能够找到引起性能问题的组件。

## 工具 2：why-did-you-update
React 中最常见的性能问题之一就是不必要的渲染。默认情况下，在 React 中当父组件渲染时，即使传入的属性没有变更，子组件也会重新渲染。

比如，假设我有一个简单的组件像这样：

```JavaScript
class DumbComponent extends Component {
  render() {
    return <div> {this.props.value} </div>;
  }
}
```

它的父组件像这样：

```JavaScript
class Parent extends Component {
  render() {
    return <div>
      <DumbComponent value={3} />
    </div>;
  }
}
```

无论父组件合适渲染，子组件都会重新渲染，即使属性没有发生改变。

通常，因为 `render` 方法应当是纯净的、没有副作用的，所以，虚拟 DOM 不会发生改变，这只是浪费了运行 `render` 方法的性能。在大型 React 应用里检查这种情况非常困难，幸运的是，有一个工具可以处理这个问题。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/translate-react-high-performance-tools/why-did-you-update.png)

### 使用 why-did-you-update
`why-did-you-update` 是一个 React 工具库，用于检测组件传入属性没有发生变化时，渲染方法是否被调用，从而避免潜在不必要的渲染。

### 安装
1. npm 安装：`npm i --save-dev why-did-you-update`
2. 在你的应用中添加

```JavaScript
import React from 'react'
if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update')
  whyDidYouUpdate(React)
}
```

注意这个工具会拖慢应用，所以确保它只用于生产环境。

### 理解结果
`why-did-you-update` 监控你的应用并记录可能会引起不必要修改的组件。它能让你知道属性在渲染前后所代表的值，从而确定渲染是否是不必要的。

### 例 2
为了演示 `why-did-you-update`，我在 Code Sandbox 上创建了 TodoMVC 应用并安装了这个库。打开浏览器控制台，然后添加一些待办事项，最后，查看控制台的输出。

[例子点这里。](https://codesandbox.io/s/xGJP4QExn)

注意应用中的一些组件可能存在不必要的渲染，试着使用下面提到的一些方法来避免不必要的渲染。如果方法正确，那么控制台将不再有警告输出。

## 工具 2：React Developer Tools
![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/translate-react-high-performance-tools/react-developer-tools.png)

React 开发者工具 Chrome 扩展程序具有可视化组件更新的功能，这有助于检测不必要的渲染。

使用前，先请确保安装了此扩展。然后，打开 Chrome 控制台，切换到 `React` 选项卡并勾选 `Highlight Updates`。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/translate-react-high-performance-tools/highlight-updates.png)

接着，使用你的应用程序，并看 React 开发者工具显神威吧~

### 理解结果
React 开发者工具在一定时间内会高亮进行重新渲染的组件。根据不同的更新频率，使用不同的颜色，蓝色为不频繁，接着依次是绿色、黄色和红色。

当调整滚动条或其他触发频繁的 UI 控件时，看到黄色或红色不一定是坏事。但是，当你只是点击一个按钮就看到红色时，那就意味着哪里出错了。这个工具的目的是发现不必更新的组件。作为应用的开发者，你应当知道在一定的时间内哪些组件应该更新。

### 例 3
为了演示该工具，我又修改了 TodoMVC 应用，使它不必要地更新组件。

[想看例子点这里。](https://highlight-demo.firebaseapp.com/) （需科学上网）

点击上面的链接，然后打开 React 开发者工具并启用高亮。当你在输入框内输入时，你会看到所有的待办事项都不必要的被高亮了。当你快速输入时，你会看到颜色变得越来越红。

## 去除不必要的渲染
一旦你找到了不必要渲染的组件，这里有几个方法可以修复它。

### 使用纯组件
在上面的例子中，`DumbComponent` 是一个纯函数。这个组件只需当属性发生变化时才需要渲染。React 内置了一个特殊的组件类型 `PureComponent` 就是用于这样的场景。

像这样继承 `React.PureComponent`，而不是 `React.Component`

```JavaScript
class DumbComponent extends PureComponent {
  render() {
    return <div> {this.props.value} </div>;
  }
}
```
这样组件只会在属性发生变化时才会重新渲染。

需要注意的是，`PureComponent` 使用浅比较来比较传入的属性，所以，当你传入复杂的数据结构时，你的组件可能遗漏更新。

### 实现 shouldComponentUpdate
`shouldComponentUpdate` 是组件生命周期的一部分，当 `state` 或 `props` 改变时，会在 `render` 之前运行。如果 `shouldComponentUpdate` 返回 true，`render` 会执行，反之，则不运行。

通过实现此方法，你可以让 React 避免重复渲染组件。

例如，我们可以在上面的组件中实现 `shouldComponentUpdate`

```JavaScript
class DumbComponent extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.value !== nextProps.value) {
      return true;
    } else {
      return false;
    }
  }
render() {
    return <div>foo</div>;
  }
}
```

> 译注：最后作者安利了一个自己的[产品](https://logrocket.com/)，类似于线上的打点分析工具，有兴趣的可以看看，这里就不打广告了。
