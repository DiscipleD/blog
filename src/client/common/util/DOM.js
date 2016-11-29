/**
 * Created by jack on 16-11-17.
 */

export const getDocumentScrollTop = () => {
	return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
};
