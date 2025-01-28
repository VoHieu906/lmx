import { chapterCommentSchema } from '$lib/schema.js';
import { type Subscription, type Chapter, type Course, type Comment } from '$lib/type';
import { redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals: { user, pb } }) => {
	const { courseId, chapterId } = params;
	const userId = user?.id;
	if (!userId) {
		redirect(308, '/');
	}

	async function getCourse() {
		try {
			const course = await pb.collection('courses').getOne<Course>(courseId, {
				expand: 'chapters(course),user'
			});

			if (course?.imageUrl) {
				course.imageUrl = pb.files.getURL(course, course.imageUrl);
			}

			if (course?.expand?.['chapters(course)']) {
				course.expand['chapters(course)'] = course.expand['chapters(course)'].map((chapter) => {
					if (chapter.videoUrl) {
						chapter.videoUrl = pb.files.getURL(chapter, chapter.videoUrl);
					}
					if (chapter.thumbnailUrl) {
						chapter.thumbnailUrl = pb.files.getURL(chapter, chapter.thumbnailUrl);
					}
					return chapter;
				});
			}

			return course;
		} catch (e) {
			console.log('error:', e);
		}
	}
	async function getSubscription() {
		try {
			const subscription = await pb
				.collection('subscriptions')
				.getFirstListItem<Subscription>(`user = "${userId}" && course = "${courseId}"`);
			return subscription;
		} catch (e) {
			return null;
		}
	}
	async function getChapter() {
		try {
			const chapter = await pb.collection('chapters').getOne<Chapter>(chapterId, {
				expand: 'course, attachments(chapter)'
			});
			if (chapter?.videoUrl) {
				const videoUrl = pb.files.getURL(chapter, chapter.videoUrl);
				chapter.videoUrl = videoUrl;
			}
			return chapter;
		} catch (e) {
			console.log('error:', e);
		}
	}
	async function getComment() {
		try {
			const comment = await pb.collection('comments').getFullList<Comment>({
				filter: `chapter = "${chapterId}"`,
				sort: '-created',
				expand: 'user'
			});
			return comment;
		} catch (e) {
			console.log('error:', e);
		}
	}
	const [chapter, course, subscription, comment] = await Promise.all([
		getChapter(),
		getCourse(),
		getSubscription(),
		getComment()
	]);
	const chapterCommentForm = await superValidate(zod(chapterCommentSchema));
	return {
		chapter,
		course,
		subscription,
		isSubscribed: !!subscription,
		chapterCommentForm,
		comment
	};
};
export const actions = {
	createComment: async (event) => {
		const {
			locals: { pb, user },
			params,
			request
		} = event;

		const { chapterId } = params;

		// Get the form data once and work with it
		const formData = await request.formData();

		// Validate the comment content using formData
		const commentContent = formData.get('comment') as string | null;

		if (!commentContent) {
			return fail(400, { message: 'Comment is required' });
		}

		console.log('Form Data: ', commentContent); // Debug the comment data

		// Extract file (if any) from the formData
		const file = formData.get('file') as File | null;

		// Debug the file
		console.log('Uploaded file: ', file);

		const commentData: any = {
			user: user?.id,
			chapter: chapterId,
			content: commentContent
		};

		if (file && file.size > 0) {
			commentData.file = file;
			console.log('File attached to comment: ', file);
		}

		try {
			// Create the comment in the database (with or without file)
			await pb.collection('comments').create(commentData);

			return {
				message: 'Comment created successfully!'
			};
		} catch (e) {
			console.error('Error creating comment: ', e); // Log error for debugging
			return fail(500, {
				message: 'Failed to create comment. Please try again.'
			});
		}
	}
};
