import { type Course, type Rating } from '$lib/type';
import { type RequestHandler } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

interface RatingRequest {
	userId: string;
	courseId: string;
	userRating: number;
	comment?: string;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { pb } = locals;
	const { userId, courseId, userRating, comment }: RatingRequest = await request.json();

	try {
		const ratings = await pb
			.collection('ratings')
			.getFullList<Rating>({ filter: `user = "${userId}" && course = "${courseId}"` });

		const existingRating = ratings.length > 0 ? ratings[0] : null;

		if (existingRating) {
			await pb.collection('ratings').update(existingRating.id, {
				rating: userRating,
				comment
			});
		} else {
			await pb.collection('ratings').create({
				user: userId,
				course: courseId,
				rating: userRating,
				comment
			});
		}
		const course = await pb.collection('courses').getOne<Course>(courseId, { expand: 'user' });
		await pb.collection('notifications').create<Notification>({
			user: course?.expand?.user?.id,
			message: 'Your course received a new rating!',
			isRead: false
		});
		return new Response(
			JSON.stringify({
				success: true,
				message: existingRating ? 'Rating updated successfully' : 'Rating created successfully',
				rating: userRating,
				// teacherId: course?.expand?.user?.id,
				comment
			}),
			{
				status: 200
			}
		);
	} catch (err) {
		if (err instanceof ClientResponseError) {
			return new Response(JSON.stringify({ error: err.message || 'An error occurred' }), {
				status: err.status
			});
		}

		return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
			status: 500
		});
	}
};
