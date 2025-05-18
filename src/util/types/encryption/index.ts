export interface HashParams {
  password: string;
  saltRounds?: number;
}

export interface CompareParams {
  password: string;
  hashed: string;
}

export interface EncryptParams {
  text: string;
  key?: string;
}

export interface DecryptParams {
  encryptedText: string;
  key?: string;
}

export interface EncryptionUtilInterface {
  hash(params: HashParams): Promise<string>;
  compare(params: CompareParams): Promise<boolean>;
  encrypt(params: EncryptParams): string;
  decrypt(params: DecryptParams): string;
}
