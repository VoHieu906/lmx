import type { Course } from '$lib/type';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params, locals: { user, pb } }) => {
	const { courseId } = params;
	const userId = user?.id;
	if (!userId) {
		redirect(308, '/');
	}
	async function getCourse() {
		try {
			const course = await pb.collection('courses').getOne<Course>(courseId, {
				expand: 'chapters(course),user,subscriptions(course)'
			});
			if (course.imageUrl) {
				const imageUrl = pb.files.getURL(course, course.imageUrl);
				course.imageUrl = imageUrl;
			}
			return course;
		} catch (e) {
			redirect(303, '/');
		}
	}
	async function checkSubscription() {
		try {
			const subscriptions = await pb.collection('subscriptions').getFullList({
				filter: `user = "${userId}" && course = "${courseId}"`
			});
			return subscriptions.length > 0; // Return true if subscription exists
		} catch (e) {
			return false;
		}
	}
	const [course, isSubscribed] = await Promise.all([getCourse(), checkSubscription()]);
	return { course, isSubscribed };
};
