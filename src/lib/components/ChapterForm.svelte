<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	import { Loader2, PlusCircle } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import { chapterTitleSchema } from '$lib/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Input from './ui/input/input.svelte';
	import type { Chapter } from '$lib/type';
	import ChapterList from './ChapterList.svelte';
	export let data: SuperValidated<Infer<typeof chapterTitleSchema>>;
	const form = superForm(data, {
		validators: zodClient(chapterTitleSchema),
		onUpdated({ form }) {
			if (form.message) {
				if (!form.valid) {
					toast.error(form.message);
				}
				if (form.valid) {
					toast.success(form.message);
					toggleCreating();
				}
			}
		}
	});
	const { form: formData, enhance, delayed, submitting } = form;
	export let chapters: Chapter[];
	let isCreating = false;
	function toggleCreating() {
		isCreating = !isCreating;
	}
</script>

<div class="mt-6 rounded-md border bg-muted p-4">
	<div class="flex items-center justify-between font-medium">
		Course Chapters

		<Button on:click={toggleCreating} variant="ghost">
			{#if isCreating}
				cancel
			{:else}
				<PlusCircle class="mr-2 size-4" />
				Add a chapter
			{/if}
		</Button>
	</div>
	{#if isCreating}
		<form
			method="POST"
			use:enhance
			action="/teacher/courses/{$page.params.courseId}/?/createChapter"
			class="mt-4 space-y-4"
		>
			<Form.Field {form} name="title">
				<Form.Control let:attrs>
					<Form.Label>Title</Form.Label>
					<Input
						{...attrs}
						bind:value={$formData.title}
						placeholder="e.g. introduction to the course"
						disabled={$submitting}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button disabled={$submitting}
				>{#if $delayed}
					<Loader2 class="size-6 animate-spin " />
				{:else}
					create
				{/if}</Form.Button
			>
		</form>
	{:else if chapters.length}
		<ChapterList items={chapters} />
		<p class="mt-4 text-xs text-muted-foreground">Drag and Drop to reorder the chapters</p>
	{:else}
		<div class="mt-2 text-sm italic text-slate-500">No Chapters</div>
	{/if}
</div>
