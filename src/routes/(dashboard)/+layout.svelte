<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<div class="h-full">
	<div class="fixed inset-y-0 z-50 h-[5rem] w-full md:pl-40">
		<Navbar />
	</div>
	<div class="fixed inset-y-0 z-50 hidden h-full w-40 flex-col md:flex">
		<Sidebar />
	</div>
	<main class="h-full pt-[5rem] md:pl-40">
		<slot />
	</main>
</div>
