<script lang="ts">
	import Button from '$lib/ui/button.svelte'
	import { goto } from '$app/navigation'
	import { AUDIO_STREAM_CONNECT } from '$lib/routes'

	let addressOrEns = ''
</script>

<div class="flex">
	<h3>Search ENS or Ethereum address</h3>
</div>
<div class="buttons">
	<input bind:value={addressOrEns} />
	<Button disabled={!addressOrEns} on:click={() => goto(AUDIO_STREAM_CONNECT(addressOrEns))}
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
