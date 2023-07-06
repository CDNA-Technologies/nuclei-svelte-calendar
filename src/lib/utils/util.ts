function findWeekNumber(dateString: string) {
	let date = parseDate(dateString);
	let startDate = new Date(date.getFullYear(), 0, 1);
	let days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

	let weekNumber = Math.ceil(days / 7);
	return weekNumber;
}

export function findCurrentCalendarDataWeekNumber(dateString: string, minDate: string) {
	let startDate = new Date(minDate);
	let firstDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
	let firstDayOfMonthWeekNumber = findWeekNumber(firstDayOfMonth.toISOString());
	let currentDayWeekNumber = findWeekNumber(dateString);
	return currentDayWeekNumber - firstDayOfMonthWeekNumber;
}

/**
 * Parses given date string to Date object
 *
 * @param date given date in string format, ex: 2021-05-17 or 2021/05/17
 * @returns Date object of given date string if valid, else returns current date
 */
export function parseDate(date?: string) {
	if (date && date.length > 0) {
		let dateParts = date.split('-');
		if (dateParts.length !== 3) {
			dateParts = date.split('/');
		}
		if (dateParts.length !== 3) {
			return new Date();
		}
		return new Date(
			Date.UTC(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
		);
	}
	return new Date();
}
