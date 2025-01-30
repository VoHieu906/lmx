import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});
export const registerSchema = z
	.object({
		username: z.string().min(3),
		email: z.string().email(),
		password: z.string().min(8),
		passwordConfirm: z.string()
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Password do not match',
		path: ['passwordConfirm']
	});

export const courseSchema = z.object({
	title: z.string().min(1),
	description: z.string(),
	imgUrl: z.string().optional(),
	price: z.number({ coerce: true }).optional(),
	isPublished: z.boolean(),
	isFree: z.boolean(),
	category: z.string().optional(),
	subscribers: z.number().optional(),
	created: z.string().optional()
});

export const titleSchema = courseSchema.pick({ title: true });
export const descriptionSchema = courseSchema.pick({ description: true });
export const categorySchema = courseSchema.pick({ category: true });
export const priceSchema = courseSchema.pick({ price: true, isFree: true });
export const chapterTitleSchema = z.object({
	title: z.string().min(1)
});
export const chapterDescriptionSchema = z.object({
	description: z.string()
});
export const chapterCommentSchema = z.object({
	comment: z.string().min(1),
	parentComment: z.string().optional(),
	file: z.instanceof(File).optional()
});
export const chapterAccessSchema = z.object({
	isFree: z.boolean()
});
export type LoginSchema = z.infer<typeof loginSchema>;
export type CourseSchema = z.infer<typeof courseSchema>;
