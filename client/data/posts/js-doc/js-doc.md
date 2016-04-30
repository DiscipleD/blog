随着 ES2015 的定稿，模块化已经成为前端开发的规范被执行，清晰的模块化使得开发者与开发者之间的依赖便的更小，当项目还小时，可以通过查找一下模块源文件中的声明就能大致了解模块的功用。然而，随着项目的不断增长以及各项目之间的整合，开发者对其他模块的内容知之甚少，如果来源于不同项目，只是项目间的依赖的话，那么源代码有可能也无法在当前开发环境下找到，此时，开发者都会想到有个 API 文档那该多好啊。

所以，**前端代码文档化势在必行**。

前端代码主要以js为主，主流的文档生成器便是 JSDoc，最近项目是使用的 ES2105 编写的，JSDoc3.4.0 之后已经提供了对 ES2015 的支持。

## install JSDoc

```Bash
npm i jsdoc -g
```

## How to use JSDoc

同其他语言一样，文档生成工具的原理还是通过代码注释去解析并根据一定的 tag 来生成文档。在 JSDoc 文档中明确说明了，只有以 `/**` 为开始的注释才会被 JSDoc 识别，其他的注释格式都会被忽略。

额外，JSDoc 默认还会将项目中的 README.md 文件一同生成到 JSDoc 最后生成的文档文件中，或通过命令 --R/-readme 指定个别文件，将其添加至所生成的文档文件中，但文件格式必须是 Markdown，此时，项目中的 README.md 将被忽略。

### JSDoc命令行参数
JSDoc 命令行几个常用参数有以下几个：
* -c, --configure 指定 configuration file
* -d, --destination 指定输出路径，默认 ./out
* -e, --encoding 设定 encoding，默认utf8
* -p, --private 将 private 注释输出到文档，默认不输出
* -P, --package 指定 package.json file
* -r, --recurse 查询子目录
* -t, --template 指定输出文档 template
* -u, --tutorials 指定教程路径，默认无

### JSDoc配置文件
同许多 js 工具一样，JSDoc 也有配置文件，可以通过设定配置文件来定制 JSDoc。如果没有指定 configuration file，将会使用一下配置。

```JavaScript
{
    "tags": {
        "allowUnknownTags": true, // 允许使用自定义tag
        "dictionaries": ["jsdoc","closure"] // 定义tag集
    },
    "source": {
        "includePattern": ".+\\.js(doc)?$", // 将以.js, .jsdoc结尾的文件作为源文件
        "excludePattern": "(^|\\/|\\\\)_" // 忽略以_开头的文件夹及文件
    },
    "plugins": [],
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false
    }
}
```
以上这个是默认配置，下面解释几个常用配置。

- source：顾名思义是用来指定源文件的，在其之下包含了4个属性，其中两个已经在默认配置中出现过了。
  |- include: [ array of paths to files to generate documentation for ], // 源文件路径数组
  |- exclude: [ array of paths to exclude ], // 排除文件路径数组
  |- includePattern: a regular expression, // 接受一个正则表达式，当文件名匹配这个正则时，执行JSDoc
  |- excludePattern: a regular expression, // 接受一个正则表达式，当文件名匹配这个正则时，JSDoc忽略该文件
  JSDoc以以下的顺序执行这些属性：
  1. 根据include获取目标文件
  2. 根据includePattern筛选由第一步得到的目标文件
  3. 根据excludePattern筛选由第二步得到的文件
  4. 最后根据exclude属性，排除由第三步得到的文件结果集，排除之后的文件便是JSDoc需要执行的源文件。
- tags: 用来指定tag库，tags下面有2个属性，分别是
  |- allowUnknownTags: 用来告诉JSDoc如何处理标签库以外的tag，设为false时，JSDoc不会处理标签库以外的tag，但会记录一个警告，默认为true
  |- dictionaries: 数组格式，指定标签库，标签库越靠前，优先度越高
