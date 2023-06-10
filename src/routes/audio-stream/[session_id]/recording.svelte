<script lang="ts">
	import { page } from '$app/stores'
	import { userStore } from '$lib/stores/user'
	import Button from '$lib/ui/button.svelte'
	import adapter from '$lib/adapters/audio-stream'
	import { onMount } from 'svelte'

	const sessionId = $page.params.session_id
	let recording = false

	onMount(async () => {
		if (!$userStore.addressOrEns) {
			console.error('No user address')
			return
		}
		await adapter.join(sessionId, $userStore.addressOrEns)
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

<h3>Tap to stop streaming</h3>
{#if adapter.localStream}
	<video use:srcObject={adapter.localStream} autoplay playsInline muted={true} />
{/if}
<Button color="green" on:click={share}>Share Link</Button>
<Button
	color="orange"
	on:click={() => {
		recording = !recording
	}}>{recording ? 'Stop recording' : 'Record'}</Button
>
