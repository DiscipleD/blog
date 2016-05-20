/**
 * Created by jack on 16-5-19.
 */

class DisqusService {
	constructor() {}

	/**
	 * load Disqus js file
	 */
	static loadDisqusPlugin() {
		if (typeof DISQUS === 'undefined') {
			const d = document;
			const s = d.createElement('script');

			s.src = '//discipled.disqus.com/embed.js';

			s.setAttribute('data-timestamp', +new Date());
			(d.head || d.body).appendChild(s);
		}
	}

	resetDisqusPlugin(identifier, title) {
		if (typeof DISQUS === 'undefined') {
			setTimeout(() => {
				this.resetDisqusPlugin(identifier);
			}, 1000);
		} else {
			try {
				DISQUS.reset({
					reload: true,
					config: function() {
						this.page.identifier = identifier;
						this.page.title = title;
						this.page.url = 'http://discipled.daoapp.io/#!/posts/' + identifier;
					}
				});
			} catch (e) {
				console.error(e);
			}
		}
	};
}

export default DisqusService;
