import dayjs from 'dayjs';
import { get } from 'svelte/store';
import { calendarStore } from '../stores/store';

export function toYYYYMMDD(date: Date) {
	return dayjs(date).format('YYYY/MM/DD');
}

/**
 * Parses given date string to Date object
 *
 * @param date given date in string format, ex: 2021-05-17 or 2021/05/17
 * @returns Date object of given date string if valid, else returns current date
 */
export function parseDate(date?: string) {
	let parsedDate = dayjs();
	if (date && date.length > 0) {
		parsedDate = dayjs(date);
		if (parsedDate.toDate().toString() == 'Invalid Date') {
			parsedDate = dayjs();
		}
	}
	return parsedDate.toDate();
}

export function buildCalendar(
	minDate: string,
	maxDate: string,
	noOfMonthsIterations: number,
	firstWeekDayOffset: number
) {
	let calendarData: string[][][] = get(calendarStore);
	console.info('Calendar Data from store', calendarData);
	if (calendarData && calendarData.length > 0 && calendarData.length == noOfMonthsIterations) {
		return calendarData;
	}
	// start with a fresh calendardata one
	calendarData = [];
	const minDateMonth = dayjs(minDate).month();
	const minDateYear = dayjs(minDate).year();
	for (let monthIndex = 0; monthIndex <= noOfMonthsIterations; monthIndex++) {
		let firstDateOfMonth = dayjs(`${minDateYear}-${minDateMonth + monthIndex + 1}-${1}`).toDate(); // +1 since dayjs start from 1 and native Date starts month from 0
		// break if max date is before first date Of Month
		if (dayjs(maxDate).isBefore(firstDateOfMonth)) {
			break;
		}
		let lastDateOfMonth = dayjs(firstDateOfMonth).endOf('month').toDate();
		let daysInMonth = lastDateOfMonth.getDate();
		let firstDayOfWeek = firstDateOfMonth.getDay();

		let weeks: string[][] = [];
		let currentWeek: string[] = [];

		// push empty date till end, if firstWeekDayOffset is non zero and firstDayOfWeek is 0 i.e Sunday iterate till 7 else firstDayOfWeek
		for (
			let week = firstWeekDayOffset;
			week < (firstWeekDayOffset && firstDayOfWeek == 0 ? 7 : firstDayOfWeek);
			week++
		) {
			currentWeek.push('');
		}

		for (let day = 1; day <= daysInMonth; day++) {
			let year = minDateYear + Math.floor((minDateMonth + monthIndex) / 12);
			let month = ((minDateMonth + monthIndex) % 12) + 1;
			let date: string = String(
				year + '/' + (month < 10 ? '0' + month : month) + '/' + (day < 10 ? '0' + day : day)
			);
			currentWeek.push(date);
			if (currentWeek.length === 7) {
				weeks.push(currentWeek);
				currentWeek = [];
			}
		}
		if (currentWeek.length > 0) {
			for (let day = currentWeek.length; day < 7; day++) {
				currentWeek.push('');
			}
			weeks.push(currentWeek);
		}

		calendarData.push(weeks);
	}
	calendarStore.set(calendarData);
	console.info('Calendar:', calendarData);
	return calendarData;
}
