import pb from '$lib/pocketbase';
import type { Notification } from '$lib/type';
import { writable, get } from 'svelte/store';
import { userStore } from '$lib/stores/authStore.js'; // Import userStore

function createNotificationStore() {
	const { subscribe, set, update } = writable<Notification[]>([]);
	let isSubscribed = false;
	let unsubscribe: (() => Promise<void>) | null = null;

	return {
		subscribe,
		set,
		update,
		init: async () => {
			try {
				const userId = get(userStore)?.id; // Get the current userId from userStore

				if (!userId) {
					console.error('User ID is not available.');
					return;
				}

				const records = await pb.collection('notifications').getList(1, 50, {
					filter: `user="${userId}" && isRead = false`,
					sort: '-created'
				});

				set(records.items as Notification[]);

				// Only set up real-time subscription in browser environment
				if (typeof window !== 'undefined' && !isSubscribed) {
					// Unsubscribe from previous subscription if it exists
					if (unsubscribe) {
						await unsubscribe(); // Await the unsubscribe promise
					}

					// Subscribe to real-time updates
					unsubscribe = await pb.collection('notifications').subscribe('*', (e) => {
						const currentUserId = get(userStore)?.id; // Get the latest userId from userStore

						// console.log('e.record.user:', e.record.user);
						// console.log('currentUserId:', currentUserId);

						if (e.record.user === currentUserId) {
							if (e.action === 'create') {
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
								update(
									(notifications) =>
										notifications
											.map((notification) =>
												notification.id === e.record.id ? (e.record as Notification) : notification
											)
											.filter((notification) => !notification.isRead) // Filter out read notifications
								);
							} else if (e.action === 'delete') {
								update((notifications) =>
									notifications.filter((notification) => notification.id !== e.record.id)
								);
							}
						}
					});

					isSubscribed = true;
				}
			} catch (error) {
				console.error('Failed to initialize notifications:', error);
			}
		},
		// Cleanup function to unsubscribe from real-time updates
		unsubscribe: async () => {
			if (unsubscribe) {
				await unsubscribe(); // Await the unsubscribe promise
				isSubscribed = false;
				unsubscribe = null;
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
