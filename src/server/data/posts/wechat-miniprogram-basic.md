2018 年过了不到一个月，时间虽短但有一样新东西在这短短时间里就火了起来。从“跳一跳”，到“坦克大战”，再到“头脑王者”，微信小游戏好像突然将时间拉回到了过去。餐桌上、休息时大家不再是各自刷着微博、段子，而是聚在一起开始一场场紧（ge）张（zhong）刺（zhuang）激（bi）的对战。小游戏充分利用了人们零碎的时间，并将娱乐和社交有效地结合起来。

在小游戏推出之前，本人是看衰小程序的，所以一直没有入坑。然而，小游戏狠狠地打了我的脸，它的出现让我眼前一亮，不单单让我觉得小游戏有着很大的想象空间，更让我觉得微信这个平台有着无限的可能。

当前，微信是将小游戏作为小程序的一个分类，所以暂时先亡羊补牢看看什么是小程序。

### 小程序
要学一样新东西的最好办法自然是看官网教程。

小程序的官网是[微信公众平台](https://mp.weixin.qq.com/)，其他什么乱七八糟的都是外包广告啦~

在官网上可以轻松地找到小程序和小游戏的教程。微信的教程也相当详细，这边就不再赘述了。

如果跟着教程走，其中第二步微信会推荐你安装一个开发者工具，这里要吹一波这个工具。

#### 接近完美的开发者工具
新版的开发者工具和之前仅能够用于调试的代理工具完全不同，可以说是鸟枪换炮。

接着就来看一下这个工具到底惊艳在哪里？

首次打开工具，你会看到一个类似下图的界面，会让你填一些项目的基础信息。其中的 AppID 可以通过注册获得，不过即使没有 AppID 也可以先创建项目进行开发，这里先选体验小程序。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/wechat-miniprogram-basic/wechat-devtool-create.png)

如果，选择一个空文件夹作为项目的目录，那么，在工具的最下方就会出现一个模板项目的选项。勾选它，创建的项目就包含了一个微信的 Demo 项目。这个小功能当然不是这个工具的亮点所在，这里先点确定生成一个 Demo 项目。

登登登等~

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/wechat-miniprogram-basic/wechat-devtool-project.png)

有没有被惊艳到？

工具左上角的 3 个按钮分别控制模拟器、编辑器和调试器区域的显示与否。模拟器和调试器的模样是不是非常熟悉？[滑稽]

这个开发者工具可以说是集成了浏览器和 IDE，以及代理等工具于一身，所有的开发工作几乎可以在这一个工具中完成，再也不用在一个个应用之间来回切换了。

整洁、干净、完美！（要被吸粉了...）

PS: 虽然，可以在设置里修改编辑器的配置，不过和真正的 IDE 比样子还是丑了一点。

开发工具就说到这，更多功能等你自己去探索。看完了酷炫的工具，平复一下心情，继续来看 Demo 项目。

#### WXML, WXSS 和 WXS
在 Demo 项目中，你会看到两种新类型的文件：.wxml 和 .wxss。这也是我之前看（xian）衰（qi）小程序的主要原因，它并没有使用标准的文件类型及语法，而是创立了一套微信自己的标准。

##### WXML
先看一下 wxml 里面究竟有什么名堂？

```wxml
<!--index.wxml-->
<view class="container">
  <view class="userinfo">
    <button wx:if="{{!hasUserInfo && canIUse}}" open-type="getUserInfo" bindgetuserinfo="getUserInfo"> 获取头像昵称 </button>
    <block wx:else>
      <image bindtap="bindViewTap" class="userinfo-avatar" src="{{userInfo.avatarUrl}}" background-size="cover"></image>
      <text class="userinfo-nickname">{{userInfo.nickName}}</text>
    </block>
  </view>
  <view class="usermotto">
    <text class="user-motto">{{motto}}</text>
  </view>
</view>
```

是不是又很熟悉？这不就是多了些默认组件的 vue 嘛。

需要注意的是，`{{}}` 与引号之间不能有空格，否则会解析为字符串。其他语法层面就没有什么难点了，再撸一遍[基础组件文档](https://mp.weixin.qq.com/debug/wxadoc/dev/component/)就差不多了。

##### WXSS
wxss 的变化就更小了，就多提供了一个单位 `rpx`。

`1rpx` 等于屏幕尺寸的 1/750。（UI 出 750 的图就很好做啦...）

剩下就提供了一些简单的选择器，类、Id、元素和前后的伪类，没有其他的学习成本。

最后说一下 wxs（Demo 项目中没有用到）。

##### WXS
什么是 WXS？微信官方是这样说的：

> WXS（WeiXin Script）是小程序的一套脚本语言，结合 WXML，可以构建出页面的结构。
> 
> wxs 与 javascript 是不同的语言，有自己的语法，并不和 javascript 一致。

但是，整个[文档](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxs/)看下来，除了在模块的处理上有些许的不同之外，其他可以说是破产版的 js 吧。既然，它是 js 的子集，那么，都用 js 来写也没什么毛病，暂时也没有看出什么场景必须使用它。

~~感觉整套都是 kpi 的产物哪...~~

小程序其他的配置文件[文档](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/config.html)里已经写得很清晰了。至此，小程序的基础就暂告一段落，下篇将关于小游戏相关内容，敬请期待。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/wechat-miniprogram-basic/end.jpg)
