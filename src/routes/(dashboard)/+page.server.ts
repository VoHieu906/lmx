import { type Course } from '$lib/type.js';

export const load = async ({ locals: { pb } }) => {
	async function getCourse() {
		try {
			const courses = await pb.collection<Course>('courses').getFullList({
				expand: 'ratings(course), category',
				filter: 'isPublished = true',
				sort: '-created'
			});
			const plainCourses = courses.map((course) => ({
				...course,
				imageUrl: course.imageUrl ? pb.files.getURL(course, course.imageUrl) : null
			}));
			const coursesWithAverageRatings = plainCourses.map((course) => {
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

export const actions = {
	logout: async (event) => {
		const {
			locals: { pb }
		} = event;
		pb.authStore.clear();
	}
};
