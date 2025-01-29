<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { chapterCommentSchema } from '$lib/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import Textarea from './ui/textarea/textarea.svelte';

	export let data: SuperValidated<Infer<typeof chapterCommentSchema>>;
	export let parentId: string | null = null;
	const form = superForm(data, {
		validators: zodClient(chapterCommentSchema)
	});

	const { form: formData, delayed } = form;
	let submitting = false;
	let fileInput: HTMLInputElement | null = null;
	let uploadedFile: File | null = null;

	async function handleSubmit(event: Event) {
		event.preventDefault();
		submitting = true;

		const formElement = event.target as HTMLFormElement;
		const formData = new FormData(formElement);

		// Include parentId if replying to a comment
		if (parentId) {
			formData.append('parentId', parentId);
		}

		try {
			const response = await fetch(formElement.action, { method: 'POST', body: formData });
			if (response.ok) {
				form.reset();
				toast.success('Submitted successfully!');
			} else {
				const errorData = await response.json();
				toast.error(errorData.message || 'Submission failed');
			}
		} catch (e) {
			toast.error('An unexpected error occurred');
		} finally {
			submitting = false;
		}
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			uploadedFile = target.files[0];
		}
	}

	function removeFile() {
		uploadedFile = null;
		if (fileInput) fileInput.value = '';
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
				<div class="flex items-center gap-x-4">
					<img src="https://github.com/shadcn.png" alt="User Avatar" class="size-10 rounded-full" />
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
					{#if uploadedFile}
						<div
							class="flex items-center space-x-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2"
						>
							<span class="text-sm text-gray-700">{uploadedFile.name}</span>
							<button
								type="button"
								on:click={removeFile}
								class="text-red-500 hover:text-red-700 focus:outline-none"
							>
								X
							</button>
						</div>
					{:else}
						<input
							type="file"
							accept="image/*, .pdf, .doc, .docx"
							class="file-input hidden"
							id="fileInput"
							name="file"
							bind:this={fileInput}
							on:change={handleFileChange}
						/>
						<label
							for="fileInput"
							class="mt-2 cursor-pointer rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
						>
							Add file
						</label>
					{/if}

					<!-- Submit button -->
					<button
						type="submit"
						class="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
						disabled={submitting || !$formData.comment}
					>
						{submitting ? 'Submitting...' : 'Submit'}
					</button>
				</div>
			</Form.Control>
		</Form.Field>
	</form>
</div>
