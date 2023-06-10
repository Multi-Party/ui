<script lang="ts">
	import { page } from '$app/stores'
	import { AUDIO_SERVICE_URL } from '$lib/constants'
	import { userStore } from '$lib/stores/user'
	import Button from '$lib/ui/button.svelte'
	import { Client, LocalStream, type RemoteStream } from 'ion-sdk-js'
	import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl'
	import { onMount } from 'svelte'

	let client: Client
	let localStream: LocalStream | undefined = undefined
	const sessionId = $page.params.session_id
	let recording = false

	function join() {
		if (client) {
			return
		}

		const signal = new IonSFUJSONRPCSignal(AUDIO_SERVICE_URL)
		client = new Client(signal)

		client.ontrack = (track, stream) => {
			console.log('Got Track:', track.id, 'of kind:', track.kind, 'for stream:', stream.id)

			if (track.kind !== 'audio') {
				return
			}
		}

		signal.onopen = async () => {
			if ($userStore.addressOrEns) {
				await client.join(sessionId, $userStore.addressOrEns)
			}
		}
	}

	function publish() {
		if (client) {
			LocalStream.getUserMedia({
				resolution: 'hd',
				codec: 'h264',
				audio: true,
				video: false,
			}).then((stream) => {
				client.publish(stream)
				localStream = stream
			})
		}
	}

	onMount(() => {
		join()
		publish()
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

<h3>Tap to stop streaming</h3>
{#if localStream}
	<video use:srcObject={localStream} autoplay playsInline muted={true} />
{/if}
<Button color="green">Share Link</Button>
<Button
	color="orange"
	on:click={() => {
		recording = !recording
	}}>{recording ? 'Stop recording' : 'Record'}</Button
>
