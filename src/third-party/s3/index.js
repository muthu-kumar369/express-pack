import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3Service {
  static s3 = null;

  // Singleton Pattern: Initialize only once
  static init(config) {
    if (!S3Service.s3) {
      S3Service.s3 = new S3Client({
        region: config.region || process?.env?.AWS_S3_REGION,
        credentials: {
          accessKeyId: config.accessKeyId || process?.env?.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey:
            config.secretAccessKey || process?.env?.AWS_S3_SECRET_ACCESS_KEY,
        },
      });
    }
  }

  /**
   * Upload file to S3
   * @param {Object} params
   * @param {string} params.Bucket - The name of the S3 bucket (e.g., 'my-bucket')
   * @param {string} params.Key - The key (path) where the file will be stored (e.g., 'uploads/myFile.txt')
   * @param {Buffer | ReadableStream | string} params.Body - The content of the file (can be a buffer, stream, or string)
   * @param {string} params.ContentType - The MIME type of the file (e.g., 'application/pdf', 'image/jpeg')
   * @returns {Object} Response metadata from AWS S3
   */
  static async uploadFile({ Bucket, Key, Body, ContentType }) {
    if (!S3Service.s3) {
      throw new Error("S3Service not initialized. Please initialize first.");
    }
    const command = new PutObjectCommand({ Bucket, Key, Body, ContentType });
    try {
      const response = await S3Service.s3.send(command);
      return response;
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  /**
   * Get a presigned URL for downloading a file
   * @param {Object} params
   * @param {string} params.Bucket - The name of the S3 bucket (e.g., 'my-bucket')
   * @param {string} params.Key - The key (path) to the file (e.g., 'uploads/myFile.txt')
   * @param {number} [params.expiresIn=3600] - The expiry time for the presigned URL in seconds (default: 3600 seconds, i.e., 1 hour)
   * @returns {string} The presigned URL that can be used to download the file
   */
  static async getPresignedUrl({ Bucket, Key, expiresIn = 3600 }) {
    if (!S3Service.s3) {
      throw new Error("S3Service not initialized. Please initialize first.");
    }
    const command = new GetObjectCommand({ Bucket, Key });
    try {
      // Generate signed URL
      const url = await getSignedUrl(S3Service.s3, command, { expiresIn });
      return url;
    } catch (error) {
      throw new Error(`Error generating presigned URL: ${error.message}`);
    }
  }

  /**
   * Delete a file from S3
   * @param {Object} params
   * @param {string} params.Bucket - The name of the S3 bucket (e.g., 'my-bucket')
   * @param {string} params.Key - The key (path) to the file to be deleted (e.g., 'uploads/myFile.txt')
   * @returns {Object} Response metadata from AWS S3
   */
  static async deleteFile({ Bucket, Key }) {
    if (!S3Service.s3) {
      throw new Error("S3Service not initialized. Please initialize first.");
    }
    const command = new DeleteObjectCommand({ Bucket, Key });
    try {
      const response = await S3Service.s3.send(command);
      return response;
    } catch (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }
}

/**
 * Initialize the S3Service (once in the application setup, such as app.js or server.js)
 * Example:
 * S3Service.initialize({
 *   region: 'us-east-1',   // Your AWS S3 region
 *   accessKeyId: 'your-access-key',  // Your AWS access key
 *   secretAccessKey: 'your-secret-key'  // Your AWS secret key
 * });
 */

/**
 * Now you can directly use the methods like this throughout your application:
 *
 * Example 1: Upload a File:
 * ```js
 * const response = await S3Service.uploadFile({
 *   Bucket: 'my-bucket',  // Your S3 bucket name
 *   Key: 'uploads/myFile.txt',  // Path in the bucket
 *   Body: file.data,  // File content (Buffer, ReadableStream, or string)
 *   ContentType: 'application/pdf',  // MIME type
 * });
 * console.log('Upload response:', response);
 * ```
 *
 * Example 2: Generate a Presigned URL:
 * ```js
 * const url = await S3Service.getPresignedUrl({
 *   Bucket: 'my-bucket',  // Your S3 bucket name
 *   Key: 'uploads/myFile.txt',  // Path to the file in the bucket
 *   expiresIn: 3600,  // Expiry time in seconds (1 hour)
 * });
 * console.log('Presigned URL:', url);
 * ```
 *
 * Example 3: Delete a File:
 * ```js
 * const response = await S3Service.deleteFile({
 *   Bucket: 'my-bucket',  // Your S3 bucket name
 *   Key: 'uploads/myFile.txt',  // Path to the file to delete
 * });
 * console.log('Delete response:', response);
 * ```
 */
