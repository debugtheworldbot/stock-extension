import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function marketIsOpen() {
	const hour = new Date().getUTCHours()
	const beijingHour = hour + 8
	return beijingHour >= 9 && beijingHour <= 17
}
