<script lang="ts">
	import { formatDuration } from '$lib/utils';
	import { Play, Pause, Files } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import type { Chapter, Course } from '$lib/type.js';
	import { toast } from 'svelte-sonner';
	import ChapterCommentForm from '$lib/components/ChapterCommentForm.svelte';

	export let data;

	let chapter: Chapter | undefined;
	let course: Course | undefined;
	let otherChapters: Chapter[] = [];

	// Reactive block to handle page params
	$: {
		const { courseId, chapterId } = get(page).params;
		if (courseId && chapterId) {
			chapter = data.chapter;
			course = data.course;
			otherChapters = course?.expand?.['chapters(course)'] || [];
		}
	}

	let progress = data.subscription?.progress ?? 0;
	let completedChapters = data.subscription?.completedChapters ?? [];

	// Function to determine progress bar color based on progress
	function getProgressColor(progress: number): string {
		if (progress >= 100) return 'bg-blue-600'; // Completed
		if (progress >= 75) return 'bg-green-500'; // Near completion
		if (progress >= 50) return 'bg-yellow-400'; // Good progress
		if (progress >= 25) return 'bg-orange-400'; // Moderate progress
		return 'bg-red-500'; // Low progress
	}

	async function markChapterAsCompleted(chapterId: string) {
		if (progress >= 100 || completedChapters.includes(chapterId)) return;

		try {
			const res = await fetch('/api/progress', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: data.user?.id,
					courseId: data.course?.id,
					chapterId
				})
			});

			const responseData = await res.json();
			if (res.ok) {
				toast.success(`Progress updated: ${responseData.progress}%`);
				progress = responseData.progress;
				completedChapters = [...completedChapters, chapterId];
			} else {
				toast.error(responseData.error || 'Failed to update progress');
			}
		} catch (e) {
			toast.error('Error updating progress');
		}
	}

	// Handle video end and mark chapter as completed
	function handleVideoEnd() {
		if (data.chapter?.id && progress < 100) {
			markChapterAsCompleted(data.chapter.id);
		}
	}
	console.log(data.comment);
</script>

<div class="container mx-auto px-4 py-2">
	<!-- Highlighted Title -->
	<h2
		class="rounded bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-2 text-2xl font-bold text-gray-800 shadow-sm md:text-3xl"
	>
		{chapter?.expand?.course[0].title}
	</h2>
	<!-- Progress Bar -->
	<div class="mt-4">
		<div class="relative h-8 w-full rounded-full bg-gray-200">
			<div
				class={`absolute left-0 top-0 h-full rounded transition-all duration-300 ease-in-out ${getProgressColor(
					progress
				)}`}
				style={`width: ${progress}%`}
			></div>

			<div
				class="absolute inset-0 flex items-center justify-center text-sm font-medium text-white"
				style="z-index: 10"
			>
				{progress}%
			</div>
		</div>
	</div>
	<div class="mt-2 flex flex-col gap-8 lg:flex-row">
		<!-- Left Column -->
		<div class="w-full rounded-lg bg-white p-2 shadow-md lg:w-2/3">
			<div class="overflow-hidden rounded-xl bg-gray-900 shadow-lg">
				<div class="relative aspect-video">
					<video
						title={chapter?.title}
						src={chapter?.videoUrl}
						controls
						crossorigin="anonymous"
						class="absolute inset-0 h-full w-full"
						on:ended={handleVideoEnd}
					>
						<track kind="captions" label="English" srclang="en" default />
						Your browser does not support the video tag.
					</video>
				</div>
			</div>

			<div class="mt-4 space-y-4">
				<h2 class="text-xl font-bold text-gray-800 md:text-2xl">{chapter?.title}</h2>
				<p class="text-base text-gray-600 md:text-lg">{chapter?.description}</p>
			</div>

			<div class="mt-4">
				{#if chapter?.expand?.['attachments(chapter)']}
					<h2 class="text-lg font-bold text-gray-800 md:text-xl">Attachments:</h2>
					{#each chapter?.expand?.['attachments(chapter)'] as attachment}
						<div
							class="mt-3 flex w-[20%] items-center gap-x-2 rounded-md border border-sky-200 bg-sky-100 p-1 text-sky-700"
						>
							<Files class="m-1 size-4 flex-shrink-0" />
							<p class="line-clamp-1 text-xs">{attachment.name}</p>
						</div>
					{/each}
				{/if}
			</div>
			<div class="mt-8">
				<!-- Comment Form -->
				<ChapterCommentForm data={data.chapterCommentForm} />

				<!-- Display Comments -->
				<div class="mt-6 space-y-4">
					<div class="flex space-x-4 p-4">
						<img src="" alt="User Avatar" class="h-10 w-10 rounded-full" />
						<div class="flex-1">
							<div class="flex justify-between">
								<p class="text-sm font-medium text-gray-700">comment.username</p>
								<p class="text-xs text-gray-500">1 hour ago</p>
							</div>
							<p class="mt-1 text-gray-600">comment.text</p>
							<div class="mt-2 flex space-x-4 text-sm text-gray-500">
								<button class="hover:text-blue-500">Like</button>
								<button class="hover:text-blue-500">Reply</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Right Column -->
		<div class="w-full rounded-lg bg-gray-50 p-2 shadow-md lg:w-1/3">
			<h3 class="mb-4 text-xl font-semibold text-gray-800">Next up</h3>
			<div class="space-y-4">
				{#each otherChapters as item}
					<a
						href={`/courses/${course?.id}/${item.id}`}
						class="group block overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg {item.id ===
						chapter?.id
							? 'ring-2 ring-blue-500'
							: ''} p-3"
					>
						<div class="flex space-x-2">
							<div class="relative flex-shrink-0">
								{#if item.thumbnailUrl}
									<img
										src={item.thumbnailUrl}
										alt={item.title}
										class="h-[101px] w-[180px] rounded-md object-cover transition-all duration-300"
									/>
								{:else}
									<div class="h-[101px] w-[180px] animate-pulse rounded-md bg-gray-200"></div>
								{/if}

								<div
									class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-50"
								>
									{#if item.id === chapter?.id}
										<Pause class="h-12 w-12 rounded-full bg-blue-500 p-2 text-white" />
									{:else}
										<Play
											class="h-12 w-12 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
										/>
									{/if}
								</div>

								{#if item.duration}
									<div
										class="absolute bottom-1 right-1 rounded bg-black bg-opacity-80 px-1.5 py-0.5 text-xs text-white"
									>
										{formatDuration(item.duration)}
									</div>
								{/if}
							</div>

							<div class="flex flex-col justify-between p-2">
								<div>
									<h4
										class="line-clamp-2 text-sm font-semibold text-gray-800 group-hover:text-blue-600"
									>
										{item.title}
									</h4>
									<p class="mt-1 line-clamp-2 text-xs text-gray-500">{item.description}</p>
								</div>
								{#if item.id === chapter?.id}
									<span class="text-xs font-medium text-blue-500">Now Playing</span>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
