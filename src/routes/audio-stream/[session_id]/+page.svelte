<script lang="ts">
	import { page } from '$app/stores'
	import { userStore } from '$lib/stores/user'
	import Recording from './recording.svelte'
	import Consuming from './consuming.svelte'
	import { goto } from '$app/navigation'
	import { AUDIO_STREAM_CONNECT } from '$lib/routes'
	import { onDestroy } from 'svelte'
	import adapter from '$lib/adapters/audio-stream'

	const sessionId = $page.params.session_id

	$: addressOrEns = $userStore?.addressOrEns

	$: if ($userStore?.addressOrEns === undefined) {
		goto(AUDIO_STREAM_CONNECT(sessionId))
	}

	onDestroy(() => {
		adapter.leave()
	})
</script>

{#if addressOrEns === sessionId}
	<Recording {sessionId} {addressOrEns} />
{:else if addressOrEns !== undefined}
	<Consuming {sessionId} {addressOrEns} />
{/if}
