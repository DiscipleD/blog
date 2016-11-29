做过移动端开发的童鞋相信一定遇到过，页面在自己电脑上模拟各种手机都跑的好好的，但当程序正真在真机上运行时，总会遇到一些问题。

有了问题就得要解决啊，这时你肯定想手机上要是能打开控制台该有多好啊~

办法当然是有滴。

![](//o7nu3cbe9.bkt.clouddn.com/blog/remote-debugging-devices/go-heaven.jpg)

首先，当然是来看看土豪们用的机器 iphone。

### Safari
iOS 系统默认的浏览器是 safari，调试 safari 只需一下简单几步。

1. 打开手机上的 web 检查器  
通过【设置】>【Safari】>【高级】>【Web检查器】打开  
![](//o7nu3cbe9.bkt.clouddn.com/blog/remote-debugging-devices/ios-open-inspect.png)
2. 链接手机到电脑。链接上了以后，手机直接访问网页就可以了。
3. 电脑上打开 safari，点击 【开发】 菜单栏  
![](//o7nu3cbe9.bkt.clouddn.com/blog/remote-debugging-devices/ios-connect.jpg)  
然后就能看到手机上访问的页面内容了  
![](//o7nu3cbe9.bkt.clouddn.com/blog/remote-debugging-devices/ios-inspect-result.png)
注：如果 safari 菜单栏上没有 【开发】，可以通过【偏好设置】>【高级】来设置  
![](//o7nu3cbe9.bkt.clouddn.com/blog/remote-debugging-devices/ios-safari-menu.png)

如果是本地调试的话，有一点要注意。iphone 通过 ip 地址访问会链接不上，需要通过`用户名.local:端口号`的方式访问，我这里就是 david-2.local:8080。

看完 iOS，当然就要看看 Android。

### Chrome
打开 Android 机上的 Chrome 控制台同上面的方法大同小异。

1. 手机进入开发者模式，启用 USB 调试
2. 链接手机到电脑
3. 打开 Chrome，访问网页
4. 电脑上同样打开 Chrome，打开控制台，通过【···】>【More tools】>【Inspect devices】  
![](//o7nu3cbe9.bkt.clouddn.com/blog/remote-debugging-devices/chrome-open-inspect.png)  
5. 选择 Devices，然后 Inspect 就可以了  
![](//o7nu3cbe9.bkt.clouddn.com/blog/remote-debugging-devices/chrome-choose-devices.png)

注意：安卓机访问本地服务器，用 ip 地址就可以了，即 192.168.1.4:8080。

Safari 和 Chrome 都了解完了，是不是就结束了？当然不是，别忘了国内一大浏览渠道微信。

### 微信浏览器
要调试微信浏览器，就需要额外下一个软件——[微信 web 开发者工具](http://mp.weixin.qq.com/wiki/10/e5f772f4521da17fa0d7304f68b97d7e.html)。

安装完成后打开软件，切换到【移动调试】，根据提示操作就可以了。

![](//o7nu3cbe9.bkt.clouddn.com/blog/remote-debugging-devices/wechat-tool.png)

> 如果，控制台中出现 `weixin://preInjectJSBridge/fail` 的错误，可能是使用了不兼容的语法，加入相应 polyfill 可以解决。

如果，你以为到此就结束了，那就图样图森破了。

![](//o7nu3cbe9.bkt.clouddn.com/blog/remote-debugging-devices/naive.jpg)

国内**绝大部分**安卓机用户都用的不是 chrome，用的都是 UC、QQ 或者自带浏览器之类，水太深啊。

### Weinre

刚刚使用微信开发工具的时候，文档上有提到它是基于 weinre 的，那 weinre 是什么，能帮我们解决问题么？

> weinre was built in an age when there were no remote debuggers available for mobile devices.

它几乎支持各种新老浏览器，而且，安装和使用也很方便，具体安装方法在这篇[文章](http://yujiangshui.com/multidevice-frontend-debug/#使用-Weinre-调试)中写得很详细了。

但，再如何方便不还得装么，而且还要修改当前的代码，那能不能有更好的办法？

### BrowserSync
BrowserSync 或许大家都有所了解，不了解的可以看一下我之前介绍它的[文章](http://discipled.daoapp.io/posts/browsersync)。

BrowserSync v2.0.0 之后就默认提供了对 weinre 的支持，当你使用 BrowserSync 启动 server 时，可以访问 browsersync 的系统面板来开启 remote debugger。

控制面板的地址在 server 启动后的控制台上看到，默认为当前 server 端口号 +1，即 server 端口是 3000，那么，browsersync 系统面板的端口就是 3001。

![BrowserSync Remote Debug config](//o7nu3cbe9.bkt.clouddn.com/blog/remote-debugging-devices/browser-sync.png)

这样，既不用修改任何一行代码，又能在任何机器的任何浏览器上使用，是不是很完美？

### 写在最后
最后，当然还是继续安利下自己的 [Blog](http://discipled.daoapp.io/)。

在之前将 vue 升级到 vue 2.0 并加入 vuex 之后，现又加入 graphql-js，并将 vue-router 切换到了 `history` 模式（点击查看[源码](https://github.com/DiscipleD/blog)）。

#### 参考资料
1. [如何在移动设备上调试网页](http://www.codingserf.com/index.php/2014/05/debug-on-devices/)
2. [Remote Debugging Android Devices](https://developers.google.com/web/tools/chrome-devtools/debug/remote-debugging/remote-debugging?hl=en)
3. [微信页面开发遇到preInjectJSBridge错误](https://segmentfault.com/q/1010000004605740)
4. [移动端前端开发调试](http://yujiangshui.com/multidevice-frontend-debug/)
5. [Weinre和Browsersync - 跨设备前端调试](http://andward.github.io/weinre/browsersync/%E5%89%8D%E7%AB%AF/2015/09/17/weinre-and-browsersync.html)