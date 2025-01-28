<script>
	import { formatDuration } from '$lib/utils';
	import { Pause, Play } from 'lucide-svelte';

	export let item;
	export let courseId;
	export let currentChapterId;

	// Ensure `isCurrentChapter` is reactive to changes in `currentChapterId`.
	$: isCurrentChapter = item.id === currentChapterId;
</script>

<a
	href={`/courses/${courseId}/${item.id}`}
	class="group block overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg {isCurrentChapter
		? 'ring-2 ring-blue-500'
		: ''} p-1"
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
				{#if isCurrentChapter}
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
				<h4 class="line-clamp-2 text-sm font-semibold text-gray-800 group-hover:text-blue-600">
					{item.title}
				</h4>
				<p class="mt-1 line-clamp-2 text-xs text-gray-500">{item.description}</p>
			</div>
			{#if isCurrentChapter}
				<span class="text-xs font-medium text-blue-500">Now Playing</span>
			{/if}
		</div>
	</div>
</a>
