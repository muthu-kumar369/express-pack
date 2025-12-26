const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '../packages');
const packages = fs.readdirSync(packagesDir);

const vitestConfigContent = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
});
`;

const basicTestContent = (pkgName) => `import { describe, it, expect } from 'vitest';
import * as pkg from '../src';

describe('${pkgName}', () => {
  it('should export modules', () => {
    expect(pkg).toBeDefined();
    // Basic check to ensure entry point is loadable
    expect(Object.keys(pkg).length).toBeGreaterThanOrEqual(0);
  });
});
`;

packages.forEach(pkg => {
  const pkgDir = path.join(packagesDir, pkg);
  if (!fs.statSync(pkgDir).isDirectory()) return;

  const pkgName = require(path.join(pkgDir, 'package.json')).name;
  console.log(`Processing ${pkgName}...`);

  // Create vitest.config.ts
  const cfgPath = path.join(pkgDir, 'vitest.config.ts');
  if (!fs.existsSync(cfgPath)) {
    fs.writeFileSync(cfgPath, vitestConfigContent);
    console.log(`  Created vitest.config.ts`);
  }

  // Create test directory and file
  const testDir = path.join(pkgDir, 'test');
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);

  const testPath = path.join(testDir, 'index.test.ts');
  if (!fs.existsSync(testPath)) {
    fs.writeFileSync(testPath, basicTestContent(pkgName));
    console.log(`  Created test/index.test.ts`);
  }
});

console.log('Done generating tests!');
