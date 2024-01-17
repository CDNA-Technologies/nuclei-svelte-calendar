<script lang="ts">
	import MonthTitle from '$lib/components/MonthTitle.svelte';
	import WeekDays from '$lib/components/WeekDays.svelte';
	import type { Data } from '$lib/messages/calendar-data.msg';
	import { calendarInfoStore } from '$lib/stores/store';
	import { toYYYYMMDD, parseDate, buildCalendar } from '$lib/utils/util';
	import dayjs from 'dayjs';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import RangeCell from './RangeCell.svelte';

	const currentDate: Date = dayjs().toDate();

	export let minDate: string;
	export let maxDate: string;
	export let firstWeekDayOffset: number = 1; // 0 for Sunday, 1 for Monday
	export let noOfMonthsIterations: number = 13;
	export let selectedStartDate: Date | undefined;
	export let selectedEndDate: Date | undefined;
	export let minSelectedDateDifference: number = 0;
	export let maxSelectedDateDifference: number = 999;

	let calendarData: string[][][] = [];
	let today: string = toYYYYMMDD(currentDate);

	let selectedStartDateCellData: string;
	let selectedEndDateCellData: string;

	let shouldShowTopData: boolean = false;
	let shouldShowBottomData: boolean = false;
	let shouldShowLeftData: boolean = false;
	let shouldShowRightData: boolean = false;

	let virtualContainerRef: HTMLDivElement;
	let scrollToSelectedDate: boolean = true;

	let year = currentDate.getFullYear();
	let month = currentDate.getMonth();
	let calendarInfo: Map<string, Data> = new Map();

	const dispatch = createEventDispatcher();

	$: {
		// Check if selected start date is defined and in the future
		if (selectedStartDate !== undefined && selectedStartDate.getTime() > currentDate.getTime()) {
			// Update selected start date and its string representation
			selectedStartDateCellData = toYYYYMMDD(selectedStartDate);
		} else {
			// Set selected start date to today if not defined or in the past
			selectedStartDate = parseDate(today);
			selectedStartDateCellData = today;
		}

		// Check if selected end date is defined, selected start date is defined, and the date difference is within the minimum allowed range
		if (
			selectedEndDate !== undefined &&
			selectedStartDate !== undefined &&
			dayjs(selectedEndDate).diff(selectedStartDate, 'day', true) >= minSelectedDateDifference
		) {
			// Update selected end date and its string representation
			selectedEndDateCellData = toYYYYMMDD(selectedEndDate);
		} else {
			// Calculate the next date based on the selected start date and minimum allowed date difference
			let nextDate: Date = dayjs(selectedStartDateCellData)
				.add(minSelectedDateDifference, 'day')
				.toDate();
			// Update selected end date and its string representation
			selectedEndDateCellData = toYYYYMMDD(nextDate);
			selectedEndDate = nextDate;
		}
		console.log('Dynamic Selected Dates:', { selectedStartDate, selectedEndDate });
	}

	calendarInfoStore.subscribe((info) => {
		calendarInfo = info;
		const valueData = Array.from(info.values());
		shouldShowTopData = valueData.some((data) => data.top !== undefined);
		shouldShowBottomData = valueData.some((data) => data.bottom !== undefined);
		shouldShowLeftData = valueData.some((data) => data.left !== undefined);
		shouldShowRightData = valueData.some((data) => data.right !== undefined);
	});

	onMount(async () => {
		calendarData = buildCalendar(minDate, maxDate, noOfMonthsIterations, firstWeekDayOffset);

		// Wait for Calendar to Load
		await tick();

		// Check if virtualContainerRef is defined and scrolling to selected end date is required
		if (virtualContainerRef && selectedEndDate) {
			const selectedEndDateMonthEl = document.getElementById(
				`${selectedEndDate?.getMonth() + 1}-${selectedEndDate?.getFullYear()}`
			);
			const weekDayHeaderEl = document.getElementById('week-days');
			let scrollTop =
				parseInt(selectedEndDateMonthEl?.getAttribute('data-scrolly') ?? '0') -
				(weekDayHeaderEl?.getBoundingClientRect().top ?? 0) -
				(selectedEndDateMonthEl?.clientHeight ?? 60);
			console.log({
				rect: selectedEndDateMonthEl?.getBoundingClientRect(),
				scrollTop,
				scrollY: window.scrollY,
				el: selectedEndDateMonthEl
			});
			if (scrollToSelectedDate) {
				virtualContainerRef.scrollTo(0, scrollTop);
				scrollToSelectedDate = true;
			}
		}
		dispatch('select', { selectedStartDate, selectedEndDate });
	});

	/**
	 * Validates the difference between two dates.
	 * @param startDate - The start date.
	 * @param endDate - The end date.
	 * @param minSelectedDateDifference - Minimum allowed date difference.
	 * @param maxSelectedDateDifference - Maximum allowed date difference.
	 * @returns True if the difference is within the specified range, false otherwise.
	 */
	function validateDateDifference(
		startDate: Date | string,
		endDate: Date | string,
		minSelectedDateDifference: number,
		maxSelectedDateDifference: number
	) {
		console.log('Validating date difference:', {
			startDate,
			endDate,
			minSelectedDateDifference,
			maxSelectedDateDifference
		});

		let dateDifference = dayjs(endDate).diff(startDate, 'day', true);

		if (dateDifference < minSelectedDateDifference || dateDifference > maxSelectedDateDifference) {
			return false;
		}

		return true;
	}

	/**
	 * Handles click events on a specific day.
	 * @param day - The clicked day in string format.
	 */
	const handleClick = (day: string) => {
		console.log('Clicked on day:', day);

		/**
		 * Validate if the clicked date is within the specified range
		 * If not reject the selection
		 */
		if (!(parseDate(day) >= parseDate(minDate) && parseDate(day) <= parseDate(maxDate))) {
			let error =
				'Date must be between ' +
				parseDate(minDate).toDateString() +
				' and ' +
				parseDate(maxDate).toDateString();
			console.error('Error: ', error);
			dispatch('error', { error });
			return;
		}

		// Update selected start and end dates based on the clicked day
		if (parseDate(day) < parseDate(selectedStartDateCellData)) {
			console.log('Case: Selected Date is before Previous Selected Start Date:', {
				day,
				selectedStartDate
			});
			// If the clicked date is before the previous selected start date
			if (
				validateDateDifference(
					day,
					selectedEndDate!,
					minSelectedDateDifference,
					maxSelectedDateDifference
				)
			) {
				// If the date difference is within the allowed range, update the selected start date
				selectedStartDateCellData = day;
			}
		} else if (parseDate(day) > parseDate(selectedEndDateCellData)) {
			console.log('Case: Selected Date is after Previous Selected End Date:', {
				day,
				selectedStartDate
			});
			// If the clicked date is after the previous selected end date
			if (
				validateDateDifference(
					selectedStartDate!,
					day,
					minSelectedDateDifference,
					maxSelectedDateDifference
				)
			) {
				// If the date difference is within the allowed range, update the selected end date
				selectedEndDateCellData = day;
			}
		} else {
			console.log('Case: Selected Date is between Previous Selected Start and End Date:', {
				day,
				selectedStartDate,
				selectedEndDate
			});
			// If the clicked date is between the previous selected start and end dates
			if (
				validateDateDifference(
					selectedStartDate!,
					day,
					minSelectedDateDifference,
					maxSelectedDateDifference
				) &&
				validateDateDifference(
					day,
					selectedEndDate!,
					minSelectedDateDifference,
					maxSelectedDateDifference
				)
			) {
				// If the date difference is within the allowed range, update the selected end date
				selectedEndDateCellData = day;
			}
		}

		console.log(
			'selectedStartDateCellData: ',
			selectedStartDateCellData,
			' selectedEndDateCellData: ',
			selectedEndDateCellData
		);

		selectedStartDate = parseDate(selectedStartDateCellData);
		selectedEndDate = parseDate(selectedEndDateCellData);
		scrollToSelectedDate = false;

		dispatch('select', { selectedStartDate, selectedEndDate });
		console.log('Selected dates: ', { selectedStartDate, selectedEndDate });
	};
