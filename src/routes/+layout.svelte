<script lang="ts">
	import '@total-typescript/ts-reset'
	import '@fontsource/syne' // Defaults to weight 400 with all styles included.
	import './styles.css'
	import Logo from '$lib/assets/logo.svelte'
</script>

<div class="root">
	<div class="wrapper">
		<div class="logo"><Logo /></div>
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
		background-color: black;
	}

	.wrapper {
		max-width: 390px;
		max-height: 844px;
		width: 100%;
		height: 100%;
		background-color: #1c1c1c;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: stretch;
		text-align: center;
		padding: 20px;
		gap: 22px;
	}
	.logo {
		display: flex;
		justify-content: center;
		text-align: center;
	}
</style>
