<script lang="ts">
	import { ChartNoAxesColumnIncreasing, Compass, Layout, List, Route } from 'lucide-svelte';
	import SidebarItem from './SidebarItem.svelte';
	import { page } from '$app/stores';

	const guestRoutes = [
		{
			icon: Layout,
			label: 'Course',
			href: '/'
		},
		{
			icon: Compass,
			label: 'Analytics',
			href: '/search'
		}
	];
	const teacherRoutes = [
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
	$: pathname = $page.url.pathname;
	$: isTeacherPage = pathname?.startsWith('/teacher');
	$: routes = isTeacherPage ? teacherRoutes : guestRoutes;
</script>

<div class="flex w-full flex-col">
	{#each routes as { href, icon, label }}
		<SidebarItem {href} {icon} {label} />
	{/each}
</div>
