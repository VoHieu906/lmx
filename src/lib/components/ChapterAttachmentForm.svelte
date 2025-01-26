<script lang="ts">
	import { Files, ImageIcon, Loader2, Pencil, PlusCircle, UploadCloud, X } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import type { Attachment } from '$lib/type';
	import { fly, slide } from 'svelte/transition';
	export let attachments: Attachment[];
	let isEditing = false;
	let fileInput: FileList | null;
	let upLoading = false;
	let deletingId: string | null;
	let deleting: string[] = [];
	function toggleEdit() {
		isEditing = !isEditing;
	}
</script>

<div class="mt-6 rounded-md border bg-muted p-4">
	<div class="flex items-center justify-between font-medium">
		Chapter attachments
		<Button on:click={toggleEdit}>
			{#if isEditing}
				Cancel
			{:else if !attachments.length}
				<PlusCircle class="mr-2 size-4" />
				Add a file
			{:else}
				<Pencil class="mr-2 size-4" />
				Edit file
			{/if}
		</Button>
	</div>
	{#if isEditing}
		<form
			action="?/createAttachment"
			method="POST"
			use:enhance={() => {
				upLoading: true;
				return async ({ update, result }) => {
					await update();
					upLoading = false;
					fileInput = null;
					if (result) {
						if (result.type === 'failure') {
							toast.error(result?.data?.message.toString() || ' ');
						}
						if (result.type === 'error') {
							toast.error(result?.error?.message.toString());
						}
						if (result.type === 'success') {
							toast.success(result.data.message.toString() || '');
							toggleEdit();
						}
					}
					invalidateAll();
				};
			}}
			enctype="multipart/form-data"
			class="mt-4"
		>
			<div class="relative">
				<input
					type="file"
					accept="image/*"
					name="file"
					bind:files={fileInput}
					class="h-60 w-full rounded-md border border-slate-300 bg-transparent text-transparent file:hidden"
				/>
				<div
					class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-2 text-center"
				>
					<UploadCloud class="mx-auto size-10" />
					<div>
						<p class="text-blue text-sm font-medium capitalize">Choose file or drag and drop</p>
						<p class="text-sm">file(4mb)</p>
					</div>
					{#if fileInput?.length === 1}
						<button
							type="submit"
							class="pointer-events-auto rounded-md bg-blue-700 px-3 py-2 font-semibold capitalize text-white"
						>
							{#if upLoading}
								<Loader2 class="size-6 animate-spin" />
							{:else}
								Upload {fileInput.length} file
							{/if}
						</button>
					{/if}
				</div>
			</div>
			<p class="mt-4 text-xs text-muted-foreground">
				Add anything your students might need to complete this chapter
			</p>
		</form>
	{:else if attachments.length}
		{#each attachments.filter((attachment) => !deleting.includes(attachment.id)) as attachment (attachment.id)}
			<div
				in:fly={{ y: 20 }}
				out:slide
				class="mt-3 flex w-full items-center gap-x-2 rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
			>
				<Files class="m-2 size-4 flex-shrink-0" />
				<p class="line-clamp-1 text-xs">
					{attachment.name}
				</p>
				<form
					action="?/deleteAttachment"
					method="POST"
					use:enhance={() => {
						deleting = [...deleting, attachment.id];
						toast.success('successfully deleted course attachment');
						return async ({ update, result }) => {
							await update();
							deleting = deleting.filter((id) => id !== attachment.id);
							if (result) {
								if (result.type === 'failure') {
									toast.error(result?.data?.message.toString() || ' ');
								}
								if (result.type === 'error') {
									toast.error(result?.error?.message.toString());
								}
							}
						};
					}}
					class="ml-auto"
				>
					<input type="hidden" name="id" value={attachment.id} />
					<button class="transition-all hover:opacity-75">
						<X class="size-4" />
					</button>
				</form>
			</div>
		{/each}
	{:else}
		<div class="flex h-60 items-center justify-center rounded-md bg-slate-200">
			<ImageIcon class="size-10 text-muted-foreground" />
		</div>
	{/if}
</div>
