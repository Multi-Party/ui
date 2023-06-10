import { PUBLIC_AUDIO_SERVICE_URL } from '$env/static/public'
import { Client, LocalStream, type RemoteStream } from 'ion-sdk-js'
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl'
import type { AudioStreamAdapter } from '..'
import { get, writable, type Writable } from 'svelte/store'

export interface StreamData {
	streams: RemoteStream[]
	localStream?: LocalStream
	listeners?: number
}

export type StreamStore = Writable<StreamData>

function createStreamStore(): StreamStore {
	return writable<StreamData>({ streams: [] })
}

export class Centralised implements AudioStreamAdapter {
	public client: Client | undefined
	public streams: StreamStore = createStreamStore()

	async join(sessionId: string, uid: string): Promise<void> {
		return new Promise((resolve) => {
			if (this.client) {
				resolve()
			}

			const signal = new IonSFUJSONRPCSignal(PUBLIC_AUDIO_SERVICE_URL)
			this.client = new Client(signal)

			this.client.ontrack = (track, stream) => {
				console.log('Got Track:', track.id, 'of kind:', track.kind, 'for stream:', stream.id)

				if (track.kind !== 'audio') {
					return
				}
			}

			signal.onopen = async () => {
				if (this.client) {
					await this.client.join(sessionId, uid)
					resolve()
				}
			}
		})
	}
	async listen(sessionId: string, uid: string): Promise<void> {
		if (this.client) {
			return
		}

		const signal = new IonSFUJSONRPCSignal(PUBLIC_AUDIO_SERVICE_URL)
		this.client = new Client(signal)

		this.client.ontrack = (track, stream) => {
			console.log('Got Track:', track.id, 'of kind:', track.kind, 'for stream:', stream.id)

			if (track.kind !== 'audio') {
				return
			}

			const str = get(this.streams)?.streams ?? []
			const found = str.find((s) => s.id === stream.id)

			if (!found) {
				stream.onremovetrack = () => {
					console.log('stream removed', stream.id)
					this.streams.update((s) => ({ streams: s.streams.filter((s) => s.id !== stream.id) }))
				}

				console.log('stream added', stream.id)
				this.streams.update((s) => ({ streams: [...s.streams, stream] }))
			}
		}

		signal.onopen = async () => {
			if (this.client) {
				await this.client.join(sessionId, uid)
			}
		}
	}
	leave(): void {
		if (this.client) {
			console.log('Disconnecting stream')
			this.client.close()
			this.client = undefined
		}
	}
	async broadcast(): Promise<void> {
		if (this.client) {
			console.log('Connecting stream')
			const stream = await LocalStream.getUserMedia({
				resolution: 'hd',
				codec: 'h264',
				audio: true,
				video: false,
			})

			this.client.publish(stream)
			this.streams.update((s) => ({ ...s, localStream: stream }))
		} else {
			console.error('I am too early')
		}
	}
}
