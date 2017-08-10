interface ShareInfo {
	title: string,
	url?: string,
	text?: string
}

interface Navigator {
	readonly share: (o: ShareInfo) => Promise<void>
}

interface SubscriptionRecord {
	endpoint: string;
	key: {
		p256dh: string,
		auth: string,
	};
}
