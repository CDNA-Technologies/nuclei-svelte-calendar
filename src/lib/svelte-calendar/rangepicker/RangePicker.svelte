<script lang="ts">
	import type { Data } from '../commons/calendar-data.msg';
	import RangeCalendar from '../commons/RangeCalendar.svelte';

	export let modalId: string = 'date-picker-modal';
	export let calendarReqData: Map<string, Data>;

	let selectedStartDate: Date;
	let selectedEndDate: Date;
</script>

<!-- The button to open modal -->
<label for={modalId} class="btn">Rangepicker</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id={modalId} class="modal-toggle" />
<label for={modalId} class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<RangeCalendar
			{selectedStartDate}
			{selectedEndDate}
			{calendarReqData}
			minDate="2023-2-12"
			maxDate="2023-3-17"
		/>
	</label>
</label>
