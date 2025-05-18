import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  HashParams,
  CompareParams,
  EncryptParams,
  DecryptParams,
} from "../types";

const DEFAULT_SALT_ROUNDS = 10;
const DEFAULT_ENCRYPTION_KEY =
  process?.env?.ENCRYPTION_KEY || "12345678901234567890123456789012"; // 32-byte
const IV_LENGTH = 16;

export class EncryptionUtil {
  static async hash({
    password,
    saltRounds = DEFAULT_SALT_ROUNDS,
  }: HashParams): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
  }

  static async compare({ password, hashed }: CompareParams): Promise<boolean> {
    return await bcrypt.compare(password, hashed);
  }

  static encrypt({
    text,
    key = DEFAULT_ENCRYPTION_KEY,
  }: EncryptParams): string {
    if (!text) throw new Error("Text need to encrypt");

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  }

  static decrypt({
    encryptedText,
    key = DEFAULT_ENCRYPTION_KEY,
  }: DecryptParams): string {
    if (!encryptedText) throw new Error("Encrypted text need to decrypt");

    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key),
      iv
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
