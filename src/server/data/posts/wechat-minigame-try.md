> 系列文章
> 
> 1. [微信小程序基础](https://discipled.me/posts/wechat-miniprogram-basic)
> 2. 微信小游戏初试（本文）

如果，你有开发 h5 游戏的经验，那么相信你能够直接上手微信小游戏。即使，你和我一样之前没有游戏开发经验也没关系，看了本文之后，相信你也可以试着开发一个简单的小游戏玩一玩了。

### 文件结构
任何应用都会有一个入口文件，微信小游戏也是如此，小游戏的入口文件是根目录下的 `game.js`。从文件名中可以看到，这个入口文件仍是 js 文件。的确，小游戏在开发语言上没有同小程序那样又另建一套规范，而是依旧采用 js 作为开发语言。

其次，一般而言一个应用的代码除了功能逻辑之外，还会有一些配置文件。对于小游戏而言，它只有一个必要的配置文件 `game.json`，而它的配置项更是不足十个。所以说，如果之前有过 h5 游戏的开发经验再来开发小游戏，可以说是基本没有任何的学习成本。

只要有了上述这两个文件，小游戏就可以正常运行了。

### Adapter
虽然，微信小游戏使用 js 作为开发语言，但小游戏的运行环境是 [JavaScriptCore](https://developer.apple.com/documentation/javascriptcore)(iOS) 和 [V8](https://developers.google.com/v8/index.html)(Android)，而不是熟悉的浏览器或者 Node，也就没有 BOM, DOM 或者文件操作等 API。

你可能会疑惑，连 DOM 都没有了还怎么玩？不用担心，微信自身提供了一系列 API 来完成创建画布、绘制图形、显示图片以及响应用户交互等基础功能。

> “又有 API，不是说好没有学习成本吗？”

这里就又要吹一波微信了。

微信提供了一个名为 `weapp-adapter` 的非常棒的库文件，用于浏览器或 Node API 到微信 API 之间的适配。只需在入口文件引入它，就可以不用额外学习微信 API，而是直接使用 DOM 或其他（如 Node）API 来编写小游戏了。

注：adapter 会自动创建一个 canvas 并暴露到全局。这个 canvas 也是主画布，之后创建的 canvas 都不会直接显示，如要显示，需将它们画到主画布上。

![小游戏架构](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/wechat-minigame-try/minigame-framework.png)

当然，这个 adapter 也不是完美的，它还是有着许多的不足之处。

微信官方对它的定位是一个第三方库，并不属于小游戏的范畴，之后也将不再维护。不过，微信提供现有 adapter 实现的[源码下载](https://mp.weixin.qq.com/debug/wxagame/dev/tutorial/weapp-adapter.zip)，之后可以根据各自需要，自行添加功能进行维护。

其次，所有的适配最终是通过微信提供的 API 实现，所以它对浏览器 API 的模拟是不完整的。

另外，图中的游戏引擎之前没有接触过就不多说了，有兴趣的可以关注[官方文档](https://mp.weixin.qq.com/debug/wxagame/dev/tutorial/base/engine.html)。

小游戏的大致架构就介绍完了，闲话不多说，先搞个简单的小游戏操练起来。

### 敲砖块小游戏
很久之前学 canvas 的时候，正好跟着 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Advanced_animations) 做过一个[敲砖块的小游戏](https://github.com/DiscipleD/eliminate-bricks)，正好这次拿来试一试。

#### 代码迁移
原先的代码模块划分没有作好，都写在了一个文件里，但这也方便了这次迁移。

首先，创建一个 `game.js` 文件，在第一行引入 adapter，这很重要。同时，不要忘了创建一个 `game.json` 文件，只需设置一下显示的方向。

然后，将原有的代码从获取 canvas 元素一直到末尾全部复制到 `game.js` 中，保存运行。

No warning! 一次成功。

不过，现在这个游戏还不能动起来，需要将原先的 mouse 事件转换为 touch 事件。

#### 事件转换
首先，将原先的一系列控制游戏开始、暂停的 `click`, `mouseenter` 和 `mouseout` 事件收拢成 `touchstart` 事件。

```javascript
  this.canvas.addEventListener('touchstart', function () {
    if (!$this.game.start) {
      $this.game.start = true;
      $this.ref = window.requestAnimationFrame(function () { $this.draw($this); });
    } else {
      $this.game.start = false;
      window.cancelAnimationFrame($this.ref);
    }
  });
```

接着是控制挡板左右移动的事件，原先是通过鼠标的移动来控制的，在移动端自然没有了鼠标，原本打算还是用 touch 事件来控制。在翻阅了小游戏的 API 之后，我发现了一个更好的选择——重力控制。

```javascript
  wx.onAccelerometerChange(function (e) {
    if ($this.game.start && !$this.game.over) {
      $this.ct.clearRect(0, $this.canvas.height - $this.board.height, $this.canvas.width, $this.canvas.height);
      var distance = e.x * $this.canvas.width;
      $this.board.x = $this.getBoardX($this.canvas.width / 2 + distance, $this.board);
      $this.board.draw();
    }
  });
```

现在就可以通过左右倾斜手机来控制挡板的移动了，是不是更有趣了？

从 `wx.onAccelerometerChange` 方法就可以看到，微信还提供了许多浏览器以外的功能，这里就不一一举例了，有兴趣的同学可以查阅下[文档](https://mp.weixin.qq.com/debug/wxagame/dev/document/render/canvas/wx.createCanvas.html)。微信小游戏的初探就到这里，消除砖块的功能就留给大家自己去尝试了。

PS：截止最新，微信小游戏还未正式开放。 

### 写在最后
就如[上一篇文章](https://discipled.me/posts/wechat-miniprogram-basic)中所提到的，微信小游戏相较于原生 APP 的主要优势在于：微信——拥有庞大用户数，强社交，易推广。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/wechat-minigame-try/bold-idea.jpg)

等小游戏正式开放上线...

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/wechat-minigame-try/cool.gif)