<script lang="ts">
	import type { Data } from '../../lib/messages/calendar-data.msg';
	import RangeCalendar from '../../lib/rangepicker/RangeCalendar.svelte';

	export let modalId: string = 'date-picker-modal';
	export let calendarReqData: Map<string, Data> = new Map();

	let selectedStartDate: Date = new Date();
	let selectedEndDate: Date = new Date();
</script>

<!-- The button to open modal -->
<div class=" mt-20 h-full text-center ">
<label for={modalId} class="btn">Rangepicker</label>
</div>

<!-- Put this part before </body> tag -->
<input type="checkbox" id={modalId} class="modal-toggle" />
<label for={modalId} class="modal cursor-pointer">
	<label class="modal-box relative h-96" for="">
		<RangeCalendar
			bind:selectedStartDate
			bind:selectedEndDate
			{calendarReqData}
			minDate="2023-6-28"
			maxDate="2024-7-17"
		/>
	</label>
</label>
