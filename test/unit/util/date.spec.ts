import { describe, it, expect } from 'vitest';
import { DateUtil } from '../../../src/util/date/index.js';

describe('Date Utilities', () => {
    describe('formatDate', () => {
        it('should format date correctly', () => {
            const date = new Date('2024-01-15T10:30:00Z');
            const formatted = DateUtil.format(date, 'YYYY-MM-DD');
            expect(formatted).toContain('2024');
        });

        it('should handle different formats', () => {
            const date = new Date('2024-01-15');
            const formatted = DateUtil.format(date, 'DD/MM/YYYY');
            expect(formatted).toBeDefined();
        });
    });

    describe('parseDate', () => {
        it('should parse date string', () => {
            const dateStr = '2024-01-15';
            const parsed = DateUtil.parse(dateStr);
            expect(parsed).toBeInstanceOf(Date);
        });

        it('should handle invalid dates', () => {
            const invalid = 'not-a-date';
            expect(() => DateUtil.parse(invalid)).toThrow();
        });
    });

    describe('addDays', () => {
        it('should add days to date', () => {
            const date = new Date('2024-01-15');
            const result = DateUtil.addDays(date, 5);
            expect(result.getDate()).toBe(20);
        });

        it('should handle negative days', () => {
            const date = new Date('2024-01-15');
            const result = DateUtil.addDays(date, -5);
            expect(result.getDate()).toBe(10);
        });
    });

    describe('isAfter', () => {
        it('should compare dates correctly', () => {
            const date1 = new Date('2024-01-20');
            const date2 = new Date('2024-01-15');
            expect(DateUtil.isAfter(date1, date2)).toBe(true);
        });

        it('should return false for earlier dates', () => {
            const date1 = new Date('2024-01-10');
            const date2 = new Date('2024-01-15');
            expect(DateUtil.isAfter(date1, date2)).toBe(false);
        });
    });
});
