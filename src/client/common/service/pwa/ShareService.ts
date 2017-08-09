/**
 * Created by d.d on 18/07/2017.
 */

export const isSupportShareAPI = () => !!navigator.share;

export const sharePage = () => {
	navigator
		.share({
			title: document.title,
			text: document.title,
			url: window.location.href,
		})
		.then(() => console.info('Successful share.'))
		.catch((error: Error) => console.log('Error sharing:', error));
};
