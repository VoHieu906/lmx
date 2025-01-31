<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="container mx-auto h-full px-4 py-8">
	<div class="flex flex-col gap-8 md:flex-row">
		<aside class="w-full rounded-lg bg-gray-100 p-4 md:w-64">
			<nav>
				<ul class="space-y-2">
					<li>
						<a
							href="/settings/profile"
							class="block rounded-md px-4 py-2 {$page.url.pathname === '/settings/profile'
								? 'bg-blue-500 text-white'
								: 'hover:bg-gray-200'}"
						>
							Profile
						</a>
					</li>
					<li>
						<a
							href="/settings/account"
							class="block rounded-md px-4 py-2 {$page.url.pathname === '/settings/account'
								? 'bg-blue-500 text-white'
								: 'hover:bg-gray-200'}"
						>
							Account
						</a>
					</li>
					<li>
						<a
							href="/settings/notifications"
							class="block rounded-md px-4 py-2 {$page.url.pathname === '/settings/notifications'
								? 'bg-blue-500 text-white'
								: 'hover:bg-gray-200'}"
						>
							Notifications
						</a>
					</li>
				</ul>
			</nav>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 rounded-lg bg-white p-6 shadow">
			<slot />
		</main>
	</div>
</div>
