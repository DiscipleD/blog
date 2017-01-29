随着前端技术的飞速发展，前端的工程化构建工具也随着这股浪潮不断更迭，从 grunt 到 gulp，而 ant 已经淹没在了潮流之中。然而，不单单是构建工具变化飞快，连构建工具的插件变化也是日新月异，最近项目使用 gulp 构建的过程中就尝试使用了 **Browsersync** 这个插件来替代 gulp-livereload。

### Why Browsersync？

首先，既然它能替代 gulp-livereload，那么它就能实现 gulp-livereload 的主要功能：实时刷新——当你在 IDE 编辑文件保存时，插件会自动应用你的修改并自动刷新浏览器页面，其中文件不单包括 html, js, css，还包括 sass, less 等类型的文件。

其次，如果 Browsersync 只是单单实现 gulp-livereload 的功能，那它不值一书。它当然还有其他优势，**Browsersync 可以同时在 PC、平板、手机 等设备下进项调试**，这就意味着任何一次改动都会实时地应用到这些设备中，这将大大提升多设备开发的效率。

![官网示例1](https://o7nu3cbe9.bkt.clouddn.com/blog/browsersync/browsersync-in-different-browser.gif)

还不仅如此，它还能**在不同的浏览器不同的设备上同步所有页面上的操作**，这绝对是多浏览器兼容性测试的福音啊！

![官网示例2](https://o7nu3cbe9.bkt.clouddn.com/blog/browsersync/browsersync-in-different-divice.gif)

Amazing？

### How to use Browsersync?

想要实现这些神奇的效果配置起来相当便捷。

1. 安装 Node.js(https://nodejs.org/en/)
2. 项目中添加 Browsersync 依赖（package.json推荐）或安装 Browsersync
3. 在 gulpfile.js 中配置

```JavaScript
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
// 静态服务器
gulp.task('browser-sync',function(){
    browserSync.init({
      server: {
        baseDir:"./"
      }
    });
});
// 代理
gulp.task('browser-sync', function() {
    browserSync.init({
     proxy: "你的域名或IP"
   });
});
// 静态服务器（server)和代理（proxy）模式不能同时使用
```

这样就简单地启动了服务器，而要实现同步刷新就要通过 gulp watch 来调用 Browsersync 的 reload 方法。

```JavaScript
// 打包js
gulp.task('js', function () {
    return gulp.src('app/js/*.js')
      .pipe(browserify())
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
});
// 确保js文件打包完成后，再调用reload方法
gulp.task('js-watch', ['js'], browserSync.reload);
gulp.task('browser-sync',function(){
    browserSync.init({
      server: {
        baseDir:"./"
      }
    });
    // 当js目录下js文件发生变化时调用browserSync.reload
    gulp.watch("app/js/*.js", ['js-watch']);
});
```

应用 js file 需要重新刷新页面，而应用 CSS 样式并不用重新加载页面。从示例图1就可以看到，当我们修改 CSS file 的时候页面及时响应了这些修改而并没有刷新页面，因为 Browsersync 可以通过配置将修改后的 CSS 文件直接注入到浏览器中。

```JavaScript
var sass = require('gulp-sass');
// scss编译后的css将注入到浏览器里实现更新
gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest("app/css"))
      .pipe(browserSync.stream()); // stream method returns a transform stream
});
// 修改上面的browser-sync task
gulp.task('browser-sync',function(){
    browserSync.init({
      server: {
        baseDir:"./"
      }
    });
    // 当js目录下js文件发生变化时调用browserSync.reload
    gulp.watch("app/js/*.js", ['js-watch']);
    // 当scss目录下scss文件发生变化时调用sass task
    gulp.watch("app/scss/*.scss", ['sass']);
});
```
项目中，开发时常前端和后端分离，而当各自接口开发完成后，进行联调测试时，前端会因为跨域问题无法请求到后台的数据，跨域当然可以通过现有的一些解决方案，如 CORS 等，但用 Browsersync 可以通过设置 proxy 的方式，简单的解决跨域问题而不需要修改业务代码。

```JavaScript
// 修改上面的browser-sync task
gulp.task('browser-sync', function () {
    browserSync.init({
      proxy: "http://172.18.2.30", //后端服务器地址
      serveStatic: ['./'] // 本地文件目录，proxy同server不能同时配置，需改用serveStatic代替
    });
    // 当js目录下js文件发生变化时调用browserSync.reload
    gulp.watch("app/js/*.js", ['js-watch']);
    // 当scss目录下scss文件发生变化时调用sass task
    gulp.watch("app/scss/*.scss", ['sass']);
});
```