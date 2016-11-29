自从我写[为什么使用柯里化？（译）](#!/posts/why-curry-helps)——一篇描述柯里化函数在 JavaScript 中强大能力的文章，已经有两年半的时间了。它是我阅读量最多的一篇文章，每月都为我带来数百个读者。

但随着时光流逝，世界变了，我也变了。通过柯里化来使你的代码更可读，依旧是个好主意么？

我不再那么肯定了。

### “这不是 [Haskell](https://www.haskell.org/)”

当我最初提出柯里化作为我们工作中一个额外的工具时，我的同事威廉（非真名）坚决坚持：

> 这不是 Haskell。

我同样固执的认为我们应使用好的技术。然而，我花了一段时间才意识到他是多么正确。

### 简单很重要，但易用也同样重要

在 Rich Hickey [简单成就易用](http://www.infoq.com/presentations/Simple-Made-Easy)的演讲中，他区分了简单和易用的概念。

他提出“简单”意味着逻辑清晰，而“易用”，则是接近于你当前的的理解。

但是，如果非常简单的代码会造成工作中突出的困难，而你的团队从中却获得很少。那此时，你就需要一个平衡，是编写简单的代码来避免 bug 和不断变化的需求；还是编写足够你的团队理解易读的代码。

这是 Haskell 和 JavaScript 第一个不同点。在 Haskell 中，柯里化是基本概念，每个 Haskell 开发者都理解它。

在 JavaScript 中，这个概念就像一个外星人。我谈论过的大多数 JavaScript 开发者发现它难以理解和阅读。虽然，你可能认为柯里化会使代码变的简单，但它并不能让身边所有的团队得益。

### 症状及原因

Haskell 有一个能够在编译时捕获许多 bugs 的类型系统。当我卡住了，我经常编译程序，并让编译器指引我下一步。

而 JavaScript 采用了相反的做法，编译时不作限制。这样做的好处是惊人的灵活性，不足之处就是错误很久才能被发现。

柯里化函数的参数太少是一个常犯的错误，而且它通常很晚才会被发现。

```JavaScript
var curry = require('curry');
var add = curry(function(a, b, c){ return a + b + c });

// 这里的 threeP 并不返回我们想要的 3 的 Promise，而是返回一个一元函数的 Promise。
// 调用 threeP 函数的代码可能不会预料到这个结果，而造成一个错误。
var threeP = Promise.resolve(1)
  .then(add(2))
```

在大多数更复杂的应用场景中，它会导致你或你的同事浪费宝贵的时间来寻找出错的根源。

### 箭头函数
几个月前 [Josh Habdas](https://disqus.com/by/jhabdas/) 评论了之前那篇[文章]():

> 在示例中，使用 [ES2015] 箭头函数将显著简化数据的访问。

他是对的。

毫无疑问，[为什么使用柯里化？（译）](#!/posts/why-curry-helps)的压轴案列是很棒的。它展示了使用 Promise 和一些工具函数来提取用户文章标题的列表。

```JavaScript
fetchFromServer()
    .then(JSON.parse)
    .then(get('posts'))
    .then(map(get('title')))
```

在之前的文章中，我尝试[多少种场景可以使用箭头函数替代？](https://hughfdjackson.com/javascript/arrow-function-syntax/)，并应用这个新语言的特性来代替柯里化函数带来的大部分的好处：

```JavaScript
fetchFromServer()
    .then(JSON.parse)
    .then(data => data.posts)
    .then(posts => posts.map(p => p.title))
```

### 我错了么？
我是不是翻脸比翻书快？是啊，快多了。

虽然[为什么使用柯里化？（译）](#!/posts/why-curry-helps)中并没有足够重视在实践中使用该技术，但我依旧认为文章中所述的柯里化所带来的好处依然存在。现在 ES2015 已经发布，在 JavaScript 中，箭头函数在大多数情况下是一个更自然的方式来优化代码。

现在，我很少在 JavaScript 中使用柯里化。

在过去 2 年半的时间里，虽然我仍试图使用柯里化，但我发现使用和团队成员水准相匹配的技术更为重要。

#### 原文链接：[does-curry-help](https://hughfdjackson.com/javascript/does-curry-help/)
