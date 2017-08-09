/**
 * Created by jack on 16-5-19.
 */

import Server from '../../constant/server';

declare const DISQUS: any;
declare const DISQUSWIDGETS: any;

class DisqusService {
	/**
	 * load Disqus js file
	 */
	public static loadDisqusPlugin() {
		if (typeof DISQUS === 'undefined') {
			const d = document;
			const s = d.createElement('script');

			s.src = '//discipled.disqus.com/embed.js';

			s.setAttribute('data-timestamp', `${+new Date()}`);
			(d.head || d.body).appendChild(s);
		}
	}

	constructor() { }

	public resetDisqusCountPlugin() {
		if (typeof DISQUSWIDGETS === 'undefined') {
			setTimeout(() => {
				this.resetDisqusCountPlugin();
			}, 1000);
		} else {
			try {
				DISQUSWIDGETS.getCount({ reset: true });
			} catch (e) {
				console.error(e);
			}
		}
	}

	public resetDisqusPlugin(identifier: string, title: string) {
		if (typeof DISQUS === 'undefined') {
			setTimeout(() => {
				this.resetDisqusPlugin(identifier, title);
			}, 1000);
		} else {
			try {
				DISQUS.reset({
					reload: true,
					config() {
						this.page.identifier = identifier;
						this.page.title = title;
						this.page.url = `${Server.HOST}${identifier}`;
					},
				});
			} catch (e) {
				console.error(e);
			}
		}
	}
}

export default DisqusService;
