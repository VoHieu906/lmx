<script lang="ts">
	import NavbarRoutes from './NavbarRoutes.svelte';
	import SidebarRoutes from './SidebarRoutes.svelte';
</script>

<div class="flex h-full flex-col overflow-y-auto border-r bg-background shadow-sm">
	<div class="p-6">LOGO</div>
	<div class="flex h-full w-full flex-col justify-between">
		<SidebarRoutes />

		<NavbarRoutes />
	</div>
</div>
