import { describe, it, expect } from 'vitest';
import { validate, z } from '../src';

describe('Validation Package', () => {
    it('should export validate function', () => {
        expect(validate).toBeDefined();
        expect(typeof validate).toBe('function');
    });

    it('should export z from zod', () => {
        expect(z).toBeDefined();
        expect(z.object).toBeDefined();
    });
});
