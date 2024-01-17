import { writable } from 'svelte/store';
import type { Data } from '../messages/calendar-data.msg';

export const calendarStore = writable<string[][][]>([]);
export let calendarInfoStore = writable<Map<string, Data>>(new Map());
