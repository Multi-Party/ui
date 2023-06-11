import { type Signer, type Eip1193Provider, BrowserProvider, type Networkish } from 'ethers'
import { browser } from '$app/environment'
import { userStore } from '$lib/stores/user'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains, createConfig } from '@wagmi/core'
import { mainnet } from '@wagmi/core/chains'
import { PUBLIC_WALLET_CONNECT_PROJECT_ID } from '$env/static/public'

const chains = [mainnet]
const projectId = PUBLIC_WALLET_CONNECT_PROJECT_ID

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
	autoConnect: true,
	connectors: w3mConnectors({ projectId, version: 1, chains }),
	publicClient,
})
export const ethereumClient = new EthereumClient(wagmiConfig, chains)
export const web3modal = new Web3Modal({ projectId }, ethereumClient)

type EthEvents = 'accountsChanged' | 'chainChanged'
type Ethereum = Eip1193Provider & {
	on: (eventName: EthEvents, eventHandler: () => void) => void
	removeListener: (eventName: EthEvents, eventHandler: () => void) => void
}
type WindowWithMaybeEthereum = Window & typeof globalThis & { ethereum: Ethereum | undefined }
type WindowWithEthereum = Window & typeof globalThis & { ethereum: Ethereum }

export async function connectWallet(network?: Networkish): Promise<Signer> {
	if (canConnectWallet()) {
		const provider = new BrowserProvider((window as WindowWithEthereum).ethereum, network)
		await provider.send('eth_requestAccounts', [])
		return provider.getSigner()
	} else {
		throw new Error('No ethereum provider found')
	}
}

export function canConnectWallet() {
	return browser && isWindowWithEthereum(window as WindowWithMaybeEthereum)
}
function isWindowWithEthereum(
	windowObject: WindowWithMaybeEthereum,
): windowObject is WindowWithEthereum {
	return typeof windowObject.ethereum !== 'undefined'
}

const windowWithEthereum = browser && (window as WindowWithEthereum)

async function onAccountChanged() {
	const wallet = await connectWallet()
	const account = await wallet.getAddress()
	userStore.set({ addressOrEns: account, signer: wallet })
}

export function subscribeAccountChanged(): () => unknown {
	if (
		windowWithEthereum &&
		windowWithEthereum.ethereum &&
		typeof windowWithEthereum.ethereum.on === 'function'
	) {
		windowWithEthereum.ethereum.on('accountsChanged', onAccountChanged)
		return () => {
			windowWithEthereum &&
				windowWithEthereum.ethereum.removeListener('accountsChanged', onAccountChanged)
		}
	}
	return () => console.error('No ethereum provider')
}

function onChainChanged() {
	browser && window.location.reload()
}

export function subscribeChainChanged() {
	if (
		windowWithEthereum &&
		windowWithEthereum.ethereum &&
		typeof windowWithEthereum.ethereum.on === 'function'
	) {
		windowWithEthereum.ethereum.on('chainChanged', onChainChanged)

		return () => {
			windowWithEthereum &&
				windowWithEthereum &&
				windowWithEthereum.ethereum.removeListener('chainChanged', onChainChanged)
		}
	}
	return () => console.error('No ethereum provider')
}
