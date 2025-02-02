import pb from '$lib/pocketbase';
import type { Comment } from '$lib/type';
import { writable } from 'svelte/store';

function createCommentsStore() {
	const { subscribe, set, update } = writable<Comment[]>([]);
	return {
		subscribe,
		set,
		update,
		init: async (chapterId: string) => {
			try {
				const records = await pb.collection('comments').getFullList({
					filter: `chapter = "${chapterId}"`,
					expand: 'user',
					sort: '-created'
				});
				set(records as Comment[]);
				if (typeof window !== 'undefined') {
					pb.collection('comments').subscribe('*', async (e) => {
						if (e.record.chapter !== chapterId) return;

						if (e.action === 'create' || e.action === 'update') {
							const fullRecord = await pb
								.collection('comments')
								.getOne(e.record.id, { expand: 'user' }); // Fetch full data

							update((comments) => [
								fullRecord as Comment,
								...comments.filter((c) => c.id !== e.record.id) // Remove old duplicate before adding
							]);
						} else if (e.action === 'delete') {
							update((comments) => comments.filter((comment) => comment.id !== e.record.id));
						}
					});
				}
			} catch (error) {
				console.error('Failed to initialize comments:', error);
			}
		}
	};
}
export const commentsStore = createCommentsStore();
