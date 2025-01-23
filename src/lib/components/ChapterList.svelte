<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { Grip, Pencil } from 'lucide-svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { Badge } from '$lib/components/ui/badge';
	import type { Chapter } from '$lib/type';
	export let items: Chapter[];

	const flipDurationMs = 150;
	function handleConsider(e: CustomEvent<DndEvent<Chapter>>) {
		items = e.detail.items;
	}
	function handleFinalize(e: CustomEvent<DndEvent<Chapter>>) {
		const { items: newItems } = e.detail;
	}

	console.log($page);
</script>

<ul
	use:dndzone={{ items: items, flipDurationMs }}
	on:consider={handleConsider}
	on:finalize={handleConsider}
>
	{#each items as item (item.id)}
		<li
			animate:flip={{ duration: flipDurationMs }}
			class={cn(
				'mb-4 flex items-center gap-x-2 rounded-md border border-slate-200 bg-slate-200 text-sm text-slate-700',
				{
					// isPublished
					'border-sky-200 bg-sky-100 text-sky-700': true
				}
			)}
		>
			<div
				class={cn(
					'rounded-l-md border-r border-r-slate-200 px-2 py-3 transition hover:bg-slate-300',
					{
						// isPublished

						'border-r-sky-200 hover:bg-sky-200': true
					}
				)}
			>
				<Grip class="h-5 w-5" />
			</div>
			<p class="truncate">
				{item.title}
			</p>
			<div class="ml-auto flex items-center gap-x-2 pr-2">
				<!-- isFree  in a badge-->
				{#if item.isFree}
					<Badge>free</Badge>
				{/if}
				<!-- isPublished , div should be a badge -->
				<!-- isPublished -->
				<Badge
					class={cn('bg-slate-500', {
						'bg-sky-700': item.isPublished
					})}
				>
					{#if item.isPublished}
						Published
					{:else}
						Draft
					{/if}
				</Badge>
				<a href="{$page.url.pathname}/chapters/{item.id}">
					<Pencil class="h-4 w-4 cursor-pointer transition hover:opacity-75 " />
				</a>
			</div>
		</li>
	{/each}
</ul>
