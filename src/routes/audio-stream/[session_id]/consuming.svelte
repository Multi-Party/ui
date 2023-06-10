<script lang="ts">
	import { page } from '$app/stores'
	import { AUDIO_SERVICE_URL } from '$lib/constants'
	import { userStore } from '$lib/stores/user'
	import { Client, type RemoteStream } from 'ion-sdk-js'
	import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl'
	import { onMount } from 'svelte'

	let client: Client
	let streams: RemoteStream[] = []
	const sessionId = $page.params.session_id

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

			let found = streams.find((s) => s.id === stream.id)

			if (!found) {
				stream.onremovetrack = () => {
					console.log('stream removed', stream.id)
					streams = streams.filter((s) => s.id !== stream.id)
				}

				console.log('stream added', stream.id)
				streams = [...streams, stream]
			}
		}

		signal.onopen = async () => {
			if ($userStore.addressOrEns) {
				await client.join(sessionId, $userStore.addressOrEns)
			}
		}
	}

	onMount(() => {
		join()
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
<p>Session id = {sessionId}</p>
<p>Address = {$userStore.addressOrEns}</p>
{#each streams as stream (stream.id)}
	<video use:srcObject={stream} autoplay playsInline muted={false} />
{/each}
