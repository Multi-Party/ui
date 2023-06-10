<script lang="ts">
	import Button from '$lib/ui/button.svelte'
	import { goto } from '$app/navigation'
	import { AUDIO_STREAM } from '$lib/routes'

	let addressOrEns = ''

	function extractENSorAddress(url: string): string | null {
		// Pattern to match Ethereum addresses and ENS domains
		const pattern = /\/(0x[a-fA-F0-9]{40}|[a-z0-9]+(\.[a-z0-9]+)*\.eth)$/

		const match = url.match(pattern)

		return match ? match[1] : null
	}

	$: if (addressOrEns) {
		const extractedEnsOrAddress = extractENSorAddress(addressOrEns)
		if (extractedEnsOrAddress) addressOrEns = extractedEnsOrAddress
	}
</script>

<div class="flex">
	<h3>Search ENS or Ethereum address</h3>
</div>
<div class="buttons">
	<input bind:value={addressOrEns} />
	<Button disabled={!addressOrEns} on:click={() => goto(AUDIO_STREAM(addressOrEns))}
		>Start listening</Button
	>
</div>

<style>
	input {
		background: var(--white);
		border: 2px solid var(--black);
		border-radius: 7px;
		padding: 5px;
		font-family: 'Syne';
		font-style: normal;
		font-weight: 400;
		font-size: 25px;
		line-height: 38px;
		text-align: center;
	}
	.flex {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 22px;
		flex-grow: 1;
	}
	.buttons {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 22px;
		flex-grow: 1;
	}
</style>
