/**
 * Created by jack on 16-4-26.
 */

import privateNpmServer from './private-npm-server';

let posts = [];

posts.push(privateNpmServer);

// 暂时由静态目录通过 webpack 的文件引入为对象的方式来管理 Post
// 后期可直接将这部分移植至 database
export default posts;
