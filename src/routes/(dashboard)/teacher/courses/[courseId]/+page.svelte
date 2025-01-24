<script lang="ts">
	import Actions from '$lib/components/Actions.svelte';
	import AttachmentForm from '$lib/components/AttachmentForm.svelte';
	import CategoryForm from '$lib/components/CategoryForm.svelte';
	import ChapterForm from '$lib/components/ChapterForm.svelte';
	import DescriptionForm from '$lib/components/DescriptionForm.svelte';
	import IconBadge from '$lib/components/IconBadge.svelte';
	import ImageForm from '$lib/components/ImageForm.svelte';
	import PriceForm from '$lib/components/PriceForm.svelte';
	import TitleForm from '$lib/components/TitleForm.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import {
		AlertTriangle,
		ArrowLeft,
		CircleDollarSign,
		File,
		LayoutDashboard,
		ListCheck
	} from 'lucide-svelte';
	export let data;
	$: course = data.course;
	$: requiredFields = [
		course.title,
		course.description,
		course.imageUrl,
		course.price,
		course.category,
		course.expand?.['chapters(course)']?.some((chapter) => chapter.isPublished)
	];
	$: totalFields = requiredFields.length;
	$: completedFields = requiredFields.filter(Boolean).length;
	$: completedText = `(${completedFields}/${totalFields})`;
	$: isComplete = requiredFields.every(Boolean);
	console.log(data.descriptionForm);
</script>

{#if !course.isPublished}
	<Alert.Root class="rounded-none border border-yellow-300 bg-yellow-200/80">
		<AlertTriangle class="size-4" />
		<Alert.Title>Heads up!</Alert.Title>
		<Alert.Description
			>This course is un-published.It will be not visible to students</Alert.Description
		>
	</Alert.Root>
{/if}
<div class="p-6">
	<div class="flex items-center justify-between">
		<div class="flex flex-col gap-y-2">
			<h1 class="text-2xl font-medium">
				<a
					href="/teacher/courses"
					class="mb-6 flex items-center text-sm transition hover:opacity-75"
				>
					<ArrowLeft class="mr-2 size-4" />
					Back to dashboard</a
				>
				Course setup
			</h1>
			<span class="text-sm text-muted-foreground"> Complete all field {completedText}</span>
		</div>
		<Actions disabled={!isComplete} isPublished={course.isPublished} />
	</div>
	<div class="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
		<div>
			<div class="flex items-center gap-x-2">
				<IconBadge icon={LayoutDashboard} />
				<h2 class="text-xl">Customize your course</h2>
			</div>
			<TitleForm data={data.titleForm} />
			<DescriptionForm data={data.descriptionForm} />
			<ImageForm imageUrl={course.imageUrl} />
			<CategoryForm data={data.categoryForm} categories={data.categories} />
		</div>
		<div class="space-y-6">
			<div>
				<div class="flex items-center gap-x-2">
					<IconBadge icon={ListCheck} />
					<h2 class="text-xl">Course chapters</h2>
				</div>
				<ChapterForm
					chapters={data.course.expand?.['chapters(course)'] ?? []}
					data={data.chapterTitleForm}
				/>
			</div>
			<div>
				<div class="flex items-center gap-x-2">
					<IconBadge icon={CircleDollarSign} />
					<h2 class="text-xl">Sell your course</h2>
				</div>
				<PriceForm data={data.priceForm} />
			</div>
			<div>
				<div class="flex items-center gap-x-2">
					<IconBadge icon={File} />
					<h2 class="text-xl">Resources and Attachments</h2>
				</div>
				<AttachmentForm attachments={data.course.expand?.['attachments(course)'] ?? []} />
			</div>
		</div>
	</div>
</div>
