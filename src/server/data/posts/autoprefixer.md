众所周知为兼容所有浏览器，有的 CSS 属性需要对不同的浏览器加上前缀，然而有时添加一条属性，需要添加 3~4 条类似的属性只是为了满足浏览器的兼容，这不仅会增加许多的工作量，还会使得你的思路被打断。

如何解决这个问题？最近写项目时，就发现了一个处理 CSS 前缀问题的神器——**AutoPrefixer**。

![AutoPrefixer](https://o7nu3cbe9.bkt.clouddn.com/blog/autoprefixer/autoprefixer.png)

### What is AutoPrefixer
Autoprefixer 是一个后处理程序，它可以同 Sass，Stylus 或 LESS 等预处理器共通使用。它适用于普通的 CSS，而你无需关心要为哪些浏览器加前缀，只需关注于使用 W3C 最新的规范。

### How to use AutoPrefixer
介绍了这么多，如果用起来很麻烦，那还不如直接手写，而 **AutoPrefixer** 的另一大特点就是使用简便，现在来说说怎么用。

**AutoPrefixer** 可以简单的通过下载 plugin 配置到 `Sublime`，`Brackets` 或 `Atom` 等 IDE 里，而在 `WebStorm` 中无法通过 plugin 直接安装和使用 AutoPrefixer，需要通过 External Tools 或 File Watchers 来实现，在 `WebStorm` 中详细的安装方法可以参考[这篇文章](http://www.css88.com/archives/5670)。

如果单单只能通过 IDE 才能使用这个功能，那它远称不上神器，真正让其拥有神器之名的原因是：它可以很简单、有效地同现有的打包工具（`gulp`, `webpack` 等）一同使用，来完成对项目中所有的 `css` 文件中的属性添加前缀。

下面，我们就分别来看在这两种打包工具下如何使用 **AutoPrefixer**。

* gulp

在 `gulp` 中，可以使用 [AutoPrefixer官网](https://github.com/postcss/autoprefixer) 推荐的 `postcss` + `autoprefixer` 两个插件的组合，也可以通过 `gulp-autoprefixer` 这一个插件。
```JavaScript
// Method 1: postcss + autoprefixer
gulp.task('autoprefixer', function () {
    var postcss = require('gulp-postcss');
    var sourcemaps = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer');

    return gulp.src('./src/*.css')
      .pipe(sourcemaps.init())
      .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./dest'));
});

// Method 2: gulp-autoprefixer
gulp.task('autoprefixer', function () {
    var autoprefixer = require('gulp-autoprefixer');

    return gulp.src('./src/*.css')
      .pipe([ autoprefixer({ browsers: ['last 2 versions'] }) ])
      .pipe(gulp.dest('./dest'));
});
```
* Webpack

而在最近很火的 `webpack` 中使用 **AutoPrefixer** 更是轻而易举、如虎添翼。
使用 `webpack` 可以通过简单的配置将本文开头提到的 sass 这样的预处理器同 `autoprefixer` 这样的后处理程序结合在一起。

```javascript
var autoprefixer = require('autoprefixer');
module.exports = {
    module: {
      loaders: [
        { test: /\.css$/, loader: "style!css!postcss" },
        { test: /\.scss$/, loader: "style!css!postcss!sass" }
      ]
    },
    postcss: [ autoprefixer({ browsers: ['last 2 versions'] })
]}
```

注： 另外 `webpack` 还有一个 `autoprefixer-loader`，但 npm 官网已将其标为【deprecated】，推荐使用上面示例中通过 `postcss-loader` 的方式使用 `autoprefixer`。