import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export function formatCurrency(num: number) {
	if (isNaN(num)) {
		return;
	}
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(num);
}
export function formatDuration(duration: string | number): string {
	const seconds = typeof duration === 'string' ? parseFloat(duration) : duration;

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	// Format the duration based on whether there are hours
	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
			.toString()
			.padStart(2, '0')}`;
	} else {
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}
}
export function formatDurationWithUnits(duration: string | number): string {
	const seconds = typeof duration === 'string' ? parseFloat(duration) : duration;

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	// Build the formatted string with units
	let formattedDuration = '';

	if (hours > 0) {
		formattedDuration += `${hours}h`;
	}
	if (minutes > 0) {
		formattedDuration += `${formattedDuration ? ' ' : ''}${minutes}m`;
	}
	if (remainingSeconds > 0 || (!hours && !minutes)) {
		formattedDuration += `${formattedDuration ? ' ' : ''}${remainingSeconds}s`;
	}

	return formattedDuration;
}
export function formatTime(dateString: string): string {
	const date = new Date(dateString);

	if (isNaN(date.getTime())) {
		throw new Error('Invalid date string');
	}

	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
}
export function timeAgo(timestamp: string): string {
	const currentTime: Date = new Date();
	const pastTime: Date = new Date(timestamp);

	const timeDifference: number = currentTime.getTime() - pastTime.getTime();

	const secondsAgo: number = Math.floor(timeDifference / 1000);
	const minutesAgo: number = Math.floor(secondsAgo / 60);
	const hoursAgo: number = Math.floor(minutesAgo / 60);
	const daysAgo: number = Math.floor(hoursAgo / 24);
	const monthsAgo: number = Math.floor(daysAgo / 30);
	const yearsAgo: number = Math.floor(monthsAgo / 12);

	if (yearsAgo > 0) {
		return `${yearsAgo} year${yearsAgo !== 1 ? 's' : ''} ago`;
	} else if (monthsAgo > 0) {
		return `${monthsAgo} month${monthsAgo !== 1 ? 's' : ''} ago`;
	} else if (daysAgo > 0) {
		return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
	} else if (hoursAgo > 0) {
		return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
	} else if (minutesAgo > 0) {
		return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
	} else {
		return `${secondsAgo} second${secondsAgo !== 1 ? 's' : ''} ago`;
	}
}
