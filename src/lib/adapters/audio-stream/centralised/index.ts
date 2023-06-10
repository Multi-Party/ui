import { PUBLIC_AUDIO_SERVICE_LISTENERS_URL, PUBLIC_AUDIO_SERVICE_URL } from '$env/static/public'
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
	private client: Client | undefined
	public streams: StreamStore = createStreamStore()
	private poll: ReturnType<typeof setInterval> | undefined

	startPolling(sessionId: string): void {
		this.stopPolling()

		async function poll(store: StreamStore) {
			try {
				const res = await fetch(`${PUBLIC_AUDIO_SERVICE_LISTENERS_URL}/${sessionId}`)
				const data = (await res.json()) as any
				const listeners = data?.n_peers

				if (listeners) store.update((s) => ({ ...s, listeners }))
			} catch (error) {
				console.error(error)
			}
		}
		poll(this.streams)
		this.poll = setInterval(() => poll(this.streams), 5000)
	}

	stopPolling(): void {
		if (this.poll) {
			clearInterval(this.poll)
			this.poll = undefined
		}
	}

	async join(sessionId: string, uid: string): Promise<void> {
		this.startPolling(sessionId)
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
					setTimeout(resolve, 1000)
				}
			}
		})
	}
	async listen(sessionId: string, uid: string): Promise<void> {
		this.startPolling(sessionId)
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
		this.stopPolling()
		if (this.client) {
			console.log('Disconnecting stream')
			this.client.leave()
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
