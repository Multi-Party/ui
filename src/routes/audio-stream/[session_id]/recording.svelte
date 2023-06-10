<script lang="ts">
	import Button from '$lib/ui/button.svelte'
	import adapter from '$lib/adapters/audio-stream'
	import { onMount } from 'svelte'
	import Animation from '$lib/ui/animation.svelte'

	export let addressOrEns: string
	export let sessionId: string

	const store = adapter.streams
	$: localStream = $store?.localStream

	let recording = false
	onMount(async () => {
		await adapter.join(sessionId, addressOrEns)
		adapter.broadcast()
	})

	function srcObject(node: HTMLVideoElement, stream: MediaStream) {
		node.srcObject = stream
		return {
			update(newStream: MediaStream) {
				if (node.srcObject != newStream) {
					node.srcObject = newStream
				}
			},
		}
	}

	function share() {
		const url = window.location.href
		if (navigator.share) {
			navigator
				.share({
					title: document.title,
					text: 'Hello World',
					url: window.location.href,
				})
				.then(() => console.log('Successful share'))
				.catch((error) => {
					navigator.clipboard.writeText(url)
					console.error('Error sharing:', error)
				})
		} else {
			navigator.clipboard.writeText(url)
		}
	}
</script>

{#if localStream}
	<h3>Tap to stop streaming</h3>
	<Animation />
	<video use:srcObject={localStream} autoplay playsInline muted={true} />
{:else}
	<h3>Starting the stream</h3>
{/if}
<Button color="green" on:click={share}>Share Link</Button>
<Button
	color="orange"
	on:click={() => {
		recording = !recording
	}}>{recording ? 'Stop recording' : 'Record'}</Button
>

<style>
	video {
		display: none;
	}
</style>
