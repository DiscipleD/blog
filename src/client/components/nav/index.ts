/**
 * Created by jack on 16-4-21.
 */

import Vue, { ComponentOptions } from 'vue';
import throttle from 'lodash/throttle';

import './style.scss';
import * as DOMUtil from 'common/util/DOM';
import template from './template.html';

const DESKTOP_MODE = 'desktop';

interface NavigationComponent extends Vue {
	mode: string,
	isShowList: boolean,
	isVisible: boolean,
	isFixed: boolean,
	_navHeight: number,
	_prevScrollTop: number,
	_listener: () => void,
	bodyScrollListener: () => void,
	_initNav: (mode: string) => void
}

export default Vue.component('navigation', {
	template,
	props: ['navList', 'mode'],
	data: () => ({
		isShowList: false,
		isVisible: false,
		isFixed: false,
		_navHeight: 0,
		_prevScrollTop: 0
	}),
	methods: {
		_initNav(mode = DESKTOP_MODE) {
			if (mode === DESKTOP_MODE) {
				this.isShowList = true;
				this._navHeight = this.$el.clientHeight;

				this._listener = throttle(this.bodyScrollListener, 200);
				document.addEventListener('scroll', this._listener);
			}
		},
		bodyScrollListener() {
			const currScrollTop = DOMUtil.getDocumentScrollTop();

			if (currScrollTop < this._prevScrollTop) {
				// if scrolling up...
				if (currScrollTop > 0 && this.isFixed) {
					this.isVisible = true;
				} else {
					// scroll to the top
					this.isVisible = false;
					this.isFixed = false;
				}
			} else if (currScrollTop > this._prevScrollTop) {
				// if scrolling down...
				this.isVisible = false;
				currScrollTop > this._navHeight && (this.isFixed = true);
			}

			this._prevScrollTop = currScrollTop;
		},
		toggleNavShown: function() {
			this.isShowList = !this.isShowList;
		}
	},
	mounted() {
		this._initNav(this.mode);
	},
	destroyed() {
		this.mode === DESKTOP_MODE && document.removeEventListener('scroll', this._listener);
	}
} as ComponentOptions<NavigationComponent>);
