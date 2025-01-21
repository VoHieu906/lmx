<script lang="ts">
	import { ChartNoAxesColumnIncreasing, List } from 'lucide-svelte';
	import SidebarItem from './SidebarItem.svelte';

	const routes = [
		{
			icon: List,
			label: 'Course',
			href: '/teacher/courses'
		},
		{
			icon: ChartNoAxesColumnIncreasing,
			label: 'Analytics',
			href: '/teacher/analytics'
		}
	];
</script>

<div class="flex w-full flex-col">
	{#each routes as { href, icon, label }}
		<SidebarItem {href} {icon} {label} />
	{/each}
</div>
