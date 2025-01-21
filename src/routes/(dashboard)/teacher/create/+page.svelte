<script lang="ts">
	import { titleSchema } from '$lib/schema.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	export let data;
	const form = superForm(data.form, {
		validators: zodClient(titleSchema),
		onUpdated({ form }) {
			if (form.message) {
				if (!form.valid) {
					toast.error(form.message);
				}
				if (form.valid) {
					toast.success(form.message);
				}
			}
		}
	});
	const { form: formData, enhance, delayed, submitting } = form;
</script>

<div class="mx-auto flex h-full max-w-5xl border p-6 md:items-center md:justify-center">
	<div>
		<h1 class="text-2xl">Name Your course</h1>
		<p class="text-sm text-muted-foreground">
			What would you like to name your course? don't worry, you can change it later
		</p>
		<form action="/teacher/create" method="POST" use:enhance class="mt-8 space-y-8">
			<Form.Field {form} name="title">
				<Form.Control let:attrs>
					<Form.Label>Title</Form.Label>
					<Input disabled={$submitting} {...attrs} bind:value={$formData.title} />
				</Form.Control>
				<Form.Description>What would you teach in this course</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex items-center gap-x-2">
				<Button variant="ghost" href="/">Cancel</Button>
				<Form.Button>
					{#if $delayed}
						<Loader2 class="size-6 animate-spin" />
					{:else}
						continue
					{/if}
				</Form.Button>
			</div>
		</form>
	</div>
</div>
