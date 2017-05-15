/**
 * Created by jack on 16-11-28.
 */

import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import MFS from 'memory-fs';
import { PassThrough } from 'stream';

import clientConfig from '../../../config/webpack/client';
import serverConfig from '../../../config/webpack/server';
import { setClientManifest, createRenderer } from './server-render';

let expressDevMiddleware;

const koaWebpackDevMiddleware = (compiler, opts) => {
	expressDevMiddleware = webpackDevMiddleware(compiler, opts);
	return async (ctx, next) => {
		await new Promise(resolve =>
			expressDevMiddleware(ctx.req, {
				end: (content) => {
					ctx.body = content;
					resolve();
				},
				setHeader: ctx.set.bind(ctx)
			}, () => resolve(next()))
		);
	};
};

const koaWebpackHotMiddleware = (compiler, opts) => {
	const expressMiddleware = webpackHotMiddleware(compiler, opts);
	return async (ctx, next) => {
		let stream = new PassThrough();
		ctx.body = stream;
		await expressMiddleware(ctx.req, {
			write: stream.write.bind(stream),
			writeHead: (state, headers) => {
				ctx.state = state;
				ctx.set(headers);
			}
		}, next);
	}
};

const clientCompiler = webpack(clientConfig);

const devMiddleware = koaWebpackDevMiddleware(clientCompiler, {
	// display no info to console (only warnings and errors)
	noInfo: false,
	stats: {
		colors: true,
		cached: false
	},
	contentBase: clientConfig.output.path,
	publicPath: clientConfig.output.publicPath
});

clientCompiler.plugin('done', () => {
	const clientManifestFileName = 'vue-ssr-client-manifest.json';
	const filePath = path.join(clientConfig.output.path, clientManifestFileName);
	const options = {
		clientManifest: JSON.parse(expressDevMiddleware.fileSystem.readFileSync(filePath, 'utf-8'))
	};
	createRenderer(JSON.parse(mfs.readFileSync(outputPath, 'utf-8')), options);
});

const hotMiddleware = koaWebpackHotMiddleware(clientCompiler, {});

// watch and update server renderer
const serverCompiler = webpack(serverConfig);
const mfs = new MFS();
const serverBundleFileName = 'vue-ssr-server-bundle.json';
const outputPath = path.join(serverConfig.output.path, serverBundleFileName);
serverCompiler.outputFileSystem = mfs;
serverCompiler.watch({}, (err, stats) => {
	if (err) throw err;
	stats = stats.toJson();
	stats.errors.forEach(err => console.error(err));
	stats.warnings.forEach(err => console.warn(err));
	createRenderer(JSON.parse(mfs.readFileSync(outputPath, 'utf-8')));
	console.log('server side bundle is now VALID.');
});

export {devMiddleware, hotMiddleware};
