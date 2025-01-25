<script lang="ts">
	import { BookOpen } from 'lucide-svelte';
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

<a href="/courses/{id}" class="">
	<div class="p3 group h-full overflow-hidden rounded-lg border transition hover:shadow-sm">
		<img alt={title} class="aspect-video w-full rounded-md object-cover" src={imageUrl} />
		<div class="flex flex-col p-2">
			<div
				class="line-clamp-2 text-lg font-medium transition group-hover:text-sky-700 md:text-base"
			>
				{title}
			</div>
			<p class="text-xs text-muted-foreground">
				{category}
			</p>
			<div class="my-3 flex items-center gap-x-2 text-sm md:text-xs">
				<div class="flex items-center gap-x-1 text-slate-500">
					<IconBadge size="sm" icon={BookOpen} />
					<span>
						{chapterLength}
					</span>
				</div>
			</div>
			{#if progress !== null && progress !== undefined}
				<div class="mt-2 h-2.5 w-full rounded-full bg-gray-200">
					<div class="h-2.5 rounded-full bg-blue-500" style="width: {progress}%"></div>
				</div>
			{:else}
				<div class="mt-2 h-2.5 w-full rounded-full bg-gray-200">
					<div class="h-2.5 rounded-full bg-blue-500" style="width: 0%"></div>
				</div>
				<p>
					{formatCurrency(price || 0)}
				</p>
			{/if}

			<Button variant="secondary" class="hover:text-blue-500">
				{#if price === 0}
					Subscribe
				{:else}
					Purchase
				{/if}
			</Button>
		</div>
	</div>
</a>
