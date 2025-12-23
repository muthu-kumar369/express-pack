/**
 * Storage Mock for Testing
 * 
 * Provides in-memory file storage for testing S3-like operations
 */

interface StoredFile {
    key: string;
    content: Buffer | string;
    contentType?: string;
    metadata?: Record<string, any>;
    timestamp: number;
}

const storage: Map<string, StoredFile> = new Map();

/**
 * Sets up storage mock
 * 
 * @example
 * ```typescript
 * import { setupStorageMock } from 'express-pack/testing';
 * 
 * beforeEach(() => {
 *   setupStorageMock();
 * });
 * ```
 * 
 * @category Testing
 */
export function setupStorageMock() {
    storage.clear();
}

/**
 * Uploads a file to mock storage
 * 
 * @param key - File key/path
 * @param content - File content
 * @param options - Upload options
 * 
 * @example
 * ```typescript
 * import { uploadFile } from 'express-pack/testing';
 * 
 * uploadFile('images/avatar.jpg', buffer, {
 *   contentType: 'image/jpeg',
 *   metadata: { userId: '123' }
 * });
 * ```
 * 
 * @category Testing
 */
export function uploadFile(
    key: string,
    content: Buffer | string,
    options: { contentType?: string; metadata?: Record<string, any> } = {}
) {
    storage.set(key, {
        key,
        content,
        contentType: options.contentType,
        metadata: options.metadata,
        timestamp: Date.now(),
    });
}

/**
 * Downloads a file from mock storage
 * 
 * @param key - File key/path
 * @returns File content or null
 * 
 * @category Testing
 */
export function downloadFile(key: string): Buffer | string | null {
    const file = storage.get(key);
    return file?.content || null;
}

/**
 * Gets file metadata
 * 
 * @param key - File key/path
 * @returns File metadata or null
 * 
 * @category Testing
 */
export function getFileMetadata(key: string): StoredFile | null {
    return storage.get(key) || null;
}

/**
 * Deletes a file from mock storage
 * 
 * @param key - File key/path
 * @returns True if deleted, false if not found
 * 
 * @category Testing
 */
export function deleteFile(key: string): boolean {
    return storage.delete(key);
}

/**
 * Lists all files in mock storage
 * 
 * @param prefix - Optional key prefix to filter
 * @returns Array of file keys
 * 
 * @category Testing
 */
export function listFiles(prefix?: string): string[] {
    const keys = Array.from(storage.keys());
    if (prefix) {
        return keys.filter(key => key.startsWith(prefix));
    }
    return keys;
}

/**
 * Checks if a file exists
 * 
 * @param key - File key/path
 * @returns True if exists
 * 
 * @category Testing
 */
export function fileExists(key: string): boolean {
    return storage.has(key);
}

/**
 * Clears all files from mock storage
 * 
 * @category Testing
 */
export function clearStorage() {
    storage.clear();
}

/**
 * Gets storage size (number of files)
 * 
 * @returns Number of stored files
 * 
 * @category Testing
 */
export function getStorageSize(): number {
    return storage.size;
}
