### 嗯？这都是怎么一回事哪？
最近我有机会研究使用不同的方法在JavaScript中实现[装饰者模式（又称为包装模式）](https://en.wikipedia.org/wiki/Decorator_pattern)。我觉得有必要分享我所学到的，关于使用这些技术来实现装饰者模式的利弊。

**"当然不是这种装饰者..."**
![当然不是这种装饰者...](https://o7nu3cbe9.bkt.clouddn.com/blog/decorator-design-pattern/decorator.png)

这5种不同的实现方式分别是：

1. 闭包
2. 猴子补丁
3. 原型继承
4. 代理（ES6）
5. 中间件

如果你想要知道本文 **a) 为什么使用ES6语法**，**b) 为什么不使用class**， **c) 源文件列表**，为了不打乱阅读顺序，我已经把这些都记在了附录中，你可以到这篇文章的最后查看。

### 首先，需要被装饰的组件
```JavaScript
'use strict'

function myComponentFactory() {
    let suffix = ''

    return {
        setSuffix: suf => suffix = suf,
        printValue: value => console.log(`value is ${value + suffix}`)
    }
}

const component = myComponentFactory()
component.setSuffix('!')
component.printValue('My Value')
```
这是个简单的组件，含有一个 `printValue(val)` 方法，用来在值的最后添加尾缀并在控制台输出，尾缀可以通过 `setSuffix(val)` 方法设置。

我准备用一个验证输入的装饰器，以及一个将值转换为小写的验证器来展示装饰链的情景。创建 `setSuffix(val)` 方法是为了添加一些复杂性，用来满足组件拥有除装饰方法以外还有其他成员。

值得注意的是，除了最后一个以外的所有例子都是使用独立的函数对目标对象进行装饰，而不是添加对象的一个成员。

#### 如何装饰这个组件

下图显示我准备如何装饰这个组件，先将初始的 `printValue(val)` 方法先用 'lower case' 装饰器包装，然后再用 'validate' 装饰器包装。当一个被装饰过的组件调用 `printValue(val)` 方法时，首先它会验证它的值，然后会将值转为小写，最后打印它。

（注意：下图表明，我们可以在原始调用之后返回过程时，给我们的装饰器添加额外的行为，而本文并没有涉及这些。）

