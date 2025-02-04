<script lang="ts">
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';

	let bannerImages = ['school1.png', 'school2.png', 'school3.png'];
	export let images: string[] = [];
	let currentBannerIndex = 0;

	// Auto-slide the banner every 3 seconds
	setInterval(() => {
		currentBannerIndex = (currentBannerIndex + 1) % images.length;
	}, 3000);

	// Prepend '/' to each image name to serve from the static folder
	images = bannerImages.map((image) => `/${image}`);

	// Functions to navigate between slides
	const nextSlide = () => {
		currentBannerIndex = (currentBannerIndex + 1) % images.length;
	};

	const prevSlide = () => {
		currentBannerIndex = (currentBannerIndex - 1 + images.length) % images.length;
	};

	// Function to go to a specific slide when a dot is clicked
	const goToSlide = (index: number) => {
		currentBannerIndex = index;
	};

	// Keyboard event handler for arrows
	const handleKeyDown = (event: KeyboardEvent, direction: 'left' | 'right') => {
		if (event.key === 'Enter' || event.key === ' ') {
			if (direction === 'left') prevSlide();
			if (direction === 'right') nextSlide();
		}
	};
</script>

<section class="relative overflow-hidden rounded-2xl">
	<!-- Banner Image -->
	<div class="relative h-64 w-full">
		<img src={images[currentBannerIndex]} alt="Banner " class="h-full w-full object-cover" />
	</div>

	<!-- Arrows for Navigation -->
	<button
		aria-label="Previous banner"
		class="absolute left-0 top-1/2 -translate-y-1/2 transform cursor-pointer p-2 focus:outline-none"
		on:click={prevSlide}
		on:keydown={(e) => handleKeyDown(e, 'left')}
		tabindex="0"
	>
		<ArrowLeft size={24} />
	</button>
	<button
		aria-label="Next banner"
		class="absolute right-0 top-1/2 -translate-y-1/2 transform cursor-pointer p-2 focus:outline-none"
		on:click={nextSlide}
		on:keydown={(e) => handleKeyDown(e, 'right')}
		tabindex="0"
	>
		<ArrowRight size={24} />
	</button>

	<!-- Dots for Navigation -->
	<div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
		{#each images as _, index}
			<button
				class="h-3 w-3 rounded-full transition-colors"
				class:bg-blue-500={currentBannerIndex === index}
				class:bg-gray-400={currentBannerIndex !== index}
				on:click={() => goToSlide(index)}
				aria-label="Go to slide {index + 1}"
			></button>
		{/each}
	</div>
</section>

<style>
	.relative {
		position: relative;
	}

	.w-full {
		width: 100%;
	}

	.h-64 {
		height: 16rem;
	}

	.object-cover {
		object-fit: cover;
	}

	/* Styling for navigation arrows */
	.cursor-pointer {
		cursor: pointer;
	}

	.p-2 {
		padding: 0.5rem;
	}

	.space-x-2 {
		/* Space between dots */
		gap: 0.5rem;
	}

	/* Focus styling for buttons */
	.focus\:outline-none:focus {
		outline: none;
	}
</style>
