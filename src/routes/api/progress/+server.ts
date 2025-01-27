import { json, type RequestHandler } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

interface UpdateProgressRequest {
	userId: string;
	courseId: string;
	chapterId: string;
}
export const PATCH: RequestHandler = async ({ request, locals }) => {
	const { pb } = locals;
	const { userId, courseId, chapterId }: UpdateProgressRequest = await request.json();

	try {
		const subscription = await pb
			.collection('subscriptions')
			.getFirstListItem(`user = "${userId}" && course = "${courseId}"`);

		const completedChapters = Array.isArray(subscription.completedChapters)
			? subscription.completedChapters
			: [];
		console.log(completedChapters);
		if (completedChapters.includes(chapterId)) {
			return json({ success: true, message: 'chapter already completed' }, { status: 200 });
		}
		completedChapters.push(chapterId);
		const course = await pb.collection('courses').getOne(courseId, { expand: 'chapters(course)' });
		const totalChapters = Array.isArray(course?.expand?.['chapters(course)'])
			? course.expand['chapters(course)'].length
			: 0;
		const progress = Math.round((completedChapters.length / totalChapters) * 100);
		await pb.collection('subscriptions').update(subscription.id, {
			completedChapters,
			progress
		});
		return json({ success: true, progress }, { status: 200 });
	} catch (err) {
		if (err instanceof ClientResponseError) {
			return json({ error: err.message || 'An error occurred' }, { status: err.status });
		}
		return json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
};
