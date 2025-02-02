export const load = async ({ locals }) => {
	const { pb, user } = locals;
	const userId = user?.id;

	if (!userId) {
		console.log('User ID is not available');
		return { notifications: [] };
	}

	async function getUser() {
		try {
			if (userId) {
				const userInfo = await pb.collection('users').getOne(userId);
				return userInfo;
			}
		} catch (error) {
			console.log('error getting user!', error);
		}
	}

	const [userInfo] = await Promise.all([getUser()]);

	return { userInfo };
};
