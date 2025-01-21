<script lang="ts">
	// Supports weights 100-900
	import '@fontsource-variable/noto-sans';
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher defaultMode={'light'} />
<Toaster richColors closeButton theme="light" />
<main class="h-screen">
	{@render children()}
</main>
