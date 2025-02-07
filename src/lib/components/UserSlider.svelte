<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	type User = {
		id: number;
		name: string;
		image: string;
	};

	// Sample user data
	let users: User[] = [
		{ id: 1, name: 'Alice', image: '/images/alice.jpg' },
		{ id: 2, name: 'Bob', image: '/images/bob.jpg' },
		{ id: 3, name: 'Charlie', image: '/images/charlie.jpg' },
		{ id: 4, name: 'Daisy', image: '/images/daisy.jpg' },
		{ id: 5, name: 'Eve', image: '/images/eve.jpg' },
		{ id: 6, name: 'Frank', image: '/images/frank.jpg' },
		{ id: 7, name: 'Grace', image: '/images/grace.jpg' },
		{ id: 8, name: 'Hank', image: '/images/hank.jpg' },
		{ id: 9, name: 'Ivy', image: '/images/ivy.jpg' },
		{ id: 10, name: 'Jack', image: '/images/jack.jpg' }
	];

	let currentIndex = 0;
	let interval: NodeJS.Timeout;

	// Duplicate users for infinite scrolling (with unique IDs)
	let sliderUsers = [...users, ...users.map((user) => ({ ...user, id: user.id + users.length }))];

	// Move to next slide
	const nextSlide = () => (currentIndex = (currentIndex + 1) % users.length);

	// Move to previous slide
	const prevSlide = () => (currentIndex = (currentIndex - 1 + users.length) % users.length);

	// Auto-scroll every 3 seconds
	onMount(() => {
		interval = setInterval(nextSlide, 3000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="relative mx-auto w-full max-w-7xl py-8">
	<!-- Navigation Buttons - Left -->
	<div class="absolute bottom-0 left-0 top-0 flex items-center">
		<button
			on:click={prevSlide}
			class="ml-2 rounded-full bg-gray-800/80 p-3 text-white shadow-lg transition-all hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 sm:ml-4"
			aria-label="Previous slide"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4 sm:h-5 sm:w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
	</div>

	<!-- Slider Content -->
	<div class="mx-12 overflow-hidden sm:mx-16">
		<div
			class="flex transition-transform duration-500 ease-in-out"
			style="transform: translateX({-currentIndex * 12.5}%);"
		>
			{#each sliderUsers as user (user.id)}
				<div class="xl:w-1/8 w-1/2 flex-shrink-0 px-2 sm:w-1/3 md:w-1/4 lg:w-1/6">
					<div class="flex flex-col items-center justify-center space-y-3">
						<div class="relative aspect-square w-full max-w-[4rem] sm:max-w-[5rem] md:max-w-[6rem]">
							<img
								src={user.image}
								alt={user.name}
								class="h-full w-full rounded-full border-4 border-gray-200 object-cover shadow-lg transition-transform duration-300 hover:scale-105"
							/>
						</div>
						<p class="text-center text-sm font-medium text-gray-800 sm:text-base">{user.name}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Navigation Buttons - Right -->
	<div class="absolute bottom-0 right-0 top-0 flex items-center">
		<button
			on:click={nextSlide}
			class="mr-2 rounded-full bg-gray-800/80 p-3 text-white shadow-lg transition-all hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 sm:mr-4"
			aria-label="Next slide"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4 sm:h-5 sm:w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>
</div>
