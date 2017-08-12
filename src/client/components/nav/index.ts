/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import Component from 'vue-class-component';
import throttle from 'lodash/throttle';

import './style.scss';
import * as DOMUtil from 'common/util/dom';
import template from './template.html';

const DESKTOP_MODE = 'desktop';

@Component({
	props: ['navList', 'mode'],
	template,
})
class Navigation extends Vue {
	public mode: string;
	public isShowList: boolean = false;
	private isVisible: boolean = false;
	private isFixed: boolean = false;
	private navHeight: number = 0;
	private prevScrollTop: number = 0;
	private listener: () => void;

	/*
	 * lifesycle start
	 */
	protected mounted() {
		this.initNav(this.mode);
	}
	protected destroyed() {
		this.mode === DESKTOP_MODE && document.removeEventListener('scroll', this.listener);
	}
	/*
	 * lifesycle start
	 */

	/*
	 * methods start
	 */
	private initNav(mode = DESKTOP_MODE) {
		if (mode === DESKTOP_MODE) {
			this.isShowList = true;
			this.navHeight = this.$el.clientHeight;

			this.listener = throttle(this.bodyScrollListener, 200);
			document.addEventListener('scroll', this.listener);
		}
	}
	private bodyScrollListener() {
		const currScrollTop = DOMUtil.getDocumentScrollTop();

		if (currScrollTop < this.prevScrollTop) {
			// if scrolling up...
			if (currScrollTop > 0 && this.isFixed) {
				this.isVisible = true;
			} else {
				// scroll to the top
				this.isVisible = false;
				this.isFixed = false;
			}
		} else if (currScrollTop > this.prevScrollTop) {
			// if scrolling down...
			this.isVisible = false;
			currScrollTop > this.navHeight && (this.isFixed = true);
		}

		this.prevScrollTop = currScrollTop;
	}
	private toggleNavShown() {
		this.isShowList = !this.isShowList;
	}
	/*
	 * methods end
	 */
}

export default Vue.component('navigation', Navigation);
