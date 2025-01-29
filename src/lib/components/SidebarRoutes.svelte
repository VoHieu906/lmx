<script lang="ts">
	import { BookA, ChartNoAxesColumnIncreasing, Home, List } from 'lucide-svelte';
	import SidebarItem from './SidebarItem.svelte';
	import { page } from '$app/stores';

	const guestRoutes = [
		{
			icon: Home,
			label: 'Home',
			href: '/'
		},
		{
			icon: BookA,
			label: 'Course',
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
