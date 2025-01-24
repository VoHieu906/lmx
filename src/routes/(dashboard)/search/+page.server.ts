import { getCourses } from '$lib/actions/getCourses';
import type { Category } from '$lib/type';

export const load = async ({ locals: { pb, user }, url }) => {
	const categoryId = url.searchParams.get('categoryId') || '';
	const userId = user?.id;
	const title = url.searchParams.get('title') || '';
	console.log(url.searchParams.get('categoryId'));
	function getCategories() {
		const categories = pb.collection('categories').getFullList<Category>({
			sort: '-created'
		});
		return categories;
	}
	const [categories, courses] = await Promise.all([
		getCategories(),
		getCourses({ categoryId, pb, title, userId })
	]);
	console.log('🚀 ~ load ~ courses:', courses);

	return {
		categories,
		courses
	};
};
export const actions = {
	getAllCourses: async () => {}
};
