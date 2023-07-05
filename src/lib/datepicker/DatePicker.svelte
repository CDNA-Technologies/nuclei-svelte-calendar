<script lang="ts">
	import Calendar from '../../lib/datepicker/Calendar.svelte';
	import type { Data } from '../../lib/messages/calendar-data.msg';

	export let modalId: string = 'date-picker-modal';
	export let calendarReqData: Map<string, Data> = new Map();

	let selectedDate: Date;
</script>

<!-- The button to open modal -->
<label for={modalId} class="btn">Datepicker</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id={modalId} class="modal-toggle" />
<label for={modalId} class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<Calendar bind:selectedDate {calendarReqData} minDate="2023-6-28" maxDate="2024-6-28" />
	</label>
</label>
