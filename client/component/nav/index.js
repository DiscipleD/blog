/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import template from './nav.html';
import './style.scss';

class Navigation {
	constructor() {
		const MinScreenWidth = 768;
		this.previousTop = 0;
		this.isVisible = false;
		this.isFixed = false;
		this._bodyScrollListener = this._bodyScrollListener.bind(this);

		return {
			template,
			data: () => {
				return {
					data: this
				};
			},
			ready: () => {
				MinScreenWidth < document.body.clientWidth && document.addEventListener('scroll', this._bodyScrollListener);
			},
			detached: () => {
				MinScreenWidth < document.body.clientWidth && document.removeEventListener('scroll', this._bodyScrollListener);
			}
		};
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
		}chan
		this.previousTop = currentTop;
	}
}

export default Vue.component('navigation', new Navigation());
