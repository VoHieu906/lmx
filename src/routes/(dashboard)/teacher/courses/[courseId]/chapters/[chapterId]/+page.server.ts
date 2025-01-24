import { chapterAccessSchema, chapterDescriptionSchema, chapterTitleSchema } from '$lib/schema.js';
import type { Chapter, Course } from '$lib/type.js';
import { error, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals: { pb } }) => {
	const chapterId = params.chapterId;
	async function getChapter() {
		try {
			const chapter = await pb.collection('chapters').getOne<Chapter>(chapterId);
			if (chapter.videoUrl) {
				const videoUrl = pb.files.getURL(chapter, chapter.videoUrl);
				chapter.videoUrl = videoUrl;
			}
			return chapter;
		} catch (e) {
			const { status } = e as ClientResponseError;

			if (status === 404) error(404, 'chapter does not exist');
			redirect(308, '/');
		}
	}
	const chapter = await getChapter();
	const chapterTitleForm = await superValidate(chapter, zod(chapterTitleSchema));
	const chapterAccessForm = await superValidate(chapter, zod(chapterAccessSchema));
	const chapterDescriptionForm = await superValidate(chapter, zod(chapterDescriptionSchema));
	return { chapter, chapterTitleForm, chapterAccessForm, chapterDescriptionForm };
};
export const actions = {
	updateTitle: async (event) => {
		const {
			locals: { pb },
			params
		} = event;
		const { chapterId } = params;

		const form = await superValidate(event, zod(chapterTitleSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await pb.collection('chapters').update(chapterId, form.data);
			return message(form, 'successfully updated chapter title');
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
		const { chapterId } = params;

		const form = await superValidate(event, zod(chapterDescriptionSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		try {
			await pb.collection('chapters').update(chapterId, form.data);
			return message(form, 'successfully updated chapter description');
		} catch (e) {
			const { message: errorMessage } = e as ClientResponseError;

			return message(form, errorMessage, {
				status: 400
			});
		}
	},
	updateAccess: async (event) => {
		const {
			locals: { pb },
			params
		} = event;
		const { chapterId } = params;

		const form = await superValidate(event, zod(chapterAccessSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await pb.collection('chapters').update(chapterId, form.data);
			return message(form, 'successfully updated chapter access settings');
		} catch (e) {
			const { message: errorMessage } = e as ClientResponseError;

			return message(form, errorMessage, {
				status: 400
			});
		}
	},
	updateVideo: async (event) => {
		const {
			locals: { pb },
			params,
			request
		} = event;
		const { chapterId } = params;

		const formData = await request.formData();
		const video = formData.get('video') as File;

		if (!video) {
			return fail(400, {
				message: 'Video is required'
			});
		}

		try {
			const formData = new FormData();
			// The key 'videoUrl' must match your PocketBase collection field name
			formData.append('videoUrl', video);

			await pb.collection('chapters').update(chapterId, formData);
			return {
				message: 'successfully updated chapter video'
			};
		} catch (e) {
			const { message: errorMessage } = e as ClientResponseError;
			return fail(400, {
				message: errorMessage
			});
		}
	},
	deleteChapter: async (event) => {
		const {
			locals: { pb },
			params
		} = event;
		const { chapterId, courseId } = params;

		try {
			// Delete the chapter from the 'chapters' collection
			await pb.collection('chapters').delete(chapterId);

			// Check if there are any published chapters in the course
			const isPublishedChapterInCourse = await pb.collection('chapters').getFullList({
				filter: `course = "${courseId}" && isPublished = "${true}" `
			});

			// If no published chapters remain in the course, unpublish the course
			if (!isPublishedChapterInCourse.length) {
				await pb.collection('courses').update<Course>(courseId, {
					isPublished: false
				});
			}

			return { message: 'Successfully deleted chapter' };
		} catch (e) {
			const { message: errorMessage } = e as ClientResponseError;

			return fail(400, {
				message: errorMessage
			});
		}
	},
	updatePublish: async (event) => {
		const {
			locals: { pb },
			params
		} = event;
		const { chapterId, courseId } = params;
		try {
			const chapter = await pb.collection('chapters').getOne<Chapter>(chapterId);
			if (chapter.isPublished) {
				await pb.collection('chapters').update(chapterId, {
					isPublished: false
				});
				const isPublishedChapterInCourse = await pb.collection('chapters').getFullList({
					filter: `course = "${courseId}" && isPublished = "${true}" `
				});

				if (!isPublishedChapterInCourse.length) {
					await pb.collection('courses').update<Course>(courseId, {
						isPublished: false
					});
				}
				return { message: 'successfully unpublished chapter' };
			} else {
				await pb.collection('chapters').update(chapterId, {
					isPublished: true
				});
				return { message: 'successfully published chapter' };
			}
		} catch (e) {
			const { message: errorMessage } = e as ClientResponseError;

			return fail(400, {
				message: errorMessage
			});
		}
	}
};
