<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Cell from './Cell.svelte';
	import WeekDays from './WeekDays.svelte';
	import type { CellData, Data } from './calendar-data.msg';
	import { MONTHS_OF_THE_YEAR } from './constants';
	import { findCurrentCalendarDataWeekNumber, parseDate } from './util';

	export let minDate: string;
	export let maxDate: string;
	/**
	 * @param firstWeekDayOffset 0 for Sunday, 1 for Monday
	 */
	export let firstWeekDayOffset: number = 1;
	export let calendarReqData: Map<string, Data> = new Map();
	export let noOfMonthsIterations: number = 13;
	export let selectedDate: Date | undefined;

	let calendarData: CellData[][][] = [];
	let currentDate: Date = new Date();
	let today: CellData = {
		date: String(
			currentDate.getFullYear() +
				'/' +
				((currentDate.getMonth() + 1) % 12) +
				'/' +
				currentDate.getDate()
		)
	};

	let shouldShowTopData: boolean = false;
	let shouldShowBottomData: boolean = false;
	let shouldShowLeftData: boolean = false;
	let shouldShowRightData: boolean = false;

	let daySelected: CellData;
	let virtualContainerRef: HTMLDivElement;
	let scrollToSelectedDate: boolean = true;

	$: {
		if (selectedDate !== undefined && selectedDate.getTime() > currentDate.getTime()) {
			daySelected = {
				date: String(
					selectedDate.getFullYear() +
						'/' +
						(selectedDate.getMonth() + 1) +
						'/' +
						selectedDate.getDate()
				)
			};
		} else {
			selectedDate = currentDate;
			daySelected = today;
		}
		if (virtualContainerRef) {
			let weekNumber = findCurrentCalendarDataWeekNumber(daySelected.date, minDate);
			console.log('weekNumber: ', weekNumber);
			let months =
				(parseDate(daySelected.date).getFullYear() - parseDate(minDate).getFullYear()) * 12 +
				parseDate(daySelected.date).getMonth() -
				parseDate(minDate).getMonth();
			console.log('months: ', months);
			let scrollTop =
				(weekNumber + months) * (document.getElementById(daySelected.date)?.scrollHeight ?? 0);
			console.log('scrollTop: ', scrollTop);
			if (scrollToSelectedDate) {
				virtualContainerRef.scrollTo(0, scrollTop);
				scrollToSelectedDate = true;
			}
		}
	}

	let year = currentDate.getFullYear();
	let month = currentDate.getMonth();
	const dispatch = createEventDispatcher();

	for (let monthIndex = 0; monthIndex < noOfMonthsIterations; monthIndex++) {
		let firstDayOfMonth = new Date(year, month + monthIndex, 1);
		let lastDayOfMonth = new Date(year, month + monthIndex + 1, 0);
		let daysInMonth = lastDayOfMonth.getDate();
		let firstDayOfWeek = firstDayOfMonth.getDay();

		let weeks: CellData[][] = [];
		let currentWeek: CellData[] = [];

		for (let week = firstWeekDayOffset; week < firstDayOfWeek; week++) {
			currentWeek.push({
				date: ''
			});
		}

		for (let day = 1; day <= daysInMonth; day++) {
			let date: string = String(
				year +
					Math.floor((month + monthIndex) / 12) +
					'/' +
					(((month + monthIndex) % 12) + 1) +
					'/' +
					day
			);
			let data: Data | undefined = calendarReqData.get(date);
			if (data?.top !== undefined) {
				shouldShowTopData = true;
			}
			if (data?.bottom !== undefined) {
				shouldShowBottomData = true;
			}
			if (data?.left !== undefined) {
				shouldShowLeftData = true;
			}
			if (data?.right !== undefined) {
				shouldShowRightData = true;
			}
			currentWeek.push({
				date: date,
				data: data
			});
			if (currentWeek.length === 7) {
				weeks.push(currentWeek);
				currentWeek = [];
			}
		}
		if (currentWeek.length > 0) {
			for (let day = currentWeek.length; day < 7; day++) {
				currentWeek.push({
					date: ''
				});
			}
			weeks.push(currentWeek);
		}
		calendarData.push(weeks);
	}

	const handleClick = (day: CellData) => {
		if (!(parseDate(day.date) >= parseDate(minDate) && parseDate(day.date) <= parseDate(maxDate))) {
			let error =
				'Date must be between ' +
				parseDate(minDate).toDateString() +
				' and ' +
				parseDate(maxDate).toDateString() +
				'.';
			console.log('error: ', error);
			dispatch('error', { error });
			return;
		}
		daySelected = day;
		selectedDate = parseDate(daySelected.date);
		scrollToSelectedDate = false;
		console.log('selectedDate: ', selectedDate);
	};
</script>

<div class="overflow-y-auto h-full" bind:this={virtualContainerRef}>
	<table class="table w-full">
		<WeekDays {firstWeekDayOffset} />
		<tbody class="w-full overflow-y-scroll" style="height: calc(100% - 48px)">
			{#each calendarData as weeks, monthIndex}
				<tr class="text-center">
					<td class="w-full text-center border-0 heading-2 py-5" colspan="7">
						{MONTHS_OF_THE_YEAR[(month + monthIndex) % 12]}
						{year + Math.floor((month + monthIndex) / 12)}
					</td>
				</tr>
				{#each weeks as week}
					<tr class="text-center">
						{#each week as day}
							{#if day.date === ''}
								<td class="p-0 border-0" />
							{:else}
								<td class="p-0 border-0 align-top">
									<Cell
										cellDisabled={!(
											parseDate(day.date) >= parseDate(minDate) &&
											parseDate(day.date) <= parseDate(maxDate)
										)}
										{today}
										{daySelected}
										{day}
										on:handleClick={() => handleClick(day)}
										{shouldShowBottomData}
										{shouldShowTopData}
										{shouldShowLeftData}
										{shouldShowRightData}
									/>
								</td>
							{/if}
						{/each}
					</tr>
				{/each}
			{/each}
		</tbody>
	</table>
</div>
