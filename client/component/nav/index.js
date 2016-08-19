/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import throttle from 'lodash/throttle';

import template from './nav.html';
import './style.scss';

class Navigation {
	constructor(clientWidth = 860) {
		// desktop min screen width
		const MinScreenWidth = 768;
		// init previous scroll top
		this.previousTop = 0;

		this.isVisible = false;
		this.isFixed = false;
		this.isDesktop = MinScreenWidth <= clientWidth;
		this.isShown = this.isDesktop;
		this._bodyScrollListener = this._bodyScrollListener.bind(this);
	}

	addBodyListener() {
		this.isDesktop && document.addEventListener('scroll', throttle(this._bodyScrollListener, 200));
	}

	removeBodyListener() {
		this.isDesktop && document.removeEventListener('scroll', this._bodyScrollListener);
	}

	_bodyScrollListener() {
		let currentTop = document.body.scrollTop;
		// in vue ready lifecycle, page not rendered, so can't query the dom element.
		this.headerHeight = document.querySelector('.navbar-custom').clientHeight;

		// check if user is scrolling up
		if (currentTop < this.previousTop) {
			// if scrolling up...
			if (currentTop > 0 && this.isFixed) {
				this.isVisible = true;
			} else {
				this.isVisible = false;
				this.isFixed = false;
			}
		} else if (currentTop > this.previousTop) {
			// if scrolling down...
			this.isVisible = false;
			currentTop > this.headerHeight && (this.isFixed = true);
		}
		this.previousTop = currentTop;
	}
}

export default Vue.component('navigation', {
	template,
	props: ['navList'],
	data: () => {
		return {
			nav: new Navigation(document.body.clientWidth)
		};
	},
	mounted: function() {
		this.nav.addBodyListener();
	},
	destroyed: function() {
		this.nav.removeBodyListener();
	}
});
