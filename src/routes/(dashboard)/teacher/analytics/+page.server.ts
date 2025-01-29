import { type Course } from '$lib/type.js';

export const load = async ({ locals: { user, pb } }) => {
	async function getCourse() {
		try {
			const courses = await pb.collection<Course>('courses').getFullList({
				expand: 'chapters(course), ratings(course)',
				filter: `user = "${user?.id}"`,
				sort: '-created'
			});

			const coursesWithAverageRatings = courses.map((course) => {
				const ratings = course.expand?.['ratings(course)']; // Ensure expand exists

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
					averageRating: null // No ratings available
				};
			});
			const sortedCourses = coursesWithAverageRatings
				.filter((course) => course.averageRating !== null) // Remove courses with no ratings
				.sort((a, b) => b.averageRating! - a.averageRating!); // Sort descending

			// Get the highest and lowest rated courses
			const highestRatedCourse = sortedCourses[0] || null;
			const lowestRatedCourse = sortedCourses[sortedCourses.length - 1] || null;

			return {
				course: coursesWithAverageRatings, // Return all courses with average ratings
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
