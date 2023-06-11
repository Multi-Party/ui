<script lang="ts">
	import { type HDNodeWallet, Wallet, type Signer } from 'ethers'
	import { ethereumClient, web3modal } from '$lib/adapters/blockchain'
	import Button from '$lib/ui/button.svelte'
	import { userStore } from '$lib/stores/user'
	import { goto } from '$app/navigation'
	import { AUDIO_STREAM } from '$lib/routes'
	import { page } from '$app/stores'

	function navigate(addressOrEns: string, signer?: Signer) {
		localStorage.setItem('address', addressOrEns)
		userStore.set({ signer, addressOrEns })
		const joinLink = $page.url.searchParams.get('address')
		if (joinLink) goto(AUDIO_STREAM(joinLink))
		else goto(AUDIO_STREAM(addressOrEns))
	}

	ethereumClient.watchAccount(async (state) => {
		if (state && state.address) {
			try {
				const ens = await ethereumClient.fetchEnsName({ address: state.address, chainId: 1 })
				if (ens) navigate(ens)
				else navigate(state.address)
			} catch (e) {
				navigate(state.address)
			}
		}
	})

	async function createWallet() {
		const mnemonic = localStorage.getItem('castaway-mnemonic')
		let wallet: HDNodeWallet
		if (mnemonic) wallet = Wallet.fromPhrase(mnemonic)
		else wallet = Wallet.createRandom()

		if (wallet.mnemonic) localStorage.setItem('castaway-mnemonic', wallet.mnemonic.phrase)

		const address = wallet.address

		// TODO: get the ENS name if available
		navigate(address, wallet)
	}
</script>

<div class="text">
	<h3>Connect your web3 profile</h3>
</div>
<div class="buttons">
	<Button on:click={() => web3modal.openModal()}>Connect</Button>
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
