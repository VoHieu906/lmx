import { type Rating, type Course } from '$lib/type.js';

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
	async function getAverageRating() {
		try {
			const ratings = await pb.collection<Rating>('ratings').getFullList({
				filter: `user = "${user?.id}"`
			});
			const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
			const formattedAvgRating = avgRating.toFixed(1); // returns a string
			return parseFloat(formattedAvgRating); // Convert back to float if necessary
		} catch (e) {
			console.log(e);
		}
	}

	const [course, avgRating] = await Promise.all([getCourse(), getAverageRating()]);
	return { course, avgRating };
};
