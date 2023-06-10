<script lang="ts">
	import { onMount } from 'svelte'
	import adapter from '$lib/adapters/audio-stream'
	import Button from '$lib/ui/button.svelte'
	import Animation from '$lib/ui/animation.svelte'
	import { ethers } from 'ethers'

	export let sessionId: string

	const uid = ethers.randomBytes(4).toString()
	const store = adapter.streams
	$: streams = $store?.streams ?? []
	$: listeners = $store?.listeners ?? '?'

	onMount(() => {
		adapter.listen(sessionId, uid)
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

{#each streams as stream}
	<h3>
		{sessionId.length < 15 ? sessionId : `${sessionId.substring(0, 10)}...`}'s stream
	</h3>
	<Animation />
	<div class="gap">
		<p class="yellow">{listeners} listeners</p>
	</div>
	<Button color="green" on:click={share}>Share Link</Button>
	<video use:srcObject={stream} autoplay playsInline muted={false} />
{:else}
	<div class="flexParrent">
		<h3>
			{sessionId.length < 15 ? sessionId : `${sessionId.substring(0, 10)}...`}'s stream has ended
		</h3>
		<h3 class="orange">Join my next talk about hamburgers and violins on June 12th</h3>
		<Button>Listen to last stream</Button>
	</div>
{/each}

<style>
	video {
		display: none;
	}
	.orange {
		color: var(--orange);
	}
	.flexParrent {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-top: 20px;
		gap: 22px;
		flex-grow: 1;
	}
	.flexParrent * {
		flex-grow: 1;
		flex-basis: 1fr;
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

	.gap {
		gap: 24px;
		padding: 24px 0px;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
</style>
