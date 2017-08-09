/**
 * Created by jack on 16-9-11.
 */

import Vue, { ComponentOptions } from 'vue';
import throttle from 'lodash/throttle';

import * as DOMUtil from 'common/util/DOM';
import './style.scss';
import template from './template.html';

interface ILazyLoadingComponent extends Vue {
	listener: () => void;
	loadFn: () => void;
	scrollFn: () => void;
	isLoading: boolean;
	isFinished: boolean;
	listenerElement: Element | Document;
	listenerTargetSelector: string;
	isScrollBottom: (element: Element | Document) => boolean;
	addListener: (element: Element | Document) => void;
	removeListener: (element: Element | Document) => void;
}

export default Vue.component('lazyLoading', {
	template,
	props: {
		loadFn: {
			type: Function,
			require: true,
		},
		isLoading: {
			type: Boolean,
			require: true,
		},
		isFinished: {
			type: Boolean,
		},
		listenerTargetSelector: {
			type: String,
		},
		finishedMessage: {
			type: String,
			default: '没有更多了...',
		},
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
			return scrollTop + element.offsetHeight >= element.scrollHeight - 50;
		},
		scrollFn() {
			// when loading, don't call loadFn again
			if (this.isLoading) return;
			!this.isFinished && this.isScrollBottom(this.listenerElement) && this.loadFn();
		},
		removeListener(element) {
			element.removeEventListener('scroll', this.listener);
		},
	},
	watch: {
		isLoading(newValue) {
			// when load finished, call scrollFn to test element is filled the target element
			// if not call loadFn another time
			if (newValue === false) {
				// give vue time to render element.
				setTimeout(this.scrollFn, 0);
			}
		},
	},
	mounted() {
		this.listenerElement = this.listenerTargetSelector ?
			document.querySelector(this.listenerTargetSelector) || document :
			this.$el;
		this.addListener(this.listenerElement);
		this.scrollFn();
	},
	destroyed() {
		this.removeListener(this.listenerElement);
	},
} as ComponentOptions<ILazyLoadingComponent>);
