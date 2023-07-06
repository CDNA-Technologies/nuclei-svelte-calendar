<script lang="ts">
	import dayjs from 'dayjs';
	import { createEventDispatcher } from 'svelte';
	import WeekDays from '../commons/WeekDays.svelte';
	import { MONTHS_OF_THE_YEAR } from '../config/constants';
	import type { CellData, Data } from '../messages/calendar-data.msg';
	import { findCurrentCalendarDataWeekNumber, parseDate } from '../utils/util';
	import RangeCell from './RangeCell.svelte';

	export let minDate: string;
	export let maxDate: string;
	export let firstWeekDayOffset: number = 1; // 0 for Sunday, 1 for Monday
	export let calendarReqData: Map<string, Data> = new Map();
	export let noOfMonthsIterations: number = 13;
	export let selectedStartDate: Date | undefined;
	export let selectedEndDate: Date | undefined;
	export let minSelectedDateDifference: number = 0;
	export let maxSelectedDateDifference: number = 999;

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

	let selectedStartDateCellData: CellData;
	let selectedEndDateCellData: CellData;

	let shouldShowTopData: boolean = false;
	let shouldShowBottomData: boolean = false;
	let shouldShowLeftData: boolean = false;
	let shouldShowRightData: boolean = false;
	const dispatch = createEventDispatcher();
	let virtualContainerRef: HTMLDivElement;
	let scrollToSelectedDate: boolean = true;

	function getScrollTop(selectedDate: CellData) {
		let weekNumber = findCurrentCalendarDataWeekNumber(selectedDate.date, minDate);
		console.log('weekNumber: ', weekNumber);
		let months =
			(parseDate(selectedDate.date).getFullYear() - parseDate(minDate).getFullYear()) * 12 +
			parseDate(selectedDate.date).getMonth() -
			parseDate(minDate).getMonth();
		console.log('months: ', months);
		let scrollTop =
			(weekNumber + months) * (document.getElementById(selectedDate.date)?.scrollHeight ?? 0);
		console.log('scrollTop: ', scrollTop);
		return scrollTop;
	}

	$: {
		if (selectedStartDate !== undefined && selectedStartDate.getTime() > currentDate.getTime()) {
			selectedStartDateCellData = {
				date: String(
					selectedStartDate.getFullYear() +
						'/' +
						(selectedStartDate.getMonth() + 1) +
						'/' +
						selectedStartDate.getDate()
				)
			};
		} else {
			selectedStartDate = parseDate(today.date);
			selectedStartDateCellData = today;
		}
		if (
			selectedEndDate !== undefined &&
			selectedStartDate !== undefined &&
			dayjs(selectedEndDate).diff(selectedStartDate, 'day', true) >= minSelectedDateDifference
		) {
			selectedEndDateCellData = {
				date: String(
					selectedEndDate.getFullYear() +
						'/' +
						(selectedEndDate.getMonth() + 1) +
						'/' +
						selectedEndDate.getDate()
				)
			};
		} else {
			let nextDate: Date = parseDate(selectedStartDateCellData.date);
			nextDate.setDate(
				parseDate(selectedStartDateCellData.date).getDate() + minSelectedDateDifference
			);
			selectedEndDateCellData = {
				date: String(
					nextDate.getFullYear() + '/' + ((nextDate.getMonth() + 1) % 12) + '/' + nextDate.getDate()
				)
			};
			selectedEndDate = nextDate;
		}
		console.log('virtualContainerRef: ', virtualContainerRef);
		if (virtualContainerRef) {
			if (scrollToSelectedDate) {
				let scrollTop = getScrollTop(selectedStartDateCellData);
				virtualContainerRef.scrollTo(0, scrollTop);
				scrollToSelectedDate = true;
			}
		}
	}

	let year = currentDate.getFullYear();
	let month = currentDate.getMonth();

	for (let k = 0; k < noOfMonthsIterations; k++) {
		let firstDayOfMonth = new Date(year, month + k, 1);
		let lastDayOfMonth = new Date(year, month + k + 1, 0);
		let daysInMonth = lastDayOfMonth.getDate();
		let firstDayOfWeek = firstDayOfMonth.getDay();

		let weeks: CellData[][] = [];
		let currentWeek: CellData[] = [];

		for (let j = firstWeekDayOffset; j < firstDayOfWeek; j++) {
			currentWeek.push({
				date: ''
			});
		}

		for (let i = 1; i <= daysInMonth; i++) {
			let date: string = String(
				year + Math.floor((month + k) / 12) + '/' + (((month + k) % 12) + 1) + '/' + i
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
			for (let i = currentWeek.length; i < 7; i++) {
				currentWeek.push({
					date: ''
				});
			}
			weeks.push(currentWeek);
		}
		calendarData.push(weeks);
	}

	function validateDateDifference(
		startDate: Date | string,
		endDate: Date | string,
		minSelectedDateDifference: number,
		maxSelectedDateDifference: number
	) {
		let dateDifference = dayjs(endDate).diff(startDate, 'day', true);
		if (dateDifference < minSelectedDateDifference || dateDifference > maxSelectedDateDifference) {
			return false;
		}
		return true;
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
		if (parseDate(day.date) < parseDate(selectedStartDateCellData.date)) {
			if (
				validateDateDifference(
					day.date,
					selectedEndDateCellData.date,
					minSelectedDateDifference,
					maxSelectedDateDifference
				)
			) {
				selectedStartDateCellData = day;
			}
		} else if (parseDate(day.date) > parseDate(selectedEndDateCellData.date)) {
			if (
				validateDateDifference(
					selectedStartDate!,
					day.date,
					minSelectedDateDifference,
					maxSelectedDateDifference
				)
			) {
				selectedEndDateCellData = day;
			}
		} else {
			if (
				validateDateDifference(
					day.date,
					selectedEndDate!,
					minSelectedDateDifference,
					maxSelectedDateDifference
				)
			) {
				selectedEndDateCellData = day;
			}
		}

		console.log(
			'selectedStartDateCellData: ',
			selectedStartDateCellData,
			' selectedEndDateCellData: ',
			selectedEndDateCellData
		);
		selectedStartDate = parseDate(selectedStartDateCellData.date);
		selectedEndDate = parseDate(selectedEndDateCellData.date);
		scrollToSelectedDate = false;
		console.log('selectedStartDate: ', selectedStartDate, ' selectedEndDate: ', selectedEndDate);
	};
</script>

<div class="overflow-y-scroll h-full" bind:this={virtualContainerRef}>
	<table class="table w-full">
		<WeekDays {firstWeekDayOffset} />
		<tbody class="w-full overflow-y-scroll" style="height: calc(100% - 48px)">
			{#each calendarData as weeks, i}
				<tr class="text-center">
					<td class="w-full text-center border-0 heading-2 py-5" colspan="7"
						>{MONTHS_OF_THE_YEAR[(month + i) % 12]} {year + Math.floor((month + i) / 12)}</td
					>
				</tr>
				{#each weeks as week}
					<tr class="text-center">
						{#each week as day}
							{#if day.date === ''}
								<td class="p-0 border-0" />
							{:else}
								<td class="p-0 border-0 align-top">
									<RangeCell
										cellInRange={parseDate(day.date) >= parseDate(selectedStartDateCellData.date) &&
											parseDate(day.date) <= parseDate(selectedEndDateCellData.date)}
										cellDisabled={!(
											parseDate(day.date) >= parseDate(minDate) &&
											parseDate(day.date) <= parseDate(maxDate)
										)}
										{today}
										startDateSelected={selectedStartDateCellData}
										endDateSelected={selectedEndDateCellData}
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
