import type { Course, Subscription } from '$lib/type';
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
	async function getSubscription() {
		try {
			const subscription = await pb
				.collection('subscriptions')
				.getFirstListItem<Subscription>(`user = "${userId}" && course = "${courseId}"`);
			return subscription;
		} catch (e) {
			return null;
		}
	}

	const [course, subscription] = await Promise.all([getCourse(), getSubscription()]);
	return { course, subscription, isSubscribed: !!subscription };
};
export const actions = {};
