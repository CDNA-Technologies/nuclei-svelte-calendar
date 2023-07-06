## DatePicker
> DatePicker is for selecting a particular date from calendar.

Features
1. Select any particular date
2. The selected date will have a color
3. The current date will have a color
4. Any date when selected sends back the date data
	`date: string` Eg: ("2023-2-23")
5. The developer can use datepicker in two ways: 
	1. Case 1: The developer just uses datepicker
		 -> Developer just passes three props namely `minDate: string, maxDate: string, noOfMonths: number`.  
	2. Case 2: The developer passes a map of prefilled data as prop to datepicker
		 -> Developer passes the above mentioned props along with extra data like a object with date as key and an interface named `Data` as value
		 Eg: `{
			`"2023-2-22": {
				`day: 22,
				`month: 2,
				`year: 2023,
				`suffix: "",
				`prefix: "",
				`top-data: "",
				`bottom-data: "",
				`color: "red"`
			 `},
			 `"2023-2-24": {
				`day: 24,
				`month: 2,
				`year: 2023,
				`suffix: "",
				`prefix: "",
				`top-data: "",
				`bottom-data: "",
				`color: "red"`
			 `},
			 ...`
		 `} 
		 when creating the calendar we will check if there is any data which the user has passed and add that to the calendar data.
		 
		 Calendar cell has structure of 
		 `{date: "string",data: Data}`
		 Eg: `{
			 `date: "2023-2-22",
			 `data: {
				`day: 22,
				`month: 2,
				`year: 2023,
				`suffix: "",
				`prefix: "",
				`top-data: "",
				`bottom-data: "",
				`color: "red"`
			 `}
		 `}`
		 When the user selected any date then the `cell.date` is returned

### How to use it
```
<Calendar bind:selectedDate {calendarReqData} minDate="2023-6-28" maxDate="2024-6-28" />
```