</script>

<div class="overflow-y-scroll h-full" bind:this={virtualContainerRef}>
	<table class="table w-full">
		<WeekDays {firstWeekDayOffset} />
		<tbody class="w-full overflow-y-scroll" style="height: calc(100% - 48px)">
			{#each calendarData as weeks, monthIndex}
				{@const currentMonth = ((month + monthIndex) % 12) + 1}
				{@const currentYear = year + Math.floor((month + monthIndex) / 12)}
				<MonthTitle {currentMonth} {currentYear} />
				<slot name="month-top-data" id="{currentMonth}-{currentYear}" />
				{#each weeks as week}
					<tr class="text-center">
						{#each week as day}
							{@const data = calendarInfo.get(day)}
							{#if day === ''}
								<td class="p-0 border-0" />
							{:else}
								<td class="p-0 border-0 align-top">
									<RangeCell
										cellInRange={parseDate(day) >= parseDate(selectedStartDateCellData) &&
											parseDate(day) <= parseDate(selectedEndDateCellData)}
										cellDisabled={!(
											parseDate(day) >= parseDate(minDate) && parseDate(day) <= parseDate(maxDate)
										)}
										{today}
										startDateSelected={selectedStartDateCellData}
										endDateSelected={selectedEndDateCellData}
										{day}
										{data}
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
				<slot name="month-bottom-data" id="{currentMonth}-{currentYear}" />
			{/each}
		</tbody>
	</table>
</div>
