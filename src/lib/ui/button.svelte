<script lang="ts">
	export let disabled = false
	export let color: 'green' | 'orange' = 'green'
</script>

<button on:click {disabled} class={color}><slot /></button>

<style>
	button {
		font-family: 'Syne';
		font-style: normal;
		font-weight: 600;
		font-size: 28px;
		padding: 24px;
		border-radius: 12px;
		text-transform: uppercase;
		border: none;
	}
	.green {
		background-color: var(--green);
		color: var(--white);
	}
	.orange {
		background-color: var(--orange);
		color: var(--black);
	}
</style>
