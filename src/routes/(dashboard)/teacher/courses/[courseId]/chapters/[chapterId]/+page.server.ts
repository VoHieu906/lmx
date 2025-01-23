import { chapterAccessSchema, chapterTitleSchema } from '$lib/schema.js';
import type { Chapter } from '$lib/type.js';
import { error, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals: { pb } }) => {
	const chapterId = params.chapterId;
	async function getChapter() {
		try {
			const chapter = await pb.collection('chapters').getOne<Chapter>(chapterId, {
				expand: 'muxData(chapterId)'
			});
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
	return { chapter, chapterTitleForm, chapterAccessForm };
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
	}
};
