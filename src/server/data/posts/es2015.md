主要介绍 `ECMAScript 6` 新引入的语法特性以及一些个人认为比较重要，以后开发时会遇到的一些特性和实例，更多特性和实例请移步[原著](http://es6.ruanyifeng.com/#README)。

<a name="catalog"></a>
## 目录
1. [ECMAScript 简介](#Introduction)
* [**let & const**](#let)
* [**变量的解构赋值**](#Destructuring)
* [字符串的扩展](#String)
* [正则的扩展](#Regular)
* [数值的扩展](#Number)
* [数组的扩展](#Array)
* [**函数的扩展**](#Function)
* [**对象的扩展**](#Object)
* [Symbol](#Symbol)
* [**Proxy和Reflect**](#Proxy)
* [二进制数组](#BinaryArray)
* [Set和Map数据结构](#SetMap)
* [Iterator和for...of循环](#Iterator)
* [Generator函数](#Generator)
* [**Promise对象**](#Promise)
* [异步操作和Async函数](#Async)
* [**Class**](#Class)
* [Decorator](#Decorator)
* [**Module**](#Module)
* [**编程风格**](#Style)

<a name="Introduction"></a>
### [ECMAScript 简介](#catalog)

#### What is ECMAScript?
总结来说，JavaScript 是 ECMAScript 的一种实现，而 ECMAScript 是一种 `浏览器脚本语言` 的国际标准。
今天分享的 ECMAScript6，是由 2013 年 6 月草案冻结，当年 12 月草案发布，各方讨论，直到今年 6 月正式通过，成为国际标准。

[**How about the browse support now?**](kangax.github.io/es5-compat-table/es6/)  
从表中可以看到，尽管有很大一部分浏览器版本还没有实现 ES6，但各个浏览器的最新版已经支持大部分的 ES6 特性。相信随着时间的推移，浏览器 ES6 的支持度将会越来越好。
NodeJs 对 ES6 的支持最好，大家有兴趣的可以使用 Node 来体验更多的 ES6 特性。

#### Why to learn it?

既然浏览器还没实现对它特性的全部支持，为什么要学它？  
首先，它已经成为公认的标准，那么浏览器提供商一定会渐渐提供 ES6 所有特性的支持；
其次，浏览器暂时的不支持是可以通过转码器来克服的。

现在的 JS 代码也能实现业务需求，为什么还要学它？
首先，也是最重要的一点，ES6 提供了模块化的支持，它使得大型项目的开发更得心应手；
其次，ES6 提供的新特性使得JS的编写更轻松，更规范。

PS:以上都是个人观点。
PPS：个人当时学 ES6 的原因一是理解最新的规范，二是为学习 React 做好准备（React 支持部分 ES6 特性）。

**转码器**  
既然浏览器还不支持 ES6 那我们是不是现在就无法使用 ES6 的新特性哪？
答案是否定的。Babel 转码器和 Traceur 转码器会是一个很好的解决方案，让你在使用 ES6 特性的同时，又能转换为浏览器可以理解的 ES5 编码。

<a name="let"></a>
### [let & const](#catalog)

ES6 新增了 `let` 命令，用来声明变量。它的用法类似于 `var`，但是所声明的变量，只在 `let` 命令所在的代码块内有效，即 `let` 的作用域是块作用域。代码块也是 ES6 的新特性，类似于 java 的块。

到此为止，大家会觉得 `let` 和 `var` 没有什么区别嘛，那我们就来看看 let 的神奇之处
```JavaScript
    var a = [];
    for (var i = 0; i < 10; i++) {
      a[i] = function () {
        console.log(i);
      };
    }
    a[6]();

	let a = [];
	for (let i = 0; i < 10; i++) {
	  a[i] = function () {
	    console.log(i);
	  };
	}
	a[6]();
```

大家来说说最后的输出分别是什么吧？

我们来看看上述 ES6 代码解析成 ES5 代码的样子。
```JavaScript
	var a = [];
	var $__0 = function(i) {
	  a[i] = function() {
	    console.log(i);
	  };
	};
	for (var i = 0; i < 10; i++) {
	  $__0(i);
	}
	a[6]();
```

说了 `let` 的好处，那再看看使用 `let` 还要注意什么！
1. 不存在变量提升  
2. 暂时性死区  
3. 不允许重复声明  
**以上这些都可以通过事先声明来规避。所以，使用 `let`，`const` 一定要事先声明再使用！在函数开头声明所有变量也是 js 开发的最佳实践之一。**

前面也说到了，ES6 新增的特性块级作用域。我们再看看下面的例子：
```JavaScript
	function f() { console.log('I am outside!'); }
	(function () {
	  if(false) {
	    // 重复声明一次函数f
	    function f() { console.log('I am inside!'); }
	  }
	
	  f();
	}());
```

上面代码在 ES5 语法下，会得到 “I am inside!”，但是在 ES6 语法下，会得到 “I am outside!”。这是因为 ES5 存在函数提升，不管会不会进入 if 代码块，函数声明都会提升到当前作用域的顶部，得到执行；而 ES6 支持块级作用域，不管会不会进入 if 代码块，其内部声明的函数皆不会影响到作用域的外部。

`const` 的用法基本和 `let` 相同，但它是用来声明的是常量。一旦声明，常量的值就不能改变。
`const` 的作用域与 `let` 命令相同：只在声明所在的块级作用域内有效。

**在 ES6 下，使用 `let`, `const` 替代 `var` 声明变量也是最佳实践。**

ES6 引入了块级作用域是完全可以替代立即执行函数。（个人认为，可讨论）

<a name="Destructuring"></a>
### [变量的解构赋值](#catalog)
ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

##### 1. 数组的解构赋值
ES6 可以从数组中提取值，按照对应位置，对变量赋值。本质上，这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值。但如果等号的右边不是数组（或者严格地说，不是可遍历的结构，参见《Iterator》一章），那么将会报错。
```JavaScript
	let [foo, [[bar], baz]] = [1, [[2], 3]];
	foo // 1
	bar // 2
	baz // 3

	let [head, ...tail] = [1, 2, 3, 4];
	head // 1
	tail // [2, 3, 4]

	// 报错
	let [foo] = 1;
	let [foo] = false;
	let [foo] = NaN;
	let [foo] = undefined;
	let [foo] = null;
```
##### 2. 对象的解构赋值
解构不仅可以用于数组，还可以用于对象。对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。
```JavaScript
	var { bar, foo } = { foo: "aaa", bar: "bbb" };
	foo // "aaa"
	bar // "bbb"
	
	var { baz } = { foo: "aaa", bar: "bbb" };
	baz // undefined
```

如果变量名与属性名不一致，必须写成下面这样。其中 foo, first, last, loc & start 都是模式，没有具体值。
```JavaScript
	var { foo: baz } = { foo: "aaa", bar: "bbb" };
	baz // "aaa"
	
	let obj = { first: 'hello', last: 'world' };
	let { first: f, last: l } = obj;
	f // 'hello'
	l // 'world'

	var node = {
	  loc: {
	    start: {
	      line: 1,
	      column: 5
	    }
	  }
	};
	
	var { loc: { start: { line }} } = node;
	line // 1
	loc  // error: loc is undefined
	start // error: start is undefined
```

##### 3. 字符串的解构赋值
字符串的解构赋值可以看成为数组解构赋值的一种。
```JavaScript
	let {length : len} = 'hello';
	len // 5
```

##### 4. 函数参数的解构赋值
函数的参数也可以使用解构，同样也可以使用默认值。
```JavaScript
	function move({x = 0, y = 0} = {}) {
	  return [x, y];
	}
	
	move({x: 3, y: 8}); // [3, 8]
	move({x: 3}); // [3, 0]
	move({}); // [0, 0]
	move(); // [0, 0]
```

```JavaScript
	function move({x, y} = { x: 0, y: 0 }) {
	  return [x, y];
	}
	
	move({x: 3, y: 8}); // [3, 8]
	move({x: 3}); // [3, undefined]
	move({}); // [undefined, undefined]
	move(); // [0, 0]
```
大家能说出上面两段代码执行不同的区别吗？

##### 5. 用途
用途也就是解构的亮点。  
（1）交换变量的值
```JavaScript
	[x, y] = [y, x];
```

（2）从函数返回多个值
```JavaScript
	// 返回一个数组
	
	function example() {
	  return [1, 2, 3];
	}
	var [a, b, c] = example();
	
	// 返回一个对象
	
	function example() {
	  return {
	    foo: 1,
	    bar: 2
	  };
	}
	var { foo, bar } = example();
```

（3）函数参数的定义
```JavaScript
	// 参数是一组有次序的值
	function f([x, y, z]) { ... }
	f([1, 2, 3])
	
	// 参数是一组无次序的值
	function f({x, y, z}) { ... }
	f({x:1, y:2, z:3})
```

（4）提取 JSON 数据
```JavaScript
	var jsonData = {
	  id: 42,
	  status: "OK",
	  data: [867, 5309]
	}
	
	let { id, status, data: number } = jsonData;
	
	console.log(id, status, number)
	// 42, OK, [867, 5309]
```

（5）函数参数的默认值
```JavaScript
	jQuery.ajax = function (url, {
	  async = true,
	  beforeSend = function () {},
	  cache = true,
	  complete = function () {},
	  crossDomain = false,
	  global = true,
	  // ... more config
	}) {
	  // ... do stuff
	};
```

（6）遍历 Map 结构
```JavaScript
	// 获取键名
	for (let [key] of map) {
	  // ...
	}
	
	// 获取键值
	for (let [,value] of map) {
	  // ...
	}
```

（7）输入模块的指定方法
```JavaScript
	let { log, sin, cos } = Math;
	const { SourceMapConsumer, SourceNode } = require("source-map");
```

<a name="String"></a>
### [字符串的扩展](#catalog)
字符串扩展这一章节主要阐述了 ES6 对 Unicode 的支持。

JavaScript 允许采用 `\uxxxx` 形式表示一个字符，其中 “xxxx” 表示字符的码点。这种表示法只限于 `\u0000` —— `\uFFFF` 之间的字符。超出这个范围的字符，必须用两个双字节的形式表达（即 \uD83D\uDE80，ES6 可以通过大括号显示超过 FFFF 的字符，\u{1F680}）。

ES6 之前，字符串函数对字符码点超过 FFFF 字符无法返回正确结果，比如 charAt 等。此次对的扩展也就是主要扩展这一方面的内容：

根据字符在字符串的位置返回字符 charAt => at     
根据字符的位置返回字符的码点 charCodeAt => codePointAt  
根据字符的码点返回对应字符 fromCharCode => fromCodePoint

另外的一大部分是 ES6 给字符串对象又添加了一些新的方法。

- **includes()**：返回布尔值，表示是否找到了参数字符串。  
- **startsWith()**：返回布尔值，表示参数字符串是否在源字符串的头部。  
- **endsWith()**：返回布尔值，表示参数字符串是否在源字符串的尾部。  
PS:这三个方法都支持第二个参数，表示开始搜索的位置。

```JavaScript
	var s = 'Hello world!';
	
	s.startsWith('Hello') // true
	s.endsWith('!') // true
	s.includes('o') // true
	
	s.startsWith('world', 6) // true
	s.endsWith('Hello', 5) // true
	s.includes('Hello', 6) // false
```

- **repeat()**:方法返回一个新字符串，表示将原字符串重复 n 次。

另一大特色是**`模板字符串`**。  
模板字符串（template string）是增强版的字符串，用反引号（**`**）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。

```JavaScript
	$("#result").append(
	  "There are <b>" + basket.count + "</b> " +
	  "items in your basket, " +
	  "<em>" + basket.onSale +
	  "</em> are on sale!"
	);

	//使用模板字符串
	$("#result").append(`
	  There are <b>${basket.count}</b> items
	   in your basket, <em>${basket.onSale}</em>
	  are on sale!
	`);
```

大括号内部可以放入任意的 JavaScript 表达式，可以进行运算，以及引用对象属性，当然包括运行函数。

模板字符串的功能，不仅仅是上面这些。它可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串。这被称为“标签模板”功能（tagged template）。

```JavaScript
	var a = 5;
	var b = 10;
	
	function tag(s, v1, v2) {
	  console.log(s[0]);
	  console.log(s[1]);
	  console.log(s[2]);
	  console.log(v1);
	  console.log(v2);
	
	  return "OK";
	}
	
	tag`Hello ${ a + b } world ${ a * b}`; //等于调用tag(['Hello ', ' world ', ''], 15, 50)
	// "Hello "
	// " world "
	// ""
	// 15
	// 50
	// "OK"
```

“标签模板”的一个重要应用，就是过滤HTML字符串，防止用户输入恶意内容。

```JavaScript
	var message =
	  SaferHTML`<p>${sender} has sent you a message.</p>`;
	
	function SaferHTML(templateData) {
	  var s = templateData[0];
	  for (var i = 1; i < arguments.length; i++) {
	    var arg = String(arguments[i]);
	
	    // Escape special characters in the substitution.
	    s += arg.replace(/&/g, "&amp;")
	            .replace(/</g, "&lt;")
	            .replace(/>/g, "&gt;");
	
	    // Don't escape special characters in the template.
	    s += templateData[i];
	  }
	  return s;
	}
```
上面代码中，经过 SaferHTML 函数处理，HTML 字符串的特殊字符都会被转义。

<a name="Regular"></a>
### [正则的扩展](#catalog)
在 ES5 中，RegExp 构造函数只能接受字符串作为参数。ES6 允许 RegExp 构造函数接受正则表达式作为参数，这时会返回一个原有正则表达式的拷贝。如果使用 RegExp 构造函数的第二个参数指定修饰符，则返回的正则表达式会忽略原有的正则表达式的修饰符，只使用新指定的修饰符。

```JavaScript
	var regex = new RegExp("xyz", "i");
	// 等价于
	var regex = new RegExp(/xyz/i);

	new RegExp(/abc/ig, 'i').flags
	// "i"
```

ES6 为正则表达式新增了 flags 属性，会返回正则表达式的修饰符。

字符串对象共有 4 个方法，可以使用正则表达式：match()、replace()、search() 和 split()。

ES6 将这 4 个方法，在语言内部全部调用 RegExp 的实例方法，从而做到所有与正则相关的方法，全都定义在 RegExp 对象上（只是实现更好的`模块化`，对调用没有任何影响）。

ES6 新增 `u` 修饰符和 `y` 修饰符，`u` 修饰符用来解决 Unicode 大于 FFFF 时的匹配；`y`（“粘连”sticky）修饰符与 `g` 修饰符类似，也是全局匹配，不同之处在于，`g` 修饰符只要剩余位置中存在匹配就可，而 `y` 修饰符确保匹配必须从剩余的第一个位置开始，进一步说，`y` 修饰符号隐含了头部匹配的标志 `ˆ`。
**注：**如果同时使用 `g` 修饰符和 `y` 修饰符，则 `y` 修饰符覆盖 `g` 修饰符。

<a name="Number"></a>
### [数值的扩展](#catalog)
ES6 提供了二进制和八进制数值的新的写法，分别用前缀 0b（或0B）和 0o（或0O）表示。
如果要将 0b 和 0x 前缀的字符串数值转为十进制，要使用 Number 方法。
```JavaScript
	Number('0b111')  // 7
	Number('0o10')  // 8
```

ES6 在 Number 对象上，新提供了一些方法，首先是 `Number.isFinite()` 和 `Number.isNaN()` 这两个方法，用来检查 Infinite 和 NaN 这两个特殊值。这两个方法也是为了更好的`模块化`，将原先属于 global 下的 `isFinite()` 和 `isNaN` 放入了 Number 对象下，此时需注意，Number 下的这两个方法是首先将值转换为数值，如果不是数值直接返回 false。
```JavaScript
	isFinite(25) // true
	isFinite("25") // true
	Number.isFinite(25) // true
	Number.isFinite("25") // false
	
	isNaN(NaN) // true
	isNaN("NaN") // true
	Number.isNaN(NaN) // true
	Number.isNaN("NaN") // false
```

ES6 将全局方法 `parseInt()` 和 `parseFloat()`，移植到 `Number` 对象上面，行为完全保持不变。目的也是逐步减少全局性方法，使得语言逐步`模块化`。

ES6 添加方法 `Number.isInteger()` 用来判断一个值是否为整数。需要注意的是，在 JavaScript 内部，整数和浮点数是同样的储存方法，所以 3 和 3.0 被视为同一个值。

`Number.EPSILON` 是 ES6 在 `Number` 对象上新增的一个极小的常量，用来设置一个误差范围，如果小于这个误差范围，我们就认为得到了正确的结果。

JavaScript 能够准确表示的整数范围在 -2^53 到 2^53 之间（不含两个端点），超过这个范围，无法精确表示这个值。为此，ES6 同时引入了 `Number.MAX_SAFE_INTEGER` 和 `Number.MIN_SAFE_INTEGER` 这两个常量，用来表示这个范围的上下限，以及一个方法 `Number.isSafeInteger()` 用来判断一个数值是否在这个范围之内。

**谨记：**在 `Number` 对象下的对象首先必须是数值型，字符型调用都会有问题（parse除外）。

ES6 在 Math 对象上新增了 17 个与数学相关的方法。所有这些方法都是静态方法，只能在 Math 对象上调用。

* `Math.trunc()` 方法用于去除一个数的小数部分，返回整数部分。
* `Math.sign()` 方法用来判断一个数到底是正数、负数、还是零。
* `Math.cbrt()` 方法用于计算一个数的立方根。
* `Math.clz32()` 方法返回一个数的 32 位无符号整数形式有多少个前导 0。
* `Math.imul()` 方法返回两个数以 32 位带符号整数形式相乘的结果，返回的也是一个 32 位的带符号整数。
* `Math.fround()` 方法返回一个数的单精度浮点数形式。
* `Math.hypot()` 方法返回所有参数的平方和的平方根。
* `Math.expm1(x)` 返回 ex - 1，即 `Math.exp(x)` - 1。
* `Math.log1p(x)` 方法返回 1 + x 的自然对数，即 `Math.log`(1 + x)。如果 x 小于 -1，返回 NaN
* `Math.log10(x)` 返回以 10 为底的 x 的对数。如果 x 小于 0，则返回 NaN。
* `Math.log2(x)` 返回以 2 为底的 x 的对数。如果 x 小于 0，则返回 NaN。
* `Math.sinh(x)` 返回 x 的双曲正弦（hyperbolic sine）
* `Math.cosh(x)` 返回 x 的双曲余弦（hyperbolic cosine）
* `Math.tanh(x)` 返回 x 的双曲正切（hyperbolic tangent）
* `Math.asinh(x)` 返回 x 的反双曲正弦（inverse hyperbolic sine）
* `Math.acosh(x)` 返回 x 的反双曲余弦（inverse hyperbolic cosine）
* `Math.atanh(x)` 返回 x 的反双曲正切（inverse hyperbolic tangent）

<a name="Array"></a>
### [数组的扩展](#catalog)
#### Array.from
`Array.from` 方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。
```JavaScript
	Array.from('hello')
	// ['h', 'e', 'l', 'l', 'o']
	
	Array.from([1, 2, 3])
	// [1, 2, 3]
	
	let namesSet = new Set(['a', 'b'])
	Array.from(namesSet) // ['a', 'b']
	
	let ps = document.querySelectorAll('p');
	Array.from(ps).forEach(function (p) {
	  console.log(p);
	});
```

上面代码中，querySelectorAll 方法返回的是一个类似数组的对象，只有将这个对象转为真正的数组，才能使用 forEach 方法。

值得提醒的是，扩展运算符（`...`）也可以将某些数据结构转为数组。
```JavaScript
	let ps = [...document.querySelectorAll('p')];
```

`Array.from` 还可以接受第二个参数，作用类似于数组的 map 方法，用来对每个元素进行处理。
```JavaScript
	function typesOf () {
	  return Array.from(arguments, value => typeof value)
	}
	typesOf(null, [], NaN)
	// ['object', 'object', 'number']
```

#### Array.of
`Array.of` 方法用于将一组值，转换为数组，主要目的是弥补数组构造函数 `Array()` 的不足。因为参数个数的不同，会导致 `Array()` 的行为有差异。
```JavaScript
	Array.of(3, 11, 8) // [3,11,8]
	Array.of(3) // [3]
	Array.of(3).length // 1

	Array() // []
	Array(3) // [undefined, undefined, undefined]
	Array(3, 11, 8) // [3, 11, 8]
```

#### copyWithin()
数组实例的 `copyWithin` 方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。
```JavaScript
	Array.prototype.copyWithin(target, start = 0, end = this.length)
	
	[1, 2, 3, 4, 5].copyWithin(0, 3)
	// [4, 5, 3, 4, 5]
```

#### find()和findIndex()
数组实例的 `find` 方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为 `true` 的成员，然后返回该成员。如果没有符合条件的成员，则返回 `undefined`。

数组实例的 `findIndex` 方法的用法与 `find` 方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回 -1。
```JavaScript
	[1, 5, 10, 15].find(function(value, index, arr) {
	  return value > 9;
	}) // 10
	
	[1, 5, 10, 15].findIndex(function(value, index, arr) {
	  return value > 9;
	}) // 2
```

这两个方法都可以发现 `NaN`，弥补了数组的 `IndexOf` 方法的不足。`indexOf` 方法无法识别数组的 `NaN` 成员，但是 `findIndex` 方法可以借助 `Object.is` 方法做到。
```JavaScript
	[NaN].indexOf(NaN)
	// -1
	
	[NaN].findIndex(y => Object.is(NaN, y))
	// 0
```

#### fill()
`fill` 方法使用给定值，填充一个数组。fill 方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。

#### entries()，keys()和values()
这 3 个方法都是用来遍历数组，都返回一个 `Iterator` 对象，可以用 `for...of` 循环进行遍历，唯一的区别是 `keys()` 是对键名的遍历, `values()` 是对键值的遍历，`entries()` 是对键值对的遍历。

#### includes()(该方法属于 ES7)
`includes` 方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的 `includes` 方法类似。该方法的第二个参数表示搜索的起始位置，默认为 0。如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度，则会重置为从 0 开始。通过 `inculdes` 方法也可以判断 `NaN`.

<a name="Function"></a>
### [函数的扩展](#catalog)
#### 函数默认值
```JavaScript
	function fetch(url, { body = '', method = 'GET', headers = {} }){
	  console.log(method);
	}
	
	fetch('http://example.com', {})
	// "GET"
	
	fetch('http://example.com')
	// 报错
```
**注：**值为`undefined`会使用默认值，但`null`不会。

#### rest
ES6 引入 `rest` 参数（形式为“...变量名”），用于获取函数的多余参数，这样就不需要使用 `arguments` 对象了。`rest` 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。
注意，`rest` 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错，且函数的 `length` 属性，不包括 `rest` 参数。
```JavaScript
	function add(...values) {
	  let sum = 0;
	
	  for (var val of values) {
	    sum += val;
	  }
	
	  return sum;
	}
	
	add(2, 5, 3) // 10

	(function(a) {}).length  // 1
	(function(...a) {}).length  // 0
	(function(a, ...b) {}).length  // 1
```

#### 扩展运算符
扩展运算符（`spread`）是三个点（`...`）。它好比 `rest` 参数的逆运算，将一个数组转为用逗号分隔的参数序列。
```JavaScript
	function push(array, ...items) {
	  array.push(...items);
	}
	
	function add(x, y) {
	  return x + y;
	}
	
	var numbers = [4, 38];
	add(...numbers) // 42
```

扩展运算符内部调用的是数据结构的 `Iterator` 接口，因此只要具有 `Iterator` 接口的对象，都可以使用扩展运算符，比如 Map 结构。

#### name属性
函数的`name`属性，返回该函数的函数名。

#### 箭头函数
ES6 允许使用“箭头”（`=>`）定义函数。
```JavaScript
	var sum = (num1, num2) => num1 + num2;
	// 等同于
	var sum = function(num1, num2) {
	  return num1 + num2;
	};
```

箭头函数可以与变量解构结合使用。
```JavaScript
	const full = ({ first, last }) => first + ' ' + last;
	
	// 等同于
	function full( person ){
	  return person.first + ' ' + person.name;
	}
```

**注意：**  
1. 函数体内的 `this` 对象，就是定义时所在的对象，而不是使用时所在的对象。
2. 不可以当作构造函数，也就是说，不可以使用 `new` 命令，否则会抛出一个错误。
3. 不可以使用 `arguments` 对象，该对象在函数体内不存在。如果要用，可以用`Rest`参数代替。
4. 不可以使用 `yield` 命令，因此箭头函数不能用作 `Generator` 函数。

#### 尾调优化
尾调用（Tail Call）是函数式编程的一个重要概念，本身非常简单，一句话就能说清楚，就是指某个函数的最后一步是调用另一个函数。
```JavaScript
	function f(x){
	  return g(x);
	}

	//以下三种情况，都不属于尾调用。
	// 情况一
	function f(x){
	  let y = g(x);
	  return y;
	}
	
	// 情况二
	function f(x){
	  return g(x) + 1;
	}
	
	// 情况三
	function f(x){
	  g(x);
	}
```

函数调用会在内存形成一个“调用记录”，又称“调用帧”（call frame），保存调用位置和内部变量等信息。所有的调用帧，就形成一个“调用栈”（call stack）。

而尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用帧，取代外层函数的调用帧就可以了。

如果所有函数都是尾调用，就只保留内层函数的调用帧，那么每次执行时调用帧只有一项，这将大大节省内存。这就是“尾调用优化”。

如果在函数的尾部调用函数自身就称为尾递归。对于尾递归来说，由于只存在一个调用帧，所以永远不会发生“栈溢出”错误，释放了内存的同时，优化了性能。

<a name="Object"></a>
### [对象的扩展](#catalog)
#### 属性的简洁表示法
ES6 允许如果对象的值等于对象的属性名，则值可以省略。
```JavaScript
	var ms = {};
	
	function getItem (key) {
	  return key in ms ? ms[key] : null;
	}
	
	function setItem (key, value) {
	  ms[key] = value;
	}
	
	function clear () {
	  ms = {};
	}
	
	module.exports = { getItem, setItem, clear };
```

ES6 允许表达式作为对象的属性名，须把表达式放在方括号内，但属性名表达式与简洁表示法，不能同时使用。

#### name属性
函数的 `name` 属性，返回函数名。对象方法也是函数，因此也有 name 属性。

有一些特殊情况，如使用了取值(`get`)函数，则会在方法名前加上 get；如存值(`set`)函数，方法名的前面会加上 set；如 `bind` 方法创造的函数，name 属性返回 “bound” 加上原函数的名字；Function 构造函数创造的函数，name 属性返回 “anonymous”。

#### Object.is
`Object.is` 用来比较两个值是否严格相等。它与严格比较运算符（`===`）的行为基本一致。不同之处只有两个：一是 +0 不等于 -0，二是 NaN 等于自身。
```JavaScript
	+0 === -0 //true
	NaN === NaN // false
	
	Object.is(+0, -0) // false
	Object.is(NaN, NaN) // true
```

#### Object.assign
`Object.assign` 方法用来将源对象（source）的**所有可枚举属性**，复制到目标对象（target）。它至少需要两个对象作为参数，第一个参数是目标对象，后面的参数都是源对象。只要有一个参数不是对象，就会抛出 TypeError 错误。如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性，且 `Object.assign` 只拷贝自身属性，不可枚举的属性（`enumerable`为false）和继承的属性不会被拷贝。
```JavaScript
	var target = { a: 1, b: 1 };
	
	var source1 = { b: 2, c: 2 };
	var source2 = { c: 3 };

	Object.assign(target, source1, source2);
	target // {a:1, b:2, c:3}
```

**注意**：对于嵌套的对象，`Object.assign` 的处理方法是替换，而不是添加，即此方法不适用深拷贝，如果目标对象的值不是原始类型就可能会存在引用问题。同时，`Object.assign` 可以用来处理数组，但是会把数组视为对象。

```JavaScript
	var target = { a: { b: 'c', d: 'e' } }
	var source = { a: { b: 'hello' } }
	Object.assign(target, source)
	// { a: { b: 'hello' } }
	
	Object.assign([1, 2, 3], [4, 5])
	// [4, 5, 3]
```

`Object.assign` 方法有很多用处。

1.给对象添加属性
```JavaScript
	class Point {
	  constructor(x, y) {
	    Object.assign(this, {x, y});
	  }
	}
```

2.给对象添加方法
```JavaScript
	Object.assign(SomeClass.prototype, {
	  someMethod(arg1, arg2) {
	    ···
	  },
	  anotherMethod() {
	    ···
	  }
	});
```

3.克隆对象（非深克隆）
```JavaScript
	function clone(origin) {
	  return Object.assign({}, origin);
	}
```

4.合并多个对象
```JavaScript
	const merge = (target, ...sources) => Object.assign(target, ...sources);
	
	// 一个新对象
	const merge = (...sources) => Object.assign({}, ...sources);
```

5.为属性指定默认值
```JavaScript
	const DEFAULTS = {
	  logLevel: 0,
	  outputFormat: 'html'
	};
	
	function processContent(options) {
	  let options = Object.assign({}, DEFAULTS, options);
	}
```

#### 对象的可枚举属性
对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。`Object.getOwnPropertyDescriptor` 方法可以获取该属性的描述对象。
```JavaScript
	let obj = { foo: 123 };
	 Object.getOwnPropertyDescriptor(obj, 'foo')
	 //   { value: 123,
	 //     writable: true,
	 //     enumerable: true,
	 //     configurable: true }
```

描述对象的 `enumerable` 属性，称为`可枚举性`，如果该属性为 false，就表示某些操作会忽略当前属性。

ES5 有三个操作会忽略 `enumerable` 为 false 的属性。

* `for...in` 循环：只遍历对象自身的和继承的可枚举的属性  
* `Object.keys()`：返回对象自身的所有可枚举的属性的键名  
* `JSON.stringify()`：只串行化对象自身的可枚举的属性

ES6 新增了两个操作，会忽略 enumerable 为 false 的属性。

* `Object.assign()`：只拷贝对象自身的可枚举的属性
* `Reflect.enumerate()`：返回所有for...in循环会遍历的属性  

引入 `enumerable` 的最初目的，就是让某些属性可以规避掉 `for...in` 操作。比如，对象原型的 `toString` 方法，以及数组的 `length` 属性，就通过这种手段，不会被 `for...in` 遍历到。

ES6 规定，所有 Class 的原型的方法都是不可枚举的。

#### 对象原型
众所周知，`__proto__` 属性是用来读取或设置当前对象的 `prototype` 属性。由于该属性是有下划线开头，故为私有属性，不建议直接去控制其的值。而是使用 `Object.setPrototypeOf()`（写操作）、`Object.getPrototypeOf()`（读操作）、`Object.create()`（生成操作）代替。

#### `Object.observe()`，`Object.unobserve()`
`Object.observe` 方法用来监听对象（以及数组）的变化。一旦监听对象发生变化，就会触发回调函数。

`Object.observe` 方法接受两个参数，第一个参数是监听的对象，第二个参数是一个回调函数，第三个参数用来指定监听的事件种类。
```JavaScript
	Object.observe(o, observer, eventType);
```

`Object.observe` 方法目前共支持监听六种变化。

- add：添加属性  
- update：属性值的变化
- delete：删除属性
- setPrototype：设置原型
- reconfigure：属性的 attributes 对象发生变化
- preventExtensions：对象被禁止扩展（当一个对象变得不可扩展时，也就不必再监听了）

`Object.unobserve` 方法用来取消监听。
```JavaScript
	Object.unobserve(o, observer);
```

**注意：** `Object.observe` 和 `Object.unobserve` 这两个方法不属于 ES6，而是属于 ES7 的一部分。

#### 对象的扩展运算符
ES7 有一个提案，将 rest 参数/扩展运算符（...）引入对象。

**注意：** `Rest` 参数的拷贝是浅拷贝，即如果一个键的值是复合类型的值（数组、对象、函数）、那么 `Rest` 参数拷贝的是这个值的引用，而不是这个值的副本。

<a name="Symbol"></a>
### [Symbol](#catalog)
ES6 引入了一种新的**原始数据类型** `Symbol`，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，前六种是：`Undefined`、`Null`、布尔值（`Boolean`）、字符串（`String`）、数值（`Number`）、对象（`Object`）。

**注意：**`Symbol` 函数前不能使用 new 命令，否则会报错。这是因为生成的 `Symbol` 是一个原始类型的值，不是对象。也就是说，由于 `Symbol` 值不是对象，所以不能添加属性。基本上，它是一种类似于字符串的数据类型。

`Symbol` 函数可以接受一个字符串作为参数，表示对 `Symbol` 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。

**注意：** `Symbol`函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的 Symbol 函数的返回值是不相等的。
```JavaScript
	// 没有参数的情况
	var s1 = Symbol();
	var s2 = Symbol();
	
	s1 === s2 // false
	
	// 有参数的情况
	var s1 = Symbol("foo");
	var s2 = Symbol("foo");
	
	s1 === s2 // false
```

`Symbol` 值不能与其他类型的值进行运算，会报错，但是，`Symbol` 值可以显式转为字符串。
```JavaScript
	var sym = Symbol('My symbol');
	
	"your symbol is " + sym
	// TypeError: can't convert symbol to string
	`your symbol is ${sym}`
	// TypeError: can't convert symbol to string

	String(sym) // 'Symbol(My symbol)'
	sym.toString() // 'Symbol(My symbol)'
```

由于每一个 `Symbol` 值都是不相等的，这意味着 `Symbol` 值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。
```JavaScript
	var mySymbol = Symbol();
	
	// 第一种写法
	var a = {};
	a[mySymbol] = 'Hello!';
	
	// 第二种写法
	var a = {
	  [mySymbol]: 'Hello!'
	};
	
	// 第三种写法
	var a = {};
	Object.defineProperty(a, mySymbol, { value: 'Hello!' });
	
	// 以上写法都得到同样结果
	a[mySymbol] // "Hello!"
```

**注意：** `Symbol` 值作为对象属性名时，不能用点运算符。为点运算符后面总是字符串，所以不会读取标识名所指代的那个值。同理，在对象的内部，使用 `Symbol` 值定义属性时，`Symbol` 值必须放在方括号之中。

`Symbol` 作为属性名，该属性不会出现在 `for...in`、`for...of` 循环中，也不会被 `Object.keys()`、`Object.getOwnPropertyNames()` 返回。但是，它也不是私有属性，有一个 `Object.getOwnPropertySymbols` 方法，可以获取指定对象的所有 `Symbol` 属性名。

`Object.getOwnPropertySymbols` 方法返回一个数组，成员是当前对象的所有用作属性名的 `Symbol` 值。
```JavaScript
	var obj = {};
	
	var foo = Symbol("foo");
	
	Object.defineProperty(obj, foo, {
	  value: "foobar",
	});
	
	for (var i in obj) {
	  console.log(i); // 无输出
	}
	
	Object.getOwnPropertyNames(obj)
	// []
	
	Object.getOwnPropertySymbols(obj)
	// [Symbol(foo)]
```

**注意：** `Reflect.ownKeys` 方法可以返回所有类型的键名，包括常规键名和 `Symbol` 键名。

#### Symbol.for()，Symbol.keyFor()
`Symbol.for` 接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 `Symbol` 值。如果有，就返回这个 `Symbol` 值，否则就新建并返回一个以该字符串为名称的 `Symbol` 值。

**注意：** `Symbol.for()` 与 `Symbol()` 这两种写法，都会生成新的 `Symbol`。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。`Symbol.for()` 不会每次调用就返回一个新的 `Symbol` 类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值。
```JavaScript
	Symbol.for("bar") === Symbol.for("bar")
	// true

	Symbol("bar") === Symbol("bar")
	// false
```

`Symbol.keyFor` 方法返回一个已登记的 `Symbol` 类型值的 `key`。
```JavaScript
	var s1 = Symbol.for("foo");
	Symbol.keyFor(s1) // "foo"
	
	var s2 = Symbol("foo");
	Symbol.keyFor(s2) // undefined
```
#### 内置的 `Symbol` 值
除了定义自己使用的 Symbol 值以外，ES6 还提供了 11 个内置的 Symbol 值，指向语言内部使用的方法。

1. **Symbol.hasInstance：**对象的 `Symbol.hasInstance` 属性，指向一个内部方法。该对象使用 `instanceof` 运算符时，会调用这个方法，判断该对象是否为某个构造函数的实例。
2. **Symbol.isConcatSpreadable:**对象的 `Symbol.isConcatSpreadable` 属性等于一个布尔值，表示该对象使用 `Array.prototype.concat()` 时，是否可以展开。
3. **Symbol.species**对象的 `Symbol.species` 属性，指向一个方法。该对象作为构造函数创造实例时，会调用这个方法。
4. **Symbol.match**对象的 `Symbol.match` 属性，指向一个函数。当执行 str.match(myObject) 时，如果该属性存在，会调用它，返回该方法的返回值。
5. **Symbol.replace**对象的 `Symbol.replace` 属性，指向一个方法，当该对象被 String.prototype.replace 方法调用时，会返回该方法的返回值。
6. **Symbol.search**对象的 `Symbol.search` 属性，指向一个方法，当该对象被 String.prototype.search 方法调用时，会返回该方法的返回值。
7. **Symbol.split**对象的 `Symbol.split` 属性，指向一个方法，当该对象被 String.prototype.split 方法调用时，会返回该方法的返回值。
8. **Symbol.iterator**对象的 `Symbol.iterator` 属性，指向该对象的默认遍历器方法，即该对象进行 `for...of` 循环时，会调用这个方法，返回该对象的默认遍历器。
9. **Symbol.toPrimitive**对象的 `Symbol.toPrimitive` 属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。
10. **Symbol.toStringTag**对象的 `Symbol.toStringTag` 属性，指向一个方法。在该对象上面调用 Object.prototype.toString 方法时，如果这个属性存在，它的返回值会出现在 toString 方法返回的字符串之中，表示对象的类型。
11. **Symbol.unscopables**对象的 `Symbol.unscopables` 属性，指向一个对象。该对象指定了使用 `with` 关键字时，哪些属性会被 `with` 环境排除。

<a name="Proxy"></a>
### [Proxy和Reflect](#catalog)
#### Proxy
`Proxy` 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

`Proxy` 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

ES6原生提供 `Proxy` 构造函数，用来生成 `Proxy` 实例。
```JavaScript
	var proxy = new Proxy(target, handler)
```

`new Proxy()` 表示生成一个 `Proxy` 实例，`target` 参数表示所要拦截的目标对象，`handler` 参数也是一个对象，用来定制拦截行为。

`Proxy` 实例也可以作为其他对象的原型对象。
`Proxy` 支持设置以下拦截操作：

1. **get(target, propKey[, receiver])：**拦截对象属性的读取，返回类型不限。最后一个参数 receiver 可选，当 target 对象设置了 propKey 属性的 get 函数时，receiver 对象会绑定 get 函数的 this 对象。
2. **set(target, propKey, value[, receiver])：**拦截对象属性的设置，返回一个布尔值。  
3. **has(target, propKey)：**拦截 `in` 的操作，返回一个布尔值。
4. **deleteProperty(target, propKey)：**拦截 `delete` 的操作，返回一个布尔值。
5. **enumerate(target)：**拦截 `for` (var x in proxy)，返回一个遍历器。
6. **hasOwn(target, propKey)：**拦截 `hasOwnProperty` 的操作，返回一个布尔值。
7. **ownKeys(target)：**拦截 `Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`，返回一个数组。
8. **getOwnPropertyDescriptor(target, propKey)：**拦截 `Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。
9. **defineProperty(target, propKey, propDesc)：**拦截 `Object.defineProperty(proxy, propKey, propDesc)`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。
10. **preventExtensions(target)：**拦截 `Object.preventExtensions(proxy)`，返回一个布尔值。
11. **getPrototypeOf(target)：**拦截 `Object.getPrototypeOf(proxy)`，返回一个对象。
12. **isExtensible(target)：**拦截 `Object.isExtensible(proxy)`，返回一个布尔值。
13. **setPrototypeOf(target, proto)：**拦截 `Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。
14. **apply(target, object, args)：**目标对象是函数，拦截 `Proxy` 实例作为函数调用的操作。
15. **construct(target, args, proxy)：**拦截 `Proxy` 实例作为构造函数调用的操作。

```JavaScript
	var handler = {
	  get: function(target, name) {
	    if (name === 'prototype') return Object.prototype;
	    return 'Hello, '+ name;
	  },
	  apply: function(target, thisBinding, args) { return args[0]; },
	  construct: function(target, args) { return args[1]; }
	};
	
	var fproxy = new Proxy(function(x,y) {
	  return x+y;
	},  handler);
	
	fproxy(1,2); // 1
	new fproxy(1,2); // 2
	fproxy.prototype; // Object.prototype
	fproxy.foo; // 'Hello, foo'
```

**Example:**
 
#### get()
```JavaScript
	var person = {
	  name: "张三"
	};
	
	var proxy = new Proxy(person, {
	  get: function(target, property) {
	    if (property in target) {
	      return target[property];
	    } else {
	      throw new ReferenceError("Property \"" + property + "\" does not exist.");
	    }
	  }
	});
	
	proxy.name // "张三"
	proxy.age // 抛出一个错误
```

上面代码表示，如果访问目标对象不存在的属性，会抛出一个错误。如果没有这个拦截函数，访问不存在的属性，只会返回 undefined。

#### set()
```JavaScript
	let validator = {
	  set: function(obj, prop, value) {
	    if (prop === 'age') {
	      if (!Number.isInteger(value)) {
	        throw new TypeError('The age is not an integer');
	      }
	      if (value > 200) {
	        throw new RangeError('The age seems invalid');
	      }
	    }
	
	    // 对于age以外的属性，直接保存
	    obj[prop] = value;
	  }
	};
	
	let person = new Proxy({}, validator);
	
	person.age = 100;
	
	person.age // 100
	person.age = 'young' // 报错
	person.age = 300 // 报错
```

上面代码中，由于设置了存值函数 set，任何不符合要求的 age 属性赋值，都会抛出一个错误。

```JavaScript
	var handler = {
	  get (target, key) {
	    invariant(key, 'get');
	    return target[key];
	  },
	  set (target, key, value) {
	    invariant(key, 'set');
	    return true;
	  }
	}
	function invariant (key, action) {
	  if (key[0] === '_') {
	    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
	  }
	}
	var target = {};
	var proxy = new Proxy(target, handler);
	proxy._prop
	// Error: Invalid attempt to get private "_prop" property
	proxy._prop = 'c'
	// Error: Invalid attempt to set private "_prop" property
```

上面代码中，只要读写的属性名的第一个字符是下划线，一律抛错，从而达到禁止读写内部属性的目的。

更多例子，请移步[原著](http://es6.ruanyifeng.com/#docs/proxy)。

#### Proxy.revocable()

`Proxy.revocable` 方法返回一个对象，该对象的 proxy 属性是 `Proxy` 实例，revoke 属性是一个函数，可以取消 `Proxy` 实例。
```JavaScript
	let target = {};
	let handler = {};
	
	let {proxy, revoke} = Proxy.revocable(target, handler);
	
	proxy.foo = 123;
	proxy.foo // 123
	
	revoke();
	proxy.foo // TypeError: Revoked
```

#### Reflect
`Reflect` 是 ES6 新增的 API 用来操作对象，将 `Object` 对象的一些明显属于语言层面的方法，放到 `Reflect` 对象上，使 `Object` 操作都变成函数行为。

`Reflect` 对象的方法还与 `Proxy` 对象的方法一一对应，只要是 `Proxy` 对象的方法，就能在 `Reflect` 对象上找到对应的方法。这就让 `Proxy` 对象可以方便地调用对应的 `Reflect` 方法，完成默认行为，作为修改行为的基础。也就是说，不管 `Proxy` 怎么修改默认行为，你总可以在 `Reflect` 上获取默认行为。

```JavaScript
	var loggedObj = new Proxy(obj, {
	  get: function(target, name) {
	    console.log("get", target, name);
	    return Reflect.get(target, name);
	  }
	});

	Proxy(target, {
	  set: function(target, name, value, receiver) {
	    var success = Reflect.set(target,name, value, receiver);
	    if (success) {
	      log('property ' + name + ' on ' + target + ' set to ' + value);
	    }
	    return success;
	  }
	});
```

#### Object，Proxy 和 Reflect 对象对照表

| Object | Reflect | Proxy |
| ------ | ------- | ----- |
| Object.apply(target,thisArg,args) | Reflect.apply(target,thisArg,args) | apply(target, object, args) |
| Object.construct(target,args) | Reflect.construct(target,args) | construct(target, args) |
| Object.defineProperty(target, name, desc) | Reflect.defineProperty(target,name,desc) | defineProperty(target, propKey, propDesc) |
| Object.deleteProperty(target,name) | Reflect.deleteProperty(target,name) | deleteProperty(target, propKey) |
| Object.enumerate(target) | Reflect.enumerate(target) | enumerate(target) |
| Object.freeze(target) | Reflect.freeze(target) | - |
| Object.get(target,name) | Reflect.get(target,name[, receiver]) | get(target, propKey[, receiver]) |
| Object.getOwnPropertyDescriptor(target,name) | Reflect.getOwnPropertyDescriptor(target,name) | getOwnPropertyDescriptor(target, propKey) |
| Object.getOwnPropertyNames(target) | Reflect.getOwnPropertyNames(target) | ownKeys(target) |
| Object.getPrototypeOf(target) | Reflect.getPrototypeOf(target) | getPrototypeOf(target) |
| Object.has(target,name) | Reflect.has(target,name) | has(target, propKey) |
| Object.hasOwnProperty(target,name) | Reflect.hasOwnProperty(target,name) | hasOwn(target, propKey) |
| Object.isExtensible(target) | Reflect.isExtensible(target) | isExtensible(target) |
| Object.isFrozen(target) | Reflect.isFrozen(target) | - |
| Object.isSealed(target) | Reflect.isSealed(target) | - |
| Object.keys(target) | Reflect.keys(target) | ownKeys(target) |
| Object.preventExtensions(target) | Reflect.preventExtensions(target) | preventExtensions(target) |
| Object.seal(target) | Reflect.seal(target) | - |
| Object.set(target,name,value) | Reflect.set(target,name,value[, receiver]) | set(target, propKey, value[, receiver]) |
| Object.setPrototypeOf(target, prototype) | Reflect.setPrototypeOf(target, prototype) | setPrototypeOf(target, proto) |

<a name="BinaryArray"></a>
### [二进制数组](#catalog)
二进制数组（`ArrayBuffer` 对象、`TypedArray` 视图和`DataView` 视图）是 JavaScript 操作二进制数据的一个接口。这些对象早就存在，属于独立的规格，ES6 将它们纳入了 ECMAScript 规格，并且增加了新的方法。

这个接口的原始设计目的，与 WebGL 项目有关。所谓 WebGL，就是指浏览器与显卡之间的通信接口，为了满足 JavaScript 与显卡之间大量的、实时的数据交换，它们之间的数据通信必须是二进制的，而不能是传统的文本格式。文本格式传递一个 32 位整数，两端的 JavaScript 脚本与显卡都要进行格式转化，将非常耗时。这时要是存在一种机制，可以像 C 语言那样，直接操作字节，将 4 个字节的 32 位整数，以二进制形式原封不动地送入显卡，脚本的性能就会大幅提升。

二进制数组就是在这种背景下诞生的。它允许开发者以数组下标的形式，直接操作内存，大大增强了 JavaScript 处理二进制数据的能力，使得开发者有可能通过 JavaScript 与操作系统的原生接口进行二进制通信。

二进制数组由三类对象组成。

1. **`ArrayBuffer` 对象：**代表内存之中的一段二进制数据，可以通过“视图”进行操作。“视图”部署了数组接口，这意味着，可以用数组的方法操作内存。

2. **`TypedArray` 视图：**共包括 9 种类型的视图，比如 Uint8Array（无符号8位整数）数组视图, Int16Array（16位整数）数组视图, Float32Array（32位浮点数）数组视图等等。

3. **`DataView` 视图：**可以自定义复合格式的视图，比如第一个字节是Uint8（无符号8位整数）、第二、三个字节是Int16（16位整数）、第四个字节开始是Float32（32位浮点数）等等，此外还可以自定义字节序。

简单说，`ArrayBuffer` 对象代表原始的二进制数据，`TypedArray` 视图用来读写简单类型的二进制数据，`DataView` 视图用来读写复杂类型的二进制数据。`TypedArray` 视图支持的数据类型一共有 9 种（DataView 视图支持除 Uint8C 以外的其他 8 种）。

| 数据类型 | 字节长度 | 含义 | 对应的C语言类型 |
| ------- | ------- | ---- | ------------- |
| Int8	  | 1       | 8位带符号整数   	         | signed char   |
| Uint8	  | 1       | 8位不带符号整数	             | unsigned char |
| Uint8C  | 1       | 8位不带符号整数（自动过滤溢出）| unsigned char |
| Int16	  | 2       | 16位带符号整数	             | short         |
| Uint16  |	2       | 16位不带符号整数   	         | unsigned short|
| Int32   |	4       | 32位带符号整数	             | int           |
| Uint32  |	4       | 32位不带符号的整数	         | unsigned int  |
| Float32 |	4       | 32位浮点数                  | float         |
| Float64 |	8       | 64位浮点数                  | double        |


#### 1. ArrayBuffer对象
`ArrayBuffer` 对象代表储存二进制数据的一段内存，它不能直接读写，只能通过视图（`TypedArray` 视图和 `DataView` 视图)来读写，视图的作用是以指定格式解读二进制数据。

`ArrayBuffer` 的构造函数会分配一段可以存放数据的连续内存区域，参数是所需要的内存大小（单位字节），每个字节的值默认都是 0。

```JavaScript
	var buf = new ArrayBuffer(32);
	// DataView
	var dataView = new DataView(buf);
	dataView.getUint8(0) // 0

	// TypedArray
	var x1 = new Int32Array(buffer);
	x1[0] = 1;
	var x2 = new Uint8Array(buffer);
	x2[0]  = 2;
	
	x1[0] // 2
```

`ArrayBuffer` 实例的 `byteLength` 属性，返回所分配的内存区域的字节长度。如果要分配的内存区域很大，有可能分配失败（因为没有那么多的连续空余内存），所以有必要检查是否分配成功。

```JavaScript
	var buffer = new ArrayBuffer(32);
	buffer.byteLength
	// 32
	
	if (buffer.byteLength === n) {
	  // 成功
	} else {
	  // 失败
	}
```

`ArrayBuffer` 实例有一个 `slice` 方法，允许将内存区域的一部分，拷贝生成一个新的 `ArrayBuffer` 对象。`slice` 方法接受两个参数，第一个参数表示拷贝开始的字节序号（含该字节），第二个参数表示拷贝截止的字节序号（不含该字节）。如果省略第二个参数，则默认到原 ArrayBuffer 对象的结尾。

**注意：**除了 `slice` 方法，`ArrayBuffer` 对象不提供任何直接读写内存的方法，只允许在其上方建立视图，然后通过视图读写。

`ArrayBuffer` 有一个静态方法 `isView`，返回一个布尔值，表示参数是否为 `ArrayBuffer` 的视图实例。这个方法大致相当于判断参数，是否为 `TypedArray` 实例或 `DataView` 实例。

#### 2. TypedArray视图
`ArrayBuffer` 对象作为内存区域，可以存放多种类型的数据。同一段内存，不同数据有不同的解读方式，这就叫做“视图”（`view`）。`TypedArray` 视图共有包括9种类型（参见第一节表格），每一种类型的视图都是一种构造函数。由这9个构造函数生成的数组，统称为 `TypedArray` 视图，它们很像普通数组，都有 `length` 属性，都能用方括号运算符（[]）获取单个元素，所有数组的方法，在它们上面都能使用。**不同点**有一下几处：

* `TypedArray` 数组的所有成员，都是同一种类型。
* `TypedArray` 数组的成员是连续的，不会有空位。
* `TypedArray` 数组成员的默认值为0。
* `TypedArray` 数组只是一层视图，本身不储存数据，它的数据都储存在底层的 `ArrayBuffer` 对象之中，要获取底层对象必须使用 `buffer` 属性。

**注意：** `TypedArray` 数组没有 `concat` 方法。

每一种视图的构造函数，都有一个 `BYTES_PER_ELEMENT` 属性，表示这种数据类型占据的字节数。

#### 3. DataView 视图
如果一段数据包括多种类型（比如服务器传来的 HTTP 数据），这时除了建立 `ArrayBuffer` 对象的复合视图以外，还可以通过 `DataView` 视图进行操作。

`DataView` 视图提供更多操作选项，而且支持设定字节序。本来，在设计目的上，`ArrayBuffer` 对象的各种 `TypedArray` 视图，是用来向网卡、声卡之类的本机设备传送数据，所以使用本机的字节序就可以了；而 `DataView` 视图的设计目的，是用来处理网络设备传来的数据，所以大端字节序或小端字节序是可以自行设定的。

```JavaScript
	DataView(ArrayBuffer buffer [, 字节起始位置 [, 长度]]);
```

`DataView` 实例有以下属性，含义与 `TypedArray` 实例的同名方法相同。

* `DataView.prototype.buffer`：返回对应的 `ArrayBuffer` 对象
* `DataView.prototype.byteLength`：返回占据的内存字节长度
* `DataView.prototype.byteOffset`：返回当前视图从对应的 `ArrayBuffer` 对象的开始字节

#### 4. 应用
很多浏览器操作的API，用到了二进制数组操作二进制数据，下面是其中的几个。

- File API
- XMLHttpRequest
- Fetch API
- Canvas
- WebSockets
例子，请移步[原著](http://es6.ruanyifeng.com/#docs/arraybuffer)。

<a name="SetMap"></a>
### [Set & Map](#catalog)
#### 1. Set

ES6 提供了新的数据结构 `Set`。它类似于数组，但是成员的值都是唯一的，没有重复的值。

**注意：**`Set` 内部判断两个值是否不同，使用的算法类似于精确相等运算符（===），这意味着，两个对象总是不相等的，唯一的例外是NaN，即 `Set` 中至多只有一个 NaN。
```JavaScript
	var set = new Set([1, 2, 3, 4, 4])
	[...set]
	// [1, 2, 3, 4]
	
	var items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
	items.size // 5
```

`Set` 结构的实例有以下属性。

* `Set.prototype.constructor`：构造函数，默认就是 Set 函数。
* `Set.prototype.size`：返回 Set 实例的成员总数。

`Set` 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。

**操作方法:**

* `add(value)`：添加某个值，返回 Set 结构本身。
* `delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
* `has(value)`：返回一个布尔值，表示该值是否为 Set 的成员。
* `clear()`：清除所有成员，没有返回值。
```JavaScript
	s.add(1).add(2).add(2);
	
	s.size // 2
	
	s.has(1) // true
	s.has(2) // true
	s.has(3) // false
	
	s.delete(2);
	s.has(2) // false
```

由于 `Array.from` 方法可以将 `Set` 结构转为数组，那么这就提供了一种去除数组的重复元素的方法。
```JavaScript
	var items = new Set([1, 2, 3, 4, 5]);
	var array = Array.from(items);
	
	function dedupe(array) {
	  return Array.from(new Set(array));
	}
	
	dedupe([1,1,2,3]) // [1, 2, 3]
```

##### 遍历方法:

* `keys()`：返回一个键名的遍历器
* `values()`：返回一个键值的遍历器
* `entries()`：返回一个键值对的遍历器
* `forEach()`：使用回调函数遍历每个成员

由于 `Set` 结构没有键名，只有键值（或者说键名和键值是同一个值），所以 `keys` 方法和 `values` 方法的行为完全一致。
```JavaScript
	let set = new Set(['red', 'green', 'blue']);
	
	for ( let item of set.keys() ){
	  console.log(item);
	}
	// red
	// green
	// blue
	
	for ( let item of set.values() ){
	  console.log(item);
	}
	// red
	// green
	// blue
	
	for ( let item of set.entries() ){
	  console.log(item);
	}
	// ["red", "red"]
	// ["green", "green"]
	// ["blue", "blue"]
```

数组的 map 和 filter 方法也可以用于 Set 了，因此使用 Set，可以很容易地实现并集（Union）和交集（Intersect）。
```JavaScript
	let a = new Set([1, 2, 3]);
	let b = new Set([4, 3, 2]);
	
	let union = new Set([...a, ...b]);
	// [1, 2, 3, 4]
	
	let intersect = new Set([...a].filter(x => b.has(x)));
	// [2, 3]
````

#### 2. WeakSet
`WeakSet` 结构与 `Set` 类似，也是不重复的值的集合。但是，它与 `Set` 有两个区别。

首先，`WeakSet`的成员只能是**对象**，而不能是其他类型的值。

其次，`WeakSet`中的对象都是弱引用，即垃圾回收机制不考虑 `WeakSet` 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 `WeakSet` 之中。这个特点意味着，**无法引用 `WeakSet` 的成员，因此 `WeakSet` 是不可遍历的。**

`WeakSet` 结构有以下三个方法。

* `WeakSet.prototype.add(value)`：向 `WeakSet` 实例添加一个新成员。
* `WeakSet.prototype.delete(value)`：清除 `WeakSet` 实例的指定成员。
* `WeakSet.prototype.has(value)`：返回一个布尔值，表示某个值是否在 `WeakSet` 实例之中。

个人暂没有想到 `WeakSet` 的用法，书中介绍 `WeakSet` 可以用来储存DOM节点，而不用担心这些节点从文档移除时，会引发内存泄漏。

#### 3. Map
JavaScript 的对象（`Object`），本质上是键值对的集合（Hash 结构），但是只能用字符串当作键，而 `Map` 结构提供了“值—值”的对应。

`Map` 结构的 `Key` 类型类似于 Set 结构（书中没有这样说，个人总结，例外请留言。）

##### `Map`属性和方法：

* `size`属性：返回 `Map` 结构的成员总数。
* `has(key)`方法：方法返回一个布尔值，表示某个键是否在 `Map` 数据结构中。
* `get(key)`方法：读取 key 对应的键值，如果找不到 key，返回 undefined。
* `set(key, value)`方法：设置 key 所对应的键值，然后返回整个 `Map` 结构，为此可以采用链式写法。
* `delete(key)`方法：删除某个 key，返回 true。如果删除失败，返回 false。
* `clear()`方法：清除所有成员，没有返回值。
* `keys()`方法：返回键名的遍历器。
* `values()`方法：返回键值的遍历器。
* `entries()`方法：返回所有成员的遍历器。
* `forEach()`：遍历 `Map` 的所有成员。

```JavaScript
	let map = new Map([
	  [1, 'one'],
	  [2, 'two'],
	  [3, 'three'],
	]);
	
	[...map.keys()]
	// [1, 2, 3]
	
	[...map.values()]
	// ['one', 'two', 'three']
	
	[...map.entries()]
	// [[1,'one'], [2, 'two'], [3, 'three']]
	
	[...map]
	// [[1,'one'], [2, 'two'], [3, 'three']]
```

#### 4. WeakMap
`WeakMap` 结构与 `Map` 结构基本类似，唯一的区别是它只接受对象作为键名（null除外），不接受其他类型的值作为键名，而且键名所指向的对象，不计入垃圾回收机制。

应用场景参照 `WeakSet`。

<a name="Iterator"></a>
### [Iterator](#catalog)
#### Iterator
由于 ES6 新加入 Set 和 Map 这两种数据属性，就有了 4 种不同的数据结构。**遍历器（Iterator）**就提供一个统一的接口为各种不同的数据结构提供统一的访问机制，任何数据结构只要部署 Iterator 接口，就可以完成遍历操作。

Iterator 的遍历主要通过指针对象，通过不断的调用 next 方法来遍历数据成员。

#### 数据结构的默认 Iterator 接口

ES6 规定，默认的 Iterator 接口部署在数据结构的 `Symbol.iterator` 属性，或者说，一个数据结构只要具有 `Symbol.iterator` 属性，就可以认为是“可遍历的”（iterable）。调用 `Symbol.iterator` 方法，就会得到当前数据结构默认的遍历器生成函数。

在 ES6 中，有三类数据结构原生具备 Iterator 接口：数组、某些类似数组的对象、Set 和 Map 结构。

对象（Object）之所以没有默认部署 Iterator 接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的，需要开发者手动指定。本质上，遍历器是一种线性处理，对于任何非线性的数据结构，部署遍历器接口，就等于部署一种线性转换。

#### 默认调用 Iterator 接口的场合
1. 解构赋值
2. 扩展运算符
3. yield*（Generator章详述）
4. 其他：由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合都调用了遍历器接口

#### 遍历器对象的 return()，throw()
遍历器对象除了具有 `next` 方法，还可以具有 `return` 方法和 `throw` 方法。如果你自己写遍历器生成函数，那么 `next` 方法是必须部署的，`return` 方法和 `throw` 方法是否部署是可选的。

`return` 方法的使用场合是，如果 for...of 循环提前退出（通常是因为出错，或者有 break 语句或 continue 语句），就会调用 `return` 方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署 `return` 方法。

`throw` 方法主要是配合Generator函数使用，一般的遍历器对象用不到这个方法。请参阅《[Generator函数](#Generator)》一章。

#### for...of循环

ES6 引入了 `for...of` 循环，作为遍历所有数据结构的统一的方法。一个数据结构只要部署了 `Symbol.iterator` 属性，就被视为具有 `iterator` 接口，就可以用 `for...of` 循环遍历它的成员。

`for...of` 循环可以使用的范围包括数组、`Set` 和 `Map` 结构、某些类似数组的对象（比如 arguments 对象、DOM NodeList 对象）、`Generator` 对象，以及字符串。

#### 与其他遍历语法的比较
以数组为例，JavaScript 提供多种遍历语法。最原始的写法就是 for 循环。
```JavaScript
	for (var index = 0; index < myArray.length; index++) {
	  console.log(myArray[index]);
	}
```
这种写法比较麻烦，因此数组提供内置的 forEach 方法。
```JavaScript
	myArray.forEach(function (value) {
	  console.log(value);
	});
```
这种写法的问题在于，**无法中途跳出 forEach 循环，break 命令或 return 命令都不能奏效**。

`for...in` 循环可以遍历数组的键名。
```JavaScript
	for (var index in myArray) {
	  console.log(myArray[index]);
	}
```

`for...in` 循环有几个缺点：

1. 数组的键名是数字，但是 for...in 循环是以字符串作为键名“0”、“1”、“2”等等。
2. for...in 循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。

`for...of` 循环相比上面几种做法，有一些显著的优点。

* 有着同 for...in 一样的简洁语法，但是没有 for...in 那些缺点。
* 不同用于 forEach 方法，它可以与 break、continue 和 return 配合使用。
* 提供了遍历所有数据结构的统一操作接口。

```JavaScript
	for (var n of fibonacci) {
	  if (n > 1000)
	    break;
	  console.log(n);
	}
```

<a name="Generator"></a>
### [Generator函数](#catalog)
`Generator` 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。

`Generator` 函数有多种理解角度。从语法上，首先可以把它理解成，`Generator` 函数是一个状态机，封装了多个内部状态。

执行 `Generator` 函数会返回一个遍历器对象，也就是说，`Generator` 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 `Generator` 函数内部的每一个状态。

形式上，`Generator` 函数是一个普通函数，但是有两个特征。一是，`function` 命令与函数名之间有一个星号；二是，函数体内部使用 `yield` 语句，定义不同的内部状态。`Generator` 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用 `Generator` 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象(即Iterator对象)。
```JavaScript
	function* helloWorldGenerator() {
	  yield 'hello';
	  yield 'world';
	  return 'ending';
	}
	
	var hw = helloWorldGenerator();
	
	hw.next()
	// { value: 'hello', done: false }
	
	hw.next()
	// { value: 'world', done: false }
	
	hw.next()
	// { value: 'ending', done: true }
	
	hw.next()
	// { value: undefined, done: true }
```

#### yield语句
由于 `Generator` 函数返回的遍历器对象，只有调用 `next` 方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。`yield` 语句就是暂停标志。

如果 `Generator` 函数不使用 `yield` 语句，这时就变成了一个单纯的暂缓执行函数。

**注意：**

* `yield` 语句不能用在普通函数中，否则会报错。
* `yield` 语句如果用在一个表达式之中，必须放在圆括号里面。
* `yield` 语句用作函数参数或赋值表达式的右边，可以不加括号。

#### `next` 方法的参数
`yield` 句本身没有返回值，或者说总是返回 undefined。`next` 方法可以带一个参数，该参数就会被当作上一个 `yield` 语句的返回值。

```JavaScript
	function* foo(x) {
	  var y = 2 * (yield (x + 1));
	  var z = yield (y / 3);
	  return (x + y + z);
	}
	
	var a = foo(5);
	
	a.next() // Object{value:6, done:false}
	a.next() // Object{value:NaN, done:false}
	a.next() // Object{value:NaN, done:false}

	var it = foo(5);
	
	it.next()
	// { value:6, done:false }
	it.next(12)
	// { value:8, done:false }
	it.next(13)
	// { value:42, done:true }
```

#### for...of 循环
for...of 循环可以自动遍历 Generator 函数，且此时不再需要调用 `next` 方法。

但有一点需要注意，一旦 `next` 方法的返回对象的 done 属性为 true，for...of 循环就会中止，且不包含该返回对象，即 `return` 语句的返回值是无法通过 for...of 循环返回的。
```JavaScript
	function *foo() {
	  yield 1;
	  yield 2;
	  yield 3;
	  yield 4;
	  yield 5;
	  return 6;
	}
	
	for (let v of foo()) {
	  console.log(v);
	}
	// 1 2 3 4 5
```

#### throw()
`Generator` 函数返回的遍历器对象，都有一个 throw 方法，可以在函数体外抛出错误，然后在 `Generator` 函数体内捕获。

如果 `Generator` 函数内部部署了 try...catch 代码块，那么遍历器的 throw 方法抛出的错误，不影响下一次遍历，否则遍历直接终止。
```JavaScript
	var g = function* () {
	  while (true) {
	    try {
	      yield;
	    } catch (e) {
	      if (e != 'a') throw e;
	      console.log('内部捕获', e);
	    }
	  }
	};
	
	var i = g();
	i.next();
	
	try {
	  i.throw('a');
	  i.throw('b');
	} catch (e) {
	  console.log('外部捕获', e);
	}
	// 内部捕获 a
	// 外部捕获 b
```

#### return()
`Generator` 函数返回的遍历器对象，还有一个 `return` 方法，可以返回给定的值，并且终结遍历 `Generator` 函数。如果 `Generator` 函数内部有 `try...finally` 代码块，那么 `return` 方法会推迟到 `finally` 代码块执行完再执行。
```JavaScript
	function* numbers () {
	  yield 1;
	  try {
	    yield 2;
	    yield 3;
	  } finally {
	    yield 4;
	    yield 5;
	  }
	  yield 6;
	}
	var g = numbers()
	g.next() // { done: false, value: 1 }
	g.next() // { done: false, value: 2 }
	g.return(7) // { done: false, value: 4 }
	g.next() // { done: false, value: 5 }
	g.next() // { done: true, value: 7 }
```

#### yield*
如果在 `Generater` 函数内部，调用另一个 `Generator` 函数，默认情况下是没有效果的。这时需要使用 yield* 来执行另一个 `Generator` 函数。
```JavaScript
	function* foo() {
	  yield 'a';
	  yield 'b';
	}
	
	function* bar() {
	  yield 'x';
	  foo();
	  yield 'y';
	}
	
	for (let v of bar()){
	  console.log(v);
	}
	// "x"
	// "y"

	function* bar() {
	  yield 'x';
	  yield* foo();
	  yield 'y';
	}
	
	for (let v of bar()){
	  console.log(v);
	}
	// "x"
	// "a"
	// "b"
	// "y"
```

#### 应用
1. 异步操作的同步化  
`Generator` 函数的暂停执行的效果，意味着可以把异步操作写在 `yield` 语句里面，等到调用 `next` 方法时再往后执行。
2. 控制流管理  
多个任务按顺序一个接一个执行时，`yield` 语句可以按顺序排列。多个任务需要并列执行时（比如只有 A 任务和 B 任务都执行完，才能执行 C 任务），可以采用数组的写法。
3. 部署 iterator 接口
利用 `Generator` 函数，可以在任意对象上部署 `iterator` 接口。
4. 作为数据结构  
`Generator` 可以看作是数据结构，更确切地说，可以看作是一个数组结构，因为 `Generator` 函数可以返回一系列的值，这意味着它可以对任意表达式，提供类似数组的接口。

<a name="Promise"></a>
### [Promise对象](#catalog)
ES6 正式将 `Promise` 写进了语言标准，统一了用法，原生提供了 `Promise` 对象。

所谓 `Promise`，就是一个对象，用来传递异步操作的消息。它代表了某个未来才会知道结果的事件（通常是一个异步操作），并且这个事件提供统一的 API，可供进一步处理。

`Promise` 对象有以下两个特点。
（1）对象的状态不受外界影响。Promise 对象代表一个异步操作，有三种状态：`Pending`（进行中）、`Resolved`（已完成，又称Fulfilled）和`Rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。
（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。`Promise` 对象的状态改变，只有两种可能：从 `Pending` 变为 `Resolved` 和从 `Pending` 变为 `Rejected`。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果。

ES6 规定，`Promise` 对象是一个构造函数，用来生成 `Promise` 实例。`Promise` 构造函数接受一个函数作为参数，该函数的两个参数分别是 `resolve` 和 `reject`。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

`resolve` 函数的作用是，将 `Promise` 对象的状态从 `Pending` 变为 `Resolved`，在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；`reject` 函数的作用是，将 `Promise` 对象的状态从 `Pending` 变为 `Rejected`，在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

`Promise` 实例生成以后，可以用 `then` 方法分别指定 `Resolved` 状态和 `Reject` 状态的回调函数。
```JavaScript
	var promise = new Promise(function(resolve, reject) {
	  // ... some code
	
	  if (/* 异步操作成功 */){
	    resolve(value);
	  } else {
	    reject(error);
	  }
	});
	
	promise.then(function(value) {
	  // success
	}, function(value) {
	  // failure
	});
```

`Promise` 实例具有 `then` 方法，`then` 方法返回的是一个新的 `Promise` 实例，即可以采用链式写法。
```JavaScript
	getJSON("/post/1.json").then(
	  post => getJSON(post.commentURL)
	).then(
	  comments => console.log("Resolved: ", comments),
	  err => console.log("Rejected: ", err)
	);
```

`Promise` 实例还提供 catch 方法，即是 .then(null, rejection) 的别名，用于指定发生错误时的回调函数。尽量不要在 `then` 方法里面定义 `Rejection` 状态的回调函数（即 `then` 的第二个参数），总是使用 `catch` 方法，这可以使得错误可以被统一处理。

由于 `catch` 方法返回的还是一个 `Promise` 对象，因此后面还可以接着调用 `then` 方法。

`Promise.all` 方法用于将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。

`Promise.all` 方法接受一个具有 iterator 接口的对象作为参数，且对象的每个成员都是 `Promise` 实例，如果对象不是 `Promise` 实例，会先调用 `Promise.resolve` 方法将对象转换为 `Promise` 实例。

`Promise.race` 方法同 `Promise.all` 方法是将多个 Promise 实例，包装成一个新的 `Promise` 实例。它与 `Promise.all` 方法不同之处在于，`Promise.race` 只要一个 `Promise` 实例的状态变化，新的包装实例的状态就随之变化（即如方法名，谁跑的快听谁的）。

`Promise.resolve()` 方法用来将现有对象转为 `Promise` 对象。

**注意：**如果 `Promise.resolve` 方法的参数，不是具有 `then` 方法的对象（又称 `thenable` 对象），则返回一个新的 `Promise` 对象，且它的状态为 `Resolved`，基于 `Promise` 的回调函数将被立即执行。

`Promise.reject()` 方法也会返回一个新的 `Promise` 实例，该实例的状态为 `rejected`。`Promise.reject` 方法的参数 reason，会被传递给实例的回调函数。

<a name="Async"></a>
### [异步操作和Async函数](#catalog)
所谓"异步"，简单说就是一个任务分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。

ES6 诞生以前，异步编程的方法，大概有下面四种。

* 回调函数
* 事件监听
* 发布/订阅
* Promise 对象

ES6 通过 `Generator` 函数将 JavaScript 异步编程带入了一个全新的阶段（原理已在[Generator](#Generator)章节中阐述，更多案例移步[原著](http://es6.ruanyifeng.com/#docs/async)），ES7 提出的 `Async` 函数更是在 ES6 的基础上的升级。

`async` 函数是什么？原著作者认为 `async` 函数就是 `Generator` 函数的语法糖。通过一个读取文件的案例来看看它们之间的区别：
```JavaScript
	var fs = require('fs');
	
	var readFile = function (fileName){
	  return new Promise(function (resolve, reject){
	    fs.readFile(fileName, function(error, data){
	      if (error) reject(error);
	      resolve(data);
	    });
	  });
	};
	
	// use Generator
	var gen = function* (){
	  var f1 = yield readFile('/etc/fstab');
	  var f2 = yield readFile('/etc/shells');
	  console.log(f1.toString());
	  console.log(f2.toString());
	};
	
	// use Async
	var asyncReadFile = async function (){
	  var f1 = await readFile('/etc/fstab');
	  var f2 = await readFile('/etc/shells');
	  console.log(f1.toString());
	  console.log(f2.toString());
	};
```

比较就会发现，`async` 函数就是将 `Generator` 函数的星号（*）替换成 `async`，将 `yield` 替换成 `await`，仅此而已。

`async` 函数对 `Generator` 函数的改进主要体现在以下三个方面：
1. 内置执行器。`async` 函数自带执行器，也就是说，async 函数的执行，与普通函数一模一样。
2. 更好的语义。`async` 表示函数里有异步操作，`await` 表示紧跟在后面的表达式需要等待结果。
3. 更广的适用性。`async` 函数的 `await` 命令后面，可以跟 `Promise` 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。

`await` 函数返回一个 `Promise` 对象，可以使用 `then` 方法添加回调函数。当函数执行的时候，一旦遇到 `await` 就会先返回，等到触发的异步操作完成，再接着执行函数体内后面的语句。

<a name="Class"></a>
### [Class](#catalog)
ES6 引入了 Class（类）这个概念，通过 `class` 关键字，可以定义类作为对象的模板代替原先通过构造函数来定义和生成新对象。

基本上，ES6 的 `class` 可以看作只是一个语法糖，完全可以看作构造函数的另一种写法。

```JavaScript
	function Point(x,y){
	  this.x = x;
	  this.y = y;
	}
	
	Point.prototype.toString = function () {
	  return '(' + this.x + ', ' + this.y + ')';
	}

	//定义类
	class Point {
	
	  constructor(x, y) {
	    this.x = x;
	    this.y = y;
	  }
	
	  toString() {
	    return '('+this.x+', '+this.y+')';
	  }
	
	}

	typeof Point // "function"
```

类的内部所有定义的方法，都是不可枚举的（`enumerable`）。

`Class` 之间通过 `extends` 关键字实现继承。

**注意：**

子类必须在 `constructor` 方法中显式地调用 `super` 方法（js 不像 java 一样默认隐式调用 `super` 方法），否则新建实例时会报错。因为子类没有自己的 `this` 对象，而是继承父类的 `this` 对象，然后对其进行加工。如果不调用 `super` 方法，子类就得不到 `this` 对象。

如果子类没有定义 `constructor` 方法，`constructor` 方法会被默认添加。

```JavaScript
	class Point {
	  constructor(x, y) {
	    this.x = x;
	    this.y = y;
	  }
	}
	
	class ColorPoint extends Point {
	  constructor(x, y, color) {
	    this.color = color; // ReferenceError
	    super(x, y);
	    this.color = color; // 正确
	  }
	}
	
	let cp = new ColorPoint(25, 8, 'green');
	
	cp instanceof ColorPoint // true
	cp instanceof Point // true
```

`Class` 作为构造函数的语法糖，同时有 `prototype` 属性和 `__proto__` 属性，因此同时存在两条继承链。

（1）子类的 `__proto__` 属性，表示构造函数的继承，总是指向父类。
（2）子类 `prototype` 属性的 `__proto__` 属性，表示方法的继承，总是指向父类的 `prototype` 属性。

在子类中，`super` 关键字代表父类实例。

`extends` 关键字不仅可以用来继承类，还可以用来**继承原生的构造函数**。因此可以在原生数据结构的基础上，定义自己的数据结构。

在 `class` 内部可以使用 `get` 和 `set` 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

在 `class` 的某个方法之前加上星号（*），就表示该方法是一个 `Generator` 函数。
```JavaScript
	class Foo {
	  constructor(...args) {
	    this.args = args;
	  }
	  * [Symbol.iterator]() {
	    for (let arg of this.args) {
	      yield arg;
	    }
	  }
	}
	
	for (let x of new Foo('hello', 'world')) {
	  console.log(x);
	}
```

#### Class 的静态方法
在一个方法前，加上 `static` 关键字，就表示该方法不会被实例化，而是直接通过类来调用，这就称为“静态方法”。
```JavaScript
	class Foo {
	  static classMethod() {
	    return 'hello';
	  }
	}
	
	Foo.classMethod() // 'hello'
	
	var foo = new Foo();
	foo.classMethod()
	// TypeError: undefined is not a function
```

父类的静态方法，可以被子类继承。

ES6 为 `new` 命令引入了一个 `new.target` 属性，（在构造函数中）返回 `new` 命令作用于的那个构造函数。如果构造函数不是通过 new 命令调用的，`new.target` 会返回undefined。

子类继承父类时，`new.target` 会返回子类。利用这个特点，可以写出不能独立使用、必须继承后才能使用的类。
```JavaScript
	class Shape {
	  constructor() {
	    if (new.target === Shape) {
	      throw new Error('本类不能实例化');
	    }
	  }
	}
	
	class Rectangle extends Shape {
	  constructor(length, width) {
	    super();
	    // ...
	  }
	}
	
	var x = new Shape();  // 报错
	var y = new Rectangle(3, 4);  // 正确
```

Mixin 模式指的是，将多个类的接口“混入”（mix in）另一个类（多继承）。
```JavaScript
	class DistributedEdit extends mix(Loggable, Serializable) {
	  // ...
	}
```

<a name="Decorator"></a>
### [修饰器](#catalog)
修饰器（Decorator）是一个表达式，用来修改类的行为。这是ES7的一个提案。修饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，修饰器能在编译阶段运行代码。
```JavaScript
	function testable(target) {
	  target.isTestable = true;
	}
	
	@testable
	class MyTestableClass {}
	
	console.log(MyTestableClass.isTestable) // true
	// PS：上面虽然为类的静态属性，但Decorator为ES7提案，并不属于ES6
```

修饰器函数可以接受三个参数，依次是目标函数、属性名和该属性的描述对象，后两个参数可省略，即 function Decorator(target[, attr, descriptor])。
```JavaScript
	// mixins.js
	export function mixins(...list) {
	  return function (target) {
	    Object.assign(target.prototype, ...list)
	  }
	}
	
	// main.js
	import { mixins } from './mixins'
	
	const Foo = {
	  foo() { console.log('foo') }
	}
	
	@mixins(Foo)
	class MyClass {}
	
	let obj = new MyClass()
	obj.foo() // 'foo'
```

修饰器不仅可以修饰类，还可以修饰类的方法。
```JavaScript
	function testable(target) {
	  target.prototype.isTestable = true;
	}
	
	function readonly(target, name, descriptor){
	  // descriptor对象原来的值如下
	  // {
	  //   value: specifiedFunction,
	  //   enumerable: false,
	  //   configurable: true,
	  //   writable: true
	  // };
	  descriptor.writable = false;
	  return descriptor;
	}
	
	function nonenumerable(target, name, descriptor) {
	  descriptor.enumerable = false;
	  return descriptor;
	}
	
	
	@testable
	class Person {
	  @readonly
	  @nonenumerable
	  name() { return `${this.first} ${this.last}` }
	}
```

修饰器只能用于类和类的方法，不能用于函数。

#### core-decorators.js
core-decorators.js 是一个第三方模块，提供了几个常见的修饰器，通过它可以更好地理解修饰器。（案例请移步[原著](http://es6.ruanyifeng.com/#docs/decorator)）

1. @autobind：使方法中的this对象，绑定原始对象。
2. @readonly：使属性或方法不可写。
3. @override：检查子类的方法，是否正确覆盖了父类的同名方法，如果不正确会报错。
4. @deprecate 或deprecated：在控制台显示一条警告，表示该方法将废除。
5. @suppressWarnings：抑制decorated修饰器导致的console.warn()调用。

#### Mixin
所谓Mixin模式，就是对象继承的一种替代方案，中文译为“混入”（mix in），意为在一个对象之中混入另外一个对象的方法。
```JavaScript
	const Foo = {
	  foo() { console.log('foo') }
	};
	
	class MyClass {}
	
	Object.assign(MyClass.prototype, Foo);
	
	let obj = new MyClass();
	obj.foo() // 'foo'

	export function mixins(...list) {
	  return function (target) {
	    Object.assign(target.prototype, ...list);
	  };
	}
	
	import { mixins } from './mixins'
	
	const Foo = {
	  foo() { console.log('foo') }
	};
	
	@mixins(Foo)
	class MyClass {}
	
	let obj = new MyClass();
	obj.foo() // "foo"
```
<a name="Module"></a>
### [Module](#catalog)
历史上，JavaScript 一直没有模块（module）体系，无法将一个大程序拆分成互相依赖的小文件，这对开发大型的、复杂的项目形成了巨大障碍。

在 ES6 之前，为人熟知的模块加载方案最主要有 `CommonJS`（同步）和 `AMD`（异步）两种。在这次 ES6 标准中实现了模块功能，而且实现得相当简单，完全可以取代现有的 `CommonJS` 和 `AMD` 规范，成为浏览器和服务器通用的模块解决方案。
```JavaScript
	// CommonJS
	let { stat, exists, readFile } = require('fs');
	
	// Module
	import { stat, exists, readFile } from 'fs';
```

ES6 模块不是对象，而是通过 `export` 命令显式指定输出的代码，输入时也采用静态命令的形式。上面代码的实质是从 fs 模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”，即 ES6 可以在编译时就完成模块编译，效率要比 `CommonJS` 模块的加载方式高。

#### 严格模式
ES6的模块自动采用严格模式，不管你有没有在模块头部加上 "use strict"。

严格模式主要有以下限制。

* 变量必须声明后再使用
* 函数的参数不能有同名属性，否则报错
* 不能使用 with 语句
* 不能对只读属性赋值，否则报错
* 不能使用前缀 0 表示八进制数，否则报错
* 不能删除不可删除的属性，否则报错
* 不能删除变量 delete prop，会报错，只能删除属性 delete global[prop]
* eval 不会在它的外层作用域引入变量
* eval 和 arguments 不能被重新赋值
* arguments 不会自动反映函数参数的变化
* 不能使用 arguments.callee
* 不能使用 arguments.caller
* 禁止 this 指向全局对象
* 不能使用 fn.caller 和 fn.arguments 获取函数调用的堆栈
* 增加了保留字（比如protected、static和interface）

#### export命令
模块功能主要由两个命令构成：`export` 和 `import`。`export` 命令用于规定模块的对外接口，`import` 命令用于输入其他模块提供的功能。

一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用 `export` 关键字输出该变量。

`export` 输出的变量就是本来的名字，但是可以使用 `as` 关键字重命名。

```JavaScript
	function v1() { ... }
	function v2() { ... }
	
	export {
	  v1 as streamV1,
	  v2 as streamV2,
	  v2 as streamLatestVersion
	};
```

`export` 语句输出的值是动态绑定，绑定其所在的模块。
```JavaScript
	export var foo = 'bar';
	setTimeout(() => foo = 'baz', 500);
```

上面代码输出变量 foo，值为 bar，500 毫秒之后变成 baz。

#### import 命令
使用 `export` 命令定义了模块的对外接口以后，其他JS文件就可以通过 `import` 命令加载这个模块（文件）。

`import` 命令同 `export` 命令一样可以使用 `as` 关键字重命名。
```JavaScript
	import { lastName as surname } from './profile';
```

#### 模块的整体加载 & module 命令
除了指定加载某个输出值，还可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面。

也可以通过 `module` 命令代替 `import` 语句，达到整体输入模块的作用。
```JavaScript
	export function area(radius) {
	  return Math.PI * radius * radius;
	}
	
	export function circumference(radius) {
	  return 2 * Math.PI * radius;
	}
	
	// 以下方法结果是相同的
	import { area, circumference } from './circle';
	
	import * as circle from './circle';
	
	module circle from './circle';
	
	console.log("圆面积：" + circle.area(4));
	console.log("圆周长：" + circle.circumference(14));
```
#### export default命令
使用 `export default` 命令为模块指定默认输出，一个模块只能有一个默认输出，因此 export deault 命令只能使用一次。需要注意的是，当要使用  export default时，`import` 命令后面不使用大括号，因为只可能对应一个方法。

如果想在一条 import 语句中，同时输入默认方法和其他变量，可以写成下面这样。
```JavaScript
	import customName, { otherMethod } from './export-default';
```

#### 模块的继承
模块之间也可以继承。
```JavaScript
	export * from 'circle';
	export var e = 2.71828182846;
	export default function(x) {
	    return Math.exp(x);
	}
```

<a name="Style"></a>
### [编程风格](#catalog)
#### 1. 块级作用域
1. let 取代 var
ES6 提出了两个新的声明变量的命令：let 和 const。其中，let 完全可以取代 var，因为两者语义相同，而且 let 没有副作用。
2. 全局常量和线程安全  
在 let 和 const 之间，建议优先使用 const，尤其是在全局环境，不应该设置变量，只应设置常量。这符合函数式编程思想，有利于将来的分布式运算。
**所有的函数都应该设置为常量。**
3. 严格模式
V8 引擎只在严格模式之下，支持 let 和 const。

#### 2. 字符串
静态字符串一律使用单引号或反引号，不使用双引号。动态字符串使用反引号。
```JavaScript
	// bad
	const a = "foobar";
	const b = 'foo' + a + 'bar';
	
	// acceptable
	const c = `foobar`;
	
	// good
	const a  = 'foobar';
	const b = `foo${a}bar`;
```

#### 3. 解构赋值
函数的参数如果是对象的成员，优先使用解构赋值。
如果函数返回多个值，优先使用对象的解构赋值，而不是数组的解构赋值。这样便于以后添加返回值，以及更改返回值的顺序。
```JavaScript
	// bad
	function getFullName(user) {
	  const firstName = user.firstName;
	  const lastName = user.lastName;
	}
	
	// good
	function getFullName(obj) {
	  const { firstName, lastName } = obj;
	}
	
	// best
	function getFullName({ firstName, lastName }) {
	}
```

如果函数返回多个值，优先使用对象的解构赋值，而不是数组的解构赋值。这样便于以后添加返回值，以及更改返回值的顺序。
```JavaScript
	// bad
	function processInput(input) {
	  return [left, right, top, bottom];
	}
	
	// good
	function processInput(input) {
	  return { left, right, top, bottom };
	}
	
	const { left, right } = processInput(input);
```

#### 4. 对象
对象尽量静态化，一旦定义，就不得随意添加新的属性。如果添加属性不可避免，要使用 `Object.assign` 方法。
```JavaScript
	// bad
	const a = {};
	a.x = 3;
	
	// if reshape unavoidable
	const a = {};
	Object.assign(a, { x: 3 });
	
	// good
	const a = { x: null };
	a.x = 3;
```

对象的属性和方法，尽量采用简洁表达法，这样易于描述和书写。

#### 5. 数组
使用扩展运算符（...）拷贝数组。使用 Array.from 方法，将类似数组的对象转为数组。
```JavaScript
	// bad
	const len = items.length;
	const itemsCopy = [];
	let i;
	
	for (i = 0; i < len; i++) {
	  itemsCopy[i] = items[i];
	}
	
	// good
	const itemsCopy = [...items];

	const foo = document.querySelectorAll('.foo');
	const nodes = Array.from(foo);
```

#### 6. 函数
立即执行函数可以写成箭头函数的形式，另外那些需要使用函数表达式的场合，尽量用箭头函数代替。

箭头函数取代 Function.prototype.bind，不应再用 self/_this/that 绑定 this。
```JavaScript
	// bad
	const self = this;
	const boundMethod = function(...params) {
	  return method.apply(self, params);
	}
	
	// acceptable
	const boundMethod = method.bind(this);
	
	// best
	const boundMethod = (...params) => method.apply(this, params);
```

所有配置项都应该集中在一个对象，放在最后一个参数，布尔值不可以直接作为参数，并使用默认值语法设置函数参数的默认值。
```JavaScript
	// bad
	function divide(a, b, option = false ) {
	}
	
	// good
	function divide(a, b, { option = false } = {}) {
	}
```

不要在函数体内使用 arguments 变量，使用 `rest` 运算符（...）代替。因为 rest 运算符显式表明你想要获取参数，而且 `arguments` 是一个类似数组的对象，而 `rest` 运算符可以提供一个真正的数组。
```JavaScript
	// bad
	function concatenateAll() {
	  const args = Array.prototype.slice.call(arguments);
	  return args.join('');
	}
	
	// good
	function concatenateAll(...args) {
	  return args.join('');
	}
```

#### 7. Map结构
注意区分 `Object` 和 `Map`，只有**模拟实体对象**时，才使用 `Object`。如果只是需要 key:value 的数据结构，使用 `Map`。因为 `Map` 有内建的遍历机制。

#### 8. Class
总是用 class，取代需要 prototype 操作；使用 extends 实现继承，因为这样更简单，不会有破坏 instanceof 运算的危险。
```JavaScript
	// bad
	function Queue(contents = []) {
	  this._queue = [...contents];
	}
	Queue.prototype.pop = function() {
	  const value = this._queue[0];
	  this._queue.splice(0, 1);
	  return value;
	}

	const inherits = require('inherits');
	function PeekableQueue(contents) {
	  Queue.apply(this, contents);
	}
	inherits(PeekableQueue, Queue);
	PeekableQueue.prototype.peek = function() {
	  return this._queue[0];
	}
	
	// good
	class Queue {
	  constructor(contents = []) {
	    this._queue = [...contents];
	  }
	  pop() {
	    const value = this._queue[0];
	    this._queue.splice(0, 1);
	    return value;
	  }
	}
	
	class PeekableQueue extends Queue {
	  peek() {
	    return this._queue[0];
	  }
	}
```
#### 9. 模块
首先，Module 语法是 JavaScript 模块的标准写法，坚持使用这种写法。使用 `import` 取代 `require`，使用 `export` 取代 `module.exports`。

不要在模块输入中使用通配符。因为这样可以确保你的模块之中，有一个默认输出（export default）。如果模块默认输出一个函数，函数名的首字母应该小写；如果模块默认输出一个对象，对象名的首字母应该大写。

#### 10. ESLint
**ESLint 是一个语法规则和代码风格的检查工具，可以用来保证写出语法正确、风格统一的代码。**