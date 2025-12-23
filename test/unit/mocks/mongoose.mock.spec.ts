import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    setupMongooseMock,
    clearDatabase,
    teardownMongooseMock,
    getMongoUri,
} from '../../../src/testing/mocks/mongoose.mock.js';
import mongoose from 'mongoose';

describe('Mongoose Mock', () => {
    beforeEach(async () => {
        await setupMongooseMock();
    });

    afterEach(async () => {
        await teardownMongooseMock();
    });

    it('should setup MongoDB mock', () => {
        const uri = getMongoUri();
        expect(uri).toBeDefined();
        expect(uri).toContain('mongodb://');
    });

    it('should connect to database', () => {
        expect(mongoose.connection.readyState).toBe(1); // connected
    });

    it('should create and find documents', async () => {
        const TestSchema = new mongoose.Schema({ name: String });
        const TestModel = mongoose.model('Test', TestSchema);

        await TestModel.create({ name: 'Test Document' });

        const docs = await TestModel.find();
        expect(docs).toHaveLength(1);
        expect(docs[0].name).toBe('Test Document');
    });

    it('should clear database', async () => {
        const TestSchema = new mongoose.Schema({ name: String });
        const TestModel = mongoose.model('Test2', TestSchema);

        await TestModel.create({ name: 'Doc 1' });
        await TestModel.create({ name: 'Doc 2' });

        await clearDatabase();

        const docs = await TestModel.find();
        expect(docs).toHaveLength(0);
    });
});
