/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 13/05/2017
 */

const path = require('path');

const ROOT = path.join(__dirname, '../../');
const SOURCE_PATH = ROOT + 'src';
const DIST_PATH = ROOT + 'build';
const PUBLIC_PATH = '/';

const indexTemplatePath = path.join(SOURCE_PATH, '/index.html');
const clientManifestFileName = 'vue-ssr-client-manifest.json';
const serverBundleFileName = 'vue-ssr-server-bundle.json';

module.exports = {
	ROOT,
	SOURCE_PATH,
	PUBLIC_PATH,
	DIST_PATH,
	indexTemplatePath,
	clientManifestFileName,
	serverBundleFileName
};
