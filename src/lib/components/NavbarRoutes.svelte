<script lang="ts">
	import LogOut from 'lucide-svelte/icons/log-out';
	import { page } from '$app/stores';
	import Button from './ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import SearchInput from './SearchInput.svelte';
	import { enhance } from '$app/forms';
	$: pathname = $page.url.pathname;
	$: isTeacherPage = pathname?.startsWith('/teacher');
	$: isPlayerPage = pathname?.includes('chapter');
	$: isSearchPage = pathname === '/search';
</script>

{#if isSearchPage}
	<div class="hidden md:block">
		<SearchInput />
	</div>
{/if}
<div class="ml-auto flex gap-x-2">
	{#if isTeacherPage || isPlayerPage}
		<Button href="/" size="sm" variant="ghost">
			<LogOut class="mr-2 size-4" />
			Exit
		</Button>
	{:else}
		<Button size="sm" variant="ghost" href="/teacher/courses">Teacher mode</Button>
	{/if}
	<Avatar.Root>
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>VH</Avatar.Fallback>
	</Avatar.Root>
	<form use:enhance method="POST" action="/?/logout">
		<Button size="sm" type="submit">Logout</Button>
	</form>
</div>
