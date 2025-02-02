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
		init: async (userId: string) => {
			try {
				const records = await pb.collection('notifications').getList(1, 50, {
					filter: `user="${userId}" && isRead = false`,
					sort: '-created'
				});

				set(records.items as Notification[]);

				// Only set up real-time subscription in browser environment
				if (typeof window !== 'undefined') {
					pb.collection('notifications').subscribe('*', (e) => {
						// Handle actions for notifications
						console.log('e.record.user:', e.record.user);
						console.log('userId:', userId);
						if (e.record.user === userId) {
							if (e.action === 'create') {
								// Only add new notification if it's not already in the store
								update((notifications) => {
									const newNotification = e.record as Notification;
									if (
										!notifications.some((notification) => notification.id === newNotification.id)
									) {
										return [newNotification, ...notifications];
									}
									return notifications;
								});
							} else if (e.action === 'update') {
								// Handle update of notifications
								update(
									(notifications) =>
										notifications
											.map((notification) =>
												notification.id === e.record.id ? (e.record as Notification) : notification
											)
											.filter((notification) => !notification.isRead) // Filter out read notifications
								);
							} else if (e.action === 'delete') {
								// Handle deletion of notifications
								update((notifications) =>
									notifications.filter((notification) => notification.id !== e.record.id)
								);
							}
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
