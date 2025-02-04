import type { Achievement, Subscription } from '$lib/type';

export function calculateProgress(user: any, achievement: Achievement) {
	switch (achievement.title) {
		case 'First steps': {
			const completedCourses =
				user.expand?.['subscriptions(user)']?.filter((sub: any) => sub.progress === 100).length ||
				0;
			return completedCourses > 0 ? 1 : 0;
		}
		case 'God of communication':
			console.log('Comment time:', user.expand?.['comments(user)']?.length);
			return Math.min(user.expand?.['comments(user)']?.length || 0, 50);
		case 'Lord of Judgment':
			return Math.min(user.expand?.['ratings(user)']?.length || 0, 5);
		default:
			console.log("Can't find title");
			return 0;
	}
}
