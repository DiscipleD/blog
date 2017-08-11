Disciple.Ding blog
====

The source code for my blog, [discipled.me](https://discipled.me)

I'm constantly rewriting / refactoring this silly little blog using
the latest and buzziest tech, so that I can stay up to date on these
libraries and frameworks.

Current buzzwords:

* main tech
    - Vue 2 & vue-router & vuex 
    - TypeScript
    - ES2015
    - Koa 2
    - GraphQL
    - SSR(Server side render)
    - PWA(progressive web apps)
* style & template
    - bootstrap v4
    - [Start Bootstrap](http://startbootstrap.com/) - [Clean Blog](http://startbootstrap.com/template-overviews/clean-blog/)
    - scss
    - postcss (Autoprefixer)
* package
    - Webpack 3
* publish
    - docker
    - docker-compose

### Branch State
As a result of rewriting / refactoring, there're several versions code using different framwork or strategy, and that will on different branches. If you have any interest on that, you can checkout it easily.(Except `master`, other branches will not be updated.)

* master: Vue + TypeScript + SSR
* vue-js-ssr: Vue + ES6+ + SSR
* vue-js-spa: Vue + ES6+ + SPA

### Dev env
Need node 8 above.

#### INSTALL
npm i

#### RUN
npm start

### Production env
#### INSTALL
npm i

#### BUILD
npm run build

#### Start server
npm run start:server

#### Stop server
npm run stop:server
