/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 13/02/2017
 */

const NOTIFICATION_API = 'Notification';
const PERMISSION_GRANTED = 'granted';
const NOTIFICATION_START_TIME = 23;
const NOTIFICATION_END_TIME = 6;
const DELAY_MINUTES = 5;
const NOTIFICATION = {
	title: '夜深了',
	delay: DELAY_MINUTES * 60 * 1000, // 5 minutes
	options: {
		body: '该睡觉了...',
		icon: 'src/client/assets/img/favicon.ico'
	}
};

const isSupportNotification = () => NOTIFICATION_API in window;
const getPermission = () => Notification.permission;
const isPermissionGranted = permission => permission === PERMISSION_GRANTED;

const registerNotification = () => {
	const now = new Date();
	const nowHour = now.getHours();
	// Time in the notification time block
	if (nowHour <= NOTIFICATION_END_TIME || nowHour >= NOTIFICATION_START_TIME) {
		// Show notification 5 minutes later
		setTimeout(() => new Notification(NOTIFICATION.title, NOTIFICATION.options), NOTIFICATION.delay);
	} else {
		// Show notification at 11 o'clock.
		const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), NOTIFICATION_START_TIME, DELAY_MINUTES);
		setTimeout(() => new Notification(NOTIFICATION.title, NOTIFICATION.options), start.valueOf() - now.valueOf());
	}
};

if (isSupportNotification()) {
	if (isPermissionGranted(getPermission())) {
		registerNotification();
	} else {
		Notification
			.requestPermission()
			.then(isPermissionGranted)
			.then(granted => granted && registerNotification());
	}
} else {
	console.info('Browser not support Notification.');
}
