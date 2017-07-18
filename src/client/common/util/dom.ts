/**
 * Created by jack on 16-11-17.
 */

export const getDocumentScrollTop: () => number = () => {
	return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
};

export const setPageTitle: (title: string) => void = (title: string) => {
	document.title = title;
};
