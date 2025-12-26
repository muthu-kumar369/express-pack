import slugify from 'slugify';
import { capitalize, camelCase, snakeCase, kebabCase } from 'lodash-es';

/**
 * Create a URL-friendly slug from a string
 */
export function createSlug(text: string): string {
    return slugify(text, { lower: true, strict: true });
}

/**
 * Capitalize first letter of a string
 */
export function capitalizeString(text: string): string {
    return capitalize(text);
}

/**
 * Convert string to camelCase
 */
export function toCamelCase(text: string): string {
    return camelCase(text);
}

/**
 * Convert string to snake_case
 */
export function toSnakeCase(text: string): string {
    return snakeCase(text);
}

/**
 * Convert string to kebab-case
 */
export function toKebabCase(text: string): string {
    return kebabCase(text);
}

/**
 * Truncate string to specified length
 */
export function truncate(text: string, length: number, suffix: string = '...'): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + suffix;
}

// Re-export lodash-es string functions
export { capitalize, camelCase, snakeCase, kebabCase } from 'lodash-es';
