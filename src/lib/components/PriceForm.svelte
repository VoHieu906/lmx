<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { page } from '$app/stores';
	import { Loader2, Pencil } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { priceSchema } from '$lib/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { cn, formatCurrency } from '$lib/utils';
	import Input from './ui/input/input.svelte';
	export let data: SuperValidated<Infer<typeof priceSchema>>;
	let isEditing = false;
	function toggleEdit() {
		isEditing = !isEditing;
	}
	const form = superForm(data, {
		validators: zodClient(priceSchema),
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
	$: price = data.data.price!;
</script>

<div class="mt-6 rounded-md border bg-muted p-4">
	<div class="flex items-center justify-between font-medium">
		Course price
		<Button on:click={toggleEdit} variant="ghost">
			{#if isEditing}
				Cancel
			{:else}
				<Pencil class="mr-2 size-4" />
				Edit price
			{/if}
		</Button>
	</div>
	{#if !isEditing}
		<p class={cn('mt-2 break-all text-sm', { 'text-muted-foreground': !data.data.price })}>
			{#if price === 0}
				<span>Free</span>
			{:else}
				{(price && formatCurrency(price)) || 'No price'}
			{/if}
		</p>
	{:else}
		<form
			method="POST"
			use:enhance
			class="mt-4 space-y-4"
			action="/teacher/courses/{$page.params.courseId}/?/updatePrice"
		>
			<Form.Field {form} name="price">
				<Form.Control let:attrs>
					<Form.Label>Price</Form.Label>
					<Input
						{...attrs}
						placeholder="Set a price for your code"
						bind:value={$formData.price}
						type="number"
						step="1"
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
					{/if}</Form.Button
				>
			</div>
		</form>
	{/if}
</div>
