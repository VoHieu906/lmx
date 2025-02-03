<script lang="ts">
	// Sample achievements data
	const achievements = [
		{
			id: 1,
			title: 'First Steps',
			description: 'Complete your first course on the platform.',
			icon: '🏆',
			progress: 100, // Progress in percentage
			unlocked: true
		},
		{
			id: 2,
			title: 'Course Master',
			description: 'Complete 10 courses on the platform.',
			icon: '📚',
			progress: 70,
			unlocked: false
		},
		{
			id: 3,
			title: 'Community Hero',
			description: 'Help 50 other learners in the community.',
			icon: '🦸',
			progress: 30,
			unlocked: false
		},
		{
			id: 4,
			title: 'Streak Champion',
			description: 'Maintain a 30-day learning streak.',
			icon: '🔥',
			progress: 10,
			unlocked: false
		}
	];
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<h1 class="mb-8 text-center text-4xl font-bold text-gray-900">Your Achievements</h1>
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each achievements as achievement}
				<div
					class="relative transform overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
				>
					<div class="p-6">
						<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
							<span class="text-3xl">{achievement.icon}</span>
						</div>
						<h2 class="mb-2 text-xl font-semibold text-gray-900">{achievement.title}</h2>
						<p class="mb-4 text-gray-600">{achievement.description}</p>
						<div class="h-2 w-full rounded-full bg-gray-200">
							<div
								class="h-2 rounded-full bg-purple-500"
								style={`width: ${achievement.progress}%`}
							/>
						</div>
						{#if achievement.unlocked}
							<div
								class="absolute right-4 top-4 rounded-full bg-green-500 px-3 py-1 text-sm text-white"
							>
								Unlocked
							</div>
						{:else}
							<div
								class="absolute right-4 top-4 rounded-full bg-gray-500 px-3 py-1 text-sm text-white"
							>
								Locked
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
