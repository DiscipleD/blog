说到关于 Angular Styleguide，很多人可能会想到[这篇](https://github.com/johnpapa/angular-styleguide/tree/master/a1)经典的文章。的确，它是一篇非常棒的文章，甚至已经被翻译成许多种语言（包括[中文](https://github.com/johnpapa/angular-styleguide/blob/master/a1/i18n/zh-CN.md)），在 github 上更是拥有将近 1.9w 个 star。

然而，这次谈论的不是它。因为随着 ES6 的广泛应用，以及 Angular 1.5 的发布，它有那么一点点不够时髦（也谈不上过时哈~）。

本文的大部分观点都来自这篇[文章](https://github.com/toddmotto/angular-styleguide)（以下简称原文），但个人根据工作上积累的一些经验添并不是完全认同原文的所有想法，并想去除些繁冗的例子，于是就没有直接翻译原文。

言归正传，下面就来看看使用 ES6 来编写基于 Angular 1.5 的代码有哪些最佳实践。

### 模块架构
在 Angular 体系中，所有代码都是基于模块的，它来封装模块内部的逻辑、模板、路由和子模块。

#### 模块划分
原文将模块分为 3 大类，分别是：root, component 和 common，并创建相应的文件夹来储存。  

* root：根模块组件，用来启动应用和相应模板
* component：包含所有可重用的模块，模块中可以包含 components, controllers, services, directives, filters and tests
* common：包含所有业务的模块（即不可重用，和 component 最大的区别），它可以是页面布局、导航和页脚等等。

[原文](https://github.com/toddmotto/angular-styleguide#root-module)中有详细的例子，但就如文章开头所说，在这里就不贴了。

但是，我并不完全认同原文观点。

因为，common 的翻译是公共的，在 common 中存放业务代码也和我们一直以来的做法相悖；其次是，在 Angular 的开发过程中，还是存在一些可以在业务逻辑中公用的代码，比如 service 和 filter。所以，我更倾向于将它分为 4 部分，分别是 root, app, component 和 common。

* root：和原文的作法一样，依旧是用来启动应用，并包含了应用的模板（并不一定要一个文件夹，可以是根目录下的一个 app.js 文件）
* app：类似于之前的 common 模块，包含所有的业务模块组件
* component：同原文的一样，包含所有可重用的模块组件
* common：公用代码模块，包含可公用的代码，如 service 和 filter

![附一张项目中的代码结构图](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/angular1.5-with-ES6-styleguide/module-file-structure.jpg)

#### 模块导出
使用 ES6 肯定会使用强大的模块语法，在同 Angular 一同使用时，一定要注意导出的是模块的名字，而非是 Angular 的模块对象，这样才能再另一处被其他模块注入。

```Javascript
// 精简了原文的代码，去除了一些和这节无关的代码
import angular from 'angular';
import CalendarComponent from './calendar.component';

const calendar = angular
  .module('calendar', [])
  .component('calendar', CalendarComponent)
  .name;

export default calendar;
```

#### 文件命名
首先，为每个模块添加 `index.js` 文件来定义整个模块，这样再别的模块中可以通过文件夹直接引入。

原文使用`模块名.文件内容.文件类型`的方式来命名一个文件，如 calendar.controller.js 等。

我完全同意第一个观点，但第二个中的模块名就没有添加的必要，因为文件夹名已经很好的体现了模块名这个含义。

![再附一张项目中的模块结构图](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/angular1.5-with-ES6-styleguide/component-file-structure.jpg)

### 组件(Component)
组件是 Angular 1.5 新提出的，是一种特殊的指令，Augular 的源码中也彰显了这一点。

它相比指令更多的是数据的单向绑定和生命周期钩子，尽管我认为所谓的生命周期钩子只是语法糖，甚至组件它本身就是个语法糖，但这不妨碍它成为 Angular 体系中重要的一部分。因为，它的推出明确的区分了指令和组件，解决了原先指令划分不清、承担过多工作的问题。

#### 组件属性
Property | Support 
--- | ---
bindings | Yes, 只使用 `@`, `<`, `&`，避免使用 `=`
controller | Yes
controllerAs | Yes, 默认为 `$ctrl`
require | Yes
template | Yes
templateUrl |Yes
transclude | Yes

#### 控制器(controller)
控制器只应在组件中使用，如果你只想创建一个控制器，那你应创建一个无状态组件来管理它。

使用 `class` 关键字来创建控制器时要注意以下几点：

* 使用 `constructor` 处理依赖注入
* 之前提到过，导出模型名，而并不是直接导出模型
* 使用箭头函数
* 使用 `$onInit`, `$onChanges`, `$postLink` 和 `$onDestroy` 生命周期  
	（注意：`$onChanges` 会在 `$onInit`之前被调用）
* 使用默认的控制器 `$ctrl`，不使用 `controllerAs` 修改控制器的别名

#### 单向数据流
* 总是使用 `<` 单向数据绑定来代替 `=` 双向数据绑定
* 使用 `$onChanges` 来监听数据的变化
* 父组件的方法使用 `$event` 作为参数传递的名字
* 子组件调用时返回一个包含有 `$event` 属性的对象

这是不是看上去很像 [Redux](http://redux.js.org/)？没错，原文的作者也是推荐使用 [Angular Redux](https://github.com/angular-redux/ng-redux) 来管理状态。

#### 状态组件(Stateful components)和无状态组件(Stateless components)
状态组件和无状态组件其实分别对应了 [Redux](http://redux.js.org/docs/basics/UsageWithReact.html) 中的容器组件（Smart/Container Components）和展示组件（Dumb/Presentational Components），这部分原作者主要也是表达了在 Angular 中实现单向数据流的理念，但原作者提供的例子并不是完整的 Redux，它没有单一的 Store 和 Reducer。

### 指令（Directive）
相信指令大家都很熟悉了，但自从 Angular 1.5 提供了组件，指令的选择就应当慎重考虑，它应当只在装饰 DOM 时使用。

* 不使用 `template`, `templateUrl`, `scope`, `bindToController` 或 `controller` 等相关的属性，如果想用，考虑是不是它可以用 `component` 来实现
* 总是使用 `restrict: 'A'`

#### 指令属性
Property | 是否使用 | Why
--- | --- | ---
bindToController | No | 使用组件替代
compile | Yes | DOM 操作/事件的预处理
controller | No | 使用组件替代
controllerAs | No | 使用组件替代
link functions | Yes | DOM 操作/事件的处理
multiElement | Yes | [See docs](https://docs.angularjs.org/api/ng/service/$compile#-multielement-)
priority | Yes | [See docs](https://docs.angularjs.org/api/ng/service/$compile#-priority-)
require | No | 使用组件替代
restrict | Yes| 总是使用 `restrict: 'A'`
scope | No | 使用组件替代
template | No | 使用组件替代
templateNamespace | Yes (如果必须) | [See docs](https://docs.angularjs.org/api/ng/service/$compile#-templatenamespace-)
templateUrl | No | 使用组件替代
transclude | No | 使用组件替代

### 服务（Service）
服务主要用于封装一些不应在组件中处理的业务逻辑和请求。

Angular 提供 2 种创建服务的方式 `service` 和 `factory`。在 ES6 引入了 `class` 关键字后，它能非常友好地同 `service`一起工作，所以，无论何时都使用 `service` 来创建服务。

### 类 or 方法
原文的标题是[常量或类（Constants or Classes）](https://github.com/toddmotto/angular-styleguide#constants-or-classes)，容许我自作主张的修改一下标题，因为我认为原文的实现的区别更主要的在于是使用**类或方法**去定义一个服务或控制器等。

当然这两种方法都可以，因为类它本身就是方法的一个语法糖。但是，Angular 2 是重度依赖 `class` 关键字的，所以，我认为还是全部统一使用 `class` 关键字来声明服务、控制器、过滤器、指令和组件的定义等。

值得注意的是，Angular 组件和指令定义的参数是一个对象，所以在使用 `class` 定义时，要手动实例化它。

### 工具
最后，原文作者还推荐了一些工具

* [Babel](https://babeljs.io/)：编译工具，这就不多说了，必备神器
* [TypeScript](http://www.typescriptlang.org/)：还是为了 A2
* [Webpack](https://webpack.github.io/)：打包工具，用过都说好
* [ngAnnotate](https://github.com/olov/ng-annotate)：自动依赖注入，和打包工具一起服用效果更好
* [Angular Redux](https://github.com/angular-redux/ng-redux)：状态管理

以上为个人观点，欢迎交流。