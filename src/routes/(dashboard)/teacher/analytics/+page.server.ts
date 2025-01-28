import { type Course } from '$lib/type.js';

export const load = async ({ locals: { user, pb } }) => {
	async function getCourse() {
		try {
			const course = await pb.collection<Course>('courses').getFullList({
				expand: 'chapters(course)',
				filter: `user = "${user?.id}"`,
				sort: '-created'
			});
			return course;
		} catch (e) {}
	}
	const [course] = await Promise.all([getCourse()]);
	return { course };
};
