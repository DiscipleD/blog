/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';

import template from './nav.html';
import './style.scss';
import PostService from '../../common/service/PostService';

const MinScreenWidth = 768;

class Navigation {
	constructor() {
		this.previousTop = 0;
		this.isVisible = false;
		this.isFixed = false;
		this.bodyScrollListener = this.bodyScrollListener.bind(this);
	}

	bodyScrollListener() {
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
	data: () => {
		return {
			postList: null,
			data: new Navigation()
		};
	},
	activate: function(done) {
		new PostService().queryPostList().then(result => {
			this.postList = result.postList;
			done();
		});
	},
	ready: function() {
		MinScreenWidth < document.body.clientWidth && document.addEventListener('scroll', this.data.bodyScrollListener);
	},
	detached: function() {
		MinScreenWidth < document.body.clientWidth && document.removeEventListener('scroll', this.data.bodyScrollListener);
	}
});
