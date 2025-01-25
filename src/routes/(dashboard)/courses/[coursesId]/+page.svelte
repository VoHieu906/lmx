<script lang="ts">
	import { formatDuration } from '$lib/utils';

	// Sample video and chapter data
	let videoData = {
		title: 'Chapter 1: Introduction to SvelteKit',
		description: 'This chapter will cover the basics of SvelteKit including setup and components.',
		videoUrl: 'https://www.youtube.com/embed/WwEISi0Ktu4'
	};

	let chapters = [
		{
			title: 'Chapter 1: Introduction to SvelteKit',
			imageUrl: 'https://via.placeholder.com/180x101',
			duration: 960, // 16 minutes in seconds
			views: 10500,
			uploadedAt: '2 weeks ago'
		},
		{
			title: 'Chapter 2: Advanced SvelteKit Concepts',
			imageUrl: 'https://via.placeholder.com/180x101',
			duration: 1140, // 19 minutes in seconds
			views: 8200,
			uploadedAt: '1 week ago'
		},
		{
			title: 'Chapter 3: Building a Full-Stack App with SvelteKit',
			imageUrl: 'https://via.placeholder.com/180x101',
			duration: 1380, // 23 minutes in seconds
			views: 6700,
			uploadedAt: '5 days ago'
		},
		{
			title: 'Chapter 4: Deploying Your SvelteKit Application',
			imageUrl: 'https://via.placeholder.com/180x101',
			duration: 780, // 13 minutes in seconds
			views: 5300,
			uploadedAt: '3 days ago'
		},
		{
			title: 'Chapter 5: Performance Optimization in SvelteKit',
			imageUrl: 'https://via.placeholder.com/180x101',
			duration: 1020, // 17 minutes in seconds
			views: 4100,
			uploadedAt: '1 day ago'
		}
	];
</script>

<div class="flex flex-col gap-4 p-6 md:flex-row md:gap-8">
	<!-- Left column for video -->
	<div class="max-w-full flex-1 space-y-4 md:max-w-[65%]">
		<div class="relative w-full pt-[56.25%]">
			<iframe
				src={videoData.videoUrl}
				title={videoData.title}
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
				class="absolute inset-0 h-full w-full"
			></iframe>
		</div>
		<h2 class="text-xl font-semibold md:text-2xl">{videoData.title}</h2>
		<p class="text-sm text-gray-700 md:text-base">{videoData.description}</p>
	</div>

	<!-- Right column for chapters (YouTube-style) -->
	<div class="mt-4 flex-1 md:mt-0 md:max-w-[35%]">
		<h3 class="mb-4 text-lg font-semibold">Next up</h3>
		<div class="space-y-3">
			{#each chapters as chapter, index}
				<div class="flex space-x-2">
					<div class="relative flex-shrink-0">
						<img
							src={chapter.imageUrl || '/placeholder.svg'}
							alt={chapter.title}
							class="h-[101px] w-40 rounded-lg object-cover"
						/>
						<div
							class="absolute bottom-1 right-1 rounded bg-black bg-opacity-80 px-1 text-xs text-white"
						>
							{formatDuration(chapter.duration)}
						</div>
					</div>
					<div class="flex flex-col justify-between py-1">
						<h4 class="line-clamp-2 text-sm font-semibold">{chapter.title}</h4>
						<div class="text-xs text-gray-500">
							<p>{chapter.views.toLocaleString()} views</p>
							<p>{chapter.uploadedAt}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
