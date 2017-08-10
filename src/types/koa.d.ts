declare module 'web-push' {
  export var sendNotification: (subscription: SubscriptionRecord, data: any, options?: any) => Promise<any>
}
