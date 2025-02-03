<script lang="ts">
	import LogOut from 'lucide-svelte/icons/log-out';
	import { Bell } from 'lucide-svelte';
	import { page } from '$app/stores';
	import Button from './ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { enhance } from '$app/forms';
	import { LucideMessageCircleQuestion, PersonStandingIcon } from 'lucide-svelte';

	import { userStore } from '$lib/stores/authStore.js';

	import { markAsRead, notificationsStore } from '$lib/stores/notificationsStore';
	import { onDestroy, onMount } from 'svelte';

	$: pathname = $page.url.pathname;
	$: isTeacherPage = pathname?.startsWith('/teacher');
	$: isPlayerPage = pathname?.includes('chapter');

	$: unreadMessages = $notificationsStore.filter((item) => !item.isRead).length;
	let error = '';

	// function handleMarkAsRead(notification: Notification) {
	// 	markAsRead(notification.id).catch((err) => {
	// 		error = 'Failed to mark notification as read. Please try again.';
	// 		console.error(err);
	// 	});
	// }
	onMount(() => {
		notificationsStore.init().catch((err) => {
			error = 'Failed to load notifications. Please refresh the page.';
			console.error(err);
		});
		onDestroy(async () => {
			await notificationsStore.unsubscribe(); // Await the unsubscribe promise
		});
	});
</script>

<div
	class="flex flex-col items-center gap-y-4 p-4 text-muted-foreground transition-all hover:text-slate-600"
>
	<!-- User and Notification Section -->
	<div class="flex w-full items-center justify-between border-b pb-4">
		<!-- User Info Column -->
		<div class="flex min-w-0 flex-1 items-center gap-x-2">
			<Avatar.Root>
				<Avatar.Image
					class="size-8 flex-shrink-0 rounded-full border border-muted sm:size-10"
					src="https://github.com/shadcn.png"
					alt="@shadcn"
				/>
				<Avatar.Fallback
					class="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-muted sm:size-8"
				>
					VH
				</Avatar.Fallback>
			</Avatar.Root>
			<div class="flex min-w-0 flex-col">
				<p class="truncate text-sm font-medium text-slate-700 transition-all hover:text-primary">
					{$userStore?.username}
				</p>
				<p class="truncate text-xs text-muted-foreground">
					{$userStore?.email}
				</p>
			</div>
		</div>

		<!-- Notification Bell Column -->
		<div class="relative ml-4 flex-shrink-0">
			<Tooltip.Root>
				<Tooltip.Trigger>
					<div
						class="relative appearance-none border-none bg-transparent p-0"
						aria-label="Notifications"
					>
						<a href="/notifications"><Bell class="size-6 text-slate-600" /></a>

						{#if unreadMessages > 0}
							<span
								class="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white"
								aria-label={`${unreadMessages} unread notifications`}
							>
								{unreadMessages}
							</span>
						{/if}
					</div>
				</Tooltip.Trigger>
				<Tooltip.Content
					side="right"
					sideOffset={5}
					class="duration-50 z-50 min-w-[12rem] rounded-md border border-gray-500 bg-white p-2 shadow-xl"
				>
					<div class=" text-gray-800">
						<p class="mb-1 font-semibold">Unread Messages:</p>
						<ul class="list-disc pl-4">
							{#each $notificationsStore as item}
								<li>
									<a href="/">{item.sMessage}</a>
								</li>
							{/each}
						</ul>
					</div>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	</div>

	<!-- Buttons Section -->
	<div class="flex w-full flex-col gap-y-2">
		{#if isTeacherPage || isPlayerPage}
			<!-- Updated Logout Button -->
			<Button
				href="/"
				size="sm"
				class="flex w-full items-center gap-x-2 rounded-md bg-red-600 py-2 pl-4 text-xs font-medium text-white transition-all hover:bg-red-700 sm:py-3 sm:pl-6 sm:text-sm"
			>
				<LucideMessageCircleQuestion class="size-3 text-white transition-all sm:size-4" />
				<span class="ml-1">Teacher mode</span>
			</Button>
		{:else}
			<!-- Updated Teacher Mode Button -->
			<Button
				size="sm"
				href="/teacher/courses"
				class="flex w-full items-center gap-x-2 rounded-md bg-blue-600 py-2 pl-4 text-xs font-medium text-white transition-all hover:bg-blue-700 sm:py-3 sm:pl-6 sm:text-sm"
			>
				<PersonStandingIcon class="size-3 text-white transition-all sm:size-4" />
				<span class="ml-1"> Student mode</span>
			</Button>
		{/if}

		<!-- Logout Form -->
		<form use:enhance method="POST" action="/?/logout" class="w-full">
			<Button
				size="sm"
				type="submit"
				class="flex w-full items-center gap-x-2 rounded-md bg-gray-600 py-2 pl-4 text-xs font-medium text-white transition-all hover:bg-gray-700 sm:py-3 sm:pl-6 sm:text-sm"
			>
				<LogOut class="size-3 text-white transition-all sm:size-4" />
				<span class="ml-1">Logout</span>
			</Button>
		</form>
	</div>
</div>
