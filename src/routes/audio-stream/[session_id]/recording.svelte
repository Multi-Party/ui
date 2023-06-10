<script lang="ts">
	import Button from '$lib/ui/button.svelte'
	import adapter from '$lib/adapters/audio-stream'
	import { onMount } from 'svelte'
	import Animation from '$lib/ui/animation.svelte'
	import StreamerDetails from '$lib/ui/streamer-details.svelte'
	import { HOME } from '$lib/routes'

	export let addressOrEns: string
	export let sessionId: string

	const store = adapter.streams
	$: localStream = $store?.localStream
	$: listeners = $store?.listeners ?? 0

	let recording = false

	onMount(async () => {
		await adapter.join(sessionId, addressOrEns)
		adapter.broadcast()
	})

	function srcObject(node: HTMLVideoElement, stream: MediaStream) {
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
</script>

<StreamerDetails address={addressOrEns} />
{#if localStream}
	<a href={HOME}>(tap to stop streaming)</a>
{:else}
	<p>Starting stream...</p>
{/if}
<div class={localStream ? '' : 'hide'}>
	<Animation />
	<div class="gap">
		<p class={recording ? '' : 'hide'}>recording</p>
		<p class="yellow">{listeners} listeners</p>
	</div>
	{#if localStream}
		<video use:srcObject={localStream} autoplay playsInline muted={true} />
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
	video {
		display: none;
	}
	.gap {
		gap: 24px;
		padding: 24px 0px;
		display: flex;
		align-items: center;
		flex-direction: column;
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
