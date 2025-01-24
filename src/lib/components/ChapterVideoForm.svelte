<script lang="ts">
	import type { Chapter } from '$lib/type';
	import Button from './ui/button/button.svelte';
	import { Loader2, Pencil, PlusCircle, UploadCloud, VideoIcon } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';

	export let initialData: Chapter;
	let isEditing = false;
	let fileInput: FileList | null;
	let upLoading = false;
	function toggleEdit() {
		isEditing = !isEditing;
	}
</script>

<div class="mt-6 rounded-md border bg-muted p-4">
	<div class="flex items-center justify-between font-medium">
		Chapter Video

		<Button on:click={toggleEdit} variant="ghost">
			{#if isEditing}
				cancel
			{:else if !initialData.videoUrl}
				<PlusCircle class="mr-2 size-4" />
				Add a video
			{:else}
				<Pencil class="mr-2 size-4" />
				Edit image
			{/if}
		</Button>
	</div>
	{#if isEditing}
		<form
			action="?/updateVideo"
			enctype="multipart/form-data"
			method="POST"
			use:enhance={() => {
				upLoading = true;
				return async ({ update, result }) => {
					await update();
					upLoading = false;
					fileInput = null;
					if (result) {
						if (result.type === 'failure') {
							toast.error(result.data?.message?.toString() || '');
						}
						if (result.type === 'error') {
							toast.error(result.error.message);
						}
						if (result.type === 'success') {
							toast.success(result.data?.message?.toString() || '');
							toggleEdit();
						}
					}
					invalidateAll();
				};
			}}
			class=" mt-4"
		>
			<div class="relative">
				<input
					type="file"
					name="video"
					accept="video/*"
					bind:files={fileInput}
					class=" h-60 w-full rounded-md border border-slate-300 bg-transparent text-transparent file:hidden"
				/>
				<div
					class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-2 text-center"
				>
					<UploadCloud class="mx-auto h-10 w-10 " />
					<div>
						<p class="text-sm font-semibold capitalize text-blue-600">
							choose file or drag and drop
						</p>
						<p class="text-sm">Video</p>
					</div>
					{#if fileInput?.length === 1}
						<button
							class="pointer-events-auto rounded-md bg-blue-700 px-3 py-2 font-semibold capitalize text-white"
							type="submit"
						>
							{#if upLoading}
								<Loader2 class="size-6 animate-spin " />
							{:else}
								upload {fileInput?.length} file
							{/if}
						</button>
					{/if}
				</div>
			</div>
			<p class="mt-4 text-xs text-muted-foreground">upload this chapter's video</p>
		</form>
	{:else if initialData.videoUrl}
		<div class="mt-4">
			<video src={initialData.videoUrl} controls class="w-full rounded-md">
				<track kind="captions" />
			</video>
		</div>
		<div class="mt-2 text-xs text-muted-foreground">
			Videos can take a few minutes to process, refresh the page if video does not appear
		</div>
	{:else}
		<div class="flex h-60 items-center justify-center rounded-md bg-slate-200">
			<VideoIcon class="h-10 w-10 text-muted-foreground" />
		</div>
	{/if}
	<!-- {#if initialData.videoUrl && !isEditing}
		
	{/if} -->
</div>
