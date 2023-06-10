<script lang="ts">
	import Button from '$lib/ui/button.svelte'
	import { goto } from '$app/navigation'
	import { AUDIO_STREAM_CONNECT } from '$lib/routes'

	let addressOrEns = ''
</script>

<h3>Or search on ENS or Ethereum address</h3>
<input bind:value={addressOrEns} />
<Button disabled={!addressOrEns} on:click={() => goto(AUDIO_STREAM_CONNECT(addressOrEns))}
	>Start listening</Button
>

<style>
	input {
		background: var(--white);
		border: 2px solid var(--black);
		border-radius: 7px;
		padding: 15px;
	}
</style>
