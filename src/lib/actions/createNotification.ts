import pb from '$lib/pocketbase';
import type { Notification } from '$lib/type';
import { error } from '@sveltejs/kit';
export async function createNotification(
	userId: string | undefined,
	sMessage: string,
	lMessage?: string
) {
	try {
		const notifications = await pb.collection('notifications').create<Notification>({
			user: userId,
			sMessage,
			lMessage,
			isRead: false
		});

		return notifications;
	} catch (e) {
		console.error('Error when creating notification', e);
		throw error(500, 'Internal Server Error: Failed to create notification');
	}
}
