<script lang="ts">
	export let achievement;
	const progress = (achievement.progress / achievement.expand?.achievement.max_progress) * 100;
</script>

<div class="banner-container">
	<div
		class={`banner ${achievement.unlocked ? 'unlocked' : ''}`}
		style={`border-color: ${achievement.unlocked ? '#10B981' : '#8B5CF6'}`}
	>
		<!-- Achievement Badge -->

		<!-- Status Indicator -->
		<div
			class="status-indicator"
			style={`background: ${achievement.unlocked ? '#10B981' : '#8B5CF6'}`}
		>
			<span>{achievement.unlocked ? 'Unlocked' : 'Locked'}</span>
		</div>

		<!-- Title and Description -->
		<div class="banner-content">
			<!-- ICON (INSIDE with circle ring) -->
			<div class="icon-container">
				<div class="icon-ring">
					<span class="text-3xl">{achievement.expand?.achievement.icon}</span>
				</div>
			</div>

			<h2 class="title">{achievement.expand?.achievement.title}</h2>
			<p class="description">{achievement.expand?.achievement.description}</p>

			<!-- Decorative Line -->
			<div class="decorative-line"></div>

			<!-- Progress Bar -->
			<div>{progress}%</div>
			<div class="progress-bar">
				<div
					class="progress-fill"
					style={`width: ${progress}%; background: ${achievement.unlocked ? '#10B981' : '#8B5CF6'}`}
				></div>
			</div>
		</div>
	</div>
</div>

<style>
	.banner-container {
		position: relative;
		width: 220px;
	}

	.banner {
		position: relative;
		background: white;
		border: 2px solid;
		padding: 1.5rem 1rem;
		margin: 0 auto;
		width: 100%;
		height: 420px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
		clip-path: polygon(0 0, 100% 0, 100% 85%, 55% 100%, 50% 95%, 45% 100%, 0 85%);
		transition:
			transform 0.2s ease-in-out,
			box-shadow 0.2s ease-in-out;
		background: linear-gradient(to bottom, #ffffff, #f3f4f6);
	}

	/* ✅ Glowing effect restored */
	.banner.unlocked {
		box-shadow: 0 0 25px rgba(16, 185, 129, 0.9);
		animation: glow 1.5s infinite alternate ease-in-out;
	}

	@keyframes glow {
		0% {
			box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
		}
		100% {
			box-shadow: 0 0 25px rgba(16, 185, 129, 0.9);
		}
	}

	.banner:hover {
		transform: scale(1.05);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
	}

	.banner-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		height: 100%;
		width: 100%;
	}

	/* ✅ FIXED: Icon is INSIDE + Circle Ring */
	.icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 10px;
	}

	.icon-ring {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		border: 4px solid #8b5cf6;
		background: white;
		box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
		transition: transform 0.2s ease-in-out;
	}

	.banner.unlocked .icon-ring {
		border-color: #10b981;
		box-shadow: 0 0 15px rgba(16, 185, 129, 0.7);
		animation: pulse 1.5s infinite alternate;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(1.1);
		}
	}

	.title {
		margin-top: 10px;
		font-size: 1.25rem;
		font-weight: bold;
		color: #333;
	}

	.description {
		margin-bottom: 1rem;
		font-size: 0.9rem;
		color: #555;
		line-height: 1.4;
	}

	.progress-bar {
		width: 90%;
		height: 6px;
		background: #e5e7eb;
		border-radius: 3px;
		overflow: hidden;
		margin-top: 80px;
		margin-bottom: 1rem;
	}

	.progress-fill {
		height: 100%;
		border-radius: 3px;
		transition: width 0.3s ease;
	}

	.status-indicator {
		position: absolute;
		top: 0;
		right: 0;
		width: 30px;
		height: 100px;
		color: white;
		font-size: 0.75rem;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0 0 0 4px;
	}

	.decorative-line {
		width: 60%;
		height: 1px;
		background: linear-gradient(to right, transparent, #8b5cf6, transparent);
		margin: 1rem 0;
	}
</style>
