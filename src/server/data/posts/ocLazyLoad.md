> “又到了月底，不得不逼自己写一篇 blog 了，不然底线一旦破了，以后就没有底线了...”

随着公司规模不断地扩大，公司的产品线也可能会随之增加，如果使用的是 AngularJS 的体系，那么产品线之间的整合势必就会遇到这样一个问题——模块加载的问题。

#### 这是个怎样的问题？
公司的产品原先通过 iframe 的形式整合在一起，iframe 的各种弊端就不再这里重复，所以公司准备做一次大的产品升级，移除所有的 iframe，将产品组合成一个单页应用来增强用户体验。

那么假设，我们将所有产品已整合成一个单页应用，显而易见，这个单页应用需要有个主路由来管理各个产品模块之间的切换，而这时问题就出现了。各个模块的代码如何引入，如果简单粗暴地在首页将各个模块的代码全部引入，那么首页就会加载很多无用的代码，从而造成首屏加载时间过长，首页加载时间超长我想没有一个用户能忍的吧，直接 GG 了。

那么，可不可以做到，首页只引入首屏需要显示的必要代码，而在必要的时候再去加载各个模块的代码，做到**按需懒加载**哪？

答案是，肯定的。

那是不是直接简单地在路由切换的 templateUrl 中，注入各自的模块代码就行了哪？

```JavaScript
// index.html
// 引入啥的就不写了
<body ng-app="mainApp">
  <nav>
    <ul>
      <li ui-sref="appA">app A</li>
      <li ui-sref="appB">app B</li>
    </ul>
  </nav>
  <ui-view></ui-view>
<script>
angular.module('mainApp', ['ui.router'])
  .config(function($stateProvider) {
    $stateProvider
      .state('appA', {url: '/appA', templateUrl: './pageA.html', controller: 'appActrl'})
      .state('appB', {url: '/appB', template: '<div>appB</div>'});
});
</script>
</body>

// pageA.html
<section>{{text}}</section>

<script src="./appA.js"></script>

// appA.js
angular.module('mainApp')
.controller('appActrl', ['$scope', function($scope){
  $scope.text='App A';
}]);
```
可惜没这么简单，你会发现当你点击路由 app A 的时候，页面没有正常显示 App A, 而是报了一个错误 appActrl 无法找到，因为 angular 体系下，单单加载 js 文件是没有作用的，必须将代码模块注入到主模块之中，模块代码才会被找到。

#### 那该如何做？
而这时，老司机祭出了关键法宝 [ocLazyLoad](https://oclazyload.readme.io/)。（我们年轻人还是太年轻了...）

ocLazyLoad 可以为你 load angular module，这个 module 可以是新建的，也可以是现有的 module。根据[官网上的例子](https://oclazyload.readme.io/docs/with-your-router)，对之前的代码稍作修改就能实现按需懒加载了。

```JavaScript
// index.html
// 以上不变省略...
angular.module('mainApp', ['ui.router', "oc.lazyLoad"])
  .config(function($stateProvider) {
    $stateProvider
      .state('appA', {
        url: '/appA',
        controller: 'appActrl',
        templateUrl: 'pageA.html',
        resolve: {
          loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load('./appA.js'); // 按需加载目标 js file
          }]
        }
      })
// 以下也不变...

// pageA.html
<section>{{text}}</section>

// appA.js
angular.module('appA', []) // 此处也可以是原 module angular.module('mainApp')
  .controller('appActrl', ['$scope', function($scope){
    $scope.text='App A';
  }]);
```

OK，大功告成([在线例子可以看这里](http://plnkr.co/edit/Y6bCd5?p=info))，打开控制台，你可以看到，只有当点击了 app A，appA.js 的请求才会被发出。

#### 写在最后
Angular 按需懒加载就完成了，剩下的就是分模块开发了，但每次在主路由里还要关心如何加载子路由的文件，还存在着模块之间的耦合，这对模块的独立性来说，还是有点丑陋。

最后再吹一波[老司机](https://github.com/kuitos)，老司机造了个轮子 [ui-router-require-polyfill](https://github.com/kuitos/angular-utils/blob/1.3.1/polyfills/ui-router-require-polyfill.js)，这个轮子用来在 router 切换的时候去拿 template 中的 script 标签去做 lazy load，那么在 roter 定义中就不用加以上 resolve 中的代码了，减小了耦合，相当好用。

[Angular 1.5 & ocLazyLoad](https://github.com/ocombe/ocLazyLoad/issues/138)，原本 Angular 1.5 有可能会提供 lazy load 的功能，最终还是被无情的丢弃了。