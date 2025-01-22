import { categorySchema, descriptionSchema, priceSchema, titleSchema } from '$lib/schema.js';
import { type Category, type Course } from '$lib/type.js';
import { error, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals: { user, pb } }) => {
	const { courseId } = params;
	const userId = user?.id;
	if (!userId) {
		redirect(308, '/');
	}
	async function getCourse() {
		try {
			const course = await pb.collection('courses').getOne<Course>(courseId, {
				expand: 'category, attachments(course), chapters(course)'
			});
			if (course.imageUrl) {
				const imageUrl = pb.files.getURL(course, course.imageUrl);
				course.imageUrl = imageUrl;
			}
			return course;
		} catch (e) {
			// const { status } = e as ClientResponseError;
			// if (status === 404) error(400, 'course does not exist');
			redirect(303, '/');
		}
	}
	async function getCategories() {
		try {
			const categories = await pb.collection('categories').getFullList<Category>({
				sort: '-created'
			});
			return categories;
		} catch (e) {
			// const { status } = e as ClientResponseError;
			// if (status === 404)
			redirect(303, '/');
		}
	}
	const [course, categories] = await Promise.all([getCourse(), getCategories()]);
	const titleForm = await superValidate(course, zod(titleSchema));
	const descriptionForm = await superValidate(course, zod(descriptionSchema));
	const categoryForm = await superValidate(course, zod(categorySchema));
	const priceForm = await superValidate(course, zod(priceSchema));
	return {
		course,
		categories,
		titleForm,
		descriptionForm,
		categoryForm,
		priceForm
	};
};

export const actions = {
	updateTitle: async (event) => {
		const {
			locals: { pb },
			params
		} = event;
		const { courseId } = params;
		const form = await superValidate(event, zod(titleSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		try {
			await pb.collection('courses').update(courseId, form.data);
			return message(form, 'successfully updated course title');
		} catch (e) {
			const { message: errorMessage } = e as ClientResponseError;
			return message(form, errorMessage, {
				status: 400
			});
		}
	},
	updateDescription: async (event) => {
		const {
			locals: { pb },
			params
		} = event;
		const { courseId } = params;
		const form = await superValidate(event, zod(descriptionSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		try {
			await pb.collection('courses').update(courseId, form.data);
			return message(form, 'successfully updated course description');
		} catch (e) {
			const { message: errorMessage } = e as ClientResponseError;
			return message(form, errorMessage, {
				status: 400
			});
		}
	},
	updateImage: async (event) => {
		const {
			locals: { pb },
			params,
			request
		} = event;
		const { courseId } = params;
		const formData = await request.formData();
		const image = formData.get('image');
		if (image instanceof File) {
			try {
				await pb.collection('courses').update(courseId, { imageUrl: image });
				return { message: 'successfully updated course image' };
			} catch (e) {
				const { message: errorMessage } = e as ClientResponseError;
				return fail(400, {
					message: errorMessage
				});
			}
		}
	},
	updateCategory: async (event) => {
		const {
			locals: { pb },
			params
		} = event;
		const { courseId } = params;

		const form = await superValidate(event, zod(categorySchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await pb.collection('courses').update(courseId, form.data);
			return message(form, 'successfully updated course category');
		} catch (e) {
			const { message: errorMessage } = e as ClientResponseError;

			return message(form, errorMessage, {
				status: 400
			});
		}
	},
	updatePrice: async (event) => {
		const {
			locals: { pb },
			params
		} = event;
		const { courseId } = params;
		const form = await superValidate(event, zod(priceSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await pb.collection('courses').update(courseId, form.data);
			return message(form, 'successfully updated course price');
		} catch (e) {
			const { message: errorMessage } = e as ClientResponseError;

			return message(form, errorMessage, {
				status: 400
			});
		}
	}
};
