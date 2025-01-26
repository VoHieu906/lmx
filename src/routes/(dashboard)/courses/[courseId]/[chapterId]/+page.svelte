<script lang="ts">
	import { formatDuration } from '$lib/utils';
	import { Play, Pause } from 'lucide-svelte';
	import { onMount } from 'svelte';

	export let data;
	let { chapter, course } = data;

	let otherChapters = course?.expand?.['chapters(course)'] || [];
	console.log(course?.expand?.['chapters(course)']);
	let videoThumbnails: { [key: string]: string } = {};

	async function generateThumbnail(videoUrl: string, maxRetries = 3): Promise<string> {
		let retries = 0;
		while (retries < maxRetries) {
			try {
				const video = document.createElement('video');
				video.crossOrigin = 'anonymous';
				video.muted = true;

				const thumbnailPromise = new Promise<string>((resolve, reject) => {
					const timeout = setTimeout(() => {
						video.remove();
						reject(new Error('Timeout'));
					}, 5000);

					video.onloadeddata = () => {
						video.currentTime = 1; // Changed to 1 second for a more representative thumbnail
					};

					video.onseeked = () => {
						try {
							const canvas = document.createElement('canvas');
							canvas.width = 180;
							canvas.height = 101;
							const ctx = canvas.getContext('2d');
							ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
							const url = canvas.toDataURL('image/jpeg', 0.7);
							clearTimeout(timeout);
							video.remove();
							resolve(url);
						} catch (e) {
							reject(e);
						}
					};

					video.onerror = () => {
						clearTimeout(timeout);
						video.remove();
						reject(new Error('Video load error'));
					};
				});

				video.src = videoUrl;
				return await thumbnailPromise;
			} catch (error) {
				console.error('Error generating thumbnail:', error);
				retries++;
				if (retries === maxRetries) {
					console.warn(`Failed to generate thumbnail after ${maxRetries} attempts`);
					return '/placeholder.svg?height=101&width=180';
				}
				// Increased wait time between retries
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}
		return '/placeholder.svg?height=101&width=180';
	}

	// Generate thumbnails on mount
	onMount(async () => {
		if (!otherChapters?.length) return;

		const generateThumbnails = async () => {
			// Process thumbnails in smaller batches
			const batchSize = 3;
			for (let i = 0; i < otherChapters.length; i += batchSize) {
				const batch = otherChapters.slice(i, i + batchSize);
				await Promise.all(
					batch.map(async (item) => {
						if (!item.videoUrl) {
							videoThumbnails[item.id] = '/placeholder.svg?height=101&width=180';
						} else {
							videoThumbnails[item.id] = await generateThumbnail(item.videoUrl);
						}
						videoThumbnails = { ...videoThumbnails };
					})
				);
			}
		};

		generateThumbnails();
	});
</script>

<div class="container mx-auto px-4 py-8">
	<h2 class="text-2xl font-bold text-gray-800 md:text-3xl">{chapter?.expand?.course[0].title}</h2>
	<div class="flex flex-col gap-8 lg:flex-row">
		<!-- Left column for video -->
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
						<track
							kind="captions"
							label="English"
							src="/captions/default.vtt"
							srclang="en"
							default
						/>
						Your browser does not support the video tag.
					</video>
				</div>
			</div>
			<div class="mt-4 space-y-4">
				<h2 class="text-xl font-bold text-gray-800 md:text-2xl">{chapter?.title}</h2>
				<p class="text-base text-gray-600 md:text-lg">{chapter?.description}</p>
			</div>
		</div>

		<!-- Right column for chapters -->
		<div class="w-full lg:w-1/3">
			<h3 class="mb-4 text-xl font-semibold text-gray-800">Next up</h3>
			<div class="space-y-4">
				{#each otherChapters as item}
					<a
						href="/courses/{course.id}/{item.id}"
						class="group block overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg {item.id ===
						chapter.id
							? 'ring-2 ring-blue-500'
							: ''}"
					>
						<div class="flex space-x-2 p-1">
							<div class="relative flex-shrink-0">
								{#if videoThumbnails[item.id]}
									<img
										src={videoThumbnails[item.id] || '/placeholder.svg'}
										alt={`Thumbnail for ${item.title}`}
										class="h-[101px] w-[180px] rounded-md bg-gray-100 object-cover"
									/>
								{:else}
									<div class="h-[101px] w-[180px] animate-pulse rounded-md bg-gray-200" />
								{/if}
								<div
									class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-50"
								>
									{#if item.id === chapter.id}
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
								{#if item.id === chapter.id}
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
