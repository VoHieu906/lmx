<script lang="ts">
	import { ImageIcon, Loader2, Pencil, PlusCircle, UploadCloud } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	export let thumbnailUrl: string | undefined;

	//to switch isEditing back to false
	let isEditing = false;
	let fileInput: FileList | null;
	let upLoading = false;
	function toggleEdit() {
		isEditing = !isEditing;
	}
</script>

<div class="mt-6 rounded-md border bg-muted p-4">
	<div class="flex items-center justify-between font-medium">
		Video Thumbnail
		<Button on:click={toggleEdit}>
			{#if isEditing}
				Cancel
			{:else if !thumbnailUrl}
				<PlusCircle class="mr-2 size-4" />
				Add an image
			{:else}
				<Pencil class="mr-2 size-4" />
				Edit image
			{/if}
		</Button>
	</div>
	{#if isEditing}
		<form
			action="?/updateThumbnail"
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
					name="thumbnail"
					bind:files={fileInput}
					class="h-60 w-full rounded-md border border-slate-300 bg-transparent text-transparent file:hidden"
				/>
				<div
					class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-2 text-center"
				>
					<UploadCloud class="mx-auto size-10" />
					<div>
						<p class="text-blue text-sm font-medium capitalize">Choose file or drag and drop</p>
						<p class="text-sm">image(4mb)</p>
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
		</form>
	{:else if thumbnailUrl}
		<img src={thumbnailUrl} alt="" class="mt-2 aspect-video w-full rounded-md object-cover" />
	{:else}
		<div class="flex h-60 items-center justify-center rounded-md bg-slate-200">
			<ImageIcon class="size-10 text-muted-foreground" />
		</div>
	{/if}
</div>
