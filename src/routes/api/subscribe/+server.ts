import { type Subscription } from '$lib/type';
import { error, type RequestHandler } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

interface SubscribeRequest {
	userId: string;
	courseId: string;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { pb } = locals;
	const { userId, courseId }: SubscribeRequest = await request.json();

	try {
		// Check if a subscription already exists using getFullList
		const existingSubscriptions = await pb
			.collection('subscriptions')
			.getFullList<Subscription>({ filter: `user = "${userId}" && course = "${courseId}"` });

		// If there are existing subscriptions, return a success response with a message
		if (existingSubscriptions.length > 0) {
			return new Response(
				JSON.stringify({
					success: true,
					message: 'User is already subscribed to this course'
				}),
				{
					status: 200
				}
			);
		}

		// If no existing subscription, create a new one
		const subscription = await pb.collection('subscriptions').create({
			user: userId,
			course: courseId,
			progress: 0
		});

		return new Response(
			JSON.stringify({
				success: true,
				user_id: userId,
				course_id: courseId,
				progress: subscription.progress
			}),
			{
				status: 201
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
