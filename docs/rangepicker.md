## RangePicker
> RangePicker is for selecting a particular range of dates from calendar.

### Features
1. Select any start date and end date
2. The selected date will have a color
3. The current date will have a color
4. The dates in between start and end date will have a light color
4. Any date when selected sends back the start and end date data
	`date: string` Eg: ("2023-2-23") ("2023-3-12)

### How to use it
```
<RangeCalendar
    bind:selectedStartDate
    bind:selectedEndDate
    {calendarReqData}
    minDate="2023-6-28"
    maxDate="2024-7-17"
/>
```

### Props passed
1. `selectedStartDate: string` - The start date variable where the selected start date is assigned
2. `selectedEndDate: string` - The end date variable where the selected end date is assigned
3. `calendarReqData: CalendarReqData` - The extra data passed to modify the calendar
4. `minDate: string` - The minimum date that can be selected
5. `maxDate: string` - The maximum date that can be selected