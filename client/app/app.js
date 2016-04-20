/**
 * Created by jack on 16-4-16.
 */
import jQuery from './../assets/lib/jquery.min.js';

if (module.hot) {
	module.hot.accept();
}

console.log('bbbc');

// Navigation Scripts to Show Header on Scroll-Up
jQuery(document).ready(function($) {
	const MQL = 1170;

	// primary navigation slide-in effect
	if ($(window).width() > MQL) {
		let headerHeight = $('.navbar-custom').height();
		$(window).on('scroll', {
			previousTop: 0
		}, () => {
			let currentTop = $(window).scrollTop();
			// check if user is scrolling up
			if (currentTop < this.previousTop) {
				// if scrolling up...
				if (currentTop > 0 && $('.navbar-custom').hasClass('is-fixed')) {
					$('.navbar-custom').addClass('is-visible');
				} else {
					$('.navbar-custom').removeClass('is-visible is-fixed');
				}
			} else if (currentTop > this.previousTop) {
				// if scrolling down...
				$('.navbar-custom').removeClass('is-visible');
				if (currentTop > headerHeight && !$('.navbar-custom').hasClass('is-fixed')) $('.navbar-custom').addClass('is-fixed');
			}
			this.previousTop = currentTop;
		});
	}
});
