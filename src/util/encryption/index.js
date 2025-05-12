import bcrypt from "bcrypt";
import crypto from "crypto";

const DEFAULT_SALT_ROUNDS = 10;
const DEFAULT_ENCRYPTION_KEY =
  process?.env?.ENCRYPTION_KEY || "12345678901234567890123456789012"; // 32-byte
const IV_LENGTH = 16;

export class EncryptionUtil {
  /**
   * Hash a password with optional salt rounds
   * @param {string} password
   * @param {number} saltRounds
   */
  static async hash({ password, saltRounds = DEFAULT_SALT_ROUNDS }) {
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare a plain password with a hashed password
   * @param {string} password
   * @param {string} hashed
   */
  static async compare({ password, hashed }) {
    return await bcrypt.compare(password, hashed);
  }

  /**
   * Encrypt text with AES-256-CBC using optional encryption key
   * @param {string} text
   * @param {string} key - 32-byte encryption key (optional)
   */
  static encrypt({ text, key = DEFAULT_ENCRYPTION_KEY }) {
    if (!text) throw new Error("Text need to encrypt");

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  }

  /**
   * Decrypt text with AES-256-CBC using optional encryption key
   * @param {string} encryptedText
   * @param {string} key - 32-byte encryption key (optional)
   */
  static decrypt({ encryptedText, key = DEFAULT_ENCRYPTION_KEY }) {
    if (!encryptedText) throw new Error("Encrypted text need to decrypt");

    const [ivHex, encrypted] = encryptedText?.split(":");
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
