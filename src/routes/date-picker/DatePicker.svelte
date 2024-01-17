<script lang="ts">
	import Calendar from '$lib/calendar/datepicker/Calendar.svelte';
	import dayjs from 'dayjs';

	let selectedDate: Date = dayjs().toDate();
	let minDate: string = dayjs().set(1, 'month').format('YYYY-MM-DD');
	let maxDate: string = dayjs().add(1, 'month').format('YYYY-MM-DD');
	let firstWeekDayOffset: number = 1;
	let noOfMonthsIterations: number = 2;
	let reload = false;

	function applySettings() {
		minDate = dayjs(minDate).format('YYYY-MM-DD');
		maxDate = dayjs(maxDate).format('YYYY-MM-DD');

		reload = !reload;
	}
</script>

<div class="flex flex-col w-full p-4">
	<div class="flex flex-row justify-between">
		<h1 class="heading-1">Date Picker</h1>
		<h2 class="card-sub-heading">
			Selected Date: {dayjs(selectedDate).format('YYYY-MM-DD')}
		</h2>
	</div>
	<div class="flex flex-row w-full pt-6">
		<div class="flex flex-col w-1/2 gap-4">
			<h2 class="card-heading">Customize Calendar</h2>
			<div class="flex flex-col items-center justify-between gap-4 w-3/4">
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">Minimum Date for Calendar</span>
					</div>
					<input
						type="text"
						placeholder="Type Min Date"
						bind:value={minDate}
						class="input input-bordered input-primary w-full"
					/>
				</label>
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">Maximum Date for Calendar</span>
					</div>
					<input
						type="text"
						placeholder="Type Max Date"
						bind:value={maxDate}
						class="input input-bordered input-primary w-full"
					/>
				</label>
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">First Week Day Offset</span>
					</div>
					<input
						type="text"
						placeholder="Type First Week Day Offset"
						bind:value={firstWeekDayOffset}
						class="input input-bordered input-primary w-full"
					/>
				</label>
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">Number of Months to iterate</span>
					</div>
					<input
						type="text"
						placeholder="Type Number of Months"
						bind:value={noOfMonthsIterations}
						class="input input-bordered input-primary w-full"
					/>
				</label>
				<button class="btn-primary rounded-lg w-3/4 p-3" on:click={applySettings}>
					Apply Settings
				</button>
			</div>
		</div>
		{#key reload}
			<div class="mockup-phone border-primary">
				<div class="camera" />
				<div class="display">
					<div class="artboard artboard-demo phone-1 p-0 m-0 pt-8">
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
			</div>
		{/key}
	</div>
</div>
