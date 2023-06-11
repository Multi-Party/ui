<script lang="ts">
	import { page } from '$app/stores'
	import Flash from '$lib/assets/flash.svelte'
	import QrModal from '$lib/ui/qr-modal.svelte'
	import { formatAddressOrEns } from '$lib/utils'

	export let address: string
	export let ens: string | undefined = undefined
	export let disconnect: () => void | Promise<void>
</script>

<div class="root">
	<div class="qr">
		<QrModal source={$page.url.href} />
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="border" on:click={disconnect}>
		<div class="text">
			{formatAddressOrEns(ens ?? address)}
		</div>
		<div class="flash">
			<Flash />
		</div>
	</div>
</div>

<style>
	.root {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;
		color: var(--orange);
		gap: 22px;
	}
	.qr {
		margin: 0px 5px;
	}
	.border {
		display: flex;
		flex-grow: 1;
		justify-content: center;
		align-items: center;
		text-align: center;
		color: var(--orange);
		padding: 3px;
		border-radius: 15px;
		border: 2px solid var(--orange);
	}
	.text {
		flex-grow: 1;
		font-family: 'Syne';
		font-style: normal;
		font-weight: 400;
		font-size: 25px;
		line-height: 38px;
	}
	.flash {
		margin-right: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
