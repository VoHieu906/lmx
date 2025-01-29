<!-- CustomStar.svelte -->
<script>
	import { Star } from 'lucide-svelte'; // Import the Star icon from lucide-svelte
	export let fill = 'none'; // Default fill is 'none'
	export let size = 24; // Default size is 24
	export let class = ''; // Additional classes
</script>

<svg
	class={class}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill={fill}
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<!-- Use the Star icon from lucide-svelte -->
	<Star />
</svg>