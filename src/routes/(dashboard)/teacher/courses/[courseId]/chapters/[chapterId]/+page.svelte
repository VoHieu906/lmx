<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { AlertTriangle, ArrowLeft, Eye, LayoutDashboard, Video, File } from 'lucide-svelte';
	import { page } from '$app/stores';
	import IconBadge from '$lib/components/IconBadge.svelte';
	import ChapterTitleForm from '$lib/components/ChapterTitleForm.svelte';
	import ChapterActions from '$lib/components/ChapterActions.svelte';
	import ChapterAccessForm from '$lib/components/ChapterAccessForm.svelte';
	import ChapterVideoForm from '$lib/components/ChapterVideoForm.svelte';
	import ChapterDescriptionForm from '$lib/components/ChapterDescriptionForm.svelte';
	import ThumbnailForm from '$lib/components/ThumbnailForm.svelte';
	import ChapterAttachmentForm from '$lib/components/ChapterAttachmentForm.svelte';
	export let data;

	$: chapter = data.chapter;
	$: requiredFields = [chapter.title, chapter.description, chapter.videoUrl, chapter.thumbnailUrl];
	$: totalFields = requiredFields.length;
	$: completedFields = requiredFields.filter(Boolean).length;
	$: completionText = `(${completedFields}/${totalFields})`;
	$: isComplete = requiredFields.every(Boolean);
</script>

{#if !chapter.isPublished}
	<Alert.Root class="rounded-none border border-yellow-300 bg-yellow-200/80 ">
		<AlertTriangle class="size-4" />
		<Alert.Title>Heads up!</Alert.Title>
		<Alert.Description
			>This chapter is unpublished , It will not be visible in the course</Alert.Description
		>
	</Alert.Root>
{/if}
<div class="p-6">
	<div class="flex items-center justify-between">
		<div class="w-full">
			<a
				href="/teacher/courses/{$page.params.courseId}"
				class="mb-6 flex items-center text-sm transition hover:opacity-75"
			>
				<ArrowLeft class="mr-2 size-4" />
				Back to course</a
			>
			<div class="flex w-full items-center justify-between">
				<div class="flex flex-col gap-y-2">
					<h1 class="text-2xl font-medium">Chapter Creation</h1>
					<span class="text-sm text-slate-700">Complete all fields {completionText} </span>
				</div>
				<ChapterActions disabled={!isComplete} isPublished={chapter.isPublished} />
			</div>
		</div>
	</div>
	<div class="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
		<div class="space-y-4">
			<div>
				<div class="flex items-center gap-x-2">
					<IconBadge icon={LayoutDashboard} />
					<h2 class="text-xl">Customize your chapter</h2>
				</div>
				<ChapterTitleForm data={data.chapterTitleForm} />
				<ChapterDescriptionForm data={data.chapterDescriptionForm} />
			</div>
			<div>
				<div class="flex items-center gap-x-2">
					<IconBadge icon={Eye} />
					<h2 class="text-xl">Access Settings</h2>
				</div>
				<ChapterAccessForm data={data.chapterAccessForm} />
			</div>
			<div>
				<div class="flex items-center gap-x-2">
					<IconBadge icon={File} />
					<h2 class="text-xl">Resources and Attachments</h2>
				</div>
				<ChapterAttachmentForm attachments={data.chapter.expand?.['attachments(chapter)'] || []} />
			</div>
		</div>
		<div>
			<div class="flex items-center gap-x-2">
				<IconBadge icon={Video} />
				<h2 class="text-xl">Add a video</h2>
			</div>
			<ChapterVideoForm initialData={data.chapter} />
			<ThumbnailForm thumbnailUrl={chapter.thumbnailUrl} />
		</div>
	</div>
</div>
