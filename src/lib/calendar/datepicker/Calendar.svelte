<script lang="ts">
	import MonthTitle from '$lib/components/MonthTitle.svelte';
	import WeekDays from '$lib/components/WeekDays.svelte';
	import type { Data } from '$lib/messages/calendar-data.msg';
	import { calendarInfoStore } from '$lib/stores/store';
	import { buildCalendar, parseDate, toYYYYMMDD } from '$lib/utils/util';
	import dayjs from 'dayjs';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import Cell from './Cell.svelte';

	const currentDate: Date = dayjs().toDate();

	export let minDate: string;
	export let maxDate: string;
	/**
	 * @param firstWeekDayOffset 0 for Sunday, 1 for Monday
	 */
	export let firstWeekDayOffset: number = 1;
	export let noOfMonthsIterations: number = 13;
	export let selectedDate: Date | undefined;

	let calendarData: string[][][] = [];
	let today: string = toYYYYMMDD(currentDate);

	let daySelected: string;
	let virtualContainerRef: HTMLDivElement;
	let scrollToSelectedDate: boolean = true;

	let year = currentDate.getFullYear();
	let month = currentDate.getMonth();

	const dispatch = createEventDispatcher();

	let shouldShowTopData: boolean = false;
	let shouldShowBottomData: boolean = false;
	let shouldShowLeftData: boolean = false;
	let shouldShowRightData: boolean = false;
	let calendarInfo: Map<string, Data> = new Map();

	$: {
		// Check if selected start date is defined and in the future
		if (selectedDate !== undefined && selectedDate.getTime() > currentDate.getTime()) {
			// Update selected start date and its string representation
			daySelected = toYYYYMMDD(selectedDate);
		} else {
			// Set selected start date to today if not defined or in the past
			selectedDate = currentDate;
			daySelected = today;
		}
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
		if (virtualContainerRef && selectedDate) {
			const selectedDateMonthEl = document.getElementById(
				`${selectedDate?.getMonth() + 1}-${selectedDate?.getFullYear()}`
			);
			const weekDayHeaderEl = document.getElementById('week-days');
			let scrollTop =
				parseInt(selectedDateMonthEl?.getAttribute('data-scrolly') ?? '0') -
				(weekDayHeaderEl?.getBoundingClientRect().top ?? 0) -
				(selectedDateMonthEl?.clientHeight ?? 60);
			console.log({
				rect: selectedDateMonthEl?.getBoundingClientRect(),
				scrollTop,
				scrollY: window.scrollY,
				el: selectedDateMonthEl
			});
			if (scrollToSelectedDate) {
				virtualContainerRef.scrollTo(0, scrollTop);
				scrollToSelectedDate = true;
			}
		}
	});

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
				parseDate(maxDate).toDateString() +
				'.';
			console.log('error: ', error);
			dispatch('error', { error });
			return;
		}
		daySelected = day;
		selectedDate = parseDate(daySelected);
		scrollToSelectedDate = false;
		dispatch('select', { selectedDate });
		console.log('selectedDate: ', selectedDate);
	};
</script>

<div class="overflow-y-auto h-full" bind:this={virtualContainerRef}>
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
									<Cell
										cellDisabled={!(
											parseDate(day) >= parseDate(minDate) && parseDate(day) <= parseDate(maxDate)
										)}
										{today}
										{daySelected}
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
