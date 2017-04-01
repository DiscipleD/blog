> 系列文章：
> 
> 1. [Service Workers 和离线缓存](https://discipled.me/posts/service-workers)
> 2. Notification with Service Workers push events (本文)
> 3. [PWA：添加应用至桌面及分享](https://discipled.me/posts/pwa-installable-and-share)
>

## Notification
HTML5 Notification 已经推出挺久了，它可以用来给用户发送通知提示。

一直想试一试给自己的博客用上这个功能。[上一篇](https://discipled.me/posts/docker-compose#Letsencrypt)成功升级 https 之后，终于可以来捣鼓一下了。捣鼓之前，还是先来看一下浏览器支持情况。

### Notification 浏览器支持情况
![Can I use Notification](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/notification-with-sw-push-events/can-i-use-notification.png)

从上图中可以看到，除了我行我素的 IE 之外，其他桌面浏览器都已经支持 Notification；与之相反，移动端一片血红，几乎全军覆没。自己玩就不用在意这些了，而且 Notification 已加入标准，移动端浏览器最终也会响应号召的🙃。

So, JUST DO IT.

虽然，桌面浏览器已经基本支持 Notification，但 Notification 之中还有很多配置项。之前，有看到过大神写的一篇关于 [Notification 的文章](http://www.zhangxinxu.com/wordpress/2016/07/know-html5-web-notification/)，上面列举了 Notification 的属性，比如，`sound`, `vibrate`, `image` 等。于是，上 MDN 看了下它们的支持情况，

![Notification API support](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/notification-with-sw-push-events/notification-api-support.png)

同样也是一大片血红，普遍也就只支持最基础的功能。

### 小试牛刀
想要尝试 Notification 非常方便，打开浏览器的 console 就可以了。

首先，申请推送的权限，在 console 中输入

```JavaScript
Notification.requestPermission();
```
就可以看到浏览器左上角弹出提示问你是否允许推送。

权限有 3 种状态：`granted`（同意）, `denied`（拒绝）和 `default`，默认是 `default`。默认权限浏览器行为和拒绝相同，不会发起推送，只有在获得用户同意后，浏览器才会发起推送。

`requestPermission` 会返回一个 Promise，当用户选择后，会将用户所做的决定（即`granted`, `denied`, `default`）作为参数传递给 `then` 方法。

获得了用户同意的授权之后，就可以发起推送了。发起推送也很简单，只需创建一个 Notification 对象。

```JavaScirpt
// new Notification(title[, options]);
new Notification('Hello world.');
```

通常情况下，这时你就能看到屏幕右上角会弹出个小框。不过总会遇到一些特例：mac 下 chrome 满屏状态下 Notification 不会实时弹出，只有切换到桌面状态下才可能弹出。然而，它就像个磨人的小妖精，你不知道它会在什么时候弹出，可能是下一秒，可能是一个小时以后，也可能是明天...（firefox 和 safiri 满屏下没有这个问题）

其他具体的一些 API 就不细讲了，有兴趣的可以看 [MDN 的文档](https://developer.mozilla.org/en-US/docs/Web/API/notification)，或者之前提到的那篇文章。

试过了最基本的 Hello world，那么，再进一步试着搞到项目中看看。

当今，人们都睡得比较晚，有的是工作原因，有的是因为有[晚睡强迫症](https://www.zhihu.com/question/19761485)，也有时是专注于什么一下子忘了时间。

这时就可以用 Notification 来做个提示，提醒自己早点休息。

```JavaScript
const NOTIFICATION_API = 'Notification';
const PERMISSION_GRANTED = 'granted';
const NOTIFICATION_START_TIME = 23;
const NOTIFICATION_END_TIME = 6;
const DELAY_MINUTES = 5;
const NOTIFICATION = {
	title: '夜深了',
	delay: DELAY_MINUTES * 60 * 1000, // 5 minutes
	options: {
		body: '亲，工作之余，也要注意身体噢...',
		icon: '/favicon.ico'
	}
};

const isSupportNotification = () => NOTIFICATION_API in window;
const getPermission = () => Notification.permission;
const isPermissionGranted = permission => permission === PERMISSION_GRANTED;

const registerNotification = () => {
	const now = new Date();
	const nowHour = now.getHours();
	// Time in the notification time block
	if (nowHour <= NOTIFICATION_END_TIME || nowHour >= NOTIFICATION_START_TIME) {
		// Show notification 5 minutes later
		setTimeout(() => new Notification(NOTIFICATION.title, NOTIFICATION.options), NOTIFICATION.delay);
	} else {
		// Show notification at 11 o'clock.
		const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), NOTIFICATION_START_TIME, DELAY_MINUTES);
		setTimeout(() => new Notification(NOTIFICATION.title, NOTIFICATION.options), start.valueOf() - now.valueOf());
	}
};

if (isSupportNotification()) {
	if (isPermissionGranted(getPermission())) {
		registerNotification();
	} else {
		Notification
			.requestPermission()
			.then(isPermissionGranted)
			.then(granted => granted && registerNotification());
	}
} else {
	console.info('Browser not support Notification.');
}
```

有兴趣的话，你还可以多捣鼓几个。但是，这些提示说起来都是程序写死的，当页面加载之后就决定了它显示的时间，而不是动态产生的。如果，想要发送动态提示，这就需要客户端与服务器端的配合，还是先来看客户端。

## 通过 service workers push events 来接收消息
[上一篇中](https://discipled.me/posts/service-workers)已经成功地在客户端注册了 service workers，通过它来获取服务端发送的消息就很简单了。

监听 Service workers 中的 `push` 事件，就能获取来自推送服务器的消息，再通过 `registration.showNotification` 方法就能发出 Notification 了。

```JavaScript
// service-worker.js
// ...
const onPush = function(event) {
	event.waitUntil(_self.registration.showNotification('New Post Arrival', {
		icon: '/logo.png'
	}));
};

_self.addEventListener('push', onPush);
```

现在就可以打开 firefox 试一试了，打开 service workers 调试页，点击推送就可以预览效果了。（为什么不用 chrome？这个问题后面会说...）

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/notification-with-sw-push-events/first-attempt-in-firefox.png)

是不是以为这样就完成了？那就错了，这才刚刚完成了一半，服务器怎么知道是给你发推送，而不是隔壁老王？

### 客户端订阅
这就需要客户端将自己与其他客户端区分的信息告诉服务器，而这个信息就是订阅信息，在 service workers 注册时可以拿到。我们再修改一下之前的代码...

```JavaScript
// ServiceWorkerService.js
// ...
sw.register(SERVICE_WORKER_FILE_PATH)
		.catch(() => console.error('Load service worker fail'))
		.then(registration =>
			registration
				.pushManager
				.getSubscription()
				.then(subscription => subscription || registration.pushManager.subscribe({ userVisibleOnly: true })))
		.then(subscription => {
			const endpoint = subscription.endpoint;

			const options = {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ endpoint })
			};

			return httpFetch(SUBSCRIBE_API, options);
		})
		.catch(error => console.error('Subscribe Failure: ', error.message))
		.then(() => sendMessageToSW('Hello, service worker.'))
		.catch(() => console.error('Send message error.'));
```

在注册 service worker 时，先通过 `pushManager.getSubscription` 方法获取当前客户端是否已经订阅过了，没有订阅则通过 `pushManager.subsribe` 方法来获取一个订阅；接着就将订阅信息发送给后端，交由后端储存起来，服务端的接口这里就不贴了，有兴趣的看 Github 上的[代码](https://github.com/DiscipleD/blog/blob/master/src/server/publish/index.js#L60)吧。

> 订阅信息是最重要的资料，需要妥善保存，一旦泄露别人就能轻易冒充你了。

订阅信息会过期，所以不要忘了在 servier worker 中监听 `pushsubscriptionchange` 事件，当订阅过期后自动重新订阅。

拿到了订阅信息，接着就可以来推送消息了。不过得先说明一点，这里所说的服务器推送与 http2 的 server push 没有任何关系（虽然，之前我一直是这么认为的...彡(-_-;)彡）。

#### 打个岔
说到 http2，就顺便说一个 nginx 升级 http2 时遇到的问题。ubuntu 14.04 下需要将 [OpenSSL 升级至 1.0.2](http://www.miguelvallejo.com/updating-to-openssl-1-0-2g-on-ubuntu-server-12-04-14-04-lts-to-stop-cve-2016-0800-drown-attack/)，nginx 才能开启 http2。

> Note that accepting HTTP/2 connections over TLS requires the “Application-Layer Protocol Negotiation” (ALPN) TLS extension support, which is available only since OpenSSL version 1.0.2. Using the “Next Protocol Negotiation” (NPN) TLS extension for this purpose (available since OpenSSL version 1.0.1) is not guaranteed.

但如果，和我一样使用 nginx docker 镜像的话，使用 `alpine` 版本就能开启 http2，而不必操心上面所提的了。

### 服务器推送
言归正传，这里的服务器推送是基于发布/订阅模式构成的一套体系，通过客户端的订阅行为向服务器注册，当服务器广播消息时，将消息传递给推送服务，再由推送服务器给客户端推送消息。

你可能会像我一样纳闷，推送服务是什么鬼？自己的服务器支持 http2，可以 server push 那是不是可以直接推送消息，而不通过推送服务哪？答案是，No way。这里的推送服务（Push Service）指的是 google 的 [fcm](https://firebase.google.com/docs/cloud-messaging/) (以前叫 [gcm](https://developers.google.com/cloud-messaging/?hl=zh-Cn))，或者 apple 的 APNs（苹果现在还不支持 webpush）等。这点可以从上面 firefox 截图中的推送服务后的字符串看出端倪 *https://updates.push.services.mozilla.com/wpush/...*，同时，它也是客户端提交给服务器的订阅信息。

知道了这些就能理解规范上的 webpush 架构了。

![Webpush Architecture](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/notification-with-sw-push-events/webpush-architecture.png)

要发送通知时，服务器端取出之前客户端上传的订阅信息，即刚提到的 url 地址，往这个地址发一个 post 请求就可以了，剩下的事推送服务会替你完成。

```JavaScript
// publish.js
// ...
	.post('/broadcast', async ctx => {
		await readEndpoints()
			.then(endpoints => {
				ctx.status = 200;
				ctx.body = {};

				endpoints.forEach(endpoint => {
					webPush.sendNotification({ endpoint })
						.catch(console.error);
				});
			})
			.catch(err => {
				ctx.status = 500;
				ctx.body = err;
			});
	});
```

### web-push & payload
给客户端发送推送内容时，需要对推送内容进行加密，这里使用了 [web-push](https://github.com/web-push-libs/web-push) 这个库来帮加密内容，并将消息传递给推送服务器。实现了推送服务后，就不用再通过控制台去模拟推送服务了。

上面是最基础的用法，如果要带上 message，就需要在客户端注册时向后端传递 `p256dh` 和 `auth`。服务器发送消息时，通过这两个值来给 message 加密，当然加密的过程都交给 `web-push` 来做。通过 Postman 发个消息👀

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/notification-with-sw-push-events/firefox-server-push-notification.png)

同之前测试一样，在系统右上角弹出了提示，通常通知都可以被点击，这点 web notification 也可以做到...

### 响应点击事件
在 service workers 中可以监听 notification 的 click 事件，再通过 clients 操作，就能达到一些诸如打开一个新页面等类似的效果。

```JavaScript
// service-worker.js
// ...
const onNotificationClick = function(event) {
	event.notification.close();

	event.waitUntil(clients.openWindow(event.notification.data));
};

_self.addEventListener('notificationclick', onNotificationClick);
```
现在点击推送，就会打开我的网站啦~😁

可惜的是，当浏览器关闭时，推送就接收不到了。

搞完了 firefox，但也不能忘了老朋友 chrome，之前有提到现在这套代码在 chrome 下无法成功订阅，如果想要 chrome 支持，那么还得用上古哥服务。

### 配置古哥服务
> 重要提示：使用 google 服务需要科学上网...

想要 chrome 下 service workers 能够发出 Notification 并不复杂，只需以下几步：

1. 由于，GCM 已经被 FCM(Firebase Cloud Messaging) 替代，所以，先要先开通 [firebase](https://console.firebase.google.com)
2. 创建一个项目
3. 查看 setting（⚙）中的 cloud messaging 信息(`Server key` 和 `Sender ID`)
4. 客户端根目录下添加 manifest.json，并设置 `gcm_sender_id` 和 `applicationServerKey`，分别对应项目的`Sender ID` 和 `Server key`
6. 服务器端，在使用 web-push 调用 `sendNotification` API 时添加 `gcmAPIKey`（填 `Server key`）

通过这几步，chrome 就和 firefox 一样可以接受通知消息了。因为，项目之前没有使用 Firebase，所以，个人没有直接使用它所提供的 API 来发送通知。如果，你的项目中已经用到了 Firebase，那么，你可以根据[手册](https://firebase.google.com/docs/cloud-messaging/js/client)直接使用 firebase 封装后的 API 来接收消息，那样可能会更简单一点。

配置成功之后，就可以试试 Notification 在移动端 chrome 下的效果。

![notification on mobile](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/notification-with-sw-push-events/notification-on-mobile.jpeg)

服务器发出消息后，notification 就会出现在系统的消息提示栏里，点击通知也会打开新的页面。（和桌面端一样，浏览器彻底关闭后就无法接收到消息了）

是不是很酷~

> 再次提示：使用 google 服务需要科学上网...

![摊手](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/notification-with-sw-push-events/tanshou.jpeg)

（google 翻译摊手竟然是 tanshou...😂）

## 最后
至此，从客户端订阅，到服务器发送推送消息，再到客户端接收推送消息一整套的功能就完成了。尽管，无论是桌面端还是移动端在浏览器关闭的情况下，Service Workers 都无法接收到推送消息，但这个功能还是能够极大得增加用户的粘性，尤其在桌面端（大多情况都会打开着浏览器）。

Tips: 开发时，记得勾选 `Application` -> `Service Workers` 下的 `Update on reload` 和 `Bypass for network`，这样 service worker 的更新会被立即应用。

同时，推荐 mozilla 的 [Service Workers Cookbook](https://serviceworke.rs) 真的很棒!论文档、Demo，M 家优势明显。

如果，你喜欢我的文章，欢迎来[我的博客](http://discipled.me)并开启通知，这样每当有新的文章，你就会第一时间收到通知啦~相信有些小伙伴已经收到了😎

有了 SW 和 Notification 还要啥 R(自)S(行)S(车)...[手动滑稽]

内容如有不妥之处，请指出，谢谢...