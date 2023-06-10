import { Centralised, type StreamStore } from './centralised'

export interface AudioStreamAdapter {
	streams: StreamStore

	join(sessionId: string, uid: string): Promise<void>
	listen(sessionId: string, uid: string): Promise<void>
	leave(): void
	broadcast(): Promise<void>
}

export default new Centralised() as AudioStreamAdapter
