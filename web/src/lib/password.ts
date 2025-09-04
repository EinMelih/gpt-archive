import { Argon2id } from "oslo/password";

const argon = new Argon2id();

export async function hashPassword(password: string) {
  return argon.hash(password);
}

export async function verifyPassword(hash: string, password: string) {
  return argon.verify(hash, password);
}
