import type { Course, Rating, Subscription } from '$lib/type';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals: { user, pb } }) => {
	const { courseId } = params;
	const userId = user?.id;
	if (!userId) {
		redirect(308, '/');
	}
	async function getCourse() {
		try {
			const course = await pb.collection('courses').getOne<Course>(courseId, {
				expand: 'chapters(course),user,subscriptions(course), ratings(course), category'
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
	async function getRating() {
		try {
			const rating = await pb
				.collection('ratings')
				.getFirstListItem<Rating>(`user = "${userId}" && course = "${courseId}"`);

			if (!rating) {
				return 0;
			}

			return rating.rating; // Assuming you want the rating value, not the entire object
		} catch (e) {
			console.log('Error fetching rating:', e);
			return 0;
		}
	}
	async function getAverageRating() {
		try {
			const ratings = await pb.collection('ratings').getFullList({
				filter: `course = "${courseId}"`
			});
			const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
			const formattedAvgRating = avgRating.toFixed(1);
			return parseFloat(formattedAvgRating);
		} catch (e) {
			console.log(e);
		}
	}
	const [course, subscription, rating, avgRating] = await Promise.all([
		getCourse(),
		getSubscription(),
		getRating(),
		getAverageRating()
	]);
	return { course, subscription, isSubscribed: !!subscription, rating, avgRating };
};
export const actions = {};
