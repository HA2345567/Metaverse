import crypto from "crypto";

const SALT_LENGTH = 16;          // bytes
const ITERATIONS = 100_000;      // recommended minimum
const KEY_LENGTH = 64;           // length of derived key
const DIGEST = "sha512";         // secure hash function

// Function to hash the password with a new random salt
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return { salt, hash };
}

// Function to verify password using stored salt and hash
export function verifyPassword(password: string, salt: string, originalHash: string): boolean {
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return hash === originalHash;
}
