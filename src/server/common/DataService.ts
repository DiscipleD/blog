/**
 * Created by jack on 16-8-22.
 */

import fs = require('fs');
import { promisify } from 'util';
import marked = require('marked');

interface IFileOptions {
	encoding?: string;
}

type TSortFunc = (params: any) => void;
type TSortKey = TSortFunc | string;

const readFilePromisify = promisify(fs.readFile);
const writeFilePromisify = promisify(fs.writeFile);

const readFile = (path: string, options?: IFileOptions) => readFilePromisify(path, options) as Promise<Buffer>;
const writeFile = (path: string, data: any, options?: IFileOptions) => writeFilePromisify(path, data, options);

const readMarkdownFile = (path: string, encoding: IFileOptions = { encoding: 'utf8' }) =>
	readFile(path, encoding).then((data: Buffer) => marked(data.toString()));

const sortFn = (key: TSortKey, order: number = 1) => (curr: any, next: any) =>
	(typeof key === 'function' ? key(curr) > key(next) : curr[key] > next[key]) ? +order : -order;

interface IObject {
	id: string | number;
}

const normalize = <T extends IObject>(data: T[]): { [key: string]: T } => Array.isArray(data)
	? data.reduce((prev, curr) => ({...prev, [curr.id]: curr}), {}) : data;

export { IFileOptions, readFile, writeFile, readMarkdownFile, sortFn, normalize };
