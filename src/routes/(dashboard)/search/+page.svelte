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
					(searchKeyword ? course.title.toLowerCase().includes(searchKeyword.toLowerCase()) : true)
			)
		: [];
</script>

<div class="block px-6 pt-6 md:mb-0">
	<Search {courses} on:search={handleSearch} />
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
