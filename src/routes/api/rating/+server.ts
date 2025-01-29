import { type Rating } from '$lib/type';
import { type RequestHandler } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

interface RatingRequest {
	userId: string;
	courseId: string;
	userRating: number; // Include the rating value in the request payload
	comment?: string; // Optional comment field
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { pb } = locals;
	const { userId, courseId, userRating, comment }: RatingRequest = await request.json();

	try {
		// Fetch all ratings for the course
		const ratings = await pb
			.collection('ratings')
			.getFullList<Rating>({ filter: `user = "${userId}" && course = "${courseId}"` });

		// Check if a rating already exists for the user and course
		const existingRating = ratings.length > 0 ? ratings[0] : null;

		if (existingRating) {
			// If a rating exists, update it
			await pb.collection('ratings').update(existingRating.id, {
				rating: userRating,
				comment
			});
		} else {
			// If no rating exists, create a new rating
			await pb.collection('ratings').create({
				user: userId,
				course: courseId,
				rating: userRating,
				comment
			});
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: existingRating ? 'Rating updated successfully' : 'Rating created successfully',
				rating: userRating,
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
