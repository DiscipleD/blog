前段时间读到一篇优秀的文章[《前端开源项目持续集成三剑客》](http://efe.baidu.com/blog/front-end-continuous-integration-tools/)，就想试着运用到自己的项目中去。（好吧，老实说，我只是个徽章收集爱好者。）

## 持续集成
持续集成，这个概念对后端来说应该并不陌生，甚至可以说是司空见惯吧。但是，这对曾经（除了那些大厂）单元测试都不一定要写的前端来说，或许是个陌生的词。

然而，随着前端飞速地发展，不断吸取后端长久以来积累的经验，以及前端对单元测试越来越重视，持续集成作为前端工程化中的一项也渐渐进入人们的视野。

那么，持续集成究竟是什么？

> 持续集成（英语：Continuous integration，缩写为 CI），一种软件工程流程，将所有工程师对于软件的工作复本，每天集成数次到共用主线（mainline）上。 —— [wikipedia](https://zh.wikipedia.org/wiki/%E6%8C%81%E7%BA%8C%E6%95%B4%E5%90%88)

简单来说，就是以一定的频率将代码整合到一起。

使用持续集成能使项目：

* 保持可测试和可发布的状态
* 易于追踪错误，当集成产生错误时，能将错误产生的缩小范围到上次成功集成之后的提交
* 版本回滚也变得轻而易举

## Travis-CI vs CircleCI
在[《前端开源项目持续集成三剑客》](http://efe.baidu.com/blog/front-end-continuous-integration-tools/)中，作者推荐了 2 个集成工具，分别是：[travis-ci](https://travis-ci.org/) 和 [circleci](https://circleci.com/)。

额...该选哪个哪？

![选择困难啊~](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/ci-solution/hard-to-choice.jpeg)

分别粗略地了解了这两个产品，它俩的网站的都非常简洁，文档也很清晰，功能上也大致相同。虽然，circleci 比 travis-ci 多了 Bitbucket 源码库的支持，但是，有一大硬伤 circleci 只对**一个** container 免费，而且，若使用 OS X 需要**额外收费**。与之相反，travis-ci 只要是 Github 上的开源项目**全部免费**，且支持在 OS X 运行。

![决定是你了](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/ci-solution/choose-you.png)

Travis-ci。

注册 travis 只需一步，点击 Sign In 按钮绑定 Github。登录后，执行 travis 只需以下 3 步：

1. 添加需要 travis 管理的项目
2. 为项目添加 .travis.yml 配置文件
3. 提交代码

与此同时，travis 的配置也极其简单。如果没有什么特别的需求，那么，只需配置运行语言类型及其版本就行。

```yml
// .travis.yml
language: node_js
node_js:
  - "6"
```

这样，一个简单、可用的 travis 配置就完成了。

Travis 构建过程主要分为两步：

* install：安装依赖，在 node 环境下，默认运行 npm install
* stript：运行构建命令，在 node 环境下，默认运行 npm test

那么，上面的代码就等价于：

```yml
language: node_js
node_js:
  - "6"
install: npm install
script: npm test
```

当然，travis 不止这两个生命周期，额外的配置需求都可以到官网[查看](https://docs.travis-ci.com/user/customizing-the-build/)。

OK。提交代码试试吧。

travis 的运行信息都可以在 Job log 中看到。

如果运行成功，你就可以通过 https://img.shields.io/travis/USER/REPO.svg 或 https://img.shields.io/travis/USER/REPO/BRANCH.svg 来给你的项目添加 badge 了，就像这样 [![Build Status](https://img.shields.io/travis/DiscipleD/react-redux-antd-starter.svg)](https://travis-ci.org/DiscipleD/react-redux-antd-starter)。

Tips：其中的 USER, REPO, BRANCH 都要替换成个人信息。

## Codecov vs Coveralls
有了构建的徽章，接着再弄一个测试覆盖率的徽章。三剑客文章中用的是 coveralls，但进入它的[官网](https://coveralls.io)发现，它和当今网站那种简洁风格不同，画风有点 classic 啊~文档也不太详细，比较简单，就查了下有没有其他更好的？

于是，发现了 [codecov](https://codecov.io)。

> 干净、免费，我喜欢。

[文档](http://docs.codecov.io/docs)也相对于 [coveralls](https://coveralls.zendesk.com/hc/en-us) 更清晰、详细。在尝试之后，更是觉得我的选择是明智的。^_^

codecov 的使用相当简单，甚至不用看文档就可以轻易配置。

首先，登录[首页](https://codecov.io)，根据自己源码的存储位置选择相应的登录按钮，这里我选择 Github，第一次登录会需要你的授权。

授权成功之后，就能看到类似下面的图，分别对应你的个人账户以及你所加入的组织。

![codecov dashboard](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/ci-solution/codecov-dashboard.png)

第一次使用时，默认是没有 repository 的，需要通过点击 `+ Add my first repository` 来添加需要 codecov 管理的 repository。

选择相应的 repository 之后，你可以看到一个类似下面的页面。当然，数据什么肯定是没有的。

![codecov repository detail](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/ci-solution/codecov-repository-detail.png)

前几个 tab 是用来展示信息的，在配置完成并运行之前是没有信息的，配置的时候只需要看最后一个 setting tab。

![codecov repository setting](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/ci-solution/codecov-setting.png)

切换左侧的菜单，就能分别看到 setting 和 badge 的信息，是不是超级赞？

无论 codecov 还是 coveralls，它自身都不会去运行测试用例来获得项目代码的覆盖率，而是通过收集覆盖率报告及其他关键信息来静态分析。

codecov 可以接收 lcov, gcov 以及正确的 json 数据格式作为输入信息。

于是，如果你使用 JEST 作为测试框架，并开启测试覆盖率（collectCoverage），由于，JEST 使用 istanbul 生成覆盖率报告，即 lcov。那么，上传报告就异常简单了。只需安装 codecov

```bash
npm install codecov --save-dev
```

然后，在 CI 执行之后，上传报告就行。比如，像这样

```yml
language: node_js
node_js:
  - "6"
cache:
  directories: node_modules
script:
  - npm run test:coverage
  # 这里我没有全局安装 codecov，所以要通过 npm 来运行 codecov
  - npm run codecov
os:
  - linux
  - osx
```

这次的 badge 如何获取上面有写到，这里就不再展示了。

## SAUCELABS vs BrowserStack
跨浏览器测试同样有 2 个选择，这次我同三剑客的作者站在了同一战线，选择使用 [SAUCELABS](https://saucelabs.com/)。

不过，由于 JEST 不支持 end-to-end 测试，所以，为了做跨浏览器测试我们不得不寻求其他的测试框架来帮助完成这一工作。这里我并不打算使用 [karma](https://karma-runner.github.io/1.0/index.html)，即使是 karma 同 SAUCELABS 有现成的集成插件 [karma-sauce-launcher](https://github.com/karma-runner/karma-sauce-launcher) 可以使用。

不要问我为什么，就是这么任(jue)性(jiang)。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/ci-solution/not-ask-me-why.jpg)

你真不问么？那我就说了吧。因为现有的测试框架 JEST 已经可以完成 karma 的大部分工作，单纯为 end-to-end 测试单独引入 karma 就没有必要了。

经过一番资料收集和比较之后，我选择 [Nightwatch](http://nightwatchjs.org/) 来解决跨浏览器测试的问题。

> What's Nightwatch?
> 
> Nightwatch.js is an automated testing framework for web applications and websites, written in Node.js and using the W3C WebDriver API (formerly Selenium WebDriver).
> 
> It is a complete browser (End-to-End) testing solution which aims to simplify the process of setting up Continuous Integration and writing automated tests. 

可以从官网的介绍中看到，Nightwatch 对我们当前想解决的问题简直是正中下怀啊！(如果你的项目使用的是 Angular，那么，你也可以试试 [Protractor](http://www.protractortest.org/#/))

在查资料时，发现 nightwatch 的第一个 [issue](https://github.com/nightwatchjs/nightwatch/issues/1) 竟然是[尤大大](https://github.com/yyx990803)提的。

> 走得越远，越是发现一路都是大大们留下的足迹。

膜拜大大。

回到正题，使用 nightwatch 建立 e2e 测试也是相当容易的，这里就简要说一下流程。

首先，使用 npm 进行安装，这就不多说了。  
然后，在根目录下添加配置文件，可以是 nightwatch.conf.js，也可以是 nightwatch.json。  
接着，写对应的测试，API 参考[官网](http://nightwatchjs.org/api)。  
最后，跑测试命令就好了。

主要是来看看，怎么将 nightwatch 的测试同 saucelabs 以及 travis-ci 整合到一起。先看看测试文件。

```JavaScript
// nightwatch.conf.js
module.exports = {
	src_folders: ['tests/e2e'], // 测试文件目录
	output_folder: 'tests/reports', // 测试报告地址
	custom_commands_path: 'tests/saucelabs', // 自定义命令，这里用来更新测试信息到 saucelabs
	custom_assertions_path: '',
	page_objects_path: '',
	globals_path: '',

	test_workers: {
		enabled: true,
		workers: 'auto'
	},

	test_settings: {
		default: {
			launch_url: 'http://localhost:8080', // 目标地址，用于测试中读取
			selenium_port: 4445, // selenium server 的端口(selenium server 由 saucelabs 提供)
			selenium_host: 'localhost', // selenium server 的地址(selenium server 由 saucelabs 提供)
			username: process.env.SAUCE_USERNAME,
			access_key: process.env.SAUCE_ACCESS_KEY,
			silent: true,
			screenshots: {
				enabled: false,
				path: ''
			},
			globals: {
				waitForConditionTimeout: 15000
			},
			// 以下重要！！！
			desiredCapabilities: {
				build: `build-${process.env.TRAVIS_JOB_NUMBER}`,
				public: 'public',
				'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
			}
		},

		// 以下是不同环境的配置
		chrome: {
			desiredCapabilities: {
				browserName: 'chrome'
			}
		},

		firefox: {
			desiredCapabilities: {
				browserName: 'firefox'
			}
		},

		internet_explorer_10: {
			desiredCapabilities: {
				browserName: 'internet explorer',
				version: '10'
			}
		},

		internet_explorer_11: {
			desiredCapabilities: {
				browserName: 'internet explorer',
				version: '11'
			}
		},

		edge: {
			desiredCapabilities: {
				browserName: 'MicrosoftEdge'
			}
		}
	}
};
```

这里要注意以下几点：（重要！！！这些折磨了我近一周）

* 运行 localhost 测试，要开启 [sauce connect](https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy)
* 开启 sauce connect 之后，设置运行环境 `selenium_port: 4445`, `selenium_host: 'localhost'`

以上几点是本地测试时需注意的，下面是连通 travis 时需注意的：

* 配置 `'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER`，其中 `process.env.TRAVIS_JOB_NUMBER` 是 travis 运行时的全局变量
* 配置 `process.env.SAUCE_USERNAME` 和 `process.env.SAUCE_ACCESS_KEY`，后面细讲
* 配置 `build` 和 `public` 属性，分别用于标识测试和查看权限，这两点对最后生成 browser matrix badge 有用，这两点在[三剑客](http://efe.baidu.com/blog/front-end-continuous-integration-tools/)的文章中也有提到

配置好了 nightwatch 同 saucelabs，再修改下 travis 的配置，将 saucelabs 整合进去。

```yml
// .travis.yml
language: node_js
node_js:
- '6'
cache:
  directories: node_modules
# 用于打包，并在 travis 上启动本地服务，用于 e2e test
before_script:
- npm run build
- node server.js &
script:
- npm run test:coverage
- npm run codecov
- npm run test:e2e
os:
- linux
- osx
env:
  global:
  - secure: v6CRj4CKMqxEQ9MSYKAkbmrBgIBZvoppICx6JyjQXhexPOVQKBvboCgdL0lOOZdGZ9rEqSMXvud97kBAFYd1sdP/kSwXdUct5BOMIT3a5GLtY5aQfOocBwR6IvmZpO2U+4VhrCwkzdaq2Ehq0fAXF1pkxDj9YkJZmwDNhTdfDGkib+AwDyr4TLQFC1QrD/4vmrULb3NZdW1KadFYjLzVF8FMa2tDSYMFFVymYu5nuCa/Z0dqSfFy8McYwBMzThDkDRHMT/sf4zKDPyxUwN7xGfC6T88xzCEaltN6K7MGMGKvl7Y0p7VjYW/+rO38936kj6xuPU6J7Vh2yKPJhhT2LtM7ucuo0XSpIxCxaKXWeEmYl2KkCMWNHgrWACE//WBFRNx/JQHimw+abr1Zt/3V9QmSEvnB3hHB0NQgJ2nVrVDjk51RSVaiP4sfQ8GVqEwr1+wJqe4wz7fV+jvRB9uUGgGsjsBbZi6ZycoMtOBoJ+miviRCjZvf9sOZKfIDjcuE5vETQcE37d/++yplCG0N83Kx+q67mbWXirfNj2CfXp7pwHTN+n21v1BSicXqQ6+jaNzD/pcN/GTHgZ5A+VkdcjSmEziuQTO035i1nnCB9TQdFeRdGdfo6DAiq8YOfyVkQ1lml6lWqbPqa4QWokRUD2yA/hAIzNWe5BeLF2JFQBc=
  - secure: S0vWVM74eiAHhk+kqqvym9aIgqaaGyGz9H3rfmEZoG4iuvXjXRaHOOSHxIRVsh5RYXr0PWHAj24fpN5AyUOlu5NQiwACBqmpw9KZBgVekWFshA5uYmpNpCG9w5/UAQa9q2+EcndOCM4lAyuT2wVJ5WfsHRzIA5jUpK1YmUYtuVICTSkumRoEaxfPkwzcGLF7f6aP7mG1YRKeO1F9+RhBfaGN1kYordxIk/fniH8OFB0XiLZ5OIovaAIYFKic0P1wUFwa78jU2fovdObS8JySl2LP19eaLX0MgAFoPB7oLFPxFBN7FCID41TEodDdZtcNnKJT4uQ/iWRqww2BOwVQM9whyBTg8J4kJZALicR4CzGCuUbdyQd2kh/hNZ9d9SKb6YXdcZElFmh3FY6zgfgv5PAx+jDlkfzmgBh7OD5OM4GVrsCsjnaAlmTUNtRPx9B4ps0gbr25F1PxuNy+MXfwSYJdliL+N01BTpiGyts/EXAraWvEm5YkhWfTnbgc8osd3cX9vwB0QHksK+BpkaEs6XCwU6kGMxAJIlafRv6RslREdTPBpYaXB4sGqdYXWY+YFqNxsAwTB3KWIq/uhZmSkou1jZfZa2QonMuVot68U11U7afmPzX8KOVeO2IEcUjt6I4eCYQ+31xO/wSLIQ1uoRySQ2S9VCzr+yzDpu0KVps=
addons:
  sauce_connect: true
```

你肯定会诧异 `global` 下面的那两串长🐜是什么东西。它们其实就是在 nightwatch.conf.js 中用到的 `process.env.SAUCE_USERNAME` 和 `process.env.SAUCE_ACCESS_KEY`。

那它们是怎么来的哪？

首先，安装 travis 工具 `gem install travis`；  
然后，使用 github 账户登录 `travis login`；  
登录后，就可以分别使用 `travis encrypt SAUCE_USERNAME=saucelabs用户名 --add`
和 `travis encrypt SAUCE_ACCESS_KEY=saucelabs的access_key --add`
 将 username 和 access_key 加密，`--add` 参数会自动将结果追加到 .travis.yml 文件中。所以，已完全不用担心字符贴错或贴漏。 

这样整个跨浏览器测试就同 CI 集成好了，配置信息比较多，有兴趣的可以结合项目一起看。（[点这里](https://github.com/DiscipleD/react-redux-antd-starter/tree/real-world)）

最后，不要忘(tian)了(jia)初(hui)衷(zhang)。这可以在 saucelabs 的 Dashboard -> Automated Builds 下看到。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/ci-solution/saucelabs-badge.png)

总的来说，nigthwatch + saucelabs + travis 来做跨浏览器自动测试还是比较方便的，只是一开始不熟悉，相应的资料也比较少，saucelabs 的文档也不够友好，耗费了些时间。覆盖率测试时， JEST 占的那点小便宜全都还回来了。

## Automatically Publish
看到这里，你是不是以为 CI 只是帮你跑跑测试、显示覆盖率？那你就错了。

CI 并不是单单只能帮你跑测试，它还可以将构建成功的代码发布到服务器上。试想一下，当你将代码合并到主分支之后，CI 不但帮你运行测试，还将测试通过之后的代码发布到了你的服务器上，而不需要你人工进行额外的操作。这是不是很 cool！

这里就举一个通过 Travis-ci 将代码发布到 github.io 上的例子。

再修改一下上面 .travis.yml 文件。

```yml
language: node_js
node_js:
- '6'
cache:
  directories: node_modules
before_script:
- npm run build
- node server.js &
script:
- npm run test:coverage
- npm run codecov
- npm run test:e2e
after_success:
- bash ./deploy.sh
os:
- linux
- osx
env:
  global:
  - USER_NAME: Disciple_D
  - USER_EMAIL: disciple.ding@gmail.com
  - GIT_DEPLOY_KEY: XXXXXXXX
  - secure: v6CRj4CKMqxEQ9MSYKAkbmrBgIBZvoppICx6JyjQXhexPOVQKBvboCgdL0lOOZdGZ9rEqSMXvud97kBAFYd1sdP/kSwXdUct5BOMIT3a5GLtY5aQfOocBwR6IvmZpO2U+4VhrCwkzdaq2Ehq0fAXF1pkxDj9YkJZmwDNhTdfDGkib+AwDyr4TLQFC1QrD/4vmrULb3NZdW1KadFYjLzVF8FMa2tDSYMFFVymYu5nuCa/Z0dqSfFy8McYwBMzThDkDRHMT/sf4zKDPyxUwN7xGfC6T88xzCEaltN6K7MGMGKvl7Y0p7VjYW/+rO38936kj6xuPU6J7Vh2yKPJhhT2LtM7ucuo0XSpIxCxaKXWeEmYl2KkCMWNHgrWACE//WBFRNx/JQHimw+abr1Zt/3V9QmSEvnB3hHB0NQgJ2nVrVDjk51RSVaiP4sfQ8GVqEwr1+wJqe4wz7fV+jvRB9uUGgGsjsBbZi6ZycoMtOBoJ+miviRCjZvf9sOZKfIDjcuE5vETQcE37d/++yplCG0N83Kx+q67mbWXirfNj2CfXp7pwHTN+n21v1BSicXqQ6+jaNzD/pcN/GTHgZ5A+VkdcjSmEziuQTO035i1nnCB9TQdFeRdGdfo6DAiq8YOfyVkQ1lml6lWqbPqa4QWokRUD2yA/hAIzNWe5BeLF2JFQBc=
  - secure: S0vWVM74eiAHhk+kqqvym9aIgqaaGyGz9H3rfmEZoG4iuvXjXRaHOOSHxIRVsh5RYXr0PWHAj24fpN5AyUOlu5NQiwACBqmpw9KZBgVekWFshA5uYmpNpCG9w5/UAQa9q2+EcndOCM4lAyuT2wVJ5WfsHRzIA5jUpK1YmUYtuVICTSkumRoEaxfPkwzcGLF7f6aP7mG1YRKeO1F9+RhBfaGN1kYordxIk/fniH8OFB0XiLZ5OIovaAIYFKic0P1wUFwa78jU2fovdObS8JySl2LP19eaLX0MgAFoPB7oLFPxFBN7FCID41TEodDdZtcNnKJT4uQ/iWRqww2BOwVQM9whyBTg8J4kJZALicR4CzGCuUbdyQd2kh/hNZ9d9SKb6YXdcZElFmh3FY6zgfgv5PAx+jDlkfzmgBh7OD5OM4GVrsCsjnaAlmTUNtRPx9B4ps0gbr25F1PxuNy+MXfwSYJdliL+N01BTpiGyts/EXAraWvEm5YkhWfTnbgc8osd3cX9vwB0QHksK+BpkaEs6XCwU6kGMxAJIlafRv6RslREdTPBpYaXB4sGqdYXWY+YFqNxsAwTB3KWIq/uhZmSkou1jZfZa2QonMuVot68U11U7afmPzX8KOVeO2IEcUjt6I4eCYQ+31xO/wSLIQ1uoRySQ2S9VCzr+yzDpu0KVps=
addons:
  sauce_connect: true
```

可以看到，我又给它添加了一个 after_success 的配置，只有当之前的测试运行成功之后，才运行之后的命令。当然你也可以选用其他的配置，比如：`deploy`。

要将代码发布到 github.io 上，就势必要 push 代码至仓库的 gh-pages 分支。然而，如果要通过 travis-ci 向 github 提交代码，那么，就要首先建立 ssh 链接。因为，这里是发布特定的仓库代码，所以，我推荐大家通过给 repository 设置 deploy key 的方式来给 travis-ci 授权，而不是 access token。

那么，如何设置 deploy key？

1. 本地新建一个 ssh key（不清楚的点[这里](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)）
2. 进入 github 你要发布的仓库中，选择 settings -> Deploy keys -> Add deploy key，并将你刚刚生成的 key.pub 文件中的内容复制到输入框中，记得勾选 Allow write access，再点击 Add key。这样就设置好了 deploy key，但肯定不能将 key 直接放到 github 上，需要先加密。
3. 使用 travis 工具加密 deploy key `travis encrypt-file key`，这会生成一个 key.enc 文件，将这个文件加入到代码仓库中就行，不要向代码库提交生成的 key 和 key.pub 文件
4. 加密完成后，控制台会输出一串日志，其中有类似这样的一条 `openssl aes-256-cbc -K $encrypted_c7881d9cb8b5_key -iv $encrypted_c7881d9cb8b5_iv -in key.enc -out key -d`，这就是用来建立 ssh 链接的。将其中 `$encrypted_..._key` 之间的字符提取出来，作为系统运行变量，也就是之前 .travis.yml 中的 `GIT_DEPLOY_KEY: XXXXXXXX`，这样发布脚步中就能使用这个变量

OK。这样 deploy key 就准备好了，下面是发布脚本。

```Bash
#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

# Git variables
TARGET_PATH="build/"
TARGET_BRANCH="gh-pages"

# Travis encrypt variables
ENCRYPTED_KEY="encrypted_${GIT_DEPLOY_KEY}_key"
ENCRYPTED_IV="encrypted_${GIT_DEPLOY_KEY}_iv"

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

# Build source
npm run build

# Set committer git info
git config user.name $USER_NAME
git config user.email $USER_EMAIL

# Force add build folder to git
git add -f $TARGET_PATH

# Commit the build code, that is a local commit for git subtree split
git commit -m "Deploy to GitHub Pages: ${SHA}"

# Split build file as a $TARGET_BRANCH of git
git subtree split -P $TARGET_PATH -b $TARGET_BRANCH

# Add ssh authorization
openssl aes-256-cbc -K ${!ENCRYPTED_KEY} -iv ${!ENCRYPTED_IV} -in deploy_key.enc -out deploy_key -d

# Change the deploy_key mod to fix ssh permissions too open error
chmod 600 deploy_key
eval `ssh-agent -s`
ssh-add deploy_key

# Push code to git
git push -f $SSH_REPO $TARGET_BRANCH
```

这个脚本只需简单的变量改动就能适应你的项目，当然，你也可以为自己的项目编写自己的发布脚本。

## Jenkins
以上说的都是源代码放在 Github 上的开源代码，但我相信大家接触得更多的应该是自己公司的私有代码，比如和 Jira 相关的 Stash。

首先，Stash 现已改名为之前提到过的 Bitbucket，那么，只要将 travis-ci 替换成 circleci 就可以了，其余两个插件都是支持 Bitbucket 的。

其次，如果项目仓库，既不是 Github, 也不是 Bitbucket 或 Gitlab，不要着急，这时候就需要祭出万金油 Jenkins 了。

Jenkins 那成千上万的 Plugin，相信总有一款适合你。比如，老版的 stash 就可以参照这篇[文章](https://blog.mikesir87.io/2013/04/continuous-integration-with-stash-and-jenkins/)来配置。

## 最后
最后，回顾一下整个 CI 流程。

当代码被提交到 github 分支上时，travis-ci 会被触发开始整套的测试及发布。

首先，安装项目依赖；  
然后，运行测试，其中包括 UT 和 e2e test；  
测试无误后，自动将打包后的代码发布到 gh-pages 分支；
于是，就可以通过 [https://用户名.github.io/项目名](https://discipled.github.io/react-redux-antd-starter) 访问项目了。

完成~

来看看成(hui)果(zhang)吧。查看源码点[这里](https://github.com/DiscipleD/react-redux-antd-starter/tree/real-world)。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/ci-solution/readme.png)

### 关于徽章
所有的徽章信息都可以在 [shields.io](http://shields.io/) 中查看，甚至可以自定义徽章，就像这样 ![custom badge](https://img.shields.io/badge/Disciple-D-blue.svg)。哈哈哈~

少年们，想要集徽章么？快把测试补起来吧~

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/ci-solution/study.jpg)

**参考文章：**

1. [前端开源项目持续集成三剑客](http://efe.baidu.com/blog/front-end-continuous-integration-tools/)
2. [一个靠谱的前端开源项目需要什么？](http://web.jobbole.com/86858/)
3. [Zero to Hero with End-to-End tests using Nightwatch, SauceLabs and Travis](https://medium.com/@mikaelberg/zero-to-hero-with-end-to-end-tests-using-nightwatch-saucelabs-and-travis-e932c8deb695#.7z40jm3ss)
4. [Auto-deploying built products to gh-pages with Travis](https://gist.github.com/domenic/ec8b0fc8ab45f39403dd)
5. [Continuous Integration with Stash and Jenkins](https://blog.mikesir87.io/2013/04/continuous-integration-with-stash-and-jenkins/)
