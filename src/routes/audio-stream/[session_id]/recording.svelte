<script lang="ts">
	import Button from '$lib/ui/button.svelte'
	import adapter from '$lib/adapters/audio-stream'
	import { onMount } from 'svelte'
	import Animation from '$lib/ui/animation.svelte'
	import StreamerDetails from '$lib/ui/streamer-details.svelte'
	import { AUDIO_STREAM, HOME } from '$lib/routes'
	import { ethereumClient, web3modal } from '$lib/adapters/blockchain'
	import { userStore } from '$lib/stores/user'
	import { goto } from '$app/navigation'

	export let addressOrEns: string
	export let sessionId: string

	const store = adapter.streams
	$: localStream = $store?.localStream
	$: listeners = $store?.listeners ?? '?'

	let recording = false

	onMount(async () => {
		await adapter.join(sessionId, addressOrEns)
		adapter.broadcast()
	})

	function srcObject(node: HTMLAudioElement, stream: MediaStream) {
		node.srcObject = stream
		return {
			update(newStream: MediaStream) {
				if (node.srcObject != newStream) {
					node.srcObject = newStream
				}
			},
		}
	}

	function share() {
		const url = window.location.href
		if (navigator.share) {
			navigator
				.share({
					title: document.title,
					url: window.location.href,
				})
				.then(() => console.log('Successful share'))
				.catch((error) => {
					navigator.clipboard.writeText(url)
					console.error('Error sharing:', error)
				})
		} else {
			navigator.clipboard.writeText(url)
		}
	}

	ethereumClient.watchAccount((state) => {
		if (state && state.address) {
			goto(AUDIO_STREAM(state.address))
		}
		if (state) {
			userStore.set({})
		}
	})

	function disconnect() {
		if ($userStore.signer) {
			userStore.set({})
		} else {
			web3modal.openModal()
		}
	}
</script>

<StreamerDetails address={addressOrEns} {disconnect} />
{#if localStream}
	<a href={HOME}>(tap to stop streaming)</a>
{:else}
	<p>Starting stream...</p>
{/if}
<div class={localStream ? 'grow' : 'grow hide'}>
	<Animation />
	<div class="gap">
		<p>
			<span class="yellow">{listeners} listeners </span>{#if recording} | recording {/if}
		</p>
	</div>
	{#if localStream}
		<audio use:srcObject={localStream} autoplay playsInline muted={true} />
	{/if}
</div>
<Button color="green" on:click={share}>Share Link</Button>
<Button
	color="orange"
	on:click={() => {
		recording = !recording
	}}>{recording ? 'Stop recording' : 'Record'}</Button
>

<style>
	.gap {
		gap: 12px;
		padding: 12px 0px;
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.grow {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-grow: 1;
		justify-content: center;
	}

	.hide {
		opacity: 0;
	}

	a,
	a:hover,
	a:visited,
	a:active {
		color: white;
		text-decoration: none;
		font-family: 'Syne';
		font-style: normal;
		font-weight: 400;
		font-size: 25px;
		line-height: 38px;
	}
	p {
		font-family: 'Syne';
		font-style: normal;
		font-weight: 400;
		font-size: 25px;
		line-height: 38px;
		color: var(--white);
	}

	.yellow {
		color: var(--yellow);
	}
</style>
