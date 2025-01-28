<script lang="ts">
	import {
		Clock,
		BookOpen,
		Users,
		Star,
		GraduationCap,
		BarChart,
		Calendar,
		Tag,
		PlayCircle,
		Check,
		X
	} from 'lucide-svelte';

	const courseDemo = {
		enrolledStudents: 1234,
		rating: 4.8,
		instructor: {
			name: 'Jane Doe',
			avatar: ''
		},
		level: 'Intermediate',
		lastUpdated: '2023-05-15',
		image: ''
	};
	import { page } from '$app/stores';
	import { formatDurationWithUnits } from '$lib/utils.js';
	import { toast } from 'svelte-sonner';
	export let data;

	let { course, subscription, isSubscribed } = data;
	let chapters = course.expand?.['chapters(course)'];

	let progress = subscription?.progress;
	let totalDuration = chapters?.reduce((acc, ch) => {
		let chdu = parseFloat(ch.duration);
		return acc + chdu;
	}, 0);

	let userId = data?.user?.id;
	let courseId = data.course.id;

	async function subscribe() {
		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId, courseId })
			});

			const responseData = await res.json();

			if (res.ok) {
				if (responseData.message === 'User is already subscribed to this course') {
					toast.info(responseData.message); // Display as an info toast
				} else {
					toast.success('Subscription successful'); // Display as a success toast
					isSubscribed = true; // Update the state to reflect the subscription
				}
			} else {
				toast.error(responseData.error || 'Failed to subscribe'); // Display as an error toast
			}
		} catch (e) {
			toast.error('Error subscribing to course');
		}
	}
	async function unSubscribe() {
		try {
			const res = await fetch('/api/unSubscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId, courseId })
			});

			const responseData = await res.json();

			if (res.ok) {
				if (responseData.message === 'User is not subscribed to this course') {
					toast.info(responseData.message); // Display as an info toast
				} else {
					toast.success('Unsubscription successful'); // Display as a success toast
					isSubscribed = false; // Update the state to reflect the unsubscription
				}
			} else {
				toast.error(responseData.error || 'Failed to unsubscribe'); // Display as an error toast
			}
		} catch (e) {
			toast.error('Error unsubscribing from course');
		}
	}
	let rating: number = 0; // Store the rating selected by the user
	let userRating: number | null = null; // Store the user's rating, initially null (not rated)

	// Function to handle star click
	function handleRating(selectedRating: number): void {
		userRating = selectedRating; // Update the user's rating
		rating = selectedRating; // Update the rating shown in the stars
		console.log(rating);
		console.log(userRating);
		// Optionally, you can send the rating to the backend immediately
		toast.success('Thank you for your rating!'); // Confirmation toast
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="flex flex-col gap-8 lg:flex-row">
		<!-- Left Column -->
		<div class="lg:w-2/3">
			<div class="relative mb-6 overflow-hidden rounded-lg shadow-lg">
				<div class="aspect-video w-full">
					<img src={course.imageUrl} alt={course.title} class="h-full w-full object-cover" />
					<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
					<div class="absolute bottom-0 left-0 right-0 p-4 text-white">
						<h1 class="mb-2 text-2xl font-bold sm:text-3xl">{course.title}</h1>
						<div class="flex flex-wrap gap-2">
							{#each course.tags as tag}
								<span
									class="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800"
								>
									<Tag class="mr-1 h-3 w-3" />
									{tag}
								</span>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<p class="mb-6 text-xl text-gray-600">{course.description}</p>

			<div class="mb-6 rounded-lg bg-gray-100 p-6">
				<h2 class="mb-4 text-xl font-semibold text-gray-900">CourseDemo Details</h2>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div class="flex items-center">
						<img
							src={courseDemo.instructor.avatar}
							alt={courseDemo.instructor.name}
							class="mr-3 h-12 w-12 rounded-full"
						/>
						<div>
							<h3 class="text-sm font-medium text-gray-500">Instructor</h3>
							<p class="mt-1 text-sm text-gray-900">{course.expand?.user?.username}</p>
						</div>
					</div>
					<div class="flex items-center">
						<BarChart class="mr-3 h-6 w-6 text-indigo-600" />
						<div>
							<h3 class="text-sm font-medium text-gray-500">Level</h3>
							<p class="mt-1 text-sm text-gray-900">{courseDemo.level}</p>
						</div>
					</div>
					<div class="flex items-center">
						<Calendar class="mr-3 h-6 w-6 text-indigo-600" />
						<div>
							<h3 class="text-sm font-medium text-gray-500">Last Updated</h3>
							<p class="mt-1 text-sm text-gray-900">{courseDemo.lastUpdated}</p>
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col justify-center space-x-2 sm:flex-row sm:space-x-4">
				{#if isSubscribed}
					{#if progress}
						<div class="flex flex-col items-center gap-4">
							<div class="relative flex h-16 w-16 items-center justify-center">
								<svg class="absolute inset-0 h-full w-full" viewBox="0 0 36 36">
									<!-- Background Circle -->
									<circle
										stroke="currentColor"
										stroke-width="3"
										fill="transparent"
										r="15.915"
										cx="18"
										cy="18"
										class="text-gray-300"
									></circle>

									<!-- Progress Circle -->
									<circle
										stroke-width="3"
										fill="transparent"
										r="15.915"
										cx="18"
										cy="18"
										style="stroke-dasharray: 100, 100; stroke-dashoffset: {100 - progress};"
										class={`transition-all duration-300 ${
											progress >= 100
												? 'stroke-blue-600'
												: progress >= 75
													? 'stroke-green-500'
													: progress >= 50
														? 'stroke-yellow-400'
														: progress >= 25
															? 'stroke-orange-400'
															: 'stroke-red-500'
										}`}
									></circle>
								</svg>
								<span class="absolute text-sm font-bold">{progress}%</span>
							</div>

							{#if progress === 100}
								<div class="flex flex-col items-center">
									<div class="flex items-center space-x-1">
										{#each [1, 2, 3, 4, 5] as star}
											<Star
												on:click={() => handleRating(star)}
												class="cursor-pointer text-yellow-500"
												size={24}
												fill={userRating !== null && userRating >= star ? 'yellow' : 'none'}
											/>
										{/each}
									</div>

									<p class="mt-2 text-sm text-gray-500">
										{#if userRating !== null}
											You rated this course {userRating} out of 5 stars.
										{:else}
											Click on a star to rate this course!
										{/if}
									</p>
								</div>
							{/if}
						</div>
					{/if}

					<div class="mt-4 sm:mt-0">
						<a
							href={`${$page.url.pathname}/${course.expand?.['chapters(course)']?.[0].id}`}
							class="flex items-center rounded-md bg-green-600 px-4 py-2 font-semibold text-white transition duration-300 hover:bg-green-700"
						>
							<PlayCircle class="mr-2 h-5 w-5" />
							Start CourseDemo
						</a>
					</div>
					<div class="mt-4 sm:mt-0">
						<button
							on:click={unSubscribe}
							class="flex items-center rounded-md bg-red-600 px-4 py-2 font-semibold text-white transition duration-300 hover:bg-red-700"
						>
							<X class="mr-2 h-5 w-5" />
							Unsubscribe
						</button>
					</div>
				{:else}
					<div class="mt-4 sm:mt-0">
						<button
							on:click={subscribe}
							class="flex items-center rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white transition duration-300 hover:bg-indigo-700"
						>
							<GraduationCap class="mr-2 h-5 w-5" />
							Enroll in CourseDemo
						</button>
					</div>
				{/if}
			</div>
		</div>

		<!-- Right Column -->
		<div class="lg:w-1/3">
			<div class="mb-6 grid grid-cols-2 gap-4">
				<div class="flex items-center rounded-lg bg-indigo-100 p-2">
					<BookOpen class="mr-4 h-8 w-8 text-indigo-600" />
					<div>
						<span class="block text-lg font-semibold text-indigo-900"
							>{course.expand?.['chapters(course)']?.length}</span
						>
						<span class="text-sm text-indigo-700">Chapters</span>
					</div>
				</div>
				<div class="flex items-center rounded-lg bg-green-100 p-2">
					<Clock class="mr-4 h-8 w-8 text-green-600" />
					<div>
						<span class="block text-lg font-semibold text-green-900"
							>{#if totalDuration}
								{formatDurationWithUnits(totalDuration)}
							{/if}
						</span>
						<span class="text-sm text-green-700">Duration</span>
					</div>
				</div>
				<div class="flex items-center rounded-lg bg-yellow-100 p-2">
					<Users class="mr-4 h-8 w-8 text-yellow-600" />
					<div>
						<span class="block text-lg font-semibold text-yellow-900"
							>{courseDemo.enrolledStudents}</span
						>
						<span class="text-sm text-yellow-700">Students</span>
					</div>
				</div>
				<div class="flex items-center rounded-lg bg-red-100 p-2">
					<Star class="mr-4 h-8 w-8 text-red-600" />
					<div>
						<span class="block text-lg font-semibold text-red-900">{courseDemo.rating}</span>
						<span class="text-sm text-red-700">Rating</span>
					</div>
				</div>
			</div>

			<div class="mb-6 rounded-lg bg-white p-6 shadow-md">
				<h2 class="mb-4 text-xl font-semibold text-gray-900">What You'll Learn</h2>
				<ul class="space-y-2">
					<li class="flex items-start">
						<Check class="mr-2 mt-1 h-5 w-5 text-green-500" />
						<span>Build scalable web applications with SvelteKit</span>
					</li>
					<li class="flex items-start">
						<Check class="mr-2 mt-1 h-5 w-5 text-green-500" />
						<span>Implement server-side rendering for improved performance</span>
					</li>
					<li class="flex items-start">
						<Check class="mr-2 mt-1 h-5 w-5 text-green-500" />
						<span>Create and manage API routes in SvelteKit</span>
					</li>
					<li class="flex items-start">
						<Check class="mr-2 mt-1 h-5 w-5 text-green-500" />
						<span>Optimize your SvelteKit applications for production</span>
					</li>
				</ul>
			</div>

			<div class="rounded-lg bg-white p-6 shadow-md">
				<h2 class="mb-4 text-xl font-semibold text-gray-900">Course Curriculum</h2>
				<div class="space-y-4">
					<div>
						<h3 class="mb-2 text-lg font-medium">1. Introduction to SvelteKit</h3>
						<ul class="list-disc space-y-1 pl-5 text-gray-600">
							<li>Setting up your development environment</li>
							<li>Creating your first SvelteKit project</li>
							<li>Understanding the SvelteKit file structure</li>
						</ul>
					</div>
					<div>
						<h3 class="mb-2 text-lg font-medium">2. Routing in SvelteKit</h3>
						<ul class="list-disc space-y-1 pl-5 text-gray-600">
							<li>File-based routing</li>
							<li>Dynamic routes and parameters</li>
							<li>Nested layouts</li>
						</ul>
					</div>
					<div>
						<h3 class="mb-2 text-lg font-medium">3. Server-Side Rendering</h3>
						<ul class="list-disc space-y-1 pl-5 text-gray-600">
							<li>SSR vs CSR</li>
							<li>Implementing SSR in SvelteKit</li>
							<li>Optimizing for performance</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
