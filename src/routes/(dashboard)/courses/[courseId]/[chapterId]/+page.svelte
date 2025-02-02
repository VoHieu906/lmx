<script lang="ts">
	import { formatTime } from '$lib/utils';
	import { Files, Eye, CalendarClock } from 'lucide-svelte';
	import { page } from '$app/stores';
	import type { Chapter, Comment, Course } from '$lib/type.js';
	import { toast } from 'svelte-sonner';
	import ChapterCommentForm from '$lib/components/ChapterCommentForm.svelte';
	import ChapterVideoCard from '$lib/components/chapterVideoCard.svelte';
	import { getProgressColor } from '$lib/actions/getProgressColor.js';
	import { commentsStore } from '$lib/stores/commentsStore.js';
	import CommentList from '$lib/components/CommentList.svelte';

	export let data;

	let chapter: Chapter | undefined;
	let course: Course | undefined;
	let otherChapters: Chapter[] = [];
	let comments: Comment[] = [];

	// Reactive block to handle page params
	$: {
		const { courseId, chapterId } = $page.params;
		if (courseId && chapterId) {
			chapter = data.chapter;
			course = data.course;
			otherChapters = course?.expand?.['chapters(course)'] || [];
			commentsStore.init(chapterId);
		}
	}
	const { subscribe } = commentsStore;
	$: {
		subscribe((newComments) => {
			comments = newComments;
		});
	}

	let progress = data.subscription?.progress ?? 0;
	let completedChapters = data.subscription?.completedChapters ?? [];

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

	let videoElement: HTMLVideoElement;
	let hasCountedView = false;
	function handleTimeUpdate() {
		if (!videoElement || hasCountedView) return;
		const currentTime = videoElement.currentTime;
		const duration = videoElement.duration;
		if (duration > 0) {
			const percentWatched = (currentTime / duration) * 100;
			if (percentWatched > 65) {
				hasCountedView = true;
				updateChapterViewCount(chapter?.id);
			}
		}
	}
	async function updateChapterViewCount(chapterId: string | undefined) {
		if (!chapterId) return;
		try {
			const res = await fetch('/api/view-count', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ chapterId })
			});
			if (!res.ok) {
				throw new Error('Fail to update view count');
			}
		} catch (e) {
			console.log('Error updating view count ');
		}
	}
</script>

<div class="container mx-auto px-4 py-2">
	<div class="mt-2 flex flex-col gap-8 lg:flex-row">
		<!-- Left Column -->
		<div class="w-full rounded-lg bg-white p-2 shadow-md lg:w-2/3">
			<!-- Title and Progress Bar -->
			<div class="mb-4">
				<!-- Highlighted Title -->
				<h2
					class="rounded bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-2 text-2xl font-bold text-gray-800 shadow-sm md:text-3xl"
				>
					{chapter?.expand?.course?.[0].title}
				</h2>

				<!-- Progress Bar -->
				<div class="mt-4">
					<div class="relative h-4 w-full rounded-full bg-gray-200">
						<div
							class={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ease-in-out ${getProgressColor(
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
			</div>

			<!-- Video Player -->
			<div class="overflow-hidden rounded-xl bg-gray-900 shadow-lg">
				<div class="relative aspect-video">
					<video
						bind:this={videoElement}
						title={chapter?.title}
						src={chapter?.videoUrl}
						controls
						crossorigin="anonymous"
						class="absolute inset-0 size-full"
						on:ended={handleVideoEnd}
						on:timeupdate={handleTimeUpdate}
					>
						<track kind="captions" label="English" srclang="en" default />
						Your browser does not support the video tag.
					</video>
				</div>
			</div>

			<!-- Chapter Details -->
			<div class="mt-4 space-y-4">
				<div class="flex justify-between">
					<h2 class="text-xl font-bold text-gray-800 md:text-2xl">{chapter?.title}</h2>
					<div class="flex justify-between gap-2">
						<div class="flex gap-1">
							<Eye />
							{chapter?.views}
						</div>
						<div class="flex gap-1">
							<CalendarClock />
							{formatTime(chapter?.created)}
						</div>
					</div>
				</div>

				<p class="text-base text-gray-600 md:text-lg">{chapter?.description}</p>
			</div>

			<!-- Attachments -->
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

			<!-- Comment Section -->
			<div class="mt-8">
				<!-- Comment Form -->
				<ChapterCommentForm data={data.chapterCommentForm} />

				<!-- Display Comments -->
				<div class="mt-6 space-y-4">
					{#each comments || [] as cmt}
						<CommentList {cmt} />
					{/each}
				</div>
			</div>
		</div>

		<!-- Right Column -->
		<div class="w-full rounded-lg bg-gray-50 p-2 shadow-md lg:w-1/3">
			<h3 class="mb-4 text-xl font-semibold text-gray-800">Next up</h3>
			<div class="space-y-4">
				{#each otherChapters as item}
					<ChapterVideoCard {item} courseId={course?.id} currentChapterId={chapter?.id} />
				{/each}
			</div>
		</div>
	</div>
</div>
