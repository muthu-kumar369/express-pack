import { describe, it, expect } from 'vitest';
import * as initCmd from '../src/commands/init';

describe('@express-pack/cli', () => {
  it('should export init command', () => {
    expect(initCmd).toBeDefined();
    expect(initCmd.initCommand).toBeDefined();
  });
});
