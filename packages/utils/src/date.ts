import { format, addDays, subDays, startOfDay, endOfDay, isAfter, isBefore } from 'date-fns';

/**
 * Format a date to a string
 */
export function formatDate(date: Date, formatStr: string = 'yyyy-MM-dd'): string {
    return format(date, formatStr);
}

/**
 * Add days to a date
 */
export function addDaysToDate(date: Date, days: number): Date {
    return addDays(date, days);
}

/**
 * Subtract days from a date
 */
export function subtractDaysFromDate(date: Date, days: number): Date {
    return subDays(date, days);
}

/**
 * Get start of day
 */
export function getStartOfDay(date: Date): Date {
    return startOfDay(date);
}

/**
 * Get end of day
 */
export function getEndOfDay(date: Date): Date {
    return endOfDay(date);
}

/**
 * Check if date is after another date
 */
export function isDateAfter(date: Date, dateToCompare: Date): boolean {
    return isAfter(date, dateToCompare);
}

/**
 * Check if date is before another date
 */
export function isDateBefore(date: Date, dateToCompare: Date): boolean {
    return isBefore(date, dateToCompare);
}

// Re-export date-fns for convenience
export * from 'date-fns';
