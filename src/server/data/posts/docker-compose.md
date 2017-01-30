首先，祝各位新年快乐，万事如意，鸡年大吉。

这次要来说说一个和前端并不太相关的东西——docker compose，一个整合发布应用的利器。

如果，你对 docker 有一些耳闻，那么，你可能知道它是什么。

不过，你不了解也没有关系，在作者眼中，docker 就类似于一个沙箱，而你的应用起在这个沙箱里，不受服务器系统环境的影响，同时也不污染服务器，配置完成之后往服务器部署或移除应用都相当方便。

而 compose 就如同它的字面意思组合，它就好像是一个大箱子，可以把几个不相关的沙箱给组合起来，变成一个整体，就如同小时候动画片中变形金刚的合体变身。

![Awesome?](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/docker-compose/transformer.gif)

理论知识就没有什么比[官方文档](https://docs.docker.com/compose/overview/)更好的了，这里就不讲了，主要来看看如何应用。本文主要包含以下几个部分：

* [安装](#Install)
* [Hello world](#HelloWorld)
* [常用命令](#Command)
* [Real world](#RealWorld)
	* [docker 到 docker-compose 的转换](#Transform)
	* [引入 nginx](#Nginx)
	* [Letsencrypt 镜像生成 SSL 证书](#Letsencrypt)
	* [最后](#Conclusion)

如果，你只对前端技术感兴趣，那么，这篇文章可能不适合你。

> 常言道：一个不懂运维的设计，不是一个好前端。

<a name="Install"></a>
## 安装
Windows 和 Mac 装了 Docker 之后已经自带 docker-compose，其他环境根据 Docker [官网](https://docs.docker.com/compose/install/)介绍，简单几步也能完成安装。

这里要提一下，在亚马逊 aws 上安装 docker-compose，由于没有 root 权限会遇到官网上所提到的 `Permission denied` 错误，加了 sudo 也是无法直接下载到 /usr/local/bin 目录下的。

硬来不行，还可以曲线救国嘛~

先将文件下载到 aws 服务器上，再将文件移动到 `/usr/local/bin` 目录就可以了。

```Bash
curl -L https://github.com/docker/compose/releases/download/1.9.0/docker-compose-`uname -s`-`uname -m` > docker-compose
sudo chown root docker-compose
sudo mv docker-compose /usr/local/bin
sudo chmod +x /usr/local/bin/docker-compose
```

验证是否安装成功，试试 `docker-compose version`。如果有输出版本信息，就说明 docker-compose 已经安装好了。

docker-compose 虽然安装好了，但并不一定能用，因为 docker 和 docker-compose 是分开安装，即使它俩各自运行正常，在一起就不一定合拍了。

那怎么知道它俩合不合拍？答案很简单，hello world~

<a name="HelloWorld"></a>
## Hello world
在任意的目录下，创建一个 docker-compose.yml 文件，并添加下面的内容。

```yml
version: '2'
services:
  helloworld:
    image: 'hello-world'
```

然后，在当前目录下使用 `docker-compose up` 启动 docker-compose。

启动时，如遇到

> client and server don't have same version (client : 1.22, server: 1.18)

类似这样的错误，可以通过设置 docker-compose 的 api 版本来解决。

```Bash
COMPOSE_API_VERSION=auto
```

不要尝试通过一次次安装不同的 docker-compose 版本来解决，你会 😭 的。如果，还遇到

> docker.errors.InvalidVersion: inspect_network is not available for version < 1.21

这是 Ubuntu 14.04 LTS 默认的 docker 版本太低引起的，需要升级 docker。然而，在 aws 的服务器上升级 docker 版本时，需要先创建 `/etc/apt/sources.list.d/docker.list` 文件，并添加

```
deb https://packages.docker.com/1.12/apt/repo ubuntu-trusty main
```

再运行 

```Bash
sudo apt-get update && sudo apt-get upgrade docker-engine
```

就能升级成功。看到👇这样的结果，就表示 docker 和 docker-compose 都安装成功，而且它俩很搭。

![Hello world result](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/docker-compose/hello_world.png)

<a name="Command"></a>
## 常用命令
docker-compose 的命令很简单，它已经将一些 docker 常用关于 image, container & volume 的命令都整合在了一起，使发布变得极其简单。比如，之前刚刚提到的 `docker-compose up`，就类似于 docker build & run，用来创建并启动 container。

其他常用的命令有：

* `build`：构建或重新构建 services
* `config`：验证 docker-compose 配置文件
* `create`：创建 services
* `down`：与 `up` 相对，停止并删除 container, image, volumn 等
* `kill`：杀死某个 container
* `logs`：查看 container 日志
* `ps`：查看 container 信息
* `restart`：重启 services
* `rm`：删除已经停止的 container
* `start`：启动 services
* `stop`：停止 service
* `version`：显示 docker-compose 版本

是不是发现有几个命令和 docker 的命令一样？的确，但就如同之前的安装过程一样，docker-compose 是依赖于 docker 的，docker 命令更底层。比如 `docker-compose ps` 这个命令，它只会显示由 docker-compose 启动的容器信息，但不包含 docker 启动的容器信息，相反 `docker ps` 可以查看由 docker-compose 启动的容器信息。

还剩几个命令没有列出来，有兴趣的童鞋可以通过 `docker-compose help` 命令或上官网查看[更多信息](https://docs.docker.com/compose/reference/overview/)。

光说不练假把式。docker-compose 究竟好不好用，只有用了才知道。

<a name="RealWorld"></a>
## Real world
之前，个人博客的静态资源一直都是通过 node 提供服务。这的确可以，但这不是 node 的强项。

> 专业的事交给专业的人去做。 - by S(ome)B(ody)

这个专业的人就是 nginx。

除此之外，2017 年起水果和古哥都强推 https，升级 https 也是箭在弦上（虽然一直有这个打算，也拖到了现在彡(-_-;)彡）。

于是，程序不再是原先单一的 node 服务，而是，变成了一系列密切相关的服务。如果，通过基础的 docker 命令来一个个启动、停止服务的话，那么，就需要额外添加一个复杂的脚本来控制。

docker-compose 就是用来处理类似的问题。它可以做到通过一条命令来控制一个应用相关的一系列服务的启动、停止等，并且不依赖于机器环境，作到随时可以将应用迁移至其他的机器上发布。

知道了准备做什么，先看看最终设计的应用结构和之前的对比。

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/docker-compose/architecture.png)

直接看这张图可能有点蒙圈，没事，一点点来看。

<a name="Transform"></a>
### docker 到 docker-compose 的转换
本文一开始就有提到，docker 可以看做是一个小箱子，而 docker-compose 是一个大箱子用来装这些小箱子。

那么，如何将小箱子放入这个大箱子里哪？

非常简单！只需告诉 docker-compose 如何启动你的应用就可以了，那就先看看原先的启动命令。

```Bash
docker run -d -p 80:8080 --name blog
```

启动命令中，主要配置了一个端口的映射 `-p`，以及命名了容器名，用于方便地启动、停止应用。清楚了这些，那么改成 docker-compose 的文件也就轻而易举了。

```yml
version: '2'
services:
  node:
    build: .
    container_name: node
    ports:
     - "80:8080"
```

docker 到 docker-compose 的转换就这样完成了，这些更新都不需要修改任何的业务逻辑或者打包配置。

试着使用 `docker-compose up -d` 启动服务验证看看。

启动正常之后，还是一步步来，先引入 nginx。

<a name="Nginx"></a>
### 引入 Nginx
Nginx 是一个高性能的 Web 服务器，它具有配置简单、运行稳定和负载均衡等特点，常被作为静态资源服务器。（详细的 Nginx 信息，请自行查询资料，这方面本人也不是行家）

Nginx 在 docker hub 上有现成的[官方镜像](https://hub.docker.com/_/nginx/)，直接拿来用就可以了。

```yml
version: '2'
services:
  # ...

  nginx:
    image: nginx:stable
    container_name: nginx
    ports:
      - "80:80"
    restart: always
```

此时，启动服务会失败并报错，因为 nginx 和原有的 node 容器都绑定到了 80 端口。docker-comopse 各个容器之间是相互独立的，容器内部的接口相互之间不影响，但对外暴露的接口不能相同，不然就会引起冲突。

从之前的结构图可以看到，请求全部由 nginx 接受并转发到 node 服务，也就是说，node 不直接对外提供服务。那么，docker-compose 中也就可以移除 ports 部分（这里便于测试 node 服务依旧暴露 8080 端口）。

其次，静态文件是由 node 打包后生成的，也就是说需要将 node 服务中的数据共享给 nginx 服务，这就需要用到 [volume](https://docs.docker.com/engine/tutorials/dockervolumes/)（数据卷）。数据卷可以将数据在宿主机和容器之间、容器和容器之间共享，即使容器被删除了，数据卷依旧存在。

这里就需要将服务器上的 nginx 配置文件和 node 构建之后的静态文件共享给 nginx。

```yml
version: '2'

services:
  node:
    build: .
    container_name: node
    # node service port export for test
    ports:
     - "8080:8080"
    volumes:
     - ./log/node:/var/log/node

  nginx:
    image: nginx:stable
    container_name: nginx
    depends_on:
      - node
    volumes:
      - ./config/nginx:/etc/nginx/conf.d:ro
      - ./log/nginx:/var/log/nginx
    volumes_from:
      - node:ro
    ports:
      - "80:80"
    restart: always
```

volume 是 docker 中相当重要及常用的一部分，理解它对使用 docker 解决问题有巨大的帮助。推荐一篇关于 docker volume 的[文章](http://dockone.io/article/128)，有助于理解 volume。

#### 负载均衡
docker-compose 配置完了，再来看看 nginx 配置。本章一开始有提到 nginx 可以做负载均衡，那该如何配置哪？

在 nginx 中配置负载均衡相当简单，只需在 `upstream` 里配置一下目标服务器。

然而，这里就会遇到一个问题。由于，容器之间是相互独立的，于是，localhost 便无法在容器之间相互访问。不过，由同一 docker-compose 所起的容器之间可以通过**容器名**相互访问，这里就是

```
upstream node_server  {
    server node:8080 max_fails=2 fail_timeout=30s;
}
```

如果要额外再起一个服务，只需在 docker-compose 文件中再启动一个容器（可以依赖同一套代码），并将之前所配的 `upstream` 中额外多添加一条 server 信息，比如：

```
upstream node_server  {
	server node:8080 max_fails=2 fail_timeout=30s;
	server node-backup:8080 max_fails=2 fail_timeout=30s;
}
```

这样即使一个服务挂了，只要另一个服务还运行正常，nginx 会将请求转发给运行正常的服务。一个最简单的复杂均衡就做好了，所有这些都不需要修改任何功能性的代码。

知道了 nginx 可以提供负载均衡，但也不要忘了老朋友 pm2。

pm2 通过命令行参数 -i，或配置文件通过起多个实例来做负载均衡（本人的小博客也是用的这个方式）。

引入 nginx 之后，将全站升级成 https 就轻而易举了，只需在配置文件中标明证书及秘钥文件的位置就可以了。接下去，就看看如何生成证书和秘钥。

<a name="Letsencrypt"></a>
### 使用 Letsencrypt 生成 SSL 证书
获取 ssl 证书的方式有许多种，有的买域名就送证书，这里介绍一下用 [letsencrypt](https://certbot.eff.org/)（现已更名为 `certbot`）获取免费 ssl 证书。

> 常言道：前人栽树，后人乘凉。

同样的，letsencrypt 在 docker hub 上也有现成的[镜像](https://hub.docker.com/r/deliverous/certbot/)。镜像有了，剩下的就只需根据不同的场景来生成证书。

`certbot` 支持 5 种生成证书的模式，分别是：`apache`, `nginx`, `webroot`, `standalone` 和 `manual`，分别用于[不同的场景](https://certbot.eff.org/docs/using.html#getting-certificates-and-choosing-plugins)。这里 nginx 和 certbot 使用的是不同的镜像，所以选用的模式是 `webroot`。

选定了镜像和模式，那么参照 certbot 的[文档](https://certbot.eff.org/docs/using.html#certbot-command-line-options)就能够简单地生成证书了。

```Bash
docker run -it --rm --name certbot \
  -v /letsencrypt/etc/letsencrypt:/etc/letsencrypt \
  -v /letsencrypt/lib/letsencrypt:/var/lib/letsencrypt \
  -v /letsencrypt/challenge:/usr/share/nginx/html \
  -v /var/log/letsencrypt:/var/log/letsencrypt \
  deliverous/certbot \
  certonly --webroot -w /usr/share/nginx/html
```

需要注意的是，在 `webroot` 模式下申请证书，需要向 certbot 证明服务器能被访问。certbot 验证程序会访问 web root 目录（这里是 /usr/share/nginx/html）来验证。这里又要用到之前提到的 volume 将目录共享给 nginx，让 nginx 能够访问到目录内部的文件。

```
server {
    listen 80;
    listen [::]:80;

    server_name discipled.me;

    # ...
    
    # letsencrypt challenge file location
    location /.well-known {
        root /usr/share/nginx/html;

        access_log  /var/log/nginx/challenge-access.log  main;
        allow all;
    }
    
    ...
}
```

修改 nginx 配置之后，别忘重启 nginx 服务。

```Bash
docker-compose restart nginx
```

重启 nginx 之后，然后再运行上面生成证书的命令就能生成证书了。

![ssl 证书生成成功](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/docker-compose/create-certificate-success.png)

看到 `Congratulations！`，证书就生成成功了。

再一次修改 nginx 配置，添加 ssl 证书信息，并监听 443 端口。

```
# redirect host http://domain to https://domain
server {
    listen 80;
    listen [::]:80;

    server_name discipled.me;

    # letsencrypt challenge file location
    location /.well-known {
        root /usr/share/nginx/html;

        access_log  /var/log/nginx/challenge-access.log  main;
        allow all;
    }

    location / {
        return 301 https://discipled.me$request_uri;
    }
}

# https://domain server
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name discipled.me;
    charset utf-8;

    gzip on;
    gzip_types    text/plain application/javascript application/x-javascript text/javascript text/xml text/css;
    root /usr/app/build/client/;

    ssl_certificate /etc/letsencrypt/live/discipled.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/discipled.me/privkey.pem;

    location / {
        try_files $uri @node;
    }

    location @node {
        proxy_pass http://node_server;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

重启 nginx 服务后，访问网站就可以看到

![](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/docker-compose/https-home-page.png)

小锁加上，大功告成。

> 七牛的图床用 https 还要实名认证，为了保护(pa)个(cha)人(shui)隐(biao)私，就暂时用 Github 来救一下急。(谁知道有啥好用的图床麻烦推荐一下，像七牛一样支持 qrsync 用脚本批量上传的就最好了~先谢过...)

#### 证书更新
letsencrypt 生成的证书有效期是 3 个月，所以，至少 3 个月内需要更新一次证书。

certbot 提供了 renew 命令可以方便地更新证书，使用 `--dry-run` 参数可以验证证书更新命令是否正确。

```Bash
docker run -it --rm --name certbot \
  -v /letsencrypt/etc/letsencrypt:/etc/letsencrypt \
  -v /letsencrypt/lib/letsencrypt:/var/lib/letsencrypt \
  -v /letsencrypt/challenge:/usr/share/nginx/html \
  -v /var/log/letsencrypt:/var/log/letsencrypt \
  deliverous/certbot \
  renew --dry-run
```

同样，看到 `Congratulations` 说明证书更新成功了。

由于，本人每月都会发布文章并重启服务，就可以把证书更新一起交由 docker-compose 管理。（这里偷了个懒，增加了证书同应用之间的耦合关系，还是建议大家证书是通过系统定时任务来更新，省得哪天忘更新证书，证书就过期了）。

<a name="Conclusion"></a>
### 最后
看一下最终的 docker-compose 配置文件和发布脚本。

```yml
# docker-compose.yml
version: '2'

services:
  node:
    build: .
    image: "blog:${TAG_NAME}"
    container_name: node
    # node service port export for test
    ports:
     - "8080:8080"
    volumes:
     - ./log/node:/var/log/node

  nginx:
    image: nginx:stable
    container_name: nginx
    depends_on:
      - node
      - letsencrypt
    volumes:
      - ./config/nginx:/etc/nginx/conf.d:ro
      - ./letsencrypt/etc/letsencrypt:/etc/letsencrypt
      - ./letsencrypt/lib/letsencrypt:/var/lib/letsencrypt
      - ./letsencrypt/challenge:/usr/share/nginx/html
      - ./log/nginx:/var/log/nginx
    volumes_from:
      - node:ro
    ports:
      - "80:80"
      - "443:443"
    restart: always

  letsencrypt:
    image: deliverous/certbot
    container_name: certbot
    volumes:
      - ./letsencrypt/etc/letsencrypt:/etc/letsencrypt
      - ./letsencrypt/lib/letsencrypt:/var/lib/letsencrypt
      - ./letsencrypt/challenge:/usr/share/nginx/html
      - ./log/letsencrypt:/var/log/letsencrypt
    command: renew
```
发布脚本主要用来更新代码，以及获取应用版本号。

```Bash
# deploy.sh
# git operation
git reset HEAD --hard
git fetch
git pull

# TAG_NAME used to set docker image tag
export TAG_NAME=`git tag -l | sort -r | head -n 1`

# docker operation
docker-compose down --volumes

docker-compose up --build -d
```

其他配置可以上 [github 查看](https://github.com/DiscipleD)。

一扯似乎又扯远了，欢迎提意见和建议，顺便再问一下有啥好的图床推荐。
