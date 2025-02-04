import { checkAchievement } from '$lib/actions/checkAchivement.js';
import { createNotification } from '$lib/actions/createNotification.js';
import { chapterCommentSchema } from '$lib/schema.js';
import { type Subscription, type Chapter, type Course, type Comment } from '$lib/type';
import { redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

type CommentWithReplies = Comment & { replies: Comment[] };

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

	// Function to get subscription info
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

			if (chapter?.thumbnailUrl) {
				const thumbnailUrl = pb.files.getURL(chapter, chapter.thumbnailUrl);
				chapter.thumbnailUrl = thumbnailUrl;
			}

			if (chapter?.expand?.['attachments(chapter)']) {
				chapter.expand['attachments(chapter)'] = chapter.expand['attachments(chapter)'].map(
					(attachment: any) => {
						if (attachment.url && attachment.url.length > 0) {
							attachment.url = pb.files.getURL(attachment, attachment.url[0]);
						}
						return attachment;
					}
				);
			}
			return chapter;
		} catch (e) {
			console.log('error:', e);
		}
	}

	// Function to fetch comments
	async function getComment() {
		try {
			// Fetch comments from PocketBase
			const comments = await pb.collection('comments').getFullList<Comment>({
				filter: `chapter = "${chapterId}"`,
				sort: '-created',
				expand: 'user,parentComment' // Expand user and parentComment
			});

			// Normalize the parentComment field
			const normalizedComments = comments.map((comment) => {
				const normalizedParentComment =
					comment.parentComment && comment.parentComment.trim() !== ''
						? comment.parentComment
						: null;
				return {
					...comment,
					parentComment: normalizedParentComment
				};
			});

			// Group comments by parentComment
			const groupedComments: { [key: string]: CommentWithReplies } = normalizedComments.reduce(
				(acc, comment) => {
					if (!comment.parentComment) {
						acc[comment.id] = { ...comment, replies: [] };
					} else {
						const parent = acc[comment.parentComment];
						if (parent) {
							parent.replies.push(comment);
						}
					}
					return acc;
				},
				{} as { [key: string]: CommentWithReplies }
			);

			// Filter out top-level comments (those without a parentComment)
			const topLevelComments = Object.values(groupedComments).filter(
				(comment) => !comment.parentComment
			);

			return topLevelComments;
		} catch (e) {
			console.log('Error fetching comments:', e);
			return [];
		}
	}

	const [chapter, course, subscription] = await Promise.all([
		getChapter(),
		getCourse(),
		getSubscription()
	]);

	const chapterCommentForm = await superValidate(zod(chapterCommentSchema));

	return {
		chapter,
		course,

		subscription,
		isSubscribed: !!subscription,
		chapterCommentForm
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

		const chapter = await pb.collection('chapters').getOne<Chapter>(chapterId);

		const course = await pb
			.collection('courses')
			.getOne<Course>(chapter.course[0], { expand: 'user' });

		const formData = await request.formData();

		const commentContent = formData.get('comment') as string | null;
		const parentComment = formData.get('parentId') as string | null;

		if (!commentContent) {
			return fail(400, { message: 'Comment is required' });
		}

		const file = formData.get('file') as File | null;

		const commentData: any = {
			user: user?.id,
			chapter: chapterId,
			content: commentContent
		};

		if (parentComment) {
			commentData.parentComment = parentComment;
		}

		if (file && file.size > 0) {
			commentData.file = file;
		}

		try {
			await pb.collection('comments').create(commentData);
			await checkAchievement('God of communication');
			await createNotification(
				course?.expand?.user?.id,
				'Some one has comment on your chapter 1s ago!',
				` ${user?.username} commented on your chapter ${chapter.title} 1s ago `
			);
			return {
				message: 'Comment created successfully!'
			};
		} catch (e) {
			console.error('Error creating comment: ', e);
			return fail(500, {
				message: 'Failed to create comment. Please try again.'
			});
		}
	}
};
