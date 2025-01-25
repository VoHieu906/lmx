<script lang="ts">
	import { Search as SearchIcon, Command } from 'lucide-svelte';
	import Input from './ui/input/input.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Course } from '$lib/type';

	export let courses: Course[] = [];

	let searchTerm = '';
	let isDropdownOpen = false;
	const dispatch = createEventDispatcher();

	$: filteredCourses = courses
		.filter((course) => course.title.toLowerCase().includes(searchTerm.toLowerCase()))
		.slice(0, 5);

	function handleInput() {
		console.log('searchTerm:', searchTerm);
		isDropdownOpen = searchTerm.length > 0;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && searchTerm) {
			dispatchSearch();
			isDropdownOpen = false;
		}
	}

	function selectCourse(course: Course) {
		searchTerm = course.title;
		dispatchSearch();
		isDropdownOpen = false;
	}

	function dispatchSearch() {
		dispatch('search', searchTerm);
	}
</script>

<div class="relative">
	<SearchIcon class="absolute left-3 top-3 size-4 text-slate-600" />
	<Input
		bind:value={searchTerm}
		on:input={handleInput}
		on:keydown={handleKeyDown}
		placeholder="Search for a course"
		class="w-full rounded-full bg-slate-100 pl-9 md:w-[300px]"
	/>

	{#if isDropdownOpen && filteredCourses.length > 0}
		<div class="absolute mt-1 w-full rounded-md bg-white shadow-lg">
			<ul class="py-1">
				{#each filteredCourses as course}
					<li>
						<button
							type="button"
							class="flex w-full items-center px-4 py-2 text-left hover:bg-slate-100"
							on:click={() => selectCourse(course)}
							on:keydown={(event) => {
								if (event.key === 'Enter') {
									selectCourse(course);
								}
							}}
						>
							<Command class="mr-2 h-4 w-4" />
							{course.title}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
