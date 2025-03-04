import type { Course } from '$lib/type';

export const load = async ({ locals: { pb, user } }) => {
	return {
		courses: await pb.collection('courses').getFullList<Course>({
			sort: '-created',
			filter: `user = "${user?.id}"`
		})
	};
};
