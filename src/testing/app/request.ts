import supertest, { type SuperTest, type Test } from 'supertest';
import type { Application } from 'express';

/**
 * Creates a supertest instance for testing HTTP requests
 * 
 * @param app - Express application
 * @returns Supertest instance
 * 
 * @example
 * ```typescript
 * import { createTestRequest } from 'express-pack/testing';
 * 
 * const request = createTestRequest(app);
 * const res = await request.get('/users').expect(200);
 * ```
 * 
 * @category Testing
 */
export function createTestRequest(app: Application): SuperTest<Test> {
    return supertest(app);
}

/**
 * Creates an authenticated request with JWT token
 * 
 * @param app - Express application
 * @param token - JWT token
 * @returns Supertest instance with auth header
 * 
 * @example
 * ```typescript
 * import { createAuthenticatedRequest, generateTestToken } from 'express-pack/testing';
 * 
 * const token = generateTestToken({ userId: '123' });
 * const request = createAuthenticatedRequest(app, token);
 * const res = await request.get('/profile').expect(200);
 * ```
 * 
 * @category Testing
 */
export function createAuthenticatedRequest(
    app: Application,
    token: string
): SuperTest<Test> {
    const request = supertest(app);

    // Override methods to add auth header
    const originalGet = request.get.bind(request);
    const originalPost = request.post.bind(request);
    const originalPut = request.put.bind(request);
    const originalDelete = request.delete.bind(request);
    const originalPatch = request.patch.bind(request);

    request.get = (url: string) => originalGet(url).set('Authorization', `Bearer ${token}`);
    request.post = (url: string) => originalPost(url).set('Authorization', `Bearer ${token}`);
    request.put = (url: string) => originalPut(url).set('Authorization', `Bearer ${token}`);
    request.delete = (url: string) => originalDelete(url).set('Authorization', `Bearer ${token}`);
    request.patch = (url: string) => originalPatch(url).set('Authorization', `Bearer ${token}`);

    return request;
}
