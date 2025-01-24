<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Loader2, Pencil } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { chapterDescriptionSchema } from '$lib/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import Textarea from './ui/textarea/textarea.svelte';
	import { cn } from '$lib/utils';
	export let data: SuperValidated<Infer<typeof chapterDescriptionSchema>>;
	let isEditing = false;
	function toggleEdit() {
		isEditing = !isEditing;
	}
	const form = superForm(data, {
		validators: zodClient(chapterDescriptionSchema),
		onUpdated({ form }) {
			if (form.message) {
				if (!form.valid) {
					toast.error(form.message);
				}
				if (form.valid) {
					toast.success(form.message);
					toggleEdit();
				}
			}
		}
	});
	const { form: formData, enhance, delayed, submitting } = form;
</script>

<div class="mt-6 rounded-md border bg-muted p-4">
	<div class="flex items-center justify-between font-medium">
		Chapter description
		<Button on:click={toggleEdit} variant="ghost">
			{#if isEditing}
				Cancel
			{:else}
				<Pencil class="mr-2 size-4" />
				Edit description
			{/if}
		</Button>
	</div>
	{#if !isEditing}
		<p class={cn('mt-2 break-all text-sm', { 'text-muted-foreground': !data.data.description })}>
			{data.data.description || ' No description'}
		</p>
	{:else}
		<form method="POST" use:enhance class="mt-4 space-y-4" action="?/updateDescription">
			<Form.Field {form} name="description">
				<Form.Control let:attrs>
					<Textarea
						{...attrs}
						placeholder="This course is about..."
						bind:value={$formData.description}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex items-center gap-x-2">
				<Form.Button disabled={$submitting}
					>{#if $delayed}
						<Loader2 class="size-6 animate-spin " />
					{:else}
						Save
					{/if}
				</Form.Button>
			</div>
		</form>
	{/if}
</div>
