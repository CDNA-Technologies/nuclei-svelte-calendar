interface DaysData {
	name: string;
	shortName: string;
	color: string;
	index: number;
}

export const DAYS_OF_THE_WEEK: DaysData[] = [
	{
		name: 'Sunday',
		shortName: 'Sun',
		color: 'text-primary',
		index: 0
	},
	{
		name: 'Monday',
		shortName: 'Mon',
		color: 'base-content-light',
		index: 1
	},
	{
		name: 'Tuesday',
		shortName: 'Tue',
		color: 'base-content-light',
		index: 2
	},
	{
		name: 'Wednesday',
		shortName: 'Wed',
		color: 'base-content-light',
		index: 3
	},
	{
		name: 'Thursday',
		shortName: 'Thu',
		color: 'base-content-light',
		index: 4
	},
	{
		name: 'Friday',
		shortName: 'Fri',
		color: 'base-content-light',
		index: 5
	},
	{
		name: 'Saturday',
		shortName: 'Sat',
		color: 'text-primary',
		index: 6
	}
];

export const MONTHS_OF_THE_YEAR: string[] = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];
