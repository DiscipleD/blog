编写的代码能被毫不费力地重复使用是程序员的一个白日梦。首先，它是有含义的，因为代码都是根据需求用某种方式所写的；并且，它是可重用的，因为你打算重用它。你还想要什么？

[柯里化](https://npmjs.org/package/curry)能帮上忙。

### 什么是柯里化？它又棒在哪里？
普通的 JavaScript 调用会像这样：

```JavaScript
	var add = function(a, b){ return a + b }
	add(1, 2) //= 3
```

一个函数有多个参数，并有一个返回值。调用的参数可以比定义的少（会出错），或多（被忽视）：

```JavaScript
	add(1) //= NaN
	add(1, 2, 'IGNORE ME') //= 3
```

柯里化后的函数是将多个参数由一系列单参数函数表示的函数。比如，柯里化后的加法会是这样：

```JavaScript
	var add = curry(function(a, b){ return a + b })
	var add100 = add(100)
	add100(1) //= 101
```

如果柯里化函数需要接受多个参数，需要这样写：

```JavaScript
	var sum3 = curry(function(a, b, c){ return a + b + c })
	sum3(1)(2)(3) //= 6
```

由于这在 JavaScript 语法中相当丑陋，柯里化接受一次调用时有多个参数：

```JavaScript
	var sum3 = curry(function(a, b, c){ return a + b + c })
	sum3(1, 2, 3) //= 6
	sum3(1)(2, 3) //= 6
	sum3(1, 2)(3) //= 6
```

### 所以？

如果你不习惯柯里化函数是语言的常规部分，那么柯里化可能对你没有什么明显的优势，而在我看来，它有 2 大优势：

* 程序片段越小越容易被配置
* 尽可能地函数化

### 小片段
举个显而易见的例子，获取集合每个成员的 id：

```JavaScript
	var objects = [{ id: 1 }, { id: 2 }, { id: 3 }]
	objects.map(function(o){ return o.id })
```

如果你想知道第二行的逻辑，让我来告诉你：

> **循环**遍历**对象**来获得 **id**

就在这行里就有许多不佳的实现，让我带你一个个清楚它。首先，在函数定义中，

```JavaScript
	var get = curry(function(property, object){ return object[property] })
	objects.map(get('id')) //= [1, 2, 3]
```

以上创建的 get 函数是一个可配置的函数。

如果我们想重用获取对象 id 的功能，就可以这样简单地使用它：

```JavaScript
	var getIDs = function(objects){
	    return objects.map(get('id'))
	}
	getIDs(objects) //= [1, 2, 3]
```

嗯，这似乎又从优雅简洁回到了呆板。我们还能做些什么？那如果，遍历方法也可以被配置哪？

```JavaScript
	var map = curry(function(fn, value){ return value.map(fn) })
	var getIDs = map(get('id'))

	getIDs(objects) //= [1, 2, 3]
```

从上面的代码中可以看到，如果代码的基础模块是柯里化函数，就可以轻松地更新它，或给它添加新的功能。更令人兴奋的是，代码读起来就如同真正的逻辑。

### 尽可能地函数化

这种方法的另一个优点是，它鼓励创建函数，而非方法。虽然方法具有多态和易读的优势，但它们并不总是最适合的工具，比如在大量异步代码的情景下。

在这个小例子中，我们试着从服务器中获取一些数据，并用一些有用的方式来处理它。数据看起来会像这样：

```JavaScript
	{
	    "user": "hughfdjackson",
	    "posts": [
	        { "title": "why curry?", "contents": "..." },
	        { "title": "prototypes: the short(est possible) story", "contents": "..." }
    	]
	}
```

目标就是获取每个 posts 中的 title。

```JavaScript
	fetchFromServer()
		.then(JSON.parse)
		.then(function(data){ return data.posts })
		.then(function(posts){
			return posts.map(function(post){ return post.title })
		})
```

由于 Promise 链（或者你更倾向于回调）本质上是函数调用，你不能轻易的映射一个从服务器中获取但尚未经过加工的值。这整个无论从视觉（或心理）上都很粗糙。

那试试用刚刚定义好的工具来看看：

```JavaScript
	fetchFromServer()
		.then(JSON.parse)
		.then(get('posts'))
		.then(map(get('title')))
```

如果没有将函数经过柯里化，就无法如此轻易地使代码逻辑变得如此精炼和易于表达。

### 概括

柯里化会给你写代码带来神奇的力量。

我建议你掌握并熟练地运用它。如果你已经熟悉它的概念，我猜你会对它的 API 很满意，如果不是，你和你的同事应该试着考虑它。

#### 原文链接：[why-curry-helps](https://hughfdjackson.com/javascript/why-curry-helps/)