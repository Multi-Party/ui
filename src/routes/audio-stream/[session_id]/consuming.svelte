<script lang="ts">
	import { page } from '$app/stores'
	import { userStore } from '$lib/stores/user'
	import { onMount } from 'svelte'
	import adapter from '$lib/adapters/audio-stream'

	onMount(() => {
		const sessionId = $page.params.session_id
		const uid = $userStore.addressOrEns

		if (uid) adapter.listen(sessionId, uid)
		else console.error('No user address')
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

<p>Consumer</p>
<p>Address = {$userStore.addressOrEns}</p>
{#each adapter.streams as stream (stream.id)}
	<video use:srcObject={stream} autoplay playsInline muted={false} />
{/each}
