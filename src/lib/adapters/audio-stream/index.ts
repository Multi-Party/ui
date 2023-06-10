import type { Client } from 'ion-sdk-js'
import { Centralised, type StreamStore } from './centralised'

export interface AudioStreamAdapter {
	client: Client | undefined
	streams: StreamStore

	join(sessionId: string, uid: string): Promise<void>
	listen(sessionId: string, uid: string): Promise<void>
	leave(): void
	broadcast(): Promise<void>
}

export default new Centralised() as AudioStreamAdapter
