<script lang="ts">
	export let disabled = false
	export let color: 'green' | 'orange' = 'green'
</script>

<button on:click {disabled} class={color}><slot /></button>

<style>
	button {
		border: none;
		color: white;
		padding: 15px 32px;
		display: flex;
		align-items: center;
		text-align: center;
		text-transform: uppercase;
		font-family: 'Syne';
		font-style: normal;
		font-weight: 600;
		font-size: 28px;
		border-radius: 12px;
	}
	.green {
		background-color: var(--green);
	}
	.orange {
		background-color: var(--orange);
	}
</style>
