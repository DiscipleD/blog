/**
 * Created by jack on 16-11-28.
 */

import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import MFS from 'memory-fs';
import { PassThrough } from 'stream';

import { serverBundleFileName, clientManifestFileName } from '../../../config/webpack/setting';
import clientConfig from '../../../config/webpack/client';
import serverConfig from '../../../config/webpack/server';
import { createRenderer } from './server-render';

const mfs = new MFS();
const clientManifestFilePath = path.join(clientConfig.output.path, clientManifestFileName);
const serverBundleFilePath = path.join(serverConfig.output.path, serverBundleFileName);
let expressDevMiddleware;

/**
 * setRenderer
 * whenever client file or server file change, renderer should be update
 */
const updateRenderer = () => {
	try {
		const options = {
			clientManifest: JSON.parse(expressDevMiddleware.fileSystem.readFileSync(clientManifestFilePath, 'utf-8'))
		};
		createRenderer(JSON.parse(mfs.readFileSync(serverBundleFilePath, 'utf-8')), options);
	} catch(e) {
		createRenderer(JSON.parse(mfs.readFileSync(serverBundleFilePath, 'utf-8')));
	}
	console.log('Renderer is updated.');
};

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

clientCompiler.plugin('done', updateRenderer);

const hotMiddleware = koaWebpackHotMiddleware(clientCompiler, {});

// watch and update server renderer
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = mfs;
serverCompiler.watch({}, (err, stats) => {
	if (err) throw err;
	stats = stats.toJson();
	stats.errors.forEach(err => console.error(err));
	stats.warnings.forEach(err => console.warn(err));
	updateRenderer();
});

export {devMiddleware, hotMiddleware};
