<script lang="ts">
	import { writable } from 'svelte/store';
	import NotificationCard from '$lib/components/NotificationCard.svelte';

	import { onMount, onDestroy } from 'svelte';
	import { markAsRead, notificationsStore } from '$lib/stores/notificationsStore';

	type NotificationType = 'all' | 'unread';

	const selectedTab = writable<NotificationType>('all');

	onMount(() => {
		notificationsStore.init();
	});

	onDestroy(() => {
		notificationsStore.unsubscribe();
	});

	async function handleMarkAsRead(notificationId: string) {
		await markAsRead(notificationId);
	}

	async function markAllAsRead() {
		const promises = $notificationsStore.map((notification) => markAsRead(notification.id));
		await Promise.all(promises);
	}

	$: filteredNotifications =
		$selectedTab === 'all' ? $notificationsStore : $notificationsStore.filter((n) => !n.isRead);

	$: hasUnreadNotifications = $notificationsStore.some((n) => !n.isRead);
</script>

<div class="mx-auto max-w-2xl p-4">
	<!-- Navigation Bar -->
	<nav class="mb-6 flex justify-between border-b">
		<div class="flex gap-8">
			<button
				class="relative px-6 py-3 font-medium {$selectedTab === 'all'
					? 'text-blue-600'
					: 'text-gray-600 hover:text-gray-900'}"
				on:click={() => selectedTab.set('all')}
			>
				All
				{#if $selectedTab === 'all'}
					<div class="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600"></div>
				{/if}
			</button>
			<button
				class="relative px-6 py-3 font-medium {$selectedTab === 'unread'
					? 'text-blue-600'
					: 'text-gray-600 hover:text-gray-900'}"
				on:click={() => selectedTab.set('unread')}
			>
				Unread
				{#if $selectedTab === 'unread'}
					<div class="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600"></div>
				{/if}
			</button>
		</div>
		<div class="flex items-center gap-4">
			{#if hasUnreadNotifications}
				<button
					on:click={markAllAsRead}
					class="text-sm font-medium text-blue-600 hover:text-blue-700"
				>
					Mark all as read
				</button>
			{/if}
			<span class="text-sm font-medium text-gray-600">
				{filteredNotifications.length}
				{$selectedTab === 'all' ? 'Total' : 'Unread'}
			</span>
		</div>
	</nav>

	<!-- Notification Cards -->
	<div class="space-y-3">
		{#each filteredNotifications as notification (notification.id)}
			<button
				type="button"
				class="w-full text-left"
				on:click={() => handleMarkAsRead(notification.id)}
				aria-label="Mark notification as read"
			>
				<NotificationCard {notification} />
			</button>
		{/each}

		{#if filteredNotifications.length === 0}
			<div class="py-12 text-center">
				<p class="text-gray-500">No notifications to display</p>
			</div>
		{/if}
	</div>
</div>
