import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ResponseUtil } from '../../../src/util/response/index.js';
import express, { Request, Response } from 'express';

describe('ResponseUtil', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonSpy: any;
    let statusSpy: any;

    beforeEach(() => {
        jsonSpy = vi.fn();
        statusSpy = vi.fn(() => ({ json: jsonSpy }));

        req = {
            requestId: 'test-request-id',
        };

        res = {
            status: statusSpy,
            headersSent: false,
            locale: 'en',
        };
    });

    describe('send', () => {
        it('should send success response', () => {
            ResponseUtil.send(req as Request, res as Response, 'SUCCESS', { user: { id: '123' } });

            expect(statusSpy).toHaveBeenCalled();
            expect(jsonSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: expect.any(Boolean),
                    data: { user: { id: '123' } },
                    requestId: 'test-request-id',
                })
            );
        });

        it('should send response without data', () => {
            ResponseUtil.send(req as Request, res as Response, 'SUCCESS');

            expect(jsonSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: expect.any(Boolean),
                    requestId: 'test-request-id',
                })
            );
        });

        it('should include request ID if present', () => {
            ResponseUtil.send(req as Request, res as Response, 'SUCCESS');

            expect(jsonSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    requestId: 'test-request-id',
                })
            );
        });

        it('should not send if headers already sent', () => {
            res.headersSent = true;

            ResponseUtil.send(req as Request, res as Response, 'SUCCESS');

            expect(statusSpy).not.toHaveBeenCalled();
            expect(jsonSpy).not.toHaveBeenCalled();
        });

        it('should throw error if code not provided', () => {
            expect(() => {
                ResponseUtil.send(req as Request, res as Response, '' as any);
            }).toThrow('code');
        });

        it('should handle empty data object', () => {
            ResponseUtil.send(req as Request, res as Response, 'SUCCESS', {});

            const callArg = jsonSpy.mock.calls[0][0];
            expect(callArg.data).toBeUndefined();
        });

        it('should include message from i18n', () => {
            ResponseUtil.send(req as Request, res as Response, 'SUCCESS');

            expect(jsonSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.any(String),
                })
            );
        });
    });
});
