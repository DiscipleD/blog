/**
 * Created by jack on 16-9-11.
 */

import Vue from 'vue';
import throttle from 'lodash/throttle';

import * as DOMUtil from 'common/util/DOM';
import './style.scss';
import template from './template.html';

export default Vue.component('lazyLoading', {
	template,
	props: {
		loadFn: {
			type: Function,
			require: true
		},
		isLoading: {
			type: Boolean,
			require: true
		},
		isFinished: {
			type: Boolean
		},
		listenerTargetSelector: {
			type: String
		},
		finishedMessage: {
			type: String,
			default: '没有更多了...'
		}
	},
	methods: {
		addListener(element) {
			this.listener = throttle(this.scrollFn, 200);
			element.addEventListener('scroll', this.listener);
		},
		isScrollBottom(element) {
			let scrollTop;
			if (element === document) {
				element = document.body;
				scrollTop = DOMUtil.getDocumentScrollTop();
			} else {
				scrollTop = element.scrollTop;
			}
			return scrollTop + element.offsetHeight >= element.scrollHeight;
		},
		scrollFn() {
			!this.isFinished && this.isScrollBottom(this.listenerElement) && this.loadFn();
		},
		removeListener(element) {
			element.removeEventListener('scroll', this.listener);
		}
	},
	mounted: function() {
		this.listenerElement = this.listenerTargetSelector ? document.querySelector(this.listenerTargetSelector) || document : this.$el;
		this.addListener(this.listenerElement);
		this.loadFn();
	},
	destroyed() {
		this.removeListener(this.listenerElement);
	}
});
