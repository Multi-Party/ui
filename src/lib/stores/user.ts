import { writable, type Writable } from 'svelte/store'
import type { Signer } from 'ethers'

export interface UserData {
	addressOrEns?: string
	signer?: Signer
}

export type UserStore = Writable<UserData>

function createUserStore(): UserStore {
	return writable<UserData>()
}

export const userStore = createUserStore()
