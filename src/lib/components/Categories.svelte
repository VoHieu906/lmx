<script lang="ts">
	import type { Category } from '$lib/type';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { List } from 'lucide-svelte';

	export let items: Category[];

	const currentCategory = derived(page, ($page) => $page.url.searchParams.get('categoryId') || '');

	function updateCategory(categoryId: string) {
		const searchParams = new URLSearchParams($page.url.searchParams);

		if ($currentCategory === categoryId) {
			searchParams.delete('categoryId');
		} else {
			searchParams.set('categoryId', categoryId);
		}

		goto(`?${searchParams.toString()}`);
	}

	function showAll() {
		const searchParams = new URLSearchParams($page.url.searchParams);
		searchParams.delete('categoryId');
		goto(`?${searchParams.toString()}`);
	}
</script>

<div class="my-2 flex items-center gap-x-3 overflow-x-auto py-2">
	<button
		on:click={showAll}
		class="flex items-center gap-x-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg focus:outline-none"
	>
		<List class="h-5 w-5" />
		<span class="truncate">Show All</span>
	</button>
	{#each items as { id, name }}
		<button
			on:click={() => updateCategory(id)}
			class={`flex items-center gap-x-2 rounded-full px-4 py-2 text-sm font-medium shadow-md transition-all duration-300 focus:outline-none ${
				$currentCategory === id
					? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg'
					: 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg'
			}`}
		>
			<div class="truncate">{name}</div>
		</button>
	{/each}
</div>
