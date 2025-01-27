<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { chapterCommentSchema } from '$lib/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import Textarea from './ui/textarea/textarea.svelte';
	import { error } from '@sveltejs/kit';

	export let data: SuperValidated<Infer<typeof chapterCommentSchema>>;

	const form = superForm(data, {
		validators: zodClient(chapterCommentSchema)
	});

	const { form: formData, delayed } = form;
	let submitting = false;
	let fileInput: HTMLInputElement | null = null;
	async function handleSubmit(event: Event) {
		event.preventDefault();
		submitting = true;

		//simulate the form submission logic
		const formElement = event.target as HTMLFormElement;
		const formData = new FormData(formElement);
		try {
			const response = await fetch(formElement.action, { method: 'POST', body: formData });
			if (response.ok) {
				form.reset();
				if (fileInput) fileInput.value = '';
				toast.success('Submitted successfully!');
			} else {
				const errorData = await response.json();
				toast.error(errorData.message || 'Submission failed');
			}
		} catch (e) {
			console.log('Error submitting the form', error);
			toast.error('An expected error occurred');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="mt-6">
	<form
		method="POST"
		action="?/createComment"
		enctype="multipart/form-data"
		class="mt-4 space-y-4"
		on:submit={handleSubmit}
	>
		<Form.Field {form} name="comment">
			<Form.Control let:attrs>
				<div class="flex items-center">
					<img src="" alt="User Avatar" class="size-10 rounded-full" />
					<Textarea
						{...attrs}
						class="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
						placeholder="Add a comment..."
						bind:value={$formData.comment}
					/>
				</div>
				<Form.FieldErrors />
				<div class="flex items-center justify-end space-x-4">
					<!-- File upload button -->
					<input
						type="file"
						accept="image/*, .pdf, .doc, .docx"
						class="file-input hidden"
						id="fileInput"
						name="file"
						bind:this={fileInput}
					/>
					<label
						for="fileInput"
						class="mt-2 cursor-pointer rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
					>
						Add file
					</label>

					<!-- Submit button -->
					<button
						type="submit"
						class="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
						disabled={submitting}
					>
						{submitting ? 'Submitting...' : 'Submit'}
					</button>
				</div>
			</Form.Control>
		</Form.Field>
	</form>
</div>
