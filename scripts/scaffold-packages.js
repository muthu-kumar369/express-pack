const fs = require('fs');
const path = require('path');

const packages = ['cache', 'queue', 'scheduler', 'email', 'storage', 'payment', 'db', 'testing'];

const baseDir = path.join('D:', 'npm', 'express-pack', 'packages');

const packageJsonTemplate = (name) => `{
  "name": "@express-pack/${name}",
  "version": "2.0.0",
  "description": "${name} module for express-pack",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    "require": "./dist/index.cjs",
    "import": "./dist/index.mjs",
    "types": "./dist/index.d.ts"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts --clean",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "test": "vitest run",
    "test:watch": "vitest watch"
  },
  "keywords": ["express", "${name}", "typescript"],
  "author": "Muthu Kumar",
  "license": "ISC",
  "peerDependencies": {
    "express": "^4.0.0"
  },
  "dependencies": {
    "@express-pack/core": "workspace:*"
  },
  "devDependencies": {
    "@types/express": "^5.0.2",
    "tsup": "^8.5.0",
    "typescript": "^5.8.3",
    "vitest": "^1.0.0"
  }
}`;

const tsconfigTemplate = `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../core" }
  ]
}`;

const tsupTemplate = `import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  external: ['express', '@express-pack/core'],
});`;

const indexTemplate = (name) => `export const ${name} = '${name}';`;

packages.forEach(pkg => {
    const pkgDir = path.join(baseDir, pkg);
    if (!fs.existsSync(pkgDir)) fs.mkdirSync(pkgDir, { recursive: true });
    
    const srcDir = path.join(pkgDir, 'src');
    if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });

    fs.writeFileSync(path.join(pkgDir, 'package.json'), packageJsonTemplate(pkg));
    fs.writeFileSync(path.join(pkgDir, 'tsconfig.json'), tsconfigTemplate);
    fs.writeFileSync(path.join(pkgDir, 'tsup.config.ts'), tsupTemplate);
    fs.writeFileSync(path.join(pkgDir, 'src/index.ts'), indexTemplate(pkg));
    
    console.log(\`Created \${pkg}\`);
});
