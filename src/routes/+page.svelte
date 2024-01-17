<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="flex flex-col justify-center items-center w-full p-4">
	<h1 class="heading-1 my-8">Nuclei Svelte Calendar</h1>
	<div class="flex flex-col justify-center m-2 gap-4 w-3/4">
		<button
			class="btn-primary p-2 rounded-lg"
			on:click={() => {
				goto('./date-picker');
			}}
		>
			Try Date-Picker
		</button>
		<button
			class="btn-secondary p-2 rounded-lg"
			on:click={() => {
				goto('./range-picker');
			}}
		>
			Try Range-Picker
		</button>
		<button
			class="btn-accent p-2 rounded-lg"
			on:click={() => {
				goto('./holo-picker');
			}}
		>
			Try Holo-Picker
		</button>
	</div>
</div>
