export const HOME = '/'
export const AUDIO_STREAM = (address: string) => `/audio-stream/${address}`
export const AUDIO_STREAM_CONNECT = (address?: string) =>
	address ? `/audio-stream/connect?address=${address}` : `/audio-stream/connect`
export const AUDIO_STREAM_JOIN = '/audio-stream/join'
