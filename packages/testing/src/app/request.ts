import { Application } from 'express';
import supertest from 'supertest';

/**
 * Creates a supertest request instance for testing
 * 
 * @param app - Express application
 * @returns Supertest instance
 */
export function createRequest(app: Application) {
    return supertest(app);
}

/**
 * Helper to create authenticated requests
 */
export function createAuthRequest(app: Application, token: string) {
    return supertest(app).set('Authorization', `Bearer ${token}`);
}
