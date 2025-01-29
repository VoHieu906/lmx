import type { AuthModel, RecordModel } from 'pocketbase';
import type { CourseSchema } from './schema';

export type Course = RecordModel &
	CourseSchema & {
		user: string;
		expand?: {
			category: Category;
			user: AuthModel;
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
	chapter: string;
	expand: {
		chapter: Chapter;
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
	view?: number;
	expand?: {
		'attachments(chapter)'?: Attachment[];
	};
};

export type Purchase = RecordModel & {
	user: string;
	course: string;
};
export type Subscription = RecordModel & {
	user: string;
	course: string;
	progress: number;
	completedChapters: string[];
};
export type Comment = RecordModel & {
	user: string;
	chapter: string;
	content: string;
	parentComment?: string;
};
export type Rating = RecordModel & {
	user: string;
	course: string;
	rating: number;
	comment?: string;
};
