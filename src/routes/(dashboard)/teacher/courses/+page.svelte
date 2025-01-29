<script lang="ts">
	import { writable } from 'svelte/store';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table';
	import { cn, formatCurrency } from '$lib/utils.js';
	import { ArrowUpDown, PlusCircle } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import DataTableActions from '$lib/components/DataTableActions.svelte';
	import IsPublishedBadge from '$lib/components/IsPublishedBadge.svelte';

	export let data;

	// Pagination
	let pageIndex = 0;
	let pageSize = 10;

	// Sorting
	let sortColumn = 'title';
	let sortDirection: 'asc' | 'desc' = 'asc';

	// Filtering
	let filterValue = '';

	$: filteredCourses = data.courses.filter((course) =>
		course.title.toLowerCase().includes(filterValue.toLowerCase())
	);

	$: sortedCourses = [...filteredCourses].sort((a, b) => {
		if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
		if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
		return 0;
	});

	$: paginatedCourses = sortedCourses.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

	$: hasNextPage = (pageIndex + 1) * pageSize < sortedCourses.length;
	$: hasPreviousPage = pageIndex > 0;

	function toggleSort(column: string) {
		if (sortColumn === column) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = column;
			sortDirection = 'asc';
		}
	}
</script>

<div class="p-6">
	<div class="flex items-center py-4">
		<Input class="max-w-sm" placeholder="Filter courses..." type="text" bind:value={filterValue} />
		<Button href="/teacher/create" class="ml-auto"
			><PlusCircle class="mr-2 size-4" />New course</Button
		>
	</div>

	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>
						<button class="flex items-center" on:click={() => toggleSort('title')}>
							Title
							<ArrowUpDown class="ml-2 h-4 w-4" />
						</button>
					</Table.Head>
					<Table.Head>
						<button class="flex items-center" on:click={() => toggleSort('price')}>
							Price
							<ArrowUpDown class="ml-2 h-4 w-4" />
						</button>
					</Table.Head>
					<Table.Head>Published</Table.Head>
					<Table.Head>Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each paginatedCourses as course (course.id)}
					<Table.Row>
						<Table.Cell>{course.title}</Table.Cell>
						<Table.Cell>{formatCurrency(course.price || 0)}</Table.Cell>
						<Table.Cell>
							<IsPublishedBadge value={course.isPublished} />
						</Table.Cell>
						<Table.Cell>
							<DataTableActions id={course.id} />
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-2 py-4">
		<Button
			variant="outline"
			size="sm"
			on:click={() => (pageIndex = pageIndex - 1)}
			disabled={!hasPreviousPage}>Previous</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!hasNextPage}
			on:click={() => (pageIndex = pageIndex + 1)}>Next</Button
		>
	</div>
</div>
