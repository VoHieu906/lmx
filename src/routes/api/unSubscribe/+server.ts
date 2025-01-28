import { type Course, type Subscription } from '$lib/type';
import { error, type RequestHandler } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

interface UnsubscribeRequest {
	userId: string;
	courseId: string;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { pb } = locals;
	const { userId, courseId }: UnsubscribeRequest = await request.json();

	try {
		// Check if a subscription exists
		const existingSubscriptions = await pb
			.collection('subscriptions')
			.getFullList<Subscription>({ filter: `user = "${userId}" && course = "${courseId}"` });

		// If no subscription exists, return a success response with a message
		if (existingSubscriptions.length === 0) {
			return new Response(
				JSON.stringify({
					success: true,
					message: 'User is not subscribed to this course'
				}),
				{
					status: 200
				}
			);
		}

		// If a subscription exists, delete it
		await pb.collection('subscriptions').delete(existingSubscriptions[0].id);

		// Decrement the subscribers count in the courses table
		await pb.collection('courses').update<Course>(courseId, {
			'subscribers-': 1
		});

		return new Response(
			JSON.stringify({
				success: true,
				message: 'Unsubscription successful',
				user_id: userId,
				course_id: courseId
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
