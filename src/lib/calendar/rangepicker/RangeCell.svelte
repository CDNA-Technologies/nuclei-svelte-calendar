<script lang="ts">
	import type { Data } from '$lib/messages/calendar-data.msg';
	import dayjs from 'dayjs';
	import { createEventDispatcher } from 'svelte';

	export let day: string;
	export let today: string;
	export let startDateSelected: string;
	export let endDateSelected: string;
	export let data: Data | undefined;
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

	let extraProps = {
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
			extraProps.isDisabled = true;
			selectedDateTextColor = 'text-nu-black-50';
		} else {
			extraProps.isDisabled = false;
			if (day === today) {
				todayDateClass = 'ring !ring-nu-black-50';
			} else {
				todayDateClass = '';
			}
			if (day === endDateSelected) {
				extraProps.isSelected = true;
				extraProps.isInRange = true;
				selectedDateClass = 'bg-primary rounded-lg';
				backgroundColour = 'bg-primary bg-opacity-10 bg-gradient-to-r from-transparent to-base-100';
				selectedDateTextColor = 'text-neutral-content';
			} else if (day === startDateSelected) {
				extraProps.isSelected = true;
				extraProps.isInRange = true;
				selectedDateClass = 'bg-primary rounded-lg';
				backgroundColour = 'bg-primary bg-opacity-10 bg-gradient-to-r from-base-100';
				selectedDateTextColor = 'text-neutral-content';
			} else if (cellInRange) {
				extraProps.isSelected = false;
				extraProps.isInRange = true;
				selectedDateClass = '';
				backgroundColour = 'bg-primary bg-opacity-10';
				selectedDateTextColor = '';
			} else {
				extraProps.isSelected = false;
				extraProps.isInRange = false;
				selectedDateClass = '';
				backgroundColour = '';
				selectedDateTextColor = '';
			}
			if (day === startDateSelected && day === endDateSelected) {
				extraProps.isSelected = true;
				extraProps.isInRange = true;
				selectedDateClass = 'bg-primary rounded-lg';
				backgroundColour = '';
				selectedDateTextColor = 'text-neutral-content';
			}
		}
		extraProps = extraProps;
	}

	const dispatch = createEventDispatcher();

	const handleClick = () => {
		dispatch('handleClick', { day });
	};
</script>

<button
	class="w-full h-full py-3 flex flex-col justify-center items-center"
	on:click={handleClick}
	id={day}
>
	{#if data?.top?.component && shouldShowTopData && !cellDisabled}
		{#key extraProps}
			<svelte:component this={data?.top?.component} {...data?.top?.props ?? {}} {...extraProps} />
		{/key}
	{/if}
	<div class="flex place-content-center w-full h-full {backgroundColour}">
		<div
			class="h-full {cellWidth} mx-auto justify-center items-center flex flex-row py-2 {todayDateClass} {selectedDateClass}"
		>
			{#if data?.left?.component && shouldShowLeftData && !cellDisabled}
				{#key extraProps}
					<svelte:component
						this={data?.left?.component}
						{...data?.left?.props ?? {}}
						{...extraProps}
					/>
				{/key}
			{/if}
			<div class="text-center card-sub-heading {selectedDateTextColor}">
				{dayjs(day).date()}
			</div>
			{#if data?.right?.component && shouldShowRightData && !cellDisabled}
				{#key extraProps}
					<svelte:component
						this={data?.right?.component}
						{...data?.right?.props ?? {}}
						{...extraProps}
					/>
				{/key}
			{/if}
		</div>
	</div>

	{#if data?.bottom?.component && shouldShowBottomData && !cellDisabled}
		{#key extraProps}
			<svelte:component
				this={data?.bottom?.component}
				{...data?.bottom?.props ?? {}}
				{...extraProps}
			/>
		{/key}
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
