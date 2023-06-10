<script lang="ts">
	import { onMount } from 'svelte'
	import json from '$lib/assets/onair.json'

	let LottiePlayer: any

	onMount(async () => {
		const module = await import('@lottiefiles/svelte-lottie-player')
		LottiePlayer = module.LottiePlayer
	})
</script>

{#if LottiePlayer}
	<div class="animation">
		<svelte:component
			this={LottiePlayer}
			src={json}
			autoplay={true}
			loop={true}
			controls={false}
			renderer="svg"
			background="transparent"
			height={150}
			width={150}
			controlsLayout={[]}
		/>
	</div>
{/if}

<style>
	.animation {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
	}
</style>
