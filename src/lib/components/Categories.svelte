<script lang="ts">
	import type { Category } from '$lib/type';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	export let items: Category[];

	let currentCategory: string = '';

	$: {
		const searchParams = get(page).url.searchParams;
		currentCategory = searchParams.get('categoryId') || '';
	}

	function updateCategory(categoryId: string) {
		const searchParams = new URLSearchParams(get(page).url.searchParams);

		if (currentCategory === categoryId) {
			searchParams.delete('categoryId');
		} else {
			searchParams.set('categoryId', categoryId);
		}

		goto(`?${searchParams.toString()}`);
	}
</script>

<div class="flex items-center gap-x-2 overflow-x-auto pb-2">
	{#each items as { id, name }}
		<button
			on:click={() => updateCategory(id)}
			class={`flex items-center gap-x-1 rounded-full border border-slate-200 px-3 py-2 text-sm transition hover:border-sky-700 ${
				currentCategory === id ? 'border-sky-700 bg-sky-200/20 text-sky-800' : ''
			}`}
		>
			<div class="truncate">{name}</div>
		</button>
	{/each}
</div>
