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
	const storedAddress = localStorage.getItem('address')

	$: addressOrEns = $userStore?.addressOrEns

	$: if (!addressOrEns && storedAddress === sessionId) {
		goto(AUDIO_STREAM_CONNECT)
	}

	onDestroy(() => {
		adapter.leave()
	})
</script>

{#if addressOrEns === sessionId}
	<Recording {sessionId} {addressOrEns} />
{:else}
	<Consuming {sessionId} />
{/if}
