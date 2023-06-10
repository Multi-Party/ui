<script lang="ts">
	import { onMount } from 'svelte'
	import adapter from '$lib/adapters/audio-stream'
	import Button from '$lib/ui/button.svelte'
	import Animation from '$lib/ui/animation.svelte'

	export let addressOrEns: string
	export let sessionId: string

	const store = adapter.streams
	$: streams = $store?.streams ?? []

	onMount(() => {
		adapter.listen(sessionId, addressOrEns)
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
</script>

{#each streams as stream}
	<h3>{sessionId}'s stream</h3>
	<Animation />
	<video use:srcObject={stream} autoplay playsInline muted={false} />
{:else}
	<h3>{addressOrEns}is resting, so no live streams :(</h3>
	<Button>Listen to last stream</Button>
{/each}

<style>
	video {
		display: none;
	}
</style>
