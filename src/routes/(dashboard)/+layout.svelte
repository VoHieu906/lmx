<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { userStore } from '$lib/stores/authStore.js';

	export let data;
	let { userInfo } = data;
	userStore.set(userInfo || null);
</script>

<div class="h-full">
	<div class="fixed inset-y-0 z-50 md:pl-48">
		<Navbar />
	</div>
	<div class="fixed inset-y-0 z-50 hidden h-full w-48 flex-col md:flex">
		<Sidebar />
	</div>
	<main class="h-full md:pl-48">
		<slot />
	</main>
</div>
