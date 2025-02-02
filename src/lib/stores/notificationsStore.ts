import pb from '$lib/pocketbase';
import type { Notification } from '$lib/type';

import { writable } from 'svelte/store';

function createNotificationStore() {
	const { subscribe, set, update } = writable<Notification[]>([]);

	return {
		subscribe,
		set,
		update,
		//init : initialize the store, prepare the store for use
		init: async () => {
			try {
				const records = await pb.collection('notifications').getList(1, 50, {
					filter: 'isRead = false',
					sort: '-created'
				});
				set(records.items as Notification[]);

				// Only set up real-time subscription in browser environment
				if (typeof window !== 'undefined') {
					pb.collection('notifications').subscribe('*', (e) => {
						if (e.action === 'create') {
							update((notifications) => [e.record as Notification, ...notifications]);
						} else if (e.action === 'update') {
							update((notifications) =>
								notifications
									.map((notification) =>
										notification.id === e.record.id ? (e.record as Notification) : notification
									)
									.filter((notification) => !notification.isRead)
							);
						} else if (e.action === 'delete') {
							update((notifications) =>
								notifications.filter((notification) => notification.id !== e.record.id)
							);
						}
					});
				}
			} catch (error) {
				console.error('Failed to initialize notifications:', error);
			}
		}
	};
}

export const notificationsStore = createNotificationStore();

export async function markAsRead(notificationId: string) {
	try {
		await pb.collection('notifications').update(notificationId, { isRead: true });
		notificationsStore.update((notifications) =>
			notifications.filter((notification) => notification.id !== notificationId)
		);
	} catch (error) {
		console.error('Failed to mark notification as read:', error);
	}
}
