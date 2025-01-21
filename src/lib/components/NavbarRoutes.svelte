<script lang="ts">
	import LogOut from 'lucide-svelte/icons/log-out';
	import Button from './ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
</script>

<div class="ml-auto flex gap-x-2">
	<Button href="/" size="sm" variant="ghost">
		<LogOut />
		Exit
	</Button>
	<Avatar.Root>
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>VH</Avatar.Fallback>
	</Avatar.Root>
	<form method="POST" action="/?/logout">
		<Button size="sm" type="submit">Logout</Button>
	</form>
</div>
