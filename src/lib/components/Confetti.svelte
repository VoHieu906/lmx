<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let particles: any[] = [];
	let animationFrameId: number;

	// Function to generate confetti
	function createConfetti() {
		const numParticles = 100;
		for (let i = 0; i < numParticles; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				radius: Math.random() * 5 + 2,
				color: `hsl(${Math.random() * 360}, 100%, 50%)`,
				velocityX: Math.random() * 4 - 2,
				velocityY: Math.random() * 4 + 2
			});
		}
	}

	// Function to update particles' position
	function updateConfetti() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		particles.forEach((particle, index) => {
			ctx.beginPath();
			ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
			ctx.fillStyle = particle.color;
			ctx.fill();

			// Move the particle
			particle.x += particle.velocityX;
			particle.y += particle.velocityY;
			particle.velocityY += 0.05; // gravity

			// Remove particles that go off-screen
			if (particle.y > canvas.height || particle.x < 0 || particle.x > canvas.width) {
				particles.splice(index, 1);
			}
		});

		if (particles.length > 0) {
			animationFrameId = requestAnimationFrame(updateConfetti);
		}
	}

	// Start confetti on mount
	onMount(() => {
		ctx = canvas.getContext('2d');
		if (ctx) {
			createConfetti();
			updateConfetti();
		}
	});

	// Clean up on destroy
	onDestroy(() => {
		if (animationFrameId) cancelAnimationFrame(animationFrameId);
	});
</script>

<canvas bind:this={canvas} class="pointer-events-none absolute left-0 top-0 h-full w-full"></canvas>

<style>
	canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 9999;
	}
</style>