![组件装饰设计图](https://o7nu3cbe9.bkt.clouddn.com/blog/decorator-design-pattern/design-picture.png)

### 方法一： 闭包
我能想到最原生实现装饰者模式的方法就是用一个对象来包装需要被装饰的对象，并返回一个新对象，在这个新对象中执行一些处理后再调用原始的方法。

![简单](https://o7nu3cbe9.bkt.clouddn.com/blog/decorator-design-pattern/simple.png)
> “简单！”

**上代码！**

首先，我会展示这些代码作为一个整体，然后我会带你一步一步地分析它。

```JavaScript
function myComponentFactory() {
    let suffix = ''

    return {
        setSuffix: suf => suffix = suf,
        printValue: value => console.log(`value is ${value + suffix}`)
    }
}

function toLowerDecorator(inner) {
    return {
        setSuffix: inner.setSuffix,
        printValue: value => inner.printValue(value.toLowerCase())
    }
}

function validatorDecorator(inner) {
    return {
        setSuffix: inner.setSuffix,
        printValue: value => {
            const isValid = ~value.indexOf('My')

            setTimeout(() => {
                if (isValid) inner.printValue(value)
                else console.log('not valid man...')
            }, 500)
        }
    }
}

const component = validatorDecorator(toLowerDecorator(myComponentFactory()))
component.setSuffix('!')
component.printValue('My Value')
component.printValue('Invalid Value')
```
这些都做了什么？

组件工厂还是和之前的一样。不过，我们通过用装饰工厂包裹它的创建来装饰它。

```JavaScript
const component = validatorDecorator(toLowerDecorator(myComponentFactory()))
```
原始对象将作为参数传入装饰工厂中，并返回一个经过包装的对象，它会将除了被装饰的方法以外的调用直接传递给初始对象。

装饰工厂接受原始对象作为参数，并返回一个经过包装后的对象，这个对象会将除了需要被装饰的方法以外的调用直接传递给原始对象。

```JavaScript
function toLowerDecorator(inner) {
    return {
        setSuffix: inner.setSuffix,
        printValue: value => inner.printValue(value.toLowerCase())
    }
}
```
装饰器会将值转换为小写，并把这个“装饰”（或“包装”）后的值传给了内部函数。

然后，我们可以继续在对象的创建上添加装饰工厂方法并等待调用，这就像是在打开一个俄罗斯套娃。

![俄罗斯套娃](https://o7nu3cbe9.bkt.clouddn.com/blog/decorator-design-pattern/Matryoshka-doll.jpg)

在完成了对象的创建和装饰之后，我们运行我们的测试代码：

```JavaScript
component.setSuffix('!')
component.printValue('My Value')
component.printValue('Invalid Value')
```
结果是：

```JavaScript
value is my value!
not valid man...
```
最外层的装饰器将会第一个被执行。在这个例子中是验证方法。第一次调用是合法的，所以结果会被传递给第二个方法，值将被转换为小写，然后再按顺序调用原始方法给经过小写处理后的值添加尾缀，并在控制台中输出结果。

第二次调用没有通过验证，所以值没有被修改，它展示了如何停止装饰链。

#### 验证装饰器为何要设置定时？

![[(服务生比喻是解释异步代码最好的方法)](http://www.roidna.com/blog/what-is-node-js-benefits-overview/)
](https://o7nu3cbe9.bkt.clouddn.com/blog/decorator-design-pattern/waiters.jpg)

我在包装方法中添加一些异步的代码，因为我们在 JavaScript 的世界里：一个单线程，无阻塞，异步为王的语言世界。如果你的代码无法处理异步，那么它就失去了大部分 JavaScript 语言设计的特点。

验证方法通过设置定时来模拟去数据库验证值的合法性，然后在回调函数中去调用内部函数的方法。这样我们能测试我们的实现方式在处理异步代码时是否依旧能正常工作。

#### 该如何使用闭包？
为了之后的调用，我们可以将内部对象存储到一个新对象上。但我们为什么不这样做？因为这会使得它成为公共的，那时，我该调用 `instance.setSuffix()`，还是 `instance._original.setSuffix()`？这会变得非常奇怪，会混淆对象的使用，使对象成为一个私有成员这会好得多。
>“然而JavaScript并没有私有成员，糟糕！”

但我们可以使用闭包来达到这个效果。

**官方：什么是闭包？**
> “即使函数在变量的作用域之外被调用，闭包允许函数访问闭包引用的变量。”（我稍微重新措辞从[维基百科](https://en.wikipedia.org/wiki/Closure_(computer_programming))的定义）

一个简单的例子:

```JavaScript
function wow() {
    const val = 5
    return () => console.log(val)
}

wow()()
```
这是一个我能想到用  JavaScript实现最简单的例子。“wow” 方法返回一个打印 “val” 的方法，然而，一旦 “wow” 返回，“val” 变量就不在作用域之中。

然而，它会正常显示，因为闭包在方法返回时就被创建了，它已经记录了作用域里的变量（在这个例子中是 “val”），即使离开了当前作用域，闭包依旧可以访问它内部的变量，

#### 回到我们的装饰器

再来看看之前的装饰器：

```JavaScript
function toLowerDecorator(inner) {
    return {
        setSuffix: inner.setSuffix,
        printValue: value => inner.printValue(value.tolowercase())
    }
}
```
它返回一个包含以下方法的对象：

```JavaScript
value => inner.printValue(value.tolowercase())
```
这个方法引用 “inner” 对象，当装饰方法被返回时，“inner” 对象就已经在作用域之外了。但因为，它在方法内部是一个被使用的变量，所以内部方法会记录这个变量，一旦这个方法被返回，那么闭包就形成了。

这意味着为了嵌套的方法能在之后正常调用，变量的生命周期被我们的内部方法给延长了。

因为闭包，我们的方法能使用“inner”对象，但它是私有变量，并不是公共的。

闭包是 JavaScript 最重要和实用的特性之一，所以确保你现在已经领悟它了。

![私有](https://o7nu3cbe9.bkt.clouddn.com/blog/decorator-design-pattern/soldiers_privates.jpg)

#### 优缺点

在这介绍闭包，虽然它和上面的包装方法有一点关系，但事实上，本文所展示的技术都使用了闭包来隐藏私有变量。

除此之外，这是一个非常简单的实现，但有一个非常明显的缺点：我们必须包装内部对象的每个方法，而非装饰那一个目标方法。就像这样：

```JavaScript
return {
    setSuffix: inner.setSuffix,
    ...
```
这既丑陋又痛苦。可不可以我们的装饰器只定义装饰行为而不去关心剩下的？幸运的是有不少技术能这样做。让我们看看猴子补丁是如何做的。

### 方法二：猴子补丁

**什么是猴子补丁？**
>“动态修改一个类或模型。” -[维基百科](https://en.wikipedia.org/wiki/Monkey_patch)

简单地在当前情景下解释一下：
>“我将要采用 JavaScript 的动态性并结合对象可变性的特点来用我的方法取代你的方法！” -（那时的我）

那该如何用猴子补丁来装饰？
>“我准备用我的方法替换你的，然后我会从我的方法内部包装并调用你的方法。” -（依旧是我）

**该怎么做！**
你问该怎么做？好，我会像你展示。首先，我会展示这些代码作为一个整体，然后我会带你一步一步地分析它：（译者注：这里是原作者的一处幽默，看原文更能体会。）

```JavaScript
function myComponentFactory() {
    let suffix = ''

    return {
        setSuffix: suf => suffix = suf,
        printValue: value => console.log(`value is ${value + suffix}`)
    }
}

function decorateWithToLower(inner) {
    const originalPrintValue = inner.printValue
    inner.printValue = value => originalPrintValue(value.toLowerCase())
}

function decorateWithValidator(inner) {
    const originalPrintValue = inner.printValue

    inner.printValue = value => {
        const isValid = ~value.indexOf('My')

        setTimeout(() => {
            if (isValid) originalPrintValue(value)
            else console.log('not valid man...')
        }, 500)
    }
}

const component = myComponentFactory()
decorateWithToLower(component)
decorateWithValidator(component)

component.setSuffix('!')
component.printValue('My Value')
component.printValue('Invalid Value')
```
这都做了些什么？

组件还是那个组件，装饰器变了，并且调用方式也变了。我们通过在现有对象上进行处理的方式，来代替通过工厂方法传递对象的方式来实现我们的装饰方法：

```JavaScript
decorateWithToLower(component)
```
这个装饰方法通过保存初始 “printValue” 方法到一个本地变量的办法来实现猴子补丁：

```JavaScript
const originalPrintValue = inner.printValue
```
然后用一个方法覆盖原始方法，这个方法先将值转换为小写，再将值传递给之前储存的原始方法的副本去调用：

```JavaScript
inner.printValue = value => originalPrintValue(value.toLowerCase())
```
我们和之前一样创建我们的装饰器。我们先用一个转换小写装饰器包装 `printValue()`，再用一个验证装饰器来包装它：

```JavaScript
const component = myComponentFactory()
decorateWithToLower(component)
decorateWithValidator(component)
```
注意这里依旧使用了闭包来用于内部函数链的存储。与例一真正的区别在于我们只替换了现有对象中的一个方法，而不是返回一个全新包装后的对象。

**猴子补丁的优缺点**

人们讨厌猴子补丁通常有着好的理由。

![猴子](https://o7nu3cbe9.bkt.clouddn.com/blog/decorator-design-pattern/monkeys.jpg)

额......

为什么所有人都讨厌？因为当我调用一个库函数时，我不希望功能因为我引入了一些其他完全无关的“巨坑”库而被修改了。

不幸的是，如果那个愚蠢的人类决定去猴子补丁一些原生方法或一些共享的依赖，那对我来说就没有惊喜，只剩惊吓了。

如果猴子补丁只是现在用于我自己的代码，它可能并不那么糟糕，但它依旧有点古怪，一些人依旧会对它说“不”。

尽管如此，它比我们之前的方法还是有一个优势。我们的装饰方法只需处理我们想要装饰的方法，组件其余的部分保持不变。这意味着我们的装饰方法只有一个职责：用新的行为包装去方法。

所以，如果你不介意猴子补丁，你的基础对象又拥有需要被额外维护的公共方法，而且你希望保持代码简洁，那么这项技术可能适合你。

好，那有关原型继承是怎样的？

### 方法三：原型继承
**什么是原型继承？**

大多数开发者习惯于 Java 或 C# 这种一个类基于另一个类的经典继承方式。简单来说，原型继承就都是用对象代替类：“一个对象从其他对象继承上属性。”

它的实现机制在 JavaScript 中也十分简单。所有对象都有同一个原型。事实上，所有原型链的终点都指向 “Object”，它也是所有原型链的基础。

**委托**

![委托](https://o7nu3cbe9.bkt.clouddn.com/blog/decorator-design-pattern/delegation.jpg)

你可以通过设置对象的原型声明一个对象基于另一个对象。这就意味着：如果需要访问一个对象成员，对象首先会在自身之中查找，但如果没有找到，它会去它的原型上继续查找，并一直按照这个方式查找到原型链的终点。

我不喜欢使用 JavaScript 中的 `new` 关键字，我不在这深入说为什么，如果你感兴趣，可以到文章的最后查看。而在我看来，实现原型继承最好的方法是使用 `Object.create(prototype)`：

```JavaScript
const myBaseObject = { myProperty: 'oh hai' }

const myNewObject = Object.create(myBaseObject)
myNewObject.newMethod = () => { console.log(myBaseObject.myProperty) }
```
这里我们不仅设置 myBaseObject 作为 myNewObject 的原型来继承，还展示了如何访问基类的成员。这里没有受保护的或私有的作用域，也没有抽象成员需要我们考虑。如果你想只暴露新的对象而不显示基类对象，只需通过一个函数包裹，然后返回所有你想要的。函数总是能处理你在 JavaScript 中遇到的任何问题。

**看代码**

```JavaScript
function myComponentFactory() {
    let suffix = ''

    return {
        setSuffix: suf => suffix = suf,
        printValue: value => console.log(`value is ${value + suffix}`)
    }
}

function toLowerDecorator(inner) {
    const instance = Object.create(inner)
    instance.printValue = value => inner.printValue(value.toLowerCase())
    return instance
}

function validatorDecorator(inner) {
    const instance = Object.create(inner)
    instance.printValue = value => {
        const isValid = ~value.indexOf('My')

        setTimeout(() => {
            if (isValid) inner.printValue(value)
            else console.log('not valid man...')
        }, 500)
    }
    return instance
}

const component = validatorDecorator(toLowerDecorator(myComponentFactory()))
component.setSuffix('!')
component.printValue('My Value')
component.printValue('Invalid Value')
```
这个例子里我构造了一个新的对象来访问内部的对象，这和第一个例子十分地相似。然而，第一个例子中有个缺陷就是为了确保初始对象的每个成员都可访问，需要将每个成员变量复制到新的包装对象上。在这个例子中，我们发挥对象继承的优势，新对象创建时使用初始对象作为它的原型，这样我们就不必在新对象上定义 “setSuffix” 方法，当这个方法被调用时，原型链会检查这个成员是否存在。

在 JavaScript 中使用继承来实现一个装饰器是一个显而易见并高效的方式。有趣的是，装饰者模式的最初设计目的之一就是解决传统继承的一些局限性。也就是说，采用传统的继承，无法将不同的行为联系起来，必须事先定义类的继承关系，这会导致它成为一个僵化的层次结构（译者并不赞同这个观点）。幸运的是，原型继承没有这个限制，从上面的例子就可以看到，我可以选择任何对象作为原型。

这使得用原型继承来实现装饰器是一个极好的选择。

### 方法四：代理
ES6中增加了代理模块，它看上去有希望去完成一些关于面向切片的编程技术。让我们来看看，它能不能帮我们创建一个装饰器。

**什么是代理？**
>“代理对象通常用来为基本操作定义自定义行为（例如：属性查找，赋值，枚举或函数调用等）。 -[MDN](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

哇~我们可以在属性查找和函数调用时注入自定义行为？听起来很强大？没错，很强大。

**看代码**

```JavaScript
require('harmony-reflect')

function myComponentFactory() {
    let suffix = ''

    return {
        setSuffix: suff => suffix = suff,
        printValue: value => console.log(`value is ${value + suffix}`)
    }
}

function toLowerDecorator(inner) {
    return new Proxy(inner, {
        get: (target, name) => {
            return (name === 'printValue')
                ? value => target.printValue(value.toLowerCase())
                : target[name]
        }
    })
}

function validatorDecorator(inner) {
    return new Proxy(inner, {
        get: (target, name) => {
            return (name === 'printValue')
                ? value => {
                    const isValid = ~value.indexOf('my')

                    setTimeout(() => {
                        if (isValid) target.printValue(value)
                        else console.log('not valid man...')
                    }, 500)
                }
                : target[name]
        }
    })
}

const component = toLowerDecorator(validatorDecorator(myComponentFactory()))
component.setSuffix('!')
component.printValue('My Value')
component.printValue('Invalid Value')
```
首先，这是什么？

```JavaScript
require('harmony-reflect')
```
因为，我用 node.js 运行代码，然而 node.js 暂时还不支持代理模块。如果你想要在 node 中使用代理需要使用以下代码：

```JavaScript
node.exe --harmony-proxies
```
即使这样，在写这篇博客时，node 中的代理模块依旧不是ES6的标准模块。然而，如果你：

```JavaScript
npm install harmony-reflect
```
并向之前一样在代码中引入该模块，那么你会得到一个接近最新 ES6 标准的代理对象来使用，而你现在仍必须使用上面的方法。（我猜测 npm 模块的底层使用的仍是不符合ES6规范的代理对象。）

接下来你会发现组件依旧没有变化，而装饰方法变得不同了：

```JavaScript
function toLowerDecorator(inner) {
    return new Proxy(inner, {
        get: (target, name) => {
            return (name === 'printValue')
                ? value => target.printValue(value.toLowerCase())
                : target[name]
        }
    })
}
```
代理赋予你无比强大的力量，值得你阅读 [MDN](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 上代理部分。

![代理](https://o7nu3cbe9.bkt.clouddn.com/blog/decorator-design-pattern/spiderman_proxies.jpg)

在这里，装饰器将内部对象作为参数输入，并返回它的代理。在代理中，我们只处理一件事：属性访问。我们通过为 “get” 处理程序添加自定义行为来做到这点。

我们测试一下看看属性是否是我们想装饰的属性，如果是则返回新的装饰器方法（在这个例子中，方法就是将值转换为小写并传递值给内部对象的 printValue 方法）；如果属性名不符合就直接返会内部对象的成员。

细心的你一定会发现我们这里又使用到了闭包。

**代理模式的优劣势**

这里的关键点是，虽然为了创建我们的代理对象不得不做一些额外的工作，但无论装饰对象中有多少个成员，装饰器都不会变的更复杂。所以，代理模式有2个优点：

1. 它不是猴子补丁
2. 不必手动重新定义内部对象的每个成员

然而，这可能有点杀鸡用牛刀了，原型继承有着相同的优势。代理的实现是被用来处理面向切片风格的东西，而不是装饰器。

还有，就像我之前说的，支持还不够好。如果你在 node 环境中，那你可以用我之前的方法 polyfill。然而，如果你在浏览器环境中，现在所有的 IE 版本都不支持， Chrome 也只在 49 版本支持。不幸的是，从我的理解看来，可能在浏览器中 ployfill 这个特性将会很困难，很可能会[造成严重的性能问题](https://www.npmjs.com/package/babel-plugin-proxy)。

### 方法五：中间件
之前的那些例子都有一个非常棒的特性，那就是初始的对象不必知道它被装饰了。通过闭包，猴子补丁，继承或者代理来扩展初始对象的行为而不必修改它，这就是[面向对象设计](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design))的[开闭原则](http://c2.com/cgi/wiki?OpenClosedPrinciple)。

假设基础对象一开始就知道自己的创建过程中会被一个特定的方法装饰，会怎么样？还有，假设想在基础功能和装饰器之间增加更多影响，会怎么样？假设通过把一些装饰器的逻辑放到基础对象中使装饰器的代码更为简单,会怎么样？

**看代码**

```JavaScript
function myComponentFactory() {
    let suffix = ''
    const instance = {
        setSuffix: suff => suffix = suff,
        printValue: value => console.log(`value is ${value + suffix}`),
        addDecorators: decorators => {
            let printValue = instance.printValue
            decorators.slice().reverse().forEach(decorator => printValue = decorator(printValue))
            instance.printValue = printValue
        }
    }
    return instance
}

function toLowerDecorator(inner) {
    return value => inner(value.toLowerCase())
}

function validatorDecorator(inner) {
    return value => {
        const isValid = ~value.indexOf('My')

        setTimeout(() => {
            if (isValid) inner(value)
            else console.log('not valid man...')
        }, 500)
    }
}

const component = myComponentFactory()
component.addDecorators([toLowerDecorator, validatorDecorator])
component.setSuffix('!')
component.printValue('My Value')
component.printValue('Invalid Value')
```

注意到主要的区别了么？我们的初始对象知道它会被装饰，并提供了一个特别的方法来添加装饰器。这里组件设置自己的装饰链，你只需提供装饰方法的列表：

```JavaScript
component.addDecorators([toLowerDecorator, validatorDecorator])
```

“addDecorators” 方法会遍历传入到方法中的装饰器，然后将最后一个装饰器方法执行后的结果赋给公共成员变量。这就是基础对象给自身设置装饰链。值得注意的是，方法里翻转了装饰器调用的顺序，为了参数传递时更具可读性：

```JavaScript
addDecorators: decorators => {
    let printValue = instance.printValue
    decorators.slice().reverse().forEach(decorator => printValue = decorator(printValue))
    instance.printValue = printValue
}
```
装饰器方法本身将便的十分简单，它所要做的全部就是更具需要装饰传入的方法并返回这个方法。

```JavaScript
function toLowerDecorator(inner) {
    return value => inner(value.toLowerCase())
}
```
**中间件的优劣势**
通过基础对象自身来创建装饰链，能够获得装饰器更多的控制权。在这个例子中，它被用来通过 `reverse()` 方法来改变装饰器数组的顺序。

在创建装饰链时获得更多的控制权也导致了装饰方法便得极其简单。

因此，通过将对象设置为可以被装饰和完成建立装饰链的工作，我们达成了这些目标：

1. 简单的装饰方法
2. 建立装饰链时，更多的控制权
3. 简单地建立装饰列表，只需传递一个有顺序的装饰器数组的方法，而不必关心特殊装饰者模式实现的构造机制
4. 依旧符合开闭原则，基本实现允许在不修改原始对象的情况下完成装饰
5. 它不是猴子补丁，也不依赖于代理

这是最复杂的实现方式，如果你设置了一些重量级的装饰器，需要更多的管理而不是简单的包装，那么这个实现可能适合你。

我称呼它为“中间件”实现，是因为：

1. 我想不出比这个更好的（译者：- -||）
2. Dan Abramov 使用相同的方法在他的 [redux 中间件](http://redux.js.org/docs/advanced/Middleware.html)实现中

### 结论
我们着眼于用5个不同的技术来实现装饰者模式，在这过程中我们学到了不少。

1. 一个原始的做法，它需要手动地从内部对象复制每个成员到装饰对象上。但我们从中学到了通过闭包来遮盖变量，就好像它们是私有的。
2. 用猴子补丁的方法解决了“复制每个成员”的问题，但是它也有相当大的副作用。
3. 用原型继承的方式解决了“复制每个成员”的问题，似乎完美无缺。
4. 使用 ES6 代理对象又一次解决了之前的问题。然而，代理对象还没有被很好的支持，虽然它是无比强大的，但也强大到超出了这个使用场景。在当前场景下，它并不能比原型继承做得更多。
5. 在“中间件”实现中，基础对象设置了自身的装饰链，这使得它和简单的装饰方法一起成为一个强大并灵活的实现。

####从中我们能总结哪些结论？
**每个实现**方式都使用了**闭包**。这应该能让你明白它在 JavaScript 中有多重要。如果你仍不理解它，退回去再读一次，或者去阅读一些别人更好的描述。

哪个是明显的赢家？当我开始写这篇的时候，我期望每个技术都有它的优势和劣势，取决于使用场景。事实上，写到最后我认为只有2种实现方式值得被使用：

1. 原型继承
2. 中间件

只有当需要对装饰链进行更多控制的时候才使用中间件的方式，否则，原型继承似乎对我来说就是最终赢家。它具有所有的优点：

1. 不需要修改基础对象
2. 不需要复制每个成员到新的对象
3. 不是猴子补丁
4. 不支持差的代码
5. 相对简单的装饰方法

### 附录
#### ES6
我在本文中使用 ES6 语法出于以下多种原因的：

1. 我爱上了 ES6 中的许多事，尤其是箭头函数和 const 关键字
2. 最新的 node.js 中已经原生支持它的大部分功能，也可以通过一个简单的 babel 转换在浏览器中运行 ES6
3. 用它更容易写文章中的例子（缺点是，这对没有学过 ES6 的读者并不是这样）
4. 最近我花了些时间在读和写一些 React 的代码，它所有都是用 ES6 的，所以我们是时候都上这条船了（译者：歪果仁动不动就开船，果仁一言不合就开车）
5. 我开始学习 ES6 在 [babel 的官网](https://babeljs.io/docs/learn-es2015/)，如果你也想开始学习 ES6 可以从这里开始

#### 类
为什么我使用 ES6 却不适用 `class` 关键字哪？有两个非常重要的原因：

1. 类在 ES6 中有很多问题，这有一整篇[文章](https://medium.com/javascript-scene/how-to-fix-the-es6-class-keyword-2d42bb3f4caf#.osnwj4xq5)关于它。（对我来说，真正的烦恼是缺乏私有变量和这样做的“意义是什么”，这个关键字比一个简单的工厂方法做得更少。）
2. 也许更重要的是为了这篇文章：我们谈论的是装饰器，然而装饰器很难和 ES6 class 语法一起工作。正因为此有项提议在 ES7 中应当解决装饰器的问题。然而，正如我希望你看到这篇文章，如果你继续使用函数语法，通过简单的 JavaScript 语法就能创建功能强大的装饰器。
3. 无论是 `new` 关键字还是 `class` 关键字在 ES6 中都让人迷惑。这看上去让 JavaScript 便得
把它们加进 JavaScript 中看上去会让从传统语言，像 Java，转过来的人感觉更舒适，但结果是笨重的，只会掩盖原型的真正能力和简单。这里是另一篇优秀的[文章](http://aaditmshah.github.io/why-prototypal-inheritance-matters/)关于刚刚所提到的。

#### 源文件

1. [闭包](http://nickmeldrum.com/scripts/decorator-wrapper.js)
2. [猴子补丁](http://nickmeldrum.com/scripts/decorator-monkeypatching.js)
3. [原型继承](http://nickmeldrum.com/scripts/decorator-inheritance.js)
4. [代理](http://nickmeldrum.com/scripts/decorator-proxy.js)
5. [中间件](http://nickmeldrum.com/scripts/decorator-middleware.js)

原文：[The decorator pattern in JavaScript using closures, monkey patching, prototypes, proxies and 'middleware'](http://nickmeldrum.com/blog/decorators-in-javascript-using-monkey-patching-closures-prototypes-proxies-and-middleware?utm_source=javascriptweekly&utm_medium=email)

------------ 华丽的分割线 ------------

最后译者推荐[飞狐系列](https://segmentfault.com/u/feihu/articles)，对理解JS设计模式很有帮助。

PPS：翻译的好坏的确是由语文水平决定的，而非外语水平。