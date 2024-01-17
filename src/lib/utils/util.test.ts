import { buildCalendar, parseDate, toYYYYMMDD } from './util';

describe('toYYYYMMDD', () => {
	test('should format date to YYYY/MM/DD', () => {
		const date = new Date('2023-12-13');

		const result = toYYYYMMDD(date);
		const expectedDate = '2023/12/13';
		expect(result).toBe(expectedDate);
	});
});

describe('parseDate', () => {
	test('should parse valid date string to Date object', () => {
		const validDateString = '2023-12-13';

		const result = parseDate(validDateString);
		const expectedDate = new Date('2023/12/13');
		expect(result).toStrictEqual(expectedDate);
	});

	test('should return current date for invalid date string', () => {
		const invalidDateString = 'invaliddate';

		const result = parseDate(invalidDateString);
		const expectedDate = new Date();
		expect(result).toStrictEqual(expectedDate);
	});

	test('should return current date for empty string', () => {
		const result = parseDate('');
		const expectedDate = new Date();
		expect(result).toStrictEqual(expectedDate);
	});

	test('should return current date if no date is passed', () => {
		const result = parseDate();
		const expectedDate = new Date();
		expect(result).toStrictEqual(expectedDate);
	});
});

describe('buildCalendar', () => {
	test('should build calendar data', () => {
		const minDate = '2023-12-08';
		const maxDate = '2023-12-29';
		const noOfMonthsIterations = 1;
		const firstWeekDayOffset = 1;

		const result = buildCalendar(minDate, maxDate, noOfMonthsIterations, firstWeekDayOffset);
		const expectedCalendar: string[][][] = [
			[
				['', '', '', '', '2023/12/01', '2023/12/02', '2023/12/03'],
				[
					'2023/12/04',
					'2023/12/05',
					'2023/12/06',
					'2023/12/07',
					'2023/12/08',
					'2023/12/09',
					'2023/12/10'
				],
				[
					'2023/12/11',
					'2023/12/12',
					'2023/12/13',
					'2023/12/14',
					'2023/12/15',
					'2023/12/16',
					'2023/12/17'
				],
				[
					'2023/12/18',
					'2023/12/19',
					'2023/12/20',
					'2023/12/21',
					'2023/12/22',
					'2023/12/23',
					'2023/12/24'
				],
				[
					'2023/12/25',
					'2023/12/26',
					'2023/12/27',
					'2023/12/28',
					'2023/12/29',
					'2023/12/30',
					'2023/12/31'
				]
			]
		];
		expect(result).toStrictEqual(expectedCalendar);
	});
});
