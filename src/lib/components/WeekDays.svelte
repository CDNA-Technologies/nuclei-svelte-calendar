<script lang="ts">
	import { DAYS_OF_THE_WEEK } from '../constants/constants';

	export let firstWeekDayOffset: number = 0;
	const getDaysOfWeek = () => {
		const daysOfWeek = DAYS_OF_THE_WEEK.slice(firstWeekDayOffset);
		return daysOfWeek.concat(DAYS_OF_THE_WEEK.slice(0, firstWeekDayOffset));
	};
</script>

<thead class="sticky !top-0 !z-10 h-full w-full" id="week-days">
	<tr class="justify-center text-center h-full w-full">
		{#each getDaysOfWeek() as day}
			<th class="p-0 min-w-[7px] max-w-[7px] my-auto content {day.color} bg-base-100">
				<div class="border-b border-base-300" />
				<p class="py-5 content">{day.shortName}</p>
				<div class="border-b border-base-300" />
			</th>
		{/each}
	</tr>
</thead>

<style>
	.sticky {
		position: -webkit-sticky;
		position: sticky;
	}
</style>
