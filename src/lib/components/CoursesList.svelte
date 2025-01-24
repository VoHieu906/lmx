<script lang="ts">
	import type { CourseWithProgressWithCategory } from '$lib/type';
	import CourseCard from './CourseCard.svelte';

	export let items: CourseWithProgressWithCategory[];
</script>

<div>
	<div class="">
		{#if items.length === 0}
			<div class="mt-10 text-center text-sm text-muted-foreground">No courses</div>
		{:else}
			<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				1234
				<!-- {#each items as { title, id, imageUrl, price, progress, expand }}
					<CourseCard
						{id}
						{title}
						{imageUrl}
						{price}
						{progress}
						category={expand?.category.name}
						chapterLength={expand?.['chapters(course)']?.length}
					/>
				{/each} -->
			</div>
		{/if}
	</div>
</div>
