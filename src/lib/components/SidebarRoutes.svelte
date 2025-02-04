<script lang="ts">
	import {
		BookA,
		ChartNoAxesColumnIncreasing,
		Home,
		IceCreamBowl,
		List,
		Settings
	} from 'lucide-svelte';
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
			label: 'Courses',
			href: '/search'
		},
		{
			icon: IceCreamBowl,
			label: 'Achievements',
			href: '/achievements'
		}
	];
	const teacherRoutes = [
		{
			icon: List,
			label: 'Courses',
			href: '/teacher/courses'
		},
		{
			icon: ChartNoAxesColumnIncreasing,
			label: 'Analytics',
			href: '/teacher/analytics'
		},
		{
			icon: Settings,
			label: 'Settings',
			href: '/teacher/settings'
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
