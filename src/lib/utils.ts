export function formatAddressOrEns(addressOrEns: string): string {
	// Pattern to match Ethereum addresses and ENS domains
	const pattern = /^[a-z0-9]+(\.[a-z0-9]+)*\.eth$/

	if (pattern.test(addressOrEns)) {
		return addressOrEns
	}

	if (addressOrEns.length < 12) {
		return addressOrEns
	}

	return `${addressOrEns.substring(0, 10)}...`
}
