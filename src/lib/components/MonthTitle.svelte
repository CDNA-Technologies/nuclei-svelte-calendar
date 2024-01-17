<script lang="ts">
	import { MONTHS_OF_THE_YEAR } from '../constants/constants';

	export let currentMonth: number;
	export let currentYear: number;

	let element: HTMLDivElement;
</script>

<tr class="text-center">
	<td
		class="w-full text-center border-0 heading-2 py-5"
		colspan="7"
		id="{currentMonth}-{currentYear}"
		bind:this={element}
		data-scrolly={element?.getBoundingClientRect()?.top ?? 0}
	>
		{MONTHS_OF_THE_YEAR[currentMonth - 1]}
		{currentYear}
	</td>
</tr>
