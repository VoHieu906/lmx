<script lang="ts">
	import AchievementCard from '$lib/components/AchievementCard.svelte';
	export let data;
	let { userAchievement, userActions, allAchievements } = data;
	console.log(userActions);
	const unlockedAchievements = userAchievement.filter((ua) => ua.unlocked);
	const progressPercentage = (unlockedAchievements.length / allAchievements.length) * 100;
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-6 sm:px-4 lg:px-6">
	<div class="mx-auto">
		<!-- Title and Progress Percentage in the Same Row -->
		<div class="mb-4 flex items-center justify-center gap-2">
			<h1 class="text-3xl font-bold text-gray-900">
				You've unlocked {unlockedAchievements.length}/{allAchievements.length}
			</h1>
			<span class="text-lg font-medium text-gray-700">({progressPercentage.toFixed(1)}%)</span>
		</div>

		<!-- Progress Bar Below -->
		<div class="mx-auto mb-8 h-4 w-full max-w-md overflow-hidden rounded-full bg-gray-300">
			<div class="h-full bg-blue-500 transition-all" style="width: {progressPercentage}%"></div>
		</div>

		<!-- Achievements Grid -->
		<div class="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each userAchievement as achievement}
				<AchievementCard {achievement} />
			{/each}
		</div>
	</div>
</div>
