/**
 * Created by jack on 16-9-11.
 */

import Vue from 'vue';
import Component from 'vue-class-component';
import throttle from 'lodash/throttle';

import * as DOMUtil from 'common/util/DOM';
import './style.scss';
import template from './template.html';

@Component({
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
	watch: {
		isLoading(newValue) {
			// when load finished, call scrollFn to test element is filled the target element
			// if not call loadFn another time
			if (newValue === false) {
				// give vue time to render element.
				setTimeout((this as LazyLoading).scrollFn, 0);
			}
		},
	},
	template,
})
class LazyLoading extends Vue {
	public loadFn: () => void;
	private listener: () => void;
	private isLoading: boolean;
	private isFinished: boolean;
	private listenerElement: Element | Document;
	private listenerTargetSelector: string;

	/*
	 * lifesycle start
	 */
	protected mounted() {
		this.listenerElement = this.listenerTargetSelector ?
			document.querySelector(this.listenerTargetSelector) || document :
			this.$el;
		this.addListener(this.listenerElement);
		this.scrollFn();
	}
	protected destroyed() {
		this.removeListener(this.listenerElement);
	}
	/*
	 * lifesycle end
	 */

	/*
	 * methods start
	 */
	protected addListener(element: Element | Document) {
		this.listener = throttle(this.scrollFn, 200);
		element.addEventListener('scroll', this.listener);
	}
	protected removeListener(element: Element | Document) {
		element.removeEventListener('scroll', this.listener);
	}
	protected isScrollBottom(element: HTMLElement | Document) {
		let scrollTop: number;
		if (element === document) {
			element = document.body;
			scrollTop = DOMUtil.getDocumentScrollTop();
		} else {
			scrollTop = (element as HTMLElement).scrollTop;
		}
		return scrollTop + (element as HTMLElement).offsetHeight >= (element as HTMLElement).scrollHeight - 50;
	}
	protected scrollFn() {
		// when loading, don't call loadFn again
		if (this.isLoading) return;
		!this.isFinished && this.isScrollBottom(this.listenerElement as HTMLElement) && this.loadFn();
	}
	/*
	 * methods end
	 */
}

export default Vue.component('lazyLoading', LazyLoading);
