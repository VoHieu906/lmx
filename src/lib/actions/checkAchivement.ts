import pb from '$lib/pocketbase';
import { userStore } from '$lib/stores/authStore.js';
import type { Achievement, UserAchievement } from '$lib/type';
import { get } from 'svelte/store';
import { calculateProgress } from './calculateProgress';
export async function checkAchievement(userId: string, achievementTitle: string) {
	console.log(achievementTitle);

	console.log('userId: ', userId);
	try {
		if (userId) {
			const user = await pb.collection('users').getOne(userId, {
				expand: 'subscriptions(user).course,ratings(user),comments(user)'
			});

			const achievements = await pb.collection('achievements').getFullList<Achievement>({
				filter: `title = "${achievementTitle}"` // Apply the filter
			});

			if (achievements.length === 0) {
				throw new Error(`Achievement with title "${achievementTitle}" not found`);
			}

			const achievement = achievements[0];

			if (!achievement) {
				throw new Error(`Achievement "${achievementTitle}" not found`);
			}
			const userAchievements = await pb
				.collection('user_achievements')
				.getFullList<UserAchievement>({
					filter: `user = "${userId}" && achievement = "${achievement.id}"`
				});

			const userAchievement = userAchievements[0];
			const progress = calculateProgress(user, achievement);
			const unlocked = progress >= achievement.max_progress;

			if (userAchievement) {
				if (progress >= userAchievement.progress || unlocked !== userAchievement.unlocked) {
					await pb
						.collection('user_achievements')
						.update(userAchievement.id, { progress, unlocked });
					console.log('Update exist achievement');
				}
			} else {
				await pb.collection('user_achievements').create({
					user: userId,
					achievement: achievement.id,
					progress,
					unlocked
				});
				console.log('created new Achievement!');
			}
			return { ...achievement, progress, unlocked };
		}
	} catch (error) {
		console.error('Error fetching!', error);
	}
}
