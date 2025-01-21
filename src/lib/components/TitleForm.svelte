<script lang="ts">
	import { Loader2, Pencil } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import { page } from '$app/stores'; // Correct import from $app/stores
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { titleSchema } from '$lib/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { Infer } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import Input from './ui/input/input.svelte';
	type TitleSchema = typeof titleSchema;
	export let data: SuperValidated<Infer<TitleSchema>>;

	const form = superForm(data, {
		validators: zodClient(titleSchema)
	});

	const { form: formData, enhance, delayed, submitting } = form;
	let isEditing = false;

	function toggleEdit() {
		isEditing = !isEditing;
	}
</script>

<div class="mt-6 rounded-md border bg-muted p-4">
	<div class="flex items-center justify-between font-medium">
		Course Title
		<Button on:click={toggleEdit} type="button" variant="ghost">
			{#if isEditing}
				Cancel
			{:else}
				<Pencil class="mr-2 size-4" />
				Edit Title
			{/if}
		</Button>
	</div>
	{#if !isEditing}
		<p class="mt-2 text-sm">This is the title</p>
	{:else}
		<form
			action="/teacher/courses/{$page.params.courseId}/?/updateTitle"
			method="POST"
			use:enhance
			class="mt-4 space-y-4"
		>
			<Form.Field {form} name="title">
				<Form.Control let:attrs>
					<Form.Label>Title</Form.Label>
					<Input {...attrs} placeholder="Advance web development" bind:value={$formData.title} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex items-center gap-x-2">
				<Form.Button>
					{#if $delayed}
						<Loader2 class="size-6 animate-spin" />
					{:else}
						Save
					{/if}
				</Form.Button>
			</div>
		</form>
	{/if}
</div>
