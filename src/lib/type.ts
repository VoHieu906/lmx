import type { AuthModel, RecordModel } from 'pocketbase';
import type { CourseSchema } from './schema';

export type Course = RecordModel &
	CourseSchema & {
		user: string;
		expand?: {
			category: Category;
			user: AuthModel;
			'attachments(course)'?: Attachment[];
			'chapters(course)'?: Chapter[];
			'purchase(course)'?: Purchase[];
		};
	};
export type Category = RecordModel & {
	name: string;
};
export type Attachment = RecordModel & {
	name: string;
	url: File;
	course: string;
	expand: {
		course: Course;
	};
};
export type Chapter = RecordModel & {
	title: string;
	description: string;
	position: number;
	videoUrl: string;
	isPublished: boolean;
	isFree: boolean;
	course: string;
};

export type Purchase = RecordModel & {
	user: string;
	course: string;
};
export type Progress = {
	progress: number | null;
};
export type CourseWithProgressWithCategory = Course & {
	progress: number | null;
};
