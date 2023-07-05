<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Wheel from './Wheel.svelte';

	export let date: Date = new Date();
	export let minDate: Date = new Date();
	export let maxDate: Date = new Date(2100, 0, 1);

	const MONTHS = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'July',
		'Aug',
		'Sept',
		'Oct',
		'Nov',
		'Dec'
	];

	const YEARS = new Array(maxDate.getFullYear() - minDate.getFullYear() + 1)
		.fill(minDate.getFullYear())
		.map((v, i) => v + i);
	const dispatch = createEventDispatcher();

	$: DAYS = new Array(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate())
		.fill(1)
		.map((v, i) => v + i);

	let dateChanged = (event) => {
		let { type, changedData } = event.detail;
		if (type === 'day') {
			date = new Date(date.getFullYear(), date.getMonth(), changedData + 1);
		} else if (type === 'month') {
			let maxDayInSelectedMonth = new Date(date.getFullYear(), changedData + 1, 0);
			let day = Math.min(date.getDate(), maxDayInSelectedMonth.getDate());
			date = new Date(date.getFullYear(), changedData, day);
		} else if (type === 'year') {
			let maxDayInSelectedMonth = new Date(YEARS[changedData], date.getMonth() + 1, 0);
			let day = Math.min(date.getDate(), maxDayInSelectedMonth.getDate());
			date = new Date(YEARS[changedData], date.getMonth(), day);
		}

		dispatch('dateChange', { date });
	};
</script>

<div>{date.toLocaleDateString()}</div>
<div class="flex flex-row overflow-hidden py-16 justify-between">
	<Wheel type="day" data={DAYS} selected={date.getDate()} on:dateChange={dateChanged} />
	<Wheel type="month" data={MONTHS} selected={date.getMonth() + 1} on:dateChange={dateChanged} />
	<Wheel
		type="year"
		data={YEARS}
		selected={YEARS.indexOf(date.getFullYear()) + 1}
		on:dateChange={dateChanged}
	/>
</div>
