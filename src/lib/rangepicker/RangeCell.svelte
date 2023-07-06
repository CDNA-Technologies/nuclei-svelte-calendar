<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CellData } from '../messages/calendar-data.msg';

	export let day: CellData;
	export let today: CellData;
	export let startDateSelected: CellData;
	export let endDateSelected: CellData;
	export let cellDisabled: boolean = false;
	export let cellInRange: boolean = false;
	export let shouldShowTopData: boolean = false;
	export let shouldShowBottomData: boolean = false;
	export let shouldShowLeftData: boolean = false;
	export let shouldShowRightData: boolean = false;

	let todayDateClass: string = '';
	let selectedDateClass: string = '';
	let selectedDateTextColor: string = '';
	let backgroundColour: string = '';

	let isSelectedProps = {
		isSelected: false,
		isDisabled: false,
		isInRange: false
	};
	let cellWidth: string = 'w-12';
	$: {
		if (shouldShowLeftData || shouldShowRightData) {
			cellWidth = 'w-14';
		} else if (shouldShowLeftData && shouldShowRightData) {
			cellWidth = 'w-16';
		}
	}

	$: {
		if (cellDisabled) {
			isSelectedProps.isDisabled = true;
			selectedDateTextColor = 'text-nu-black-50';
		} else {
			isSelectedProps.isDisabled = false;
			if (day.date === today.date) {
				todayDateClass = 'ring !ring-nu-black-50';
			} else {
				todayDateClass = '';
			}
			if (day.date === endDateSelected.date) {
				isSelectedProps.isSelected = true;
				isSelectedProps.isInRange = true;
				selectedDateClass = 'bg-primary rounded-lg';
				backgroundColour = 'bg-primary bg-opacity-10 bg-gradient-to-r from-transparent to-base-100';
				selectedDateTextColor = 'text-neutral-content';
			} else if (day.date === startDateSelected.date) {
				isSelectedProps.isSelected = true;
				isSelectedProps.isInRange = true;
				selectedDateClass = 'bg-primary rounded-lg';
				backgroundColour = 'bg-primary bg-opacity-10 bg-gradient-to-r from-base-100';
				selectedDateTextColor = 'text-neutral-content';
			} else if (cellInRange) {
				isSelectedProps.isSelected = false;
				isSelectedProps.isInRange = true;
				selectedDateClass = '';
				backgroundColour = 'bg-primary bg-opacity-10';
				selectedDateTextColor = '';
			} else {
				isSelectedProps.isSelected = false;
				isSelectedProps.isInRange = false;
				selectedDateClass = '';
				backgroundColour = '';
				selectedDateTextColor = '';
			}
			if (day.date === startDateSelected.date && day.date === endDateSelected.date) {
				isSelectedProps.isSelected = true;
				isSelectedProps.isInRange = true;
				selectedDateClass = 'bg-primary rounded-lg';
				backgroundColour = '';
				selectedDateTextColor = 'text-neutral-content';
			}
		}
	}

	const dispatch = createEventDispatcher();

	const handleClick = () => {
		dispatch('handleClick', { day });
	};
</script>

<button
	class="w-full h-full py-3 flex flex-col justify-center items-center"
	on:click={handleClick}
	id={day.date}
>
	{#if shouldShowTopData}
		<svelte:component
			this={day.data?.top?.component}
			{...day.data?.top?.props}
			{...isSelectedProps}
		/>
	{/if}
	<div class="flex place-content-center w-full h-full {backgroundColour}">
		<div
			class="h-full {cellWidth} mx-auto justify-center items-center flex flex-row py-2 {todayDateClass} {selectedDateClass}"
		>
			{#if shouldShowLeftData}
				<svelte:component
					this={day.data?.left?.component}
					{...day.data?.left?.props}
					{...isSelectedProps}
				/>
			{/if}
			<div class="text-center card-sub-heading {selectedDateTextColor}">
				{new Date(day.date).getDate()}
			</div>
			{#if shouldShowRightData}
				<svelte:component
					this={day.data?.right?.component}
					{...day.data?.right?.props}
					{...isSelectedProps}
				/>
			{/if}
		</div>
	</div>

	{#if shouldShowBottomData}
		<svelte:component
			this={day.data?.bottom?.component}
			{...day.data?.bottom?.props}
			{...isSelectedProps}
		/>
	{/if}
</button>

<style>
	.ring {
		@apply ring-1 ring-base-300;
		box-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width))
			var(--tw-ring-color);
		border-radius: 8px;
	}
</style>
