<script lang="ts">
	import { BookOpen, DollarSign } from 'lucide-svelte';
	import IconBadge from './IconBadge.svelte';
	import { formatCurrency } from '$lib/utils';
	import Button from './ui/button/button.svelte';

	export let id: string;
	export let title: string;
	export let imageUrl: string | undefined;
	export let price: number | undefined;
	export let progress: number | null | undefined;
	export let category: string | undefined;
	export let chapterLength: number | undefined;
</script>

<a href="/courses/{id}" class="group block">
	<div
		class="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
	>
		<div class="relative">
			<img alt={title} class="h-40 w-full object-cover" src={imageUrl} />
			<div
				class="absolute right-0 top-0 m-2 rounded-md bg-black bg-opacity-50 px-2 py-1 text-xs font-semibold text-white"
			>
				{category}
			</div>
		</div>
		<div class="flex flex-grow flex-col p-4">
			<h3
				class="mb-2 line-clamp-2 text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-600"
			>
				{title}
			</h3>
			<div class="mb-3 flex items-center gap-x-2 text-xs text-gray-600">
				<IconBadge size="sm" icon={BookOpen} />
				<span>{chapterLength} {chapterLength === 1 ? 'Chapter' : 'Chapters'}</span>
			</div>
			{#if progress !== null && progress !== undefined}
				<div class="relative mt-auto pt-1">
					<div class="mb-1 flex items-center justify-between">
						<div>
							<span
								class="inline-block rounded-full bg-blue-200 px-2 py-1 text-xs font-semibold uppercase text-blue-600"
							>
								Progress
							</span>
						</div>
						<div class="text-right">
							<span class="inline-block text-xs font-semibold text-blue-600">
								{progress}%
							</span>
						</div>
					</div>
					<div class="mb-1 flex h-2 overflow-hidden rounded bg-blue-200 text-xs">
						<div
							style="width:{progress}%"
							class="flex flex-col justify-center whitespace-nowrap bg-blue-500 text-center text-white shadow-none"
						></div>
					</div>
				</div>
			{:else}
				<div class="mt-auto flex items-center justify-center">
					<span class="text-lg font-bold text-blue-600">{formatCurrency(price || 0)}</span>
					<!-- <Button
						variant="outline"
						size="sm"
						class="transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white"
					>
						<DollarSign class="mr-1 h-3 w-3" />
						Buy Now
					</Button> -->
				</div>
			{/if}
		</div>
	</div>
</a>
