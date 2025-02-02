import type { RecordModel } from 'pocketbase';
import { writable } from 'svelte/store';

export const userStore = writable<RecordModel | null>(null);
