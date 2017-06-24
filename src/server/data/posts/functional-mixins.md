> 原文链接：[Functional Mixins](https://medium.com/javascript-scene/functional-mixins-composing-software-ffb66d5e731c)  
> 译者注：在编程中，mixin 类似于一个固有名词，可以理解为混合或混入，通常不进行直译，本文也是同样。


> 这是“软件构建”系列教程的一部分，该系列主要从 JavaScript ES6+ 中学习函数式编程，以及软件构建技术。敬请关注。  
> [上一篇](https://medium.com/javascript-scene/functors-categories-61e031bac53f) | [第一篇](https://medium.com/javascript-scene/composing-software-an-introduction-27b72500d6ea)

**Mixin 函数** 是指能够给对象添加属性或行为，并可以通过管道连接在一起的组合工厂函数，就如同流水线上的工人。Mixin 函数不依赖或要求一个基础工厂或构造函数：简单地将任意一个对象传入一个 mixin，就会得到一个增强之后的对象。

Mixin 函数的特点：

* 数据封装
* 继承私有状态
* 多继承
* 覆盖重复属性
* 无需基础类

### 动机
现代软件开发的核心就是组合：我们将一个庞大复杂的问题，分解成更小，更简单的问题，最终将这些问题的解决办法组合起来就变成了一个应用程序。

组合的最小单位就是以下两者之一：

* 函数
* 数据结构

他们的组合就定义了应用的结构。

通常，组合对象由类继承实现，其中子类从父类继承其大部分功能，并扩展或覆盖部分。这种方法导致了 **is-a** 问题，比如：管理员是一名员工，这引发了许多设计问题：

* 高耦合：由于子类的实现依赖于父类，所以类继承是面向对象设计中最紧密的耦合。
* 脆弱的子类：由于高耦合，对父类的修改可能会破坏子类。软件作者可能在不知情的情况下破坏了第三方管理的代码。
* 层次不灵活：根据单一祖先分类，随着长时间的演变，最终所有的类都将不适用于新用例。
* 重复问题：由于层次不灵活，新用例通常是通过重复而不是扩展来实现的，这导致不同的类有着相似的类结构。而一旦重复创建，在创建其子类时，该继承自哪个类以及为什么继承于这个类就不清晰了。
* 大猩猩和香蕉问题：“...面向对象语言的问题是他们会获得所有与之相关的隐含环境。比如你想要一个香蕉，但你得到的会是一只拿着香蕉的大猩猩，以及一整片丛林。” - Joe Armstrong([Coders at Work](https://www.amazon.com/gp/product/1430219483?ie=UTF8&camp=213733&creative=393185&creativeASIN=1430219483&linkCode=shr&tag=eejs-20&linkId=3MNWRRZU3C4Q4BDN))

假设管理员是一名员工，你如何处理聘请外部顾问暂时行使管理员职务的情况？（译者：木知啊~）如果你事先知道所有的需求，类继承可能有效，但我从没有看到过这种情况。随着不断地使用，新问题和更有效的流程将会被发现，应用程序和需求不可避免地随着时间的推移而发展和演变。

Mixin 提供了更灵活的方法。

### 什么是 Mixin？

> “组合优于继承。” - [设计模式：可重用面向对象软件的元素](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612/ref=as_li_ss_tl?ie=UTF8&qid=1494993475&sr=8-1&keywords=design+patterns&linkCode=ll1&tag=eejs-20&linkId=6c553f16325f3939e5abadd4ee04e8b4)

**Mixin** 是对象组合的一种，它将部分特性混入复合对象中，使得这些属性成为复合对象的属性。

面向对象编程中的 "mixin" 一词来源于冰激凌店。不同于将不同口味的冰激凌预先混合，每个顾客可以自由混合各种口味的冰激凌，从而创造出属于自己的冰激凌口味。

对象 mixin 与之类似：从一个空对象开始，然后一步步扩展它。由于 JavaScript 支持动态对象扩展，所以在 JavaScript 中使用对象 mixin 是非常简单的。它也是 JavaScript 中最常见的继承形式，来看一个例子：

```JavaScript
const chocolate = {
  hasChocolate: () => true
};
const caramelSwirl = {
  hasCaramelSwirl: () => true
};
const pecans = {
  hasPecans: () => true
};
const iceCream = Object.assign({}, chocolate, caramelSwirl, pecans);
/*
// 支持对象扩展符的话也可以写成这样...
const iceCream = {...chocolate, ...caramelSwirl, ...pecans};
*/
console.log(`
  hasChocolate: ${ iceCream.hasChocolate() }
  hasCaramelSwirl: ${ iceCream.hasCaramelSwirl() }
  hasPecans: ${ iceCream.hasPecans() }
`);

/* 输出
  hasChocolate: true
  hasCaramelSwirl: true
  hasPecans: true
*/
```	

### 什么是函数继承？
函数继承是指通过函数来增强对象实例实现特性继承的过程。该函数建立一个闭包使得部分数据是私有的，并通过动态对象扩展使得对象实例拥有新的属性和方法。

来看一下这个词的创造者 Douglas Crockford 所给出的例子。

```JavaScript
// 父类
function base(spec) {
    var that = {}; // Create an empty object
    that.name = spec.name; // Add it a "name" property
    return that; // Return the object
}
// 子类
function child(spec) {
    // 调用父类构造函数
    var that = base(spec); 
    that.sayHello = function() { // Augment that object
        return 'Hello, I\'m ' + that.name;
    };
    return that; // Return it
}
// Usage
var result = child({ name: 'a functional object' });
console.log(result.sayHello()); // "Hello, I'm a functional object"
```

由于 `child()` 同 `base()` 紧密耦合在一起，当你想添加 `grandchild()`, `greatGrandchild()` 等时，你将面对类继承中许多常见的问题。

### 什么是 Mixin 函数?
Mixin 函数是一系列将新的属性或行为混入特定对象的组合函数。它不依赖或需要一个基础工厂方法或构造器，只需将任意对象传入一个 mixin 方法，它就会被扩展。

来看下面的例子。

```JavaScript
const flying = o => {
  let isFlying = false;
  return Object.assign({}, o, {
    fly () {
      isFlying = true;
      return this;
    },
    isFlying: () => isFlying,
    land () {
      isFlying = false;
      return this;
    }
  });
};
const bird = flying({});
console.log( bird.isFlying() ); // false
console.log( bird.fly().isFlying() ); // true
```

这里需要注意，当调用 `flying()` 时需要传递一个被扩展的对象。Mixin 函数被设计用来实现函数组合，继续看下去。

```JavaScript
const quacking = quack => o => Object.assign({}, o, {
  quack: () => quack
});
const quacker = quacking('Quack!')({});
console.log( quacker.quack() ); // 'Quack!'
```

### 组合 Mixin 函数
通过简单的函数组合就可以将 mixin 函数组合起来。

```JavaScript
const createDuck = quack => quacking(quack)(flying({}));
const duck = createDuck('Quack!');
console.log(duck.fly().quack());
```

但是，这看上去有点丑陋，调试或重新排列组合顺序也有点困难。

当然，这只是标准的函数组合，而我们可以通过一些好的办法来将它们组合起来，比如 `compose()` 或 `pipe()`。如果，使用 `pipe()` 就需反转函数的调用顺序，才能保持相同的执行顺序。当属性冲突时，最后的属性生效。

```JavaScript
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
// OR...
// import pipe from `lodash/fp/flow`;
const createDuck = quack => pipe(
  flying,
  quacking(quack)
)({});
const duck = createDuck('Quack!');
console.log(duck.fly().quack());
```

### Mixin 函数的使用场景
你应当总是使用最简单的抽象来解决问题。从纯函数开始。如果需要一个持久化状态的对象，就试试工厂方法。如果你需要构建更复杂的对象，那就试试 Mixin 函数。

以下是一些使用 Mixin 函数很棒的例子：

* 应用状态管理，比如，Redux
* 某些横向服务，比如，集中日志处理
* 组件生命周期函数
* 功能可组合的数据类型，比如，JavaScript `Array` 类实现了 [`Semigroup`](https://en.wikipedia.org/wiki/Semigroup), [`Functor`](https://en.wikipedia.org/wiki/Functor), [`Foldable`](https://en.wikibooks.org/wiki/Haskell/Foldable)

一些代数结构可以根据其他代数结构得出，这意味着新的数据类型可以通过某些推导组合而成，而不需要定制。

### 注意事项
大部分问题都可以使用纯函数优雅地解决。然而，mixin 函数同类继承一样，会造成一些问题。事实上，使用 mixin 函数能够完全复制类继承的优缺点。

你应当遵循以下的建议来避免这些问题。

* 使用最简单的实现。从左边开始，根据需要移到右边。纯函数 > 工厂方法 > mixin 函数 > 类
* 避免创建对象，mixin，或数据类型之间的 is-a 关系
* 避免 mixins 之间的隐含依赖关系，mixin 函数应当是独立的
* mixin 函数并不意味着函数式编程

### 类
在 JavaScript 中，类继承在极少情况下（也许永远不）会是最佳方案，但这通常是一些不由你控制的库或框架。在这种场景下，类有时是实用的。

1. 无需扩展你自己的类（不需要你建立多层次的类结构）
2. 无需使用 `new` 关键字，也就是说，框架会替你实例化

Angular 2+ 和 React 满足这些需求，所以你无需扩展你自己的类，而是放心地使用它们的类。在 React 中，你可以不使用类，不过这样你的组件将不会获得 React 的优化，并且你的组件也会同文档中的例子不同。但无论如何，使用函数构建 React 组件总是你的首选。

#### 性能
在一些浏览器中，类会获得 JavaScript 引擎的优化，其他的则无法直接使用。在几乎所有情况下，这些优化都不会对程序产生决定性的影响。事实上，在接下去的几年中，你都无需关心类在性能上的不同。无论你如何构建对象，对象创建和属性访问总是非常快的（每秒百万次）。

也就是说，类似 RxJS，Lodash 等公共库的作者应该研究使用 `class` 创建对象实例可能的性能优势。除非你能够证明通过类能够解决性能瓶颈，否则，你就应当使你的代码保持干净、灵活，而不必担心性能。

### 隐式依赖
你可能打算创建一些计划用于一同工作的 mixin 函数。试想一下，你想要为你的应用添加一个配置管理器，当你访问不存在的配置属性时，它会提示警告，像这样：

```JavaScript
// log 模块
const withLogging = logger => o => Object.assign({}, o, {
  log (text) {
    logger(text)
  }
});

// 确认配置项存在模块，同 log 模块无关，这里只是确保 log 存在
const withConfig = config => (o = {
  log: (text = '') => console.log(text)
}) => Object.assign({}, o, {
  get (key) {
    return config[key] == undefined ?
      // vvv 隐式依赖! vvv
      this.log(`Missing config key: ${ key }`) :
      // ^^^ 隐式依赖! ^^^
      config[key]
    ;
  }
});
// 模块封装
const createConfig = ({ initialConfig, logger }) =>
  pipe(
    withLogging(logger),
    withConfig(initialConfig)
  )({})
;
// 调用
const initialConfig = {
  host: 'localhost'
};
const logger = console.log.bind(console);
const config = createConfig({initialConfig, logger});
console.log(config.get('host')); // 'localhost'
config.get('notThere'); // 'Missing config key: notThere'
```

也可以是这样，

```JavaScript
// 引入 log 模块
import withLogging from './with-logging';
const addConfig = config => o => Object.assign({}, o, {
  get (key) {
    return config[key] == undefined ? 
      this.log(`Missing config key: ${ key }`) :
      config[key]
    ;
  }
});
const withConfig = ({ initialConfig, logger }) => o =>
  pipe(
    // vvv 明确的依赖! vvv
    withLogging(logger),
    // ^^^ 明确的依赖! ^^^
    addConfig(initialConfig)
  )(o)
;
// 工厂方法
const createConfig = ({ initialConfig, logger }) =>
  withConfig({ initialConfig, logger })({})
;

// 另一模块
const initialConfig = {
  host: 'localhost'
};
const logger = console.log.bind(console);
const config = createConfig({initialConfig, logger});
console.log(config.get('host')); // 'localhost'
config.get('notThere'); // 'Missing config key: notThere'
```

选择隐式还是显式取决于很多因素。Mixin 函数作用的数据类型必须是有效的，这就需要 API 文档中的函数签名非常清晰。

这就是隐式依赖版本中为 `o` 添加默认值的原因。由于 JavaScript 缺少类型注释功能，但我们可以通过默认值来代替它。

```JavaScript
const withConfig = config => (o = {
  log: (text = '') => console.log(text)
}) => Object.assign({}, o, {
  // ...
```

如果你使用 TypeScript 或 Flow，最好为你的对象参数定义一个明确的接口。

### Mixin 函数与函数式编程
Mixin 函数并不像函数式编程那样纯。Mixin 函数通常是面向对象编程风格，具有副作用。许多 Mixin 函数会改变传入的参数对象。注意！

出于同样的原因，一些开发者更喜欢函数式编程风格，不修改传入的对象。在编写 mixin 时，你应当适当地使用这两种编码风格。

这意味着，如果你要返回对象的实例，则始终返回 `this`，而不是闭包中对象实例的引用。因为在函数式编程中，很有可能这些引用指向的并不是同一个对象。另外，总是使用 `Object.assign()` 或 `{...object, ...spread}` 语法进行复制。但需要注意的是，非枚举的属性将不会存在于最终的对象上。

```JavaScript
const a = Object.defineProperty({}, 'a', {
  enumerable: false,
  value: 'a'
});
const b = {
  b: 'b'
};
console.log({...a, ...b}); // { b: 'b' }
```

出于同样的原因，如果你使用的 mixin 函数不是自己构建的，就不要认为它就是纯的。假设基础对象会被改变，假设它可能会产生副作用，不保证参数不会改变，即由 mixin 函数组合而成的记录工厂通常是不安全的。

### 结论
Mixin 函数是可组合的工厂方法，它能够为对象添加属性和行为，就如同装配线上的站。它是将多个来源的功能（has-a, uses-a, can-do）组合成行为的好方法，而不是从一个类上继承所有功能（is-a）。

记住，“mixin 函数” 并不意味着“函数式编程”。Mixin 函数可以用函数式编程风格编写，避免副作用并不修改参数，但这并不保证。第三方 mixin 可能存在副作用和不确定性。

* 不同于对象 mixin，mixin 函数支持正真的私有数据（封装），包括继承私有数据的能力。
* 不同于单继承，mixin 函数还支持继承多个祖先的能力，类似于类装饰器或多继承。
* 不同于 C++ 中的多继承，JavaScript 中很少出现属性冲突问题，当属性冲突发生时，总是最后添加的 mixin 有效。
* 不同于类装饰器或多继承，不需要基类

总是从最简单的实现方式开始，只根据需要使用更复杂的实现方式：

**纯函数 > 工厂方法 > mixin 函数 > 类**
