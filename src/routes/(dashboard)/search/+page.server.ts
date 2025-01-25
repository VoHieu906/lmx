import type { Category, Course } from '$lib/type';
import { fail } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';

export const load = async ({ locals: { pb, user }, url }) => {
	async function getCategories() {
		try {
			const categories = pb.collection('categories').getFullList<Category>({
				sort: '-created'
			});
			return categories;
		} catch (e) {
			const { message: errorMessage } = e as ClientResponseError;

			return fail(400, {
				message: errorMessage
			});
		}
	}
	async function getAllCourses() {
		try {
			const allCourses = await pb.collection('courses').getFullList<Course>({
				filter: `isPublished = true`,
				expand: 'category,chapters(course)',
				sort: '-created'
			});

			const plainCourses = allCourses.map((course) => ({
				...course,
				imageUrl: course.imageUrl ? pb.files.getURL(course, course.imageUrl) : null
			}));

			return plainCourses;
		} catch (e) {
			const { message: errorMessage } = e as ClientResponseError;
			return fail(400, { message: errorMessage });
		}
	}
	const [categories, allCourses] = await Promise.all([getCategories(), getAllCourses()]);
	return {
		categories,
		allCourses
	};
};
