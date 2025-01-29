import { type Course } from '$lib/type.js';

export const load = async ({ locals: { user, pb } }) => {
	async function getCourse() {
		try {
			const courses = await pb.collection<Course>('courses').getFullList({
				expand: 'chapters(course), ratings(course), subscriptions(course)',
				filter: `user = "${user?.id}"`,
				sort: '-created'
			});

			const coursesWithAverageRatings = courses.map((course) => {
				const ratings = course.expand?.['ratings(course)'];

				if (ratings && ratings.length > 0) {
					const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
					const averageRating = totalRating / ratings.length;

					return {
						...course,
						averageRating
					};
				}

				return {
					...course,
					averageRating: null
				};
			});
			const sortedCourses = coursesWithAverageRatings
				.filter((course) => course.averageRating !== null) // Remove courses with no ratings
				.sort((a, b) => b.averageRating! - a.averageRating!); // Sort descending

			const highestRatedCourse = sortedCourses[0] || null;
			const lowestRatedCourse = sortedCourses[sortedCourses.length - 1] || null;

			return {
				course: coursesWithAverageRatings,
				highestRatedCourse,
				lowestRatedCourse
			};
		} catch (e) {
			console.error(e);
			return { course: [], highestRatedCourse: null, lowestRatedCourse: null };
		}
	}

	const { course, highestRatedCourse, lowestRatedCourse } = await getCourse();
	return { course, highestRatedCourse, lowestRatedCourse };
};
