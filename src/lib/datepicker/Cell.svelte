<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CellData } from './calendar-data.msg';

	export let day: CellData;
	export let today: CellData;
	export let daySelected: CellData;
	export let cellDisabled: boolean = false;
	export let shouldShowTopData: boolean = false;
	export let shouldShowBottomData: boolean = false;
	export let shouldShowLeftData: boolean = false;
	export let shouldShowRightData: boolean = false;

	let todayDateClass: string = '';
	let selectedDateClass: string = '';
	let selectedDateTextColor: string = '';
	let isSelectedProps = {
		isSelected: false,
		isDisabled: false
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
			if (day.date === daySelected.date) {
				isSelectedProps.isSelected = true;
				selectedDateClass = 'bg-primary rounded-lg';
				selectedDateTextColor = 'text-neutral-content';
			} else {
				isSelectedProps.isSelected = false;
				selectedDateClass = '';
				selectedDateTextColor = '';
			}
		}
	}

	const dispatch = createEventDispatcher();

	const handleClick = () => {
		dispatch('handleClick', { day });
	};
</script>

<button
	class="{cellWidth} h-full justify-center items-center py-3"
	id={day.date}
	on:click={handleClick}
>
	{#if shouldShowTopData}
		<svelte:component
			this={day.data?.top?.component}
			{...day.data?.top?.props}
			{...isSelectedProps}
		/>
	{/if}
	<div class="flex place-content-center w-full h-full">
		<div
			class="h-full mx-auto justify-center items-center flex flex-row py-2 {todayDateClass} {selectedDateClass}"
			style="width: 98%;"
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
