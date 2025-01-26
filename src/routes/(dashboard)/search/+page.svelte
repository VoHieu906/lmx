<script lang="ts">
	import Categories from '$lib/components/Categories.svelte';
	import CourseCard from '$lib/components/CourseCard.svelte';
	import type { CourseWithProgressWithCategory } from '$lib/type';
	import { page } from '$app/stores';
	import Search from '$lib/components/Search.svelte';

	export let data;
	$: courses = data.allCourses;
	$: categories = data.categories;
	$: currentCategory = $page.url.searchParams.get('categoryId');

	let searchKeyword = '';
	let priceFilter: 'all' | 'free' | 'paid' = 'all';
	let minPrice = 0;
	let maxPrice = 10000; // Set this to the maximum price in your courses

	function isCoursesArray(courses: any): courses is CourseWithProgressWithCategory[] {
		return Array.isArray(courses);
	}

	function handleSearch(event: CustomEvent<string>) {
		searchKeyword = event.detail;
	}

	$: filteredCourses = isCoursesArray(courses)
		? courses.filter(
				(course) =>
					(currentCategory ? course.expand?.category?.id === currentCategory : true) &&
					(searchKeyword
						? course.title.toLowerCase().includes(searchKeyword.toLowerCase())
						: true) &&
					(priceFilter === 'all' ||
						(priceFilter === 'free' && course.isFree) ||
						(priceFilter === 'paid' &&
							!course.isFree &&
							course.price >= minPrice &&
							course.price <= maxPrice))
			)
		: [];
</script>

<div class="block px-6 pt-6 md:mb-0">
	<Search {courses} on:search={handleSearch} />
	<div class="mt-4 w-[50%]">
		<div class="mt-2 text-sm text-gray-600">Price Filter</div>
		<select
			id="priceFilter"
			bind:value={priceFilter}
			class="mt-1 block w-full rounded-md border border-gray-500 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
		>
			<option value="all">All</option>
			<option value="free">Free</option>
			<option value="paid">Paid</option>
		</select>
	</div>
	{#if priceFilter === 'paid'}
		<div class="mt-4 w-[50%]">
			<div class="mt-2 text-sm text-gray-600">
				Selected Range: ${minPrice} - ${maxPrice}
			</div>
			<div class="flex items-center space-x-4">
				<input type="range" min={0} max={1000} step={10} bind:value={minPrice} class="w-full" />
				<input type="range" min={0} max={1000} step={10} bind:value={maxPrice} class="w-full" />
			</div>
		</div>
	{/if}
</div>

<div class="p-6">
	<Categories items={categories} />
	<div>
		{#if searchKeyword}
			<p class="mb-4 text-sm text-muted-foreground">Search results for: "{searchKeyword}"</p>
		{/if}
		<div class="">
			{#if !isCoursesArray(courses) || filteredCourses.length === 0}
				<div class="mt-10 text-center text-sm text-muted-foreground">
					{searchKeyword ? 'No courses found matching your search' : 'No courses available'}
				</div>
			{:else}
				<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{#each filteredCourses as { title, id, imageUrl, price, progress, expand, isFree }}
						<CourseCard
							{id}
							{title}
							{imageUrl}
							{price}
							{progress}
							category={expand?.category?.name || 'Unknown Category'}
							chapterLength={expand?.['chapters(course)']?.length || 0}
						/>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	input[type='range'] {
		-webkit-appearance: none;
		width: 100%;
		height: 4px; /* Smaller track height */
		background: #d1d5db; /* Light gray track */
		border-radius: 2px; /* Smaller border radius */
		outline: none;
		opacity: 0.7;
		transition: opacity 0.2s;
	}

	input[type='range']:hover {
		opacity: 1;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px; /* Smaller thumb */
		height: 16px; /* Smaller thumb */
		background: #4f46e5; /* Purple accent color */
		border-radius: 50%;
		cursor: pointer;
		border: 2px solid white; /* Add a white border for contrast */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
	}

	input[type='range']::-moz-range-thumb {
		width: 16px; /* Smaller thumb */
		height: 16px; /* Smaller thumb */
		background: #4f46e5; /* Purple accent color */
		border-radius: 50%;
		cursor: pointer;
		border: 2px solid white; /* Add a white border for contrast */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
	}
</style>
