<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="container mx-auto h-full p-6">
	<div class="flex flex-col gap-8">
		<nav>
			<ul class="flex w-full flex-col items-center md:flex-row md:space-x-2">
				<li class="w-full md:w-auto">
					<a
						href="/settings/profile"
						class="block w-full rounded-md px-4 py-2 text-center md:w-auto
							{$page.url.pathname === '/settings/profile' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}"
					>
						Profile
					</a>
				</li>
				<li class="w-full md:w-auto">
					<a
						href="/settings/account"
						class="block w-full rounded-md px-4 py-2 text-center md:w-auto
							{$page.url.pathname === '/settings/account' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}"
					>
						Account
					</a>
				</li>
				<li class="w-full md:w-auto">
					<a
						href="/settings/notifications"
						class="block w-full rounded-md px-4 py-2 text-center md:w-auto
							{$page.url.pathname === '/settings/notifications' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}"
					>
						Notifications
					</a>
				</li>
				<li class="w-full md:w-auto">
					<a
						href="/settings/security"
						class="block w-full rounded-md px-4 py-2 text-center md:w-auto
							{$page.url.pathname === '/settings/security' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}"
					>
						Security
					</a>
				</li>
			</ul>
		</nav>

		<!-- Main Content -->
		<main class="flex-1 rounded-lg bg-white p-6 shadow">
			<slot />
		</main>
	</div>
</div>
