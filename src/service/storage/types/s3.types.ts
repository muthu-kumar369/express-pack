import { PutObjectCommandInput } from "@aws-sdk/client-s3";

export interface S3Config {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export interface UploadFileParams
  extends Pick<
    PutObjectCommandInput,
    "Bucket" | "Key" | "Body" | "ContentType"
  > {}

export interface PresignedUrlParams {
  Bucket: string;
  Key: string;
  expiresIn?: number;
}

export interface DeleteFileParams {
  Bucket: string;
  Key: string;
}
