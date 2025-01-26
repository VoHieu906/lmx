import { type Chapter, type Course } from '$lib/type';
import { redirect } from '@sveltejs/kit';

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

	const [chapter, course] = await Promise.all([getChapter(), getCourse()]);
	return { chapter, course };
};
