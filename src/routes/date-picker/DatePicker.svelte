<script lang="ts">
	import { dayjs } from 'dayjs';
	import Calendar from '../../lib/datepicker/Calendar.svelte';
	import type { Data } from '../../lib/messages/calendar-data.msg';

	export let modalId: string = 'date-picker-modal';
	export let calendarReqData: Map<string, Data> = new Map();

	let selectedDate: Date | undefined = undefined;
</script>

<!-- The button to open modal -->
<div class=" mt-20 h-full text-center ">
	<label for={modalId} class="btn"
	>Datepicker</label
>
</div>

<!-- Put this part before </body> tag -->
<input type="checkbox" id={modalId} class="modal-toggle" />
<label for={modalId} class="modal cursor-pointer h-full">
	<label class="modal-box relative h-3/4" for="{modalId}">
		<Calendar bind:selectedDate {calendarReqData} minDate="2023-6-28" maxDate="2024-6-28" />
	</label>
</label>
