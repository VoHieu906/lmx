<script lang="ts">
	import { timeAgo } from '$lib/utils';

	export let notification;
	console.log(notification);
</script>

<div
	class="rounded-lg border bg-white p-4 transition-all hover:shadow-md {!notification.isRead
		? 'border-l-4 border-l-blue-500 bg-blue-50/50'
		: 'border-gray-100'}"
>
	<div class="flex items-center gap-3">
		<div class="flex-1">
			<p class="text-gray-900 {!notification.isRead ? 'font-medium' : ''}">
				{notification.lMessage}
			</p>
			<p class="mt-1 text-sm text-gray-500">{timeAgo(notification.created)}</p>
		</div>
		{#if !notification.isRead}
			<div class="h-2 w-2 rounded-full bg-blue-500"></div>
		{/if}
	</div>
</div>
