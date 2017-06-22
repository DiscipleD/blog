> 系列文章：
> 
> 1. Service Workers 和离线缓存 (本文)
> 2. [Notification with Service Workers push events](https://discipled.me/posts/notification-with-sw-push-events)
> 3. [PWA：添加应用至桌面及分享](https://discipled.me/posts/pwa-installable-and-share)
>

第一次听到 Service Workers 这个词还是在去年 Google 来安利 Angular 2 的时候，那时就觉得很惊艳，想搞一搞，但是因为没把网站升级成 https 一直拖到现在。[不久前](https://discipled.me/posts/docker-compose)，把网站升级成了 https，终于可以搞一发了。

本篇主要包含以下内容：

* [What's Service Workers?](#Whats-service-workers)
* [小试 Service Workers](#try-service-workers)
* [调试 Service Workers](#debug-service-workers)
* [通过 postMessage 与主窗口通信](#postmessage)
* [为应用添加离线缓存](#offline-cache)
* [Service workers 的生命周期与更新](#lifecycle-and-update)

当然，还是先来看看 Service Workers 究竟是什么？

<a name="Whats-service-workers"></a>
## What's Service Workers?
Service Workers 是谷歌 chrome 团队提出并大力推广的一项 web 技术。在 2015 年，它加入到 W3C 标准，进入[草案阶段](https://www.w3.org/TR/service-workers/)。W3C 标准中对 Service Workers 的解释太细致，相对而言，我更喜欢 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) 上的解释，更简练，更易于理解。

> Service workers essentially act as proxy servers that sit between web applications, and the browser and network (when available). They are intended to (amongst other things) enable the creation of effective offline experiences, intercepting network requests and taking appropriate action based on whether the network is available and updated assets reside on the server. They will also allow access to push notifications and background sync APIs. - MDN

简单翻译一下：Service workers 基本上充当应用同服务器之间的**代理服务器**，可以用于拦截请求，也就意味着可以在离线环境下响应请求，从而提供更好的离线体验。同时，它还可以接收服务器推送和后台同步 API。

那么，这项技术的浏览器支持情况是什么样，还是来看一眼 Can I use?

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/service-workers/can-i-use.png)

可以从看到，Chrome 和 Firefox, Opera 都已经支持 Service Workers，底下的备注也写到 Edge 在开发中，Safari 也考虑支持。至于 IE，[船长都跳船了](https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support)。看了 PC 端，再来看看移动端。移动端的支持率并不尽如人意，不过在安卓 4.4 之后，安卓原生浏览器，以及安卓版的 Chrome 都已经开始支持 Service Workers。

说句题外话，突然发现在 Can I use 中选择导入我国数据时，竟出现了 UC 和 QQ 浏览器的支持情况，口以口以👍...

言归正传，在真正开始使用 Service Workers 之前，还有几点要注意：

1. Service Workers 基于 Https，这是硬性条件（如何升级 https 可以参考[上一篇文章](https://discipled.me/posts/docker-compose#Letsencrypt)）
2. 每个 Service Worker 都有自己的作用域，它只会处理自己作用域下的请求，而 Service Worker 的存放位置就是它的最大作用域
3. Service Workder 是 Web Worker 的一种，它不能够直接操作 DOM

Github 上有一个[非常棒的资源](https://github.com/delapuente/service-workers-101)，它用图片的方式展示了 Servic Workers 的一些核心要点。

搞定这些基础就可以正式开搞了...

<a name="try-service-workers"></a>
## 小试 Service Workers
和其他 worker 一样，service worker 有一个独自的文件。由于之前所提到的 service worker 只能作用在自己存放位置之下的文件，所以，一般在应用根目录下存放 service worker 文件。

首先，先写一个最简单的来看看浏览器是不是支持，以及能否正确地安装并运行 service worker。

```JavaScript
// service-worker.js
const _self = this;

console.log('In service worker.');

_self.addEventListener('install', function () {
	console.log('Install success');
});

_self.addEventListener('activate', function () {
	console.log('Activated');
});
```

虽然，service worker 是 web worker 其中的一种，但它有些不同，它有自己的注册方式。

```JavaScript
// ServiceWorkerService.js
const SERVICE_WORKER_API = 'serviceWorker';
const SERVICE_WORKER_FILE_PATH = 'service-worker.js';

const isSupportServiceWorker = () => SERVICE_WORKER_API in navigator;

if (isSupportServiceWorker()) {
	navigator
		.serviceWorker
		.register(SERVICE_WORKER_FILE_PATH)
		.then(() => console.log('Load service worker Success.'))
		.catch(() => console.error('Load service worker fail'));
} else {
	console.info('Browser not support Service Worker.');
}
```

重启程序之后，你应该就能在控制台中看到 `Load service worker Success.`。然而，却没有另两句的输出，难道加载失败了？但是，控制台不是显示加载成功了么？不要担心，程序没有出错，只是 service worker 中的日志信息有它自己的输出位置，而并非输出在主日志之中。

接下去，先来看看如何调试 service worker。

<a name="debug-service-workers"></a>
## 调试 Service Workers
在 Chrome 中，service worker 的信息显示在 `Application -> Service Workers` 中，就像这样

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/service-workers/chrome-console-application-service-worker.png)

里面会显示注册的 service worker，以及它当前的状态。还能通过切换最上面的选项来模拟不同的网络环境，测试在不同环境下 service worker 的响应，它们分别是：

* Offline: 离线
* Update on reload: 加载时更新
* Bypass for network: 使用网络内容

回到之前的问题，如何查看 service worker 之中的日志哪？只需点击图中的 `inspect` 链接，它会弹出另一个开发者窗口，在里面可以查看 service worker 的日志。是不是觉得需要那么多步有点麻烦，别担心，Chrome 已经替我们解决了这个烦恼。重新刷新页面后，Chrome 的开发者工具中已经能够查看 service workers 的信息了，比如：在 console 选项卡勾选 `Show all messages` 就能显示 service workers 中控制台的信息；在 source 选项卡也能看到 service workers 的代码，当然也可以打断点啦~

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/service-workers/chrome-console-show-all-messages.png)

在 firefox 中，默认会将 service worker 中的日志输出到主控制台中，但要打开 service worker 的调试器就有点麻烦了。有两种方法查看，一个是在地址栏中输入 `about:debugging#workers`，另一种就是通过菜单栏中选择 `Tools -> Web Developer -> Service Workers`。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/service-workers/firefox-debugging-service-workers.png)

更多关于在 firefox 中调试 service workers 的信息可以[点此查看](https://hacks.mozilla.org/2016/03/debugging-service-workers-and-push-with-firefox-devtools/)。

虽然，已经将日志输出到主控制台了，可这里就有个疑问了，主页能不能获取 service workers 中的信息哪？答案是肯定的，那就是通过 `postMessage`。

<a name="postmessage"></a>
## 通过 postMessage 与主窗口通信
和 web worker 一样，service worker 与主窗口通讯也需要通过 `postMessage`，但它的语法又有些许不同。

首先，是主页面给 service worker 发消息。

```JavaScript
// ServiceWorkerService.js
const sendMessageToSW = msg => navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage(msg);

if (isSupportServiceWorker()) {
	const sw = navigator.serviceWorker;

	sw.register(SERVICE_WORKER_FILE_PATH)
		.then(() => console.log('Load service worker Success.'))
		.catch(() => console.error('Load service worker fail'))
		.then(() => sendMessageToSW('Hello, service worker.'))
		.catch(() => console.error('Send message error.'));
} else {
	console.info('Browser not support Service Worker.');
}
```

可以看到，`postMessage` 方法并不在 worker 实例下，而是在 serviceWorker 下的 controller 对象下。这里需要注意一下，当 service worker 还没有注册成功时，`navigator.serviceWorker.controller` 对象的值是 `null`，所以，在调用 `postMessage` 之前需要确保 `controller` 对象已经存在。在 service worker 这边就没有什么区别了

```JavaScript
// service-worker.js
_self.addEventListener('message', function(event) {
	console.log(event.data);
});
```

是不是很简单？不过，反过来 service worker 给主页面发消息就要复杂一点了。在 service worker 里发送信息需要通过 [`Client`](https://developer.mozilla.org/en-US/docs/Web/API/Client) 对象的 `postMessage` 方法。获取 `Client` 的方法有很多，比如，刚从主页面发来的消息，事件的来源就是一个 `Client` 对象，即 `event.source`。不过，这只能向来源发消息，但如果你开了几个网页，或者不是通过主页消息发来的该怎么办哪？方法还是有的，在 service workers 中可以通过 `clients` 来获取所有的页面对象或其他的 service workers。

```JavaScript
// service-worker.js
_self.clients.matchAll().then(function(clients) {
	clients.forEach(function(client) {
		client.postMessage('Service worker attached.');
	})
});
```

不过，如果你发出一个消息需要等到另一方的返回的消息做处理，上述的办法就做不到了。这时就需要建立一个通道来处理了，修改一下之前的 `sendMessageToSW` 方法。

```JavaScript
// ServiceWorkerService.js
const sendMessageToSW = msg => new Promise((resolve, reject) => {
	const messageChannel = new MessageChannel();
	messageChannel.port1.onmessage = event => {
		if (event.data.error) {
			reject(event.data.error);
		} else {
			resolve(event.data);
		}
	};

	navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage(msg, [messageChannel.port2]);
});
```

这样信息发送出去后会返回一个 `promise`，然后就可以优雅地链式调用了。

```JavaScript
// ServiceWorkerService.js
if (isSupportServiceWorker()) {
	const sw = navigator.serviceWorker;

	sw.register(SERVICE_WORKER_FILE_PATH)
		.then(() => console.log('Load service worker Success.'))
		.catch(() => console.error('Load service worker fail'))
		.then(() => sendMessageToSW('Hello, service worker.'))
		.then(console.log)
		.catch(() => console.error('Send message error.'));
} else {
	console.info('Browser not support Service Worker.');
}
```

了解了如何在浏览器中调试  service workers 和与主页面通信这些基础之后，就可以搞一些正真功能性的东西，比如创造 service workers 最初的动机——提供更好的离线体验。

<a name="offline-cache"></a>
## 为应用添加离线缓存
为应用添加缓存的方式有很多，但能够提供**离线**缓存的，据我所知，那就只有 service workers 一家了。这就好比已经安装了的应用，无论是否有网络连接都可以随时打开使用（google 所推的 PWA 最终目的就是这个）。你可能会怀疑，听起来这么高大上实现起来会不会很复杂？然而并没有，使用 service workers 为应用添加离线缓存还是相当简单的。

就如同文章开头 MDN 中所提到的，service workers 可以充当应用与服务器之前的代理服务器，它通过监听 `fetch` 事件来捕捉自己作用域下发出的网络请求，并通过 `event.respondWith` 来返回请求结果，过程中可以对返回结果做任何的修改（所以必须 https 啊）。

```JavaScript
// service-worker.js
const handleFetchRequest = function(request) {
	return fetch(request);
};

const onFetch = function(event) {
	event.respondWith(handleFetchRequest(event.request));
};

_self.addEventListener('fetch', onFetch);
```

上面这段代码就是捕获请求最基本的方式，然后直接将请求发送出去，并将请求的结果返回，没有做其他额外的操作。如果，你这时观察控制台的网络请求，会发现所有请求的 `size` 都不再是原先的文件大小或来自缓存，而是 `from ServiceWorker`。

接下去，就来给应用添加离线缓存。既然，所有的请求都是手动发出的，而且能够拿到返回的结果，那么，缓存这些结果就变得轻而易举了。

不过，这里要先讲另一个知识点——[`Cache Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Cache)。它作为 service worker 的一部分写在[草案中](https://www.w3.org/TR/service-workers/#cache-objects)。通过它，我们可以方便地把请求，以及请求结果一同缓存起来。了解了 `Cache Storage`，那就把上面的代码改一下，让它能够缓存请求。

```JavaScript
// service-worker.js
const handleFetchRequest = function(request) {
	return caches.match(request)
		.then(function(response) {
			return response || fetch(request)
					.then(function(response) {
						const clonedResponse = response.clone();

						caches.open(CACHE_NAME)
							.then(function(cache) {
								cache.put(request, clonedResponse);
							});

						return response;
					});
		});
};
```

这里主要修改了如何处理请求的方法，先判断这个请求是否已经被缓存过了，缓存过了就直接返回结果，没有的话就去请求，并把结果添加到缓存中，以便下次请求来时可以直接返回。

离线缓存就这样添加好了，来看看效果怎么样。这就要用到之前调试时所提到的模拟不同环境，不记得的童鞋可以往上翻一翻。（提示关键词：控制台, `Application`, `Service Workers`, `Offline`）这里模拟离线环境，设置好后再刷新页面。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/service-workers/offline-page-view.png)

Awesome~😁

虽然已实现了离线缓存，但是，使用 `Cache Storage` 还需要注意以下几点：

1. 它只能缓存 `GET` 请求；
2. 每个站点只能缓存属于自己域下的请求，同时也能缓存跨域的请求，比如 CDN，不过无法对跨域请求的请求头和内容进行修改
3. 缓存的更新需要自行实现；
4. 缓存不会过期，除非将缓存删除，而浏览器对每个网站 `Cache Storage` 的大小有硬性的限制，所以需要清理不必要的缓存。

上面的代码并没有做缓存的清除和更新，所以，还要更新一下。同时，通过给跨域请求添加 `{mode: 'cors'}` 属性来使请求支持跨域，从而拿到响应头信息。

```JavaScript
const HOST_NAME = location.host;
const VERSION_NAME = 'CACHE-v1';
const CACHE_NAME = HOST_NAME + '-' + VERSION_NAME;
const CACHE_HOST = [HOST_NAME, 'cdn.bootcss.com'];

const isNeedCache = function(url) {
	return CACHE_HOST.some(function(host) {
		return url.search(host) !== -1;
	});
};

const isCORSRequest = function(url, host) {
	return url.search(host) === -1;
};

const isValidResponse = function(response) {
	return response && response.status >= 200 && response.status < 400;
};

const handleFetchRequest = function(req) {
	if (isNeedCache(req.url)) {
		const request = isCORSRequest(req.url, HOST_NAME) ? new Request(req.url, {mode: 'cors'}) : req;
		return caches.match(request)
			.then(function(response) {
				// Cache hit - return response directly
				if (response) {
					// Update Cache for next time enter
					fetch(request)
						.then(function(response) {

							// Check a valid response
							if(isValidResponse(response)) {
								caches
									.open(CACHE_NAME)
									.then(function (cache) {
										cache.put(request, response);
									});
							} else {
								sentMessage('Update cache ' + request.url + ' fail: ' + response.message);
							}
						})
						.catch(function(err) {
							sentMessage('Update cache ' + request.url + ' fail: ' + err.message);
						});
					return response;
				}

				// Return fetch response
				return fetch(request)
					.then(function(response) {
						// Check if we received an unvalid response
						if(!isValidResponse(response)) {
							return response;
						}

						const clonedResponse = response.clone();

						caches
							.open(CACHE_NAME)
							.then(function(cache) {
								cache.put(request, clonedResponse);
							});

						return response;
					});
			});
	} else {
		return fetch(req);
	}
};
```

升级之后，还是有缓存先拿缓存，这样比较快，但依旧会在后台发出请求，如果返回合法的请求，就更新 cache 中的值，那么，下次访问时就是这次访问返回的结果了。

service worker 的 `install` 和 `activite` 事件对象都包含一个 `waitUntil` 方法，方法接受一个 promise，当 promise 被 `resolve` 后才会继续执行到下一个状态。如果，想要强制更新缓存，就可以通过这个方法在 service worker 激活时除旧版本缓存。

```JavaScript
// service-worker.js
const onActive = function(event) {
	event.waitUntil(
		caches
			.keys()
			.then(function(cacheNames) {
				return Promise.all(
					cacheNames.map(function(cacheName) {
						// Remove expired cache response
						if (CACHE_NAME.indexOf(cacheName) === -1) {
							return caches.delete(cacheName);
						}
					})
				);
			})
	);
};

_self.addEventListener('activate', onActive);
```
这样请求的缓存就能随时更新了，不过，你可能会和我有同样的疑问——那 service workers 怎么更新呢？

<a name="lifecycle-and-update"></a>
## Service workers 的生命周期与更新
事实上，service workers 的更新并不需要我们操心，只要 service workers 文件有任何一点的修改，浏览器就会立即装载它。然而，它还是有需要注意的地方，不然也就不值一提了。

虽然，浏览器立即装载它，但它并没有立即生效，这和它的生命周期有关。下面这张图来自 [Service Workers 101](https://github.com/delapuente/service-workers-101)，非常形象地展示了 service workers 的生命周期。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/service-workers/sw-lifecycle.png)

先看图的右边，它展示了 service workers 的 3 种状态：`Installing`, `Waiting` 和 `Active`；左边是 service workers 的生命周期，两者结合在一起，直观地展现了在 service workers 不同的生命周期时，service workers 所处的状态。可以看到，`install` 与 `activate` 2 个时间中间，service workers 是处于 `Waiting` 的状态。

回到刚才提到的 service workers 更新，浏览器虽然会立即装载最新的 service workers，但只是让它 `install`，并进入 `Waiting` 的状态，而并没有立即 `activate`。只有当用户将浏览器关闭后，重新打开页面时，旧的 service workers 才会被新的 service workers 替换。不过，图中也有提到，可以在 `install` 事件中 `self.skipWaiting` 方法来跳过等待，直接进入 `activate` 状态。同样的，可以在 `activate` 事件中调用 `self.clients.claim` 方法来更新所有客户端上的 service works。

为 service workers 添加上述两个方法就能较好地处理更新问题。代码改动很小，这里就不再重复贴了，所有的代码都已上传 [Github](https://github.com/DiscipleD/blog)。

下次准备捣鼓 service workers 相关的服务器推送，敬请关注...😏