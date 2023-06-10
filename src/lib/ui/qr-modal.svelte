<script lang="ts">
	// import SvelteQrCode from 'svelte-qrcode'
	import QrCode from '$lib/assets/qr-code.svelte'
	import { onMount } from 'svelte'

	export let source: string
	let show = false
	let width: number

	let SvelteQrCode: any

	onMount(async () => {
		const module = await import('svelte-qrcode')
		SvelteQrCode = module.default
	})
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="qr" on:click={() => (show = true)}>
	<QrCode />
</div>

{#if show}
	<div class="root">
		<div class="wrapper" bind:clientWidth={width}>
			<p>Screenshot or save this to reach listeners</p>
			{#if SvelteQrCode}
				<svelte:component this={SvelteQrCode} value={source} background="#ffffe4" size={width} />
			{/if}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="close" on:click={() => (show = false)}>close</div>
		</div>
	</div>
{/if}

<style>
	.root {
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 5;
		background-color: var(--black);
	}

	.qr {
		cursor: pointer;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: var(--white);
		padding: 24px;
		border-radius: 24px;
		max-width: 350px;
		gap: 24px;
	}
	p {
		font-family: 'Syne';
		font-style: normal;
		font-weight: 400;
		font-size: 25px;
		line-height: 38px;
		text-align: center;
		color: var(--black);
	}
	.close {
		font-family: 'Syne';
		font-style: normal;
		font-weight: 400;
		font-size: 25px;
		line-height: 38px;
		text-align: center;
		text-decoration-line: underline;
		color: var(--black);
		border: none;
		background-color: none;
		cursor: pointer;
	}
</style>
