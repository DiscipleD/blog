### 基本概念
Alias 是 `resolve` 下的一个子属性，用于给引入文件的路径起别名，它主要有两个好处

* 文件引入简单：避免引入文件时，相对路径太长、查找复杂
* 配置归于一处：文件移动时，代码改动量小，无需再计算引入文件位置

这个属性比较常见，[文档](https://webpack.js.org/configuration/resolve/#resolve-alias)也很易懂，就不展开了。

这样引入 js 文件、样式文件、照片等等（有适当的 loader）都没有问题了。在 js 里引入样式文件是没有问题了，但问题还没有完美解决。

## alias in css
通常项目会有一些样式公有变量或规则等等，每个页面的样式文件可能都会引入。

```javascript
<style lang="less">
@import '../../../assets/less/common/index';
// ...
</style>
```

呃，又看到了熟悉的相当路径引用...

有没有办法像 js 那样使用 alias 解决哪？

答案就是 `~`。在 `import` 语句中使用 `~` 作为前缀，webpack 就会根据模块规则查找。

```javascript
<style lang="less">
@import '~@/assets/less/common/index';
// ...
</style>
```

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/webpack-alias-in-css/almost-prefect.png)

注：如果还是打包失败，可能是 `css-loader` 版本过低的问题，更新至最新就行。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/webpack-alias-in-css/do-not-ask.jpg)

同时，也可以在 `css-loader` 中添加样式专属的 alias.

```javascript
// ...
  use: [{
    loader: 'css-loader',
      options: {
        alias: {
          '@variable': path.resolve(__dirname, '../src/assets/less/common/variable'),
        }
      }
// ...
```

这样项目再也见不到一长串的相对路径查找了。

---
[webpack 4 发布了...](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4)（跟不上，溜了溜了...）
