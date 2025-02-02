<script lang="ts">
	import { getRandomColor } from '$lib/actions/getRandomColor';
	import type { Comment } from '$lib/type';
	import { timeAgo } from '$lib/utils';
	import { Files, Reply } from 'lucide-svelte';
	import { onMount } from 'svelte';
	let replyFormVisible: Record<string, boolean> = {};
	let showCommentForm = false;
	let userAvatarColor: string;
	function toggleReplyForm(commentId: string) {
		replyFormVisible[commentId] = !replyFormVisible[commentId];

		replyFormVisible = { ...replyFormVisible };
	}
	onMount(() => {
		const storedColor = localStorage.getItem('userAvatarColor');
		userAvatarColor = storedColor || getRandomColor();
		if (!storedColor) {
			localStorage.setItem('userAvatarColor', userAvatarColor);
		}
	});
	export let cmt: Comment;
</script>

<div class="flex space-x-4 rounded-lg py-4">
	{#if cmt?.expand?.user?.avatar}
		<img src={cmt?.expand?.user?.avatar} alt="User Avatar" class="h-10 w-10 rounded-full" />
	{:else}
		<div
			class={`flex h-10 w-10 items-center justify-center rounded-full font-medium text-white ${userAvatarColor}`}
		>
			{cmt?.expand?.user?.username ? cmt?.expand?.user?.username[0].toUpperCase() : '?'}
		</div>
	{/if}

	<div class="flex-1">
		<div class="flex justify-between">
			<p class="text-sm font-medium text-gray-700">{cmt?.expand?.user?.username}</p>
			<p class="text-xs text-gray-500">{timeAgo(cmt.created)}</p>
		</div>
		<p class="mt-1 text-gray-600">{cmt.content}</p>

		{#if cmt.file}
			<div class="flex w-[20%] items-center rounded border border-sky-200 bg-sky-100 p-2">
				<Files class="m-1 size-4 flex-shrink-0" />
				<p class="line-clamp-1 text-xs">{cmt.file}</p>
			</div>
		{/if}

		<div class="mt-2 flex space-x-4 text-sm text-gray-500">
			<button class="hover:text-blue-500">Like</button>
			<button class="hover:text-blue-500" on:click={() => toggleReplyForm(cmt.id)}><Reply /></button
			>
		</div>

		<!-- Show Reply Form when replyFormVisible[cmt.id] is true -->
		<!-- {#if replyFormVisible[cmt.id]}
			<div class=" mt-4">
				<ChapterCommentForm data={data.chapterCommentForm} parentId={cmt.id} />
			</div>
		{/if} -->

		<!-- Recursive Display of Replies -->
		{#if cmt.replies}
			<div class="ml-12 mt-4 border-l-2 border-gray-300 pl-4">
				{cmt.replies}
			</div>
		{/if}
	</div>
</div>
