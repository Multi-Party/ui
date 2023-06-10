<script>
	import { goto } from '$app/navigation'
	import { AUDIO_STREAM_CONNECT, AUDIO_STREAM_JOIN } from '$lib/routes'
	import Button from '$lib/ui/button.svelte'
</script>

<h1>Ride the wave</h1>
<h3>Decentralized live streaming for audio etc.</h3>
<div class="buttons">
	<Button color="green" on:click={() => goto(AUDIO_STREAM_CONNECT())}>Create stream</Button>
	<Button color="orange" on:click={() => goto(AUDIO_STREAM_JOIN)}>Just listen</Button>
</div>

<style>
	h1 {
		padding-top: 5px;
	}
	h3 {
		padding-top: 10px;
	}
	.buttons {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-top: 20px;
		gap: 22px;
		flex-grow: 1;
	}
</style>
