<script lang="ts">
	import { page } from '$app/stores'
	import { userStore } from '$lib/stores/user'
	import Recording from './recording.svelte'
	import Consuming from './consuming.svelte'
	import User from '$lib/ui/user.svelte'

	const sessionId = $page.params.session_id
</script>

{#if $userStore.addressOrEns !== undefined}
	<User>{$userStore.addressOrEns}</User>
{/if}
{#if $userStore.addressOrEns === sessionId}
	<Recording />
{:else if $userStore.addressOrEns !== undefined}
	<Consuming />
{:else}
	<h3>There is no wallet, this will be handled better...</h3>
{/if}
