<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import type { IconProps } from 'lucide-svelte';
	import type { Component } from 'svelte';
	export let href: string;
	export let label: string;
	export let icon: Component<IconProps>;
	$: pathname = $page.url.pathname;
	$: isActive =
		(pathname === '/' && href === '/') || pathname === href || pathname.startsWith(`${href}/`);
</script>

<a
	{href}
	class={cn(
		'flex items-center gap-x-2 pl-6 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-slate-600',
		{ 'bg-primary/20 text-primary hover:bg-primary/20 hover:text-primary': isActive }
	)}
>
	<div class="flex items-center gap-x-2 py-4">
		<svelte:component
			this={icon}
			class={cn('text-muted-foreground', { 'text-primary': isActive })}
			size={22}
		/>
		{label}
	</div>
	<div
		class={cn('ml-auto h-full border-2 border-primary opacity-0 transition-all', {
			'opacity-100': isActive
		})}
	></div>
</a>
