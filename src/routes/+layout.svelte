<script lang="ts">
	import '@total-typescript/ts-reset'
	import '@fontsource/syne' // Defaults to weight 400 with all styles included.
	import '@fontsource/syne/600.css'
	import '@fontsource/syne/700.css'
	import './styles.css'
	import Logo from '$lib/assets/logo.svelte'
	import { goto } from '$app/navigation'
	import { HOME } from '$lib/routes'
</script>

<div class="root">
	<div class="wrapper">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="logo" on:click={() => goto(HOME)}><Logo /></div>
		<slot />
	</div>
</div>

<style>
	.root {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		height: 100dvh;
		width: 100vw;
		background-color: #1c1c1c;
	}

	.wrapper {
		max-width: 500px;
		max-height: 1280px;
		width: 100%;
		height: 100%;
		background-color: #1c1c1c;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: stretch;
		text-align: center;
		padding: 20px;
		gap: 15px;
	}
	.logo {
		display: flex;
		justify-content: center;
		text-align: center;
		cursor: pointer;
	}
</style>
