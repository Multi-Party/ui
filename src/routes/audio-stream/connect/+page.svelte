<script lang="ts">
	import { type HDNodeWallet, Wallet, type Signer } from 'ethers'
	import { connectWallet } from '$lib/adapters/blockchain'
	import Button from '$lib/ui/button.svelte'
	import { userStore } from '$lib/stores/user'
	import { goto } from '$app/navigation'
	import { AUDIO_STREAM } from '$lib/routes'
	import { page } from '$app/stores'

	function navigate(signer: Signer, addressOrEns: string) {
		localStorage.setItem('address', addressOrEns)
		userStore.set({ signer, addressOrEns })
		const joinLink = $page.url.searchParams.get('address')
		if (joinLink) goto(AUDIO_STREAM(joinLink))
		else goto(AUDIO_STREAM(addressOrEns))
	}

	async function connect() {
		const signer = await connectWallet()
		const address = await signer.getAddress()

		// TODO: get the ENS name if available
		navigate(signer, address)
	}

	async function createWallet() {
		const mnemonic = localStorage.getItem('mnemonic')
		let wallet: HDNodeWallet
		if (mnemonic) wallet = Wallet.fromPhrase(mnemonic)
		else wallet = Wallet.createRandom()

		if (wallet.mnemonic) localStorage.setItem('mnemonic', wallet.mnemonic.phrase)

		const address = wallet.address

		// TODO: get the ENS name if available
		navigate(wallet, address)
	}
</script>

<div class="text">
	<h3>Connect your web3 profile</h3>
</div>
<div class="buttons">
	<Button on:click={connect}>Connect</Button>
	<Button color="orange" on:click={createWallet}>I don't have one</Button>
</div>

<style>
	.text {
		display: flex;
		flex-direction: column;
		justify-content: end;
		gap: 22px;
		flex-grow: 1;
	}
	.buttons {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 22px;
		flex-grow: 1;
	}
</style>
