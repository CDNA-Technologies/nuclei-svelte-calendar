<script lang="ts">
	import Calendar from '$lib/calendar/datepicker/Calendar.svelte';

	let selectedDate: Date;
	let minDate: string;
	let maxDate: string;
	let firstWeekDayOffset: number;
	let noOfMonthsIterations: number;
</script>

<div class="flex flex-row">
	<div class="flex flex-col">
		<input class="input" bind:value={selectedDate} />
	</div>
	<div class="mock">
		<Calendar
			{selectedDate}
			{minDate}
			{maxDate}
			{firstWeekDayOffset}
			{noOfMonthsIterations}
			on:select={(e) => {
				selectedDate = e.detail.selectedDate;
			}}
		/>
	</div>
</div>
