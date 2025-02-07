<script lang="ts">
	export let achievement;
	const progress = (achievement.progress / achievement.expand?.achievement.max_progress) * 100;
</script>

<div class="banner-container">
	<div class="pole">
		<div class="pole-top"></div>
		<div class="pole-body"></div>
	</div>
	<div
		class={`banner ${achievement.unlocked ? 'unlocked' : ''}`}
		style={`background: ${achievement.unlocked ? '#10B981' : '#8B5CF6'}`}
	>
		<div class="banner-content">
			<div class="achievement-medal">
				<div class="medal-ring"></div>
				<div class="icon-container">
					<span class="icon">{achievement.expand?.achievement.icon}</span>
				</div>
			</div>

			<div class="ribbon left"></div>
			<div class="ribbon right"></div>

			<h2 class="title">{achievement.expand?.achievement.title}</h2>
			<div class="separator">
				<div class="line"></div>
				<div class="diamond"></div>
				<div class="line"></div>
			</div>
			<p class="description">{achievement.expand?.achievement.description}</p>

			<div class="progress-section">
				<div class="progress-text">
					<span class="progress-value">{progress}%</span>
					<span class="progress-label">Complete</span>
				</div>
				<div class="progress-bar">
					<div
						class="progress-fill"
						style={`width: ${progress}%; background: ${achievement.unlocked ? '#ffffff' : '#f0f0f0'}`}
					></div>
				</div>
			</div>

			<div class="status-badge">
				{#if achievement.unlocked}
					<span class="star">★</span>
				{/if}
				{achievement.unlocked ? 'Unlocked' : 'Locked'}
				{#if achievement.unlocked}
					<span class="star">★</span>
				{/if}
			</div>
		</div>
		<div class="banner-tail"></div>
	</div>
</div>

<style>
	.banner-container {
		position: relative;
		width: min(280px, 100%);
		height: 400px;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		.banner-container {
			width: 260px;
		}
	}

	.pole {
		position: absolute;
		top: 0;
		width: 8px;
		height: 100%;
		z-index: 1;
	}

	.pole-top {
		width: 16px;
		height: 16px;
		background: #c0c0c0;
		border-radius: 50%;
		position: absolute;
		top: -8px;
		left: -4px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.pole-body {
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, #a0a0a0 0%, #d0d0d0 50%, #a0a0a0 100%);
		box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
	}

	.banner {
		position: relative;
		width: 100%;
		height: 320px;
		margin-top: 20px;
		color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem;
		transition: all 0.3s ease;
		box-shadow:
			0 4px 6px rgba(0, 0, 0, 0.1),
			0 1px 3px rgba(0, 0, 0, 0.1);
		background-image: linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.1) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 255, 255, 0.1) 50%,
			rgba(255, 255, 255, 0.1) 75%,
			transparent 75%,
			transparent
		);
		background-size: 10px 10px;
		overflow: visible;
		z-index: 2;
	}

	.banner.unlocked {
		animation: sway 3s ease-in-out infinite;
		box-shadow:
			0 0 30px rgba(16, 185, 129, 0.4),
			0 0 60px rgba(16, 185, 129, 0.2),
			0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.banner-content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		z-index: 3;
	}

	.achievement-medal {
		position: relative;
		margin-bottom: 1.5rem;
	}

	.medal-ring {
		position: absolute;
		width: 52px;
		height: 52px;
		border: 3px solid rgba(255, 255, 255, 0.8);
		border-radius: 50%;
		top: -6px;
		left: -6px;
		animation: rotate 8s linear infinite;
	}

	.banner.unlocked .medal-ring {
		border-color: gold;
		box-shadow:
			0 0 15px rgba(255, 215, 0, 0.5),
			0 0 30px rgba(255, 215, 0, 0.3);
		animation:
			rotate 8s linear infinite,
			glow 1.5s infinite alternate;
	}

	.icon-container {
		width: 40px;
		height: 40px;
		background: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.icon {
		color: #333;
		font-size: 1.5rem;
	}

	.ribbon {
		position: absolute;
		top: 60px;
		width: 24px;
		height: 40px;
		background: rgba(255, 255, 255, 0.2);
		z-index: 1;
	}

	.ribbon.left {
		left: 20px;
		transform: skew(-20deg);
	}

	.ribbon.right {
		right: 20px;
		transform: skew(20deg);
	}

	.title {
		font-size: 1.2rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
		text-align: center;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
		word-wrap: break-word;
	}

	.separator {
		display: flex;
		align-items: center;
		width: 100%;
		margin: 0.75rem 0;
	}

	.line {
		flex: 1;
		height: 1px;
		background: rgba(255, 255, 255, 0.3);
	}

	.diamond {
		width: 8px;
		height: 8px;
		background: white;
		transform: rotate(45deg);
		margin: 0 8px;
	}

	.description {
		font-size: 0.9rem;
		margin-bottom: 1rem;
		opacity: 0.9;
		line-height: 1.4;
		text-align: center;
		padding: 0 0.5rem;
		word-wrap: break-word;
	}

	.progress-section {
		width: 100%;
		margin-top: auto;
		padding: 0 0.5rem;
	}

	.progress-text {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.progress-value {
		font-size: 1.2rem;
		font-weight: bold;
	}

	.progress-label {
		font-size: 0.8rem;
		opacity: 0.9;
	}

	.progress-bar {
		width: 100%;
		height: 6px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 3px;
		overflow: hidden;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.progress-fill {
		height: 100%;
		transition: width 0.3s ease;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.status-badge {
		margin-top: 1rem;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.4rem 0.8rem;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.star {
		font-size: 0.9rem;
		color: #ffd700;
		text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
	}

	.banner-tail {
		position: absolute;
		bottom: -20px;
		width: 100%;
		height: 40px;
		background: inherit;
		clip-path: polygon(0 0, 50% 100%, 100% 0);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	@keyframes sway {
		0%,
		100% {
			transform: rotate(-1deg);
		}
		50% {
			transform: rotate(1deg);
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes glow {
		0% {
			box-shadow:
				0 0 5px rgba(255, 215, 0, 0.5),
				0 0 10px rgba(255, 215, 0, 0.3);
		}
		100% {
			box-shadow:
				0 0 15px rgba(255, 215, 0, 0.7),
				0 0 30px rgba(255, 215, 0, 0.5);
		}
	}

	.banner.unlocked .status-badge {
		background: rgba(255, 215, 0, 0.3);
		box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
	}
</style>
