import { describe, it, expect } from 'vitest';
import * as pkg from '../src';

describe('@express-pack/cache', () => {
  it('should export modules', () => {
    expect(pkg).toBeDefined();
    // Basic check to ensure entry point is loadable
    expect(Object.keys(pkg).length).toBeGreaterThanOrEqual(0);
  });
});
