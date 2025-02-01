<script lang="ts">
	import LogOut from 'lucide-svelte/icons/log-out';

	import { page } from '$app/stores';
	import Button from './ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { enhance } from '$app/forms';
	import Search from './Search.svelte';
	import { LucideMessageCircleQuestion, PersonStandingIcon } from 'lucide-svelte';

	$: pathname = $page.url.pathname;
	$: isTeacherPage = pathname?.startsWith('/teacher');
	$: isPlayerPage = pathname?.includes('chapter');
	$: isSearchPage = pathname === '/search';
</script>

<div
	class="flex flex-col items-center gap-y-4 p-4 text-muted-foreground transition-all hover:text-slate-600"
>
	<!-- Avatar Section -->
	<Avatar.Root class="flex w-full items-center gap-x-2">
		<Avatar.Image
			class="size-8 rounded-full border border-muted"
			src="https://github.com/shadcn.png"
			alt="@shadcn"
		/>
		<Avatar.Fallback class="flex size-6 items-center justify-center rounded-full bg-muted">
			VH
		</Avatar.Fallback>
		<!-- User Info -->
		<div class="flex flex-col">
			<p class="text-sm font-medium text-slate-700 transition-all hover:text-primary">John Doe</p>
			<p class="text-xs text-muted-foreground">john.doe@example.com</p>
		</div>
	</Avatar.Root>

	<!-- Buttons Section -->
	<div class="flex w-full flex-col gap-y-2">
		{#if isTeacherPage || isPlayerPage}
			<!-- Updated Logout Button -->
			<Button
				href="/"
				size="sm"
				class="flex w-full items-center gap-x-2 rounded-md bg-red-600 py-3 pl-6 text-sm font-medium text-white transition-all hover:bg-red-700"
			>
				<LucideMessageCircleQuestion class="size-4 text-white transition-all" />
				<span class="ml-1">Teacher mode</span>
			</Button>
		{:else}
			<!-- Updated Teacher Mode Button -->
			<Button
				size="sm"
				href="/teacher/courses"
				class="flex w-full items-center gap-x-2 rounded-md bg-blue-600 py-3 pl-6 text-sm font-medium text-white transition-all hover:bg-blue-700"
			>
				<PersonStandingIcon class="size-4 text-white transition-all" />
				<span class="ml-1"> Student mode</span>
			</Button>
		{/if}

		<!-- Logout Form -->
		<form use:enhance method="POST" action="/?/logout" class="w-full">
			<Button
				size="sm"
				type="submit"
				class="flex w-full items-center gap-x-2 rounded-md bg-gray-600 py-3 pl-6 text-sm font-medium text-white transition-all hover:bg-gray-700"
			>
				<LogOut class="size-4 text-white transition-all" />
				<span class="ml-1">Logout</span>
			</Button>
		</form>
	</div>
</div>
