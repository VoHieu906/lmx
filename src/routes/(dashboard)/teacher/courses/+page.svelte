<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { PlusCircle } from 'lucide-svelte';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	export let data;
	const table = createTable;
</script>

<div class="p-6">
	<div class="flex items-center py-4">
		<Button href="/teacher/create" class="ml-auto">
			<PlusCircle class=" mr-2 size-4" />
			New course
		</Button>
	</div>
</div>
