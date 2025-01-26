<script lang="ts">
	import { formatDuration } from '$lib/utils';
	import { Play, Pause, Files } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import type { Chapter, Course } from '$lib/type.js';

	export let data;

	let chapter: Chapter | undefined;
	let course: Course | undefined;
	let otherChapters: Chapter[] = [];

	// Watch for changes in the URL parameters
	$: {
		const params = get(page).params;
		const courseId = params.courseId;
		const chapterId = params.chapterId;

		// Update the data when the URL changes
		if (courseId && chapterId) {
			chapter = data.chapter;
			course = data.course;
			otherChapters = course?.expand?.['chapters(course)'] || [];
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h2 class="text-2xl font-bold text-gray-800 md:text-3xl">
		{chapter?.expand?.course[0].title}
	</h2>

	<div class="flex flex-col gap-8 lg:flex-row">
		<div class="w-full lg:w-2/3">
			<div class="overflow-hidden rounded-xl bg-gray-900 shadow-lg">
				<div class="relative aspect-video">
					<video
						title={chapter?.title}
						src={chapter?.videoUrl}
						controls
						crossorigin="anonymous"
						class="absolute inset-0 h-full w-full"
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
		</div>

		<div class="w-full lg:w-1/3">
			<h3 class="mb-4 text-xl font-semibold text-gray-800">Next up</h3>
			<div class="space-y-4">
				{#each otherChapters as item}
					<a
						href={`/courses/${course?.id}/${item.id}`}
						class="group block overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg {item.id ===
						chapter?.id
							? 'ring-2 ring-blue-500'
							: ''}"
					>
						<div class="flex space-x-2 p-1">
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
