<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	import { Search } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';

	let currentTitle = '';
	let debounceTimeout: NodeJS.Timeout | null = null;

	// Reactively update `currentTitle` based on the query params
	$: {
		const searchParams = get(page).url.searchParams;
		currentTitle = searchParams.get('title') || '';
	}

	// Watch `currentTitle` changes and debounce the update
	$: if (debounceTimeout) {
		clearTimeout(debounceTimeout);
	}

	$: debounceTimeout = setTimeout(() => {
		const searchParams = new URLSearchParams(get(page).url.searchParams);

		if (currentTitle) {
			searchParams.set('title', currentTitle);
		} else {
			searchParams.delete('title');
		}

		goto(`?${searchParams.toString()}`, { replaceState: true });
	}, 1500);
</script>

<div class="relative">
	<Search class="absolute left-3 top-3 size-4 text-slate-600" />
	<Input
		bind:value={currentTitle}
		placeholder="Search for a course"
		class="w-full rounded-full bg-slate-100 pl-9 md:w-[300px]"
	/>
</div>