- opts: 命定行参数可以在此属性下配置，列如：
```JavaScript
  "opts": {
    "template": "templates/default",  // same as -t templates/default
    "encoding": "utf8",               // same as -e utf8
    "destination": "./out/",          // same as -d ./out/
    "recurse": true,                  // same as -r
    "tutorials": "path/to/tutorials", // same as -u path/to/tutorials
}
```
- plugins: 配置额外的插件，如 markdown 插件，与此同时，JSDoc 也可以编写[自定义插件](http://usejsdoc.org/about-plugins.html)做额外的处理。
- templates: 可以用来配置默认 template 的格式，或另外指定自定义的 template

### Tags
上文说了那么多，主要说的都是 JSDoc 如何使用和配置，和平时的编码过程中注释怎么写，要使用哪些标签并没什么联系，现在就来讲讲最重要的 **Tag**。

JSDoc 中将 tag 分为两类，`Block tag` 和 `Inline tag`。

* Block tag: 在 JSDoc 中是最高级别的注释，通常用来提供代码的详细信息。它以 `@` 开头，除了位于注释最后的 `Block tag`，其他 `Block tag` 必须紧跟换行符
* Inline tag: 通常是 `Block tag` 的文字内容或描述，它用一对 `{}` 包裹。

`Block tag` 也就是我们平时最常用的注释标签，在此列举一些常用的 tag

- [@abstact](http://usejsdoc.org/tags-abstract.html): 抽象
- [@access](http://usejsdoc.org/tags-access.html): 也可以直接使用 @private, @protect, @public 来替代
- [@alias](http://usejsdoc.org/tags-alias.html): 别名
- [@augments | @extends](http://usejsdoc.org/tags-augments.html): 继承
- [@author](http://usejsdoc.org/tags-author.html): 作者
- [@borrows](http://usejsdoc.org/tags-borrows.html): 引用，用来引用文档中的另一个记录
- [@callback](http://usejsdoc.org/tags-callback.html): 回调
- [@class | @constructor](http://usejsdoc.org/tags-class.html): 类，ES2015 规范下不用显示添加该 tag，JSDoc 会默认将注释第一段转换为 @class
- [@classdesc](http://usejsdoc.org/tags-classdesc.html): 类描述
- [@const | @constant](http://usejsdoc.org/tags-constant.html): 常量，ES2015 规范下使用 const 定义变量，不用显示添加该 tag
- [@copyright](http://usejsdoc.org/tags-copyright.html): 版权
- [@default | @defaultvalue](http://usejsdoc.org/tags-default.html): 默认值，JSDoc 会自动识别简单类型的值：string, number, boolean and null.
- [@deprecated](http://usejsdoc.org/tags-deprecated.html): 废弃
- [@desc | @description](http://usejsdoc.org/tags-description.html): 描述
- [@emits | @fires](http://usejsdoc.org/tags-fires.html): 发出，函数内部会触发自定义事件，即包含 `@event` tag
- [@enum](http://usejsdoc.org/tags-enum.html): 枚举
- [@event](http://usejsdoc.org/tags-event.html): 事件，自定义事件触发处，父方法应添加 `@fires` tag
- [@example](http://usejsdoc.org/tags-example.html): 举例
- [@exports](http://usejsdoc.org/tags-exports.html): 导出，ES2015 规范下使用 exports 不用显示添加该 tag
- [@external | @host](http://usejsdoc.org/tags-external.html): 外部引用
- [@file | @fileoverview | @overview](http://usejsdoc.org/tags-file.html): 文件
- [@func | @function | @method](http://usejsdoc.org/tags-function.html): 方法
- [@global](http://usejsdoc.org/tags-global.html): 全局变量
- [@license](http://usejsdoc.org/tags-license.html): 许可证
- [@member | @var](http://usejsdoc.org/tags-member.html): 成员变量
- [@mixin](http://usejsdoc.org/tags-mixes.html): 混合
- [@module](http://usejsdoc.org/tags-module.html): 模型
- [@name](http://usejsdoc.org/tags-name.html): 名称，用于抽象方法或匿名函数，变更现有方法的方法名使用 `@alias` tag
- [@namespace](http://usejsdoc.org/tags-namespace.html): 命名空间
- [@override](http://usejsdoc.org/tags-override.html): 重写
- [@param | @arg | @argument](http://usejsdoc.org/tags-param.html): 参数
- [@property | @prop](http://usejsdoc.org/tags-property.html): 属性，多用于静态对象，区别于 `@enum` 标签，`property` 标签可以设定不用类型，而 `@enum` 标签是同一类型的值的集合
- [@readonly](http://usejsdoc.org/tags-readonly.html): 只读
- [@requires](http://usejsdoc.org/tags-requires.html): 依赖
- [@return | @returns](http://usejsdoc.org/tags-returns.html): 返回
- [@see](http://usejsdoc.org/tags-see.html): 参阅，ref
- [@since](http://usejsdoc.org/tags-since.html): 添加版本
- [@summary](http://usejsdoc.org/tags-summary.html): 总结
- [@this](http://usejsdoc.org/tags-this.html): 声明方法中的this指代
- [@throws | @exception](http://usejsdoc.org/tags-throws.html): 异常
- [@type](http://usejsdoc.org/tags-type.html): 类型

`Inline tag`

- {@link} 生成一个链接指向定义的 `namepath` 或者 URL

### Namepaths
`namepath` 在 JSDoc 中起着至关重要的作用，JSDoc namepath 会提供一个唯一的标识给任意一个变量，这使得你在使用 inline tag 时，可以方便的找到任何一个变量，从而提供一个指向该变量的链接。

```JavaScript
MyConstructor                // 父元素
MyConstructor#instanceMember // 成员变量使用#
MyConstructor.staticMember   // 静态变量使用.
MyConstructor~innerMember    // 内部成员使用~
                             // module使用:
```