import { checkAchievement } from '$lib/actions/checkAchivement.js';
import { userStore } from '$lib/stores/authStore.js';
import { type UserAchievement, type Achievement } from '$lib/type.js';
import { get } from 'svelte/store';

export const load = async ({ locals }) => {
	const { pb, user } = locals;
	const userId = user?.id;
	if (userId) {
		await checkAchievement(userId, 'Lord of Judgment');
		await checkAchievement(userId, 'Streak Champion');
		await checkAchievement(userId, 'God of communication');
		await checkAchievement(userId, 'Course Master');
		await checkAchievement(userId, 'First steps');
	}

	async function getUserActions() {
		try {
			if (userId) {
				const user = await pb.collection('users').getOne(userId, {
					expand: 'subscriptions(user).course,ratings(user), comments(user)'
				});
				return user;
			}
		} catch (error) {
			console.error('Error fetching!', error);
			return [];
		}
	}
	async function getUserAchievement() {
		try {
			const achievement = pb
				.collection('user_achievements')
				.getFullList<UserAchievement>({ filter: `user = "${userId}"`, expand: 'achievement' });
			return achievement;
		} catch (error) {
			console.error('Error fetching!', error);
			return [];
		}
	}
	async function getAllAchievements() {
		try {
			const allAchievements = pb.collection('achievements').getFullList();
			return allAchievements;
		} catch (error) {
			console.error('Error fetching!', error);
			return [];
		}
	}
	const [userAchievement, userActions, allAchievements] = await Promise.all([
		getUserAchievement(),
		getUserActions(),
		getAllAchievements()
	]);
	return { userAchievement, userActions, allAchievements };
};
