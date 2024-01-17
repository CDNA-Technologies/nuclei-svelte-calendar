<script lang="ts">
	import dayjs from 'dayjs';
	import { createEventDispatcher } from 'svelte';
	import type { Data } from '../../messages/calendar-data.msg.js';

	export let day: string;
	export let today: string;
	export let daySelected: string;
	export let data: Data | undefined;
	export let cellDisabled: boolean = false;
	export let shouldShowTopData: boolean = false;
	export let shouldShowBottomData: boolean = false;
	export let shouldShowLeftData: boolean = false;
	export let shouldShowRightData: boolean = false;

	let todayDateClass: string = '';
	let selectedDateClass: string = '';
	let selectedDateTextColor: string = '';
	let extraProps = {
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
			extraProps.isDisabled = true;
			selectedDateTextColor = 'text-nu-black-50';
		} else {
			extraProps.isDisabled = false;
			if (day === today) {
				todayDateClass = 'ring !ring-nu-black-50';
			} else {
				todayDateClass = '';
			}
			if (day === daySelected) {
				extraProps.isSelected = true;
				selectedDateClass = 'bg-primary rounded-lg';
				selectedDateTextColor = 'text-neutral-content';
			} else {
				extraProps.isSelected = false;
				selectedDateClass = '';
				selectedDateTextColor = '';
			}
		}
		extraProps = extraProps;
	}

	const dispatch = createEventDispatcher();

	const handleClick = () => {
		dispatch('handleClick', { day });
	};
</script>

<button class="{cellWidth} h-full justify-center items-center py-3" id={day} on:click={handleClick}>
	{#if data?.top?.component && shouldShowTopData && !cellDisabled}
		{#key extraProps}
			<svelte:component this={data?.top?.component} {...data?.top?.props ?? {}} {...extraProps} />
		{/key}
	{/if}
	<div class="flex place-content-center w-full h-full">
		<div
			class="h-full mx-auto justify-center items-center flex flex-row py-2 {todayDateClass} {selectedDateClass}"
			style="width: 98%;"
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
