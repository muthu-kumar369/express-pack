import { describe, it, expect, beforeEach } from 'vitest';
import {
    setupStorageMock,
    uploadFile,
    downloadFile,
    getFileMetadata,
    deleteFile,
    listFiles,
    fileExists,
    clearStorage,
    getStorageSize,
} from '../../../src/testing/mocks/storage.mock.js';

describe('Storage Mock', () => {
    beforeEach(() => {
        setupStorageMock();
    });

    it('should upload and download files', () => {
        const content = Buffer.from('test content');
        uploadFile('test.txt', content);

        const downloaded = downloadFile('test.txt');
        expect(downloaded).toEqual(content);
    });

    it('should store file metadata', () => {
        uploadFile('test.txt', 'content', {
            contentType: 'text/plain',
            metadata: { userId: '123' },
        });

        const metadata = getFileMetadata('test.txt');
        expect(metadata?.contentType).toBe('text/plain');
        expect(metadata?.metadata?.userId).toBe('123');
    });

    it('should delete files', () => {
        uploadFile('test.txt', 'content');

        const deleted = deleteFile('test.txt');
        expect(deleted).toBe(true);
        expect(fileExists('test.txt')).toBe(false);
    });

    it('should list all files', () => {
        uploadFile('file1.txt', 'content1');
        uploadFile('file2.txt', 'content2');
        uploadFile('image.jpg', 'content3');

        const files = listFiles();
        expect(files).toHaveLength(3);
    });

    it('should list files by prefix', () => {
        uploadFile('images/photo1.jpg', 'content1');
        uploadFile('images/photo2.jpg', 'content2');
        uploadFile('documents/doc1.pdf', 'content3');

        const imageFiles = listFiles('images/');
        expect(imageFiles).toHaveLength(2);
    });

    it('should check file existence', () => {
        uploadFile('test.txt', 'content');

        expect(fileExists('test.txt')).toBe(true);
        expect(fileExists('nonexistent.txt')).toBe(false);
    });

    it('should clear all storage', () => {
        uploadFile('file1.txt', 'content1');
        uploadFile('file2.txt', 'content2');

        clearStorage();

        expect(getStorageSize()).toBe(0);
    });

    it('should track storage size', () => {
        uploadFile('file1.txt', 'content1');
        uploadFile('file2.txt', 'content2');

        expect(getStorageSize()).toBe(2);
    });
});
