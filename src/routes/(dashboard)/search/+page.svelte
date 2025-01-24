<script lang="ts">
	import Categories from '$lib/components/Categories.svelte';
	import CoursesList from '$lib/components/CoursesList.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';

	export let data;
	$: courses = data.courses;
	$: {
		console.log(courses);
	}
</script>

<div class="block px-6 pt-6 md:mb-0 md:hidden">
	<SearchInput />
</div>
<div class="p-6">
	<Categories items={data.categories} />
	<CoursesList items={courses} />
</div>
