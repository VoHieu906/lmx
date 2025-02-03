import { type Course } from '$lib/type.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { user, pb } }) => {
	const userId = user?.id;
	if (!userId) {
		redirect(308, '/');
	}
	async function getCourse() {
		try {
			const courses = await pb.collection<Course>('courses').getFullList({
				expand: 'ratings(course), category, chapters(course)',
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

			// Separate courses into free and paid categories
			const freeCourses: Course[] = [];
			const paidCourses: Course[] = [];

			coursesWithAverageRatings.forEach((course) => {
				if (course.isFree) {
					freeCourses.push(course);
				} else {
					paidCourses.push(course);
				}
			});

			// Get the highest and lowest rated courses from all courses
			const allRatedCourses = coursesWithAverageRatings
				.filter((course) => course.averageRating !== null) // Remove courses with no ratings
				.sort((a, b) => b.averageRating! - a.averageRating!); // Sort descending

			const highestRatedCourse = allRatedCourses[0] || null;
			const lowestRatedCourse = allRatedCourses[allRatedCourses.length - 1] || null;

			return {
				course: coursesWithAverageRatings,
				freeCourses,
				paidCourses,
				highestRatedCourse,
				lowestRatedCourse
			};
		} catch (e) {
			console.error(e);
			return {
				course: [],
				freeCourses: [],
				paidCourses: [],
				highestRatedCourse: null,
				lowestRatedCourse: null
			};
		}
	}
	async function getSubscribedCourses() {
		try {
			const subscribedCourses = await pb.collection('subscriptions').getFullList({
				filter: `user = "${userId}"`,
				expand: 'course'
			});

			// Loop through each subscription and update the imageUrl of the course
			subscribedCourses.forEach((subscription) => {
				const course = subscription?.expand?.course;

				if (course?.imageUrl) {
					course.imageUrl = pb.files.getURL(course, course.imageUrl);
				}
			});

			return subscribedCourses;
		} catch (e) {
			console.log('Error:', e);
		}
	}

	const { course, freeCourses, paidCourses, highestRatedCourse, lowestRatedCourse } =
		await getCourse();
	const subscribedCourses = await getSubscribedCourses();
	return {
		course,
		freeCourses,
		paidCourses,
		highestRatedCourse,
		lowestRatedCourse,
		subscribedCourses
	};
};

export const actions = {
	logout: async (event) => {
		const {
			locals: { pb }
		} = event;

		pb.authStore.clear();
	}
};
