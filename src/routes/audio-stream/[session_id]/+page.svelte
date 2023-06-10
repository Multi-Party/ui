<script lang="ts">
	import { page } from '$app/stores'
	import { userStore } from '$lib/stores/user'
	import Recording from './recording.svelte'
	import Consuming from './consuming.svelte'
	import User from '$lib/ui/user.svelte'
	import { goto } from '$app/navigation'
	import { AUDIO_STREAM_CONNECT } from '$lib/routes'

	const sessionId = $page.params.session_id

	$: if ($userStore.addressOrEns === undefined) {
		goto(AUDIO_STREAM_CONNECT(sessionId))
	}
</script>

<User>{$userStore.addressOrEns}</User>

{#if $userStore.addressOrEns === sessionId}
	<Recording />
{:else if $userStore.addressOrEns !== undefined}
	<Consuming />
{/if}
