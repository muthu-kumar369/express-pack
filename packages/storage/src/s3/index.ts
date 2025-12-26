import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommandOutput,
  DeleteObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Config,
  UploadFileParams,
  PresignedUrlParams,
  DeleteFileParams,
} from "../types/s3.types";

export class S3Service {
  private static s3: S3Client | null = null;

  static init(config: S3Config): void {
    if (!S3Service.s3) {
      S3Service.s3 = new S3Client({
        region: config.region || process?.env?.AWS_S3_REGION,
        credentials: {
          accessKeyId:
            config.accessKeyId || process?.env?.AWS_S3_ACCESS_KEY_ID!,
          secretAccessKey:
            config.secretAccessKey || process?.env?.AWS_S3_SECRET_ACCESS_KEY!,
        },
      });
    }
  }

  static async uploadFile(
    params: UploadFileParams
  ): Promise<PutObjectCommandOutput> {
    if (!S3Service.s3) {
      throw new Error("S3Service not initialized. Please initialize first.");
    }
    const command = new PutObjectCommand(params);
    try {
      const response = await S3Service.s3.send(command);
      return response;
    } catch (error: any) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  static async getPresignedUrl(params: PresignedUrlParams): Promise<string> {
    if (!S3Service.s3) {
      throw new Error("S3Service not initialized. Please initialize first.");
    }
    const { Bucket, Key, expiresIn = 3600 } = params;
    const command = new GetObjectCommand({ Bucket, Key });
    try {
      const url = await getSignedUrl(S3Service.s3, command, { expiresIn });
      return url;
    } catch (error: any) {
      throw new Error(`Error generating presigned URL: ${error.message}`);
    }
  }

  static async deleteFile(
    params: DeleteFileParams
  ): Promise<DeleteObjectCommandOutput> {
    if (!S3Service.s3) {
      throw new Error("S3Service not initialized. Please initialize first.");
    }
    const command = new DeleteObjectCommand(params);
    try {
      const response = await S3Service.s3.send(command);
      return response;
    } catch (error: any) {
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
