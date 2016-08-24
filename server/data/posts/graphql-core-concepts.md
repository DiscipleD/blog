> 系列文章：
>
> 1. GraphQL 核心概念(本文)
> 2. [graphql-js 浅尝](http://discipled.daoapp.io/#!/posts/graphql-js-entry)

最近因为工作上新产品的需要，让我有机会了解和尝试 [GraphQL](https://github.com/facebook/graphql)。按照套路，在介绍一项新技术的时候总要回答 3 个问题：What, Why & How。

![tradition](http://o7nu3cbe9.bkt.clouddn.com/blog/graphql-core-concepts/traditional.jpg)

### What is GraphQL?
正如副标题所说，GraphQL 是由 Facebook 创造的用于描述复杂数据模型的一种查询语言。这里查询语言所指的并不是常规意义上的类似 sql 语句的查询语言，而是一种用于前后端数据查询方式的规范。

### Why using GraphQL?
当今客户端和服务端主要的交互方式有 2 种，分别是 REST 和 ad hoc 端点。[GraphQL](http://graphql.org/) 官网指出了它们的不足之处主要在于：当需求或数据发生变化时，它们都需要建立新的接口来适应变化，而不断添加的接口，会造成服务器代码的不断增长，即使通过增加接口版本，也并不能够完全限制服务器代码的增长。（更多不足，前往[官网](http://graphql.org/)查看）

既然，GraphQL 指出了它们的缺点，那么它自然解决了这些问题。

如何解决的哪？那就得说说 GraphQL 的 3 大特性。

* 首先，它是**声明式的**。查询的结果格式由请求方（即客户端）决定而非响应方（即服务器端）决定，也就是说，一个 GraphQL 查询结果的返回是同客户端请求时的结构一样的，不多不少，不增不减。
* 其次，它是**可组合的**。一个 GraphQL 的查询结构是一个有层次的字段集，它可以任意层次地进行嵌套或组合，也就是说它可以通过对字段进行组合、嵌套来满足需求。
* 第三，它是**强类型的**。强类型保证，只有当一个 GraphQL 查询满足所设定的查询类型，那么查询的结果才会被执行。

回到之前的问题，也就是说，当需求或数据发生变化时，客户端可以根据需求来改变查询的结构，只要查询结构满足之前的定义，服务器端代码甚至不需要做任何的修改；即使不满足，也只需修改服务器端的查询结构，而不必额外添加新的接口来满足需求。

### Core Concepts
可能你会问，按套路这节不该是 HOW to use GraphQL，怎么变成了 Core Concepts？

由于，GraphQL 是一种规范，于是，它的实现不限制某种特定语言，每种语言对 GraphQL 都可以有自己的实现，比如相对 JavaScript 就有 [graphql-js](https://github.com/graphql/graphql-js)。既然，实现都不相同，那么，使用的方法也会不同，所以便不在这里细述了。

这篇文章主要分享的是 GraphQL 的核心概念，主要分为：`Type System`, `Query Syntax`, `Validation ` 和 `Introspection ` 四部分。

#### Type System
类型系统是整个 GraphQL 的核心，它用来定义每个查询对象和返回对象的类型，将所有定义的对象组合起来就形成了一整个 GraphQL Schema。

这个概念比较抽象，空说很难理解，还是拿例子来边看边说。个人博客相信大家都很熟悉，这里就尝试用一个简单的博客系统的例子来说明，这会比[官网](http://graphql.org/)星战的例子简单一点。

Let's go!

既然是一个博客，那么，文章肯定少不了，我们首先来建立一个文章的类型。

```
type Post {
	id: String,
	name: String,
	createDate: String,
	title: String,
	subtitle: String,
	content: String
}
```

这样，一个简单的文章类型就定义好了，它是一个自定义的类型，包含了一系列的字段，巧合的是这些字段的类型正好都是 `String`（字符串类型）。

`String` 没有定义过，为什么可以直接使用哪？因为，`String` 是 GraphQL 支持的 scalar type(标量类型)，默认的标量类型还包括 `Int`，`Float`, `Boolean` 和 `ID`。

许多的博客网站都支持给每篇文章打标签，那么我们在来建立一个标签的类型。

```
type Tag {
	id: String,
	name: String,
	label: String,
	createDate: String
}
```

标签类型和文章类型怎么整合到一起哪？

GraphQL 不单单支持简单类型，还支持一些[其他类型](http://graphql.org/docs/api-reference-type-system/#overview)，如 `Object`, `Enum`, `List`, `NotNull` 这些常见的类型，还有 `Interface`, `Union`, `InputObject` 这几个特殊类型。

PS：一直没搞明白 `Interface` 和 `Union` 的区别在哪，它们分别适用于什么场景？谷歌了一下，还真有篇[文章](https://medium.com/the-graphqlhub/graphql-tour-interfaces-and-unions-7dd5be35de0d#.4ywdt7kj4)说它们的区别，不过恕我愚钝，还是没能领悟，还望大神点拨...

再修改一下之前的文章类型，使一个文章可以包含多个标签。

```
type Post {
	id: String,
	name: String,
	createDate: String,
	title: String,
	subtitle: String,
	content: String,
	tags: [Tag]
}
```
通常在博客网站的标签列表中会显示该标签下的一些文章，由于 GraphQL 是以**产品为中心**的，那么在标签类型下也可以有文章类型。于是，标签类就变成了

```
type Tag {
	id: String,
	name: String,
	label: String,
	createDate: String,
	posts: [Post]
}
```
可能你会疑惑，文章类型和标签类型这样相互嵌套会不会造成死循环？我可以负责任的告诉你：不会。你可以尽情地嵌套、组合类型结构来满足你的需求。

最后，根据整个博客网站的需求，组合嵌套刚刚定义的文章类型和标签类型，建立一个根类型作为查询的 schema。

```
type Blog {
	post: Post,		// 查询一篇文章
	posts: [Post],	// 用于博客首页，查询一组文章
	tag: Tag,		// 查询一个标签
	tags: [Tag],	// 用于博客标签页，查询所有标签
}
```

OK，我们的类型和 schema 都定义好了，就可以开始查询了。怎么查哪？那我们来看看 GraphQL 的查询语法。

#### Query Syntax
GraphQL 的查询语法同我们现在所使用的有一大不同是，传输的数据结构并不是 JSON 对象，而是一个字符串，这个字符串描述了客户端希望服务端返回数据的具体结构。

知道了概念，那么一个 GraphQL 的查询到底长什么样哪？继续我们的例子，假设，我们现在要查询一篇文章，那么，GraphQL 的查询语句就可以是这样。

```
query FetchPostQuery {
	post {
		id,
		name,
		createDate,
		title,
		subtitle,
		content,
		tags {
			name,
			label
		}
	}
}
```
它相对应的返回就会是类似这样的一个 JSON 数据。

```
{
	"data": {
		"post": {
			"id": "3",
			"name": "graphql-core-concepts",
			"createDate": "2016-08-01",
			"title": "GraphQL 核心概念",
			"subtitle": "A query language created by Facebook for decribing data requirements on complex application data models",
			"content": "省略...",
			"tags": [{
				"name": "graphql",
				"label": "GraphQL"
			}]
		}
	}
}
```
从中我们可以看到，数据返回了整个文章的属性以及部分的标签属性。其中，标签属性并没有返回全部的字段，而是只返回了 name 和 label 字段的属性，做到了返回数据的结构完成同请求数据的结构相同，没有冗余的数据。

查询添加参数的需求也非常基本，在 GraphQL 的查询语法中也相当简单，就拿刚刚的例子，要查询特定的文章就可以把它改成这样。

```
query FetchPostQuery {
	post(name: 'graphql-core-concepts') {
		id,
		name,
		createDate,
		title,
		subtitle,
		content,
		tags {
			name,
			label
		}
	}
}
```
返回的结果会是和之前的一样。查询关键字只有在多个查询时才必须，在单个查询时可以省略。同时，也可以对查询的返回起别名，再来看看博客的首页希望展示一个粗略的文章列表，那么这样的一个查询语句可以是

```
{
	postList: posts {
		id,
		name,
		createDate,
		title,
		subtitle,
		tags {
			name,
			label
		}
	}
}
```
这里，我们省略了查询关键字，并将 `posts` 起了一个别名为 `postList`，返回的结果就会是

```
{
	"data": {
		"postList": [{
			"id": "3",
			"name": "graphql-core-concepts",
			"createDate": "2016-08-01",
			"title": "GraphQL 核心概念",
			"subtitle": "A query language created by Facebook for decribing data requirements on complex application data models",
			"tags": [{
				"name": "graphql",
				"label": "GraphQL"
			}]
		}, {
			"id": "2",
			"name": "redux-advanced",
			"createDate": "2016-07-23",
			"title": "Redux 进阶",
			"subtitle": "Advanced skill in Redux",
			"tags": [{
				"name": "javascript",
				"label": "JavaScript"
			}, {
				"name": "redux",
				"label": "Redux"
			}, {
				"name": "state-management",
				"label": "State management"
			}, {
				"name": "angular-1.x",
				"label": "Angular 1.x"
			}, {
				"name": "ui-router",
				"label": "ui-router"
			}, {
				"name": "redux-ui-router",
				"label": "redux-ui-router"
			}]
		}, {
			"id": "1",
			"name": "getting-started-with-redux",
			"createDate": "2016-07-06",
			"title": "Redux 入门",
			"subtitle": "A tiny predictable state management lib for JavaScript apps",
			"tags": [{
				"name": "javascript",
				"label": "JavaScript"
			}, {
				"name": "redux",
				"label": "Redux"
			}, {
				"name": "state-management",
				"label": "State management"
			}, {
				"name": "angular-1.x",
				"label": "Angular 1.x"
			}]
		}]
	}
}
```
同样，查询所有标签的语句就可以是这样

```
{
	tags {
		id,
		name,
		label,
		posts {
			name,
			title
		}
	}
}
```

这样，一个 GraphQL 的接口，满足了一个简单博客网站的所有需求，是不是很神奇？

![萌呆](http://o7nu3cbe9.bkt.clouddn.com/blog/graphql-core-concepts/tim.png)

#### Validation
由于 GraphQL 是一个强类型语言，所以它可以在执行查询之前检查每个查询语句是否满足事先设定的 schema，符合则合法，如果查询语句不合法则不进行查询。

以上所举的都是合法的例子，[官网](http://graphql.org/docs/validation/)上举了一些例子，这里就不贴了，我们就总结看看要注意的有哪几点。

1. `fragment` 不能引用自己从而形成一个循环
2. 不能查询类型中不存在的字段
3. 查询的字段如果不是 scalar type(标量类型)或 enum type（枚举类型），则需要明确该字段下所包含的字段
4. 同上一条相对，如果查询字段是 scalar type(标量类型)，那么它就不能再有子字段

#### Introspection
Introspection 这个词的意思是内省，自我检查（第一次发现英语有语义如此丰富的词，又暴露词汇量少了-_-||）。

不扯远了，在 GraphQL 中 Introspection 是一个非常有用的功能，它可以用来查询当前 GraphQL 的 schema，从而得知服务器端支持何种类型的查询。

这是一个非常强大且有用的功能，可以想象一下，现在大型公司的开发基本上都是前后端分离的，客户端并不知道服务器端提供的 schema 结构，但通过 Introspection，客户端就能获得当前服务器端所提供的 schema，这无论对开发，还是调试错误都很有帮助。

还是拿刚刚的博客系统来做例子，我们可以通过查询 `__schema` 字段来获得当前所支持的查询类型。

```
// query string
{
	__schema {
		types {
			name
		}
	}
}

// response data
{
  "data": {
    "__schema": {
      "types": [
        {
          "name": "String"
        },
        {
          "name": "BlogType"
        },
        {
          "name": "PostType"
        },
        {
          "name": "ID"
        },
        {
          "name": "TagType"
        },
        {
          "name": "__Schema"
        },
        {
          "name": "__Type"
        },
        {
          "name": "__TypeKind"
        },
        {
          "name": "Boolean"
        },
        {
          "name": "__Field"
        },
        {
          "name": "__InputValue"
        },
        {
          "name": "__EnumValue"
        },
        {
          "name": "__Directive"
        },
        {
          "name": "__DirectiveLocation"
        }
      ]
    }
  }
}
```
从返回的数据中可以看到，我们自定义的 BlogType, PostType 和 TagType 类，剩下的都是 GraphQL 内部类型，其中又分为两类：一类是 ID, String 和 Bealoon 所表示的标量类型，另一类以双下划线开头的是用于自我检查的类型。

知道了自定义类，假设，还想知道自定义类中包含哪些属性以及属性的类型，就可以这样查询

```
// query string
{
	__type(name: "PostType") {
		name
		fields {
			name,
			type {
				name,
				kind
			}
		}
	}
}

// response result
{
  "data": {
    "__type": {
      "name": "PostType",
      "fields": [
        {
          "name": "id",
          "type": {
            "name": null,
            "kind": "NON_NULL"
          }
        },
        {
          "name": "name",
          "type": {
            "name": null,
            "kind": "NON_NULL"
          }
        },
        {
          "name": "createDate",
          "type": {
            "name": null,
            "kind": "NON_NULL"
          }
        },
        {
          "name": "title",
          "type": {
            "name": null,
            "kind": "NON_NULL"
          }
        },
        {
          "name": "subtitle",
          "type": {
            "name": "String",
            "kind": "SCALAR"
          }
        },
        {
          "name": "content",
          "type": {
            "name": "String",
            "kind": "SCALAR"
          }
        },
        {
          "name": "tags",
          "type": {
            "name": null,
            "kind": "LIST"
          }
        }
      ]
    }
  }
}
```

### 最后
总结一下，GraphQL 是一种客户端同服务端之间数据交互的概念，具有强大、灵活、易扩展等的特点。既然，它是一种概念，那么，不同的语言就可以有各种不同的实现方式。

概念并不多，在于灵活运用。

> PS：再次强调，本文主要讲的是 GraphQL 的核心概念，Type System 中所定义的类，都是设计类，并不是具体实现代码。实现请听下回分解。
