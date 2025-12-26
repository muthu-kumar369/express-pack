import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: false,
    clean: true,
    splitting: false,
    sourcemap: true,
    external: [
        '@express-pack/core',
        '@express-pack/auth',
        '@express-pack/cache',
        '@express-pack/queue',
        '@express-pack/scheduler',
        '@express-pack/email',
        '@express-pack/storage',
        '@express-pack/payment',
        '@express-pack/db',
        '@express-pack/testing',
        '@express-pack/cli'
    ],
});
