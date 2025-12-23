import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import { ExpressPack } from '../../../src/framework/express/index.js';

describe('ExpressPack', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
    });

    describe('init', () => {
        it('should initialize app with default config', async () => {
            const result = await ExpressPack.init({ app, config: {} });

            expect(result).toBe(app);
            expect(ExpressPack.isInitialized()).toBe(true);
        });

        it('should apply middleware configuration', async () => {
            await ExpressPack.init({
                app,
                config: {
                    bodyParser: {},
                    cors: {},
                },
            });

            // Verify middleware stack exists
            const middlewareStack = (app as any)._router?.stack;
            expect(middlewareStack).toBeDefined();
            expect(middlewareStack.length).toBeGreaterThan(0);
        });
    });

    describe('getApp', () => {
        it('should return initialized app', async () => {
            await ExpressPack.init({ app, config: {} });

            const retrievedApp = ExpressPack.getApp();
            expect(retrievedApp).toBe(app);
        });

        it('should throw if app not initialized', () => {
            expect(() => ExpressPack.getApp()).toThrow(
                'Express app not initialized'
            );
        });
    });

    describe('getRouter', () => {
        it('should return new router instance', () => {
            const router1 = ExpressPack.getRouter();
            const router2 = ExpressPack.getRouter();

            expect(router1).toBeDefined();
            expect(router2).toBeDefined();
            expect(router1).not.toBe(router2);
        });
    });

    describe('isInitialized', () => {
        it('should return false before initialization', () => {
            expect(ExpressPack.isInitialized()).toBe(false);
        });

        it('should return true after initialization', async () => {
            await ExpressPack.init({ app, config: {} });
            expect(ExpressPack.isInitialized()).toBe(true);
        });
    });
});
