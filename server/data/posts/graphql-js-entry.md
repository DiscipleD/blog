> 系列文章：
>
> 1. [GraphQL 核心概念](http://discipled.daoapp.io/posts/graphql-core-concepts)
> 2. graphql-js 浅尝(本文)

**常言道，实践是检验真理的唯一标准。**

[上一篇文章](http://discipled.daoapp.io/posts/graphql-core-concepts)讲了 GraphQL 的核心概念，所提到的一些例子都是理论化的，并没有实际代码做支撑，就好像在画一个大饼，总是让人不那么信服。

它真的有那么神奇吗？那就同我一起看下去，用事实说话。

之前那篇文章一直有提到 GraphQL 是一个概念，每个语言可以有自己实现它的方式。因为，我是搞前端的，对 JavaScript 比较熟悉，所以，这里就用 graphql-js（GraphQL 的 JavaScript 实现）来举例。

### Hello World
遵循传统，第一个例子必须是 Hello World。

首先，安装就不用多说了。

```Bash
npm install graphql-js --save
```

那这个例子该怎么设计哪？假设，查询一个 `hello` 字符串，就返回一个 `world` 字符串，很明显 type 的结构就该是这样

```
type HelloWorld {
	hello: String
}
```
如何实现这个 HelloWorld 类型哪？graphql-js 已经定义好了[基础类](http://graphql.org/docs/api-reference-type-system/)，我们直接调用就行。那么，这个 type 实现起来也就非常简单了

```JavaScript
import {
	GraphQLString,
	GraphQLObjectType,
} from 'graphql';

const HelloWorldType = new GraphQLObjectType({
	name: 'HelloWorldType',
	fields: () => ({
		hello: {
			type: GraphQLString,
		}
	})
});
```
简单分析一下上面的代码，可以看到 `HelloWorldType` 是一个 `GraphQLObjectType` 的实例，它包含一个 `fields` 是 hello，这个 hello 所对应的返回类型是字符串。

那如何返回 world 字符串？那就给它个 `resolve` 方法

```JavaScript
const HelloWorldType = new GraphQLObjectType({
	name: 'HelloWorldType',
	fields: () => ({
		hello: {
			type: GraphQLString,
			resolve() {
				return 'world';
			},
		}
	})
});
```

这样类型就定义好了，还记不记得上篇文章提到的类型定义完成后该怎么办？

对，创建查询的 schema。

```JavaScript
import {
	GraphQLString,
	GraphQLObjectType,
	GraphQLSchema,
} from 'graphql';

const HelloWorldType = new GraphQLObjectType({
	name: 'HelloWorldType',
	fields: {
		hello: {
			type: GraphQLString,
			resolve() {
				return 'world';
			},
		}
	}
});

const schema = new GraphQLSchema({
	query: HelloWorldType
});
```
schema 设置好了，是不是想查询看看哪？

![万事俱备，只欠东风](http://o7nu3cbe9.bkt.clouddn.com/blog/graphql-js-entry/sanguo.jpeg)

东风当然是服务器啦。GraphQL 官方提供 [express-graphql](https://github.com/graphql/express-graphql) 这个中间件来支持基于 GraphQL 的查询，所以，这里选用 [Express](http://expressjs.com/) 作为服务器。

安装就不再重复了，只需将刚刚建立的 schema 添加到 express 的中间件中就可以了。

```JavaScript
const app = express();

app
	.use('/graphql', graphqlHTTP({ schema, pretty: true }))
	.listen(3000, () => {
		console.log('GraphQL server running on http://localhost:3000/graphql');
	});
```
当当当当~完成，去 Postman 里查询 `http://localhost:3000/graphql?query={hello}` 看看吧。

### Blog System
在[上一篇文章](http://discipled.daoapp.io/posts/graphql-core-concepts)里，我们设计了一个博客的查询 schema，这次我们就来动手实现它。（下面就开始讲例子啦，不愿听我唠叨的可以直接看[代码](https://github.com/DiscipleD/graphql-demo)）

前面 HelloWorld 的例子讲的比较详细，现在大家熟悉了语法，接下来的案例就会过得快一些。

首先是 PostType，这里对 Posttype 做了一点小修改，给几个字段添加了不能为空的设计。

```JavaScript
/**
 * type Post {
 *   id: ID!,
 *   name: String!,
 *   createDate: String!,
 *   title: String!,
 *   subtitle: String,
 *   content: String,
 *   tags: [Tag]
 * }
 */
const Post = new GraphQLObjectType({
	name: 'PostType',
	fields: () => ({
		id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		name: {
			type: new GraphQLNonNull(GraphQLString)
		},
		createDate: {
			type: new GraphQLNonNull(GraphQLString)
		},
		title: {
			type: new GraphQLNonNull(GraphQLString)
		},
		subtitle: {
			type: GraphQLString
		},
		content: {
			type: GraphQLString
		},
		tags: {
			type: new GraphQLList(TagType),
			resolve: post => post.tags.map(tagName => getTagByName(tagName))
		}
	})
});
```
然后是另一个主要的 type: Tag type。

```JavaScript
/**
 * type Tag {
 *   id: ID!,
 *   name: String!,
 *   label: String!,
 *   createDate: String!,
 *   posts: [Post]
 * }
 */
const Tag = new GraphQLObjectType({
	name: 'TagType',
	fields: () => ({
		id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		name: {
			type: new GraphQLNonNull(GraphQLString)
		},
		label: {
			type: new GraphQLNonNull(GraphQLString)
		},
		createDate: {
			type: new GraphQLNonNull(GraphQLString)
		},
		posts: {
			type: new GraphQLList(PostType),
			resolve: tag => getPostsList().filter(post => ~post.tags.indexOf(tag.name))
		}
	})
});
```
两个主要的类型已经定义好了，把它们俩整合起来就是博客类型了。

```JavaScript
/**
 * type Blog {
 *   post: Post,	// 查询一篇文章
 *   posts: [Post],	// 查询一组文章，用于博客首页
 *   tag: Tag,		// 查询一个标签
 *   tags: [Tag],	// 查询所有标签，用于博客标签页
 * }
 */
const BlogType = new GraphQLObjectType({
	name: 'BlogType',
	fields: () => ({
		post: {
			type: PostType,
			args: {
				name: {
					type: GraphQLString
				}
			},
			resolve: (blog, { name }) => getPostByName(name),
		},
		posts: {
			type: new GraphQLList(PostType),
			resolve: () => getPostsList(),
		},
		tag: {
			type: TagType,
			args: {
				name: {
					type: GraphQLString
				}
			},
			resolve: (blog, { name }) => getTagByName(name),
		},
		tags: {
			type: new GraphQLList(TagType),
			resolve: () => getTagsList(),
		}
	})
});
```
这里有一个新东西，就是 `arg` 字段，用来获取查询参数，如果在没有设置过 `arg` 字段的属性上添加变量进行查询，graphql-js 的验证系统会报错。

最后，将之前的 helloworld 类型稍微修饰一下，独立出来，然后和 blog type 整合到一起成为根查询类。

```JavaScript
const queryType = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: () => ({
		hello: WorldType,
		blog: {
			type: BlogType,
			resolve: () => ({})
		},
	})
});

const schema = new GraphQLSchema({
	query: queryType
});
```
OK。这样整个 Demo 就完成了([查看源码戳这里](https://github.com/DiscipleD/graphql-demo))，快去 Postman 试试各种查询，体验 GraphQL 的神奇吧。（不知道怎么写查询语句的就看[上一篇](http://discipled.daoapp.io/posts/graphql-core-concepts)吧）

![](http://o7nu3cbe9.bkt.clouddn.com/blog/graphql-js-entry/convinced.jpeg)

### 最后
如果，你不喜欢 GET 方法或查询字符串过长，express-graphql 也支持 POST 方法，服务器会先查看请求的 URL 中是否包含查询字符串，如果不包含就会去 request body 中获取，只需在 request header 中将 `Content-Type` 设置为 `application/graphql` 就可以了。

全文一直在说查询，或许你会疑惑，那我修改怎么做哪？graphql 中的修改称之为 `mutation`。`mutation` 可以定义自己的接口解析类，它在 graphql 的 schema 中是一个可选项，其他的和查询并无两样，只是最后在 `resolve` 方法中的处理方式不同而已。

```JavaScript
const schema = new GraphQLSchema({
	query: queryType，
	mutation: mutationType
});
```

最后的最后提一句，[nodemon](http://nodemon.io/) 很好用，谁用谁知道。