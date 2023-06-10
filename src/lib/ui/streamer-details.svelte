<script lang="ts">
	import Flash from '$lib/assets/flash.svelte'
	import QrCode from '$lib/assets/qr-code.svelte'

	export let address: string
	export let ens: string | undefined = undefined
</script>

<div class="root">
	<div class="qr">
		<QrCode />
	</div>
	<div class="name">
		<div class="grow">
			{ens ?? `${address.substring(0, 9)} ...`}
		</div>
		<div class="flash">
			<Flash />
		</div>
	</div>
</div>

<style>
	.qr {
		margin: 0px 5px;
	}
	.root {
		display: flex;
		flex-direction: row;
		align-items: center;
		text-align: center;
		color: var(--orange);
		gap: 22px;
	}
	.name {
		font-family: 'Syne';
		font-style: normal;
		font-weight: 400;
		font-size: 25px;
		line-height: 38px;
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
	.grow {
		flex-grow: 1;
	}
	.flash {
		margin-right: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
