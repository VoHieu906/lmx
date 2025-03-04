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
			'subscriptions(course)'?: Subscription[];
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
	expand: {
		'attachments(chapter)': Attachment[];
		course: Course;
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
	user: string | AuthModel;
	chapter: string | Chapter;
	content: string;
	file?: string;
	parentComment?: string | null;
};
export type Rating = RecordModel & {
	user: string;
	course: string;
	rating: number;
	comment?: string;
};
export type Notification = RecordModel & {
	user: string;
	sMessage: string;
	lMessage?: string;
	isRead: boolean;
};
export type Achievement = RecordModel & {
	title: string;
	description: string;
	type: 'single' | 'progress';
	max_progress: number;
	icon: string;
};
export type UserAchievement = RecordModel & {
	user: string;
	achievement: string;
	progress: number;
	unlocked: boolean;
	expand: {
		user: AuthModel;
		achievement: Achievement[];
	};
};
