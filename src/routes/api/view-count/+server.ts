import { json, type RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ request, locals }) => {
	const { pb } = locals;
	const { chapterId } = await request.json();
	try {
		const chapter = await pb.collection('chapters').getOne(chapterId);
		const currentView = chapter.views || 0;
		await pb.collection('chapters').update(chapterId, {
			views: currentView + 1
		});
		return json({ views: currentView + 1 });
	} catch (e) {
		return json({ error: 'Failed to update view count' }, { status: 500 });
	}
};
