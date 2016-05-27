/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';

import template from './nav.html';
import './style.scss';
import PostService from '../../common/service/PostService';

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

		this.initNavList();
	}

	initNavList() {
		this.navList = [];
		this.addNavItem('home', 'Home', '/home');
		this.addNavItem('aboutMe', 'About', '/about');
	}

	addNavItem(name, title, path) {
		this.navList.push({name, title, path});
	}

	addBodyListener() {
		this.isDesktop && document.addEventListener('scroll', this._bodyScrollListener);
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
	data: () => {
		return {
			postList: null,
			nav: new Navigation(document.body.clientWidth)
		};
	},
	activate: function(done) {
		new PostService().queryPostList()
			.then((result = {}) => {
				const latestPost = result.postList[0];
				this.nav.addNavItem('latestPost', 'Latest Post', '/posts/' + latestPost.name);
				done();
			})
			.catch(err => {
				console.error(err);
				done();
			});
	},
	ready: function() {
		this.nav.addBodyListener();
	},
	detached: function() {
		this.nav.removeBodyListener();
	}
});
