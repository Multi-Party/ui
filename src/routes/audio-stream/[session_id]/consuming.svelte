<script lang="ts">
	import { onMount } from 'svelte'
	import adapter from '$lib/adapters/audio-stream'
	import Button from '$lib/ui/button.svelte'
	import Animation from '$lib/ui/animation.svelte'
	import { ethers } from 'ethers'
	import { formatAddressOrEns } from '$lib/utils'

	export let sessionId: string

	const uid = ethers.randomBytes(4).toString()
	const store = adapter.streams
	let listening = false

	$: streams = $store?.streams ?? []
	$: listeners = $store?.listeners ?? '?'

	onMount(() => {
		adapter.listen(sessionId, uid)
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
</script>

{#if streams.length > 0}
	<h3>
		{formatAddressOrEns(sessionId)}'s stream
	</h3>
	<div class="grow">
		{#if listening}
			<Animation />
		{:else}
			<button on:click={() => (listening = true)}>Start</button>
		{/if}
	</div>
	<div class="gap">
		<p class="yellow">{listeners} listeners</p>
	</div>
	<Button color="green" on:click={share}>Share Link</Button>
	{#if listening}
		{#each streams as stream}
			<audio use:srcObject={stream} autoplay playsInline muted={false} />
		{/each}
	{/if}
{:else}
	<div class="flexParrent">
		<h3>
			{formatAddressOrEns(sessionId)} is not live right now but left a message.
		</h3>
		<h3 class="orange">
			Hey there! Although I'm not live at the moment, remember that I love you very much. Check out
			my cast at june 11 about hamburger recipies
		</h3>
		<Button>Listen to most recent cast</Button>
	</div>
{/if}

<style>
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
	.grow {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	button {
		font-family: 'Syne';
		font-style: normal;
		font-weight: 600;
		font-size: 28px;
		padding: 20px;
		border-radius: 100%;
		text-transform: uppercase;
		border: 5px solid var(--yellow);
		background-color: var(--orange);
		color: var(--black);
		width: 150px;
		height: 150px;
	}
</style>
