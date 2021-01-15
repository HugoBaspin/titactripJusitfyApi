import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  Cipher,
  Decipher,
} from "crypto";
import { sign, verify } from "jsonwebtoken";
import { generateCustomError, level } from "../config/error";
import { logger } from "../config/logger";

export function encryptToken(object: any) {
  if (!process.env.JWP_APP_KEY || !process.env.JWT_CIPHER_KEY) {
    throw generateCustomError(level.ERROR, new Error("BAD_JWT_KEY"), 404, {});
  }

  const key: string = process.env.JWT_CIPHER_KEY || "";
  const iv: Buffer = randomBytes(16);

  const content: string = sign(object, process.env.JWP_APP_KEY || "");
  const cipher: Cipher = createCipheriv("aes-128-cbc", Buffer.from(key), iv);
  const crypted: Buffer = cipher.update(content);
  const finalBuffer: Buffer = Buffer.concat([crypted, cipher.final()]);
  const encryptedHex: string = `${iv.toString("hex")}:${finalBuffer.toString(
    "hex"
  )}`;

  return encryptedHex;
}
export function verifyToken(token: string) {
  if (!process.env.JWP_APP_KEY) {
    throw generateCustomError(level.ERROR, new Error("BAD_JWT_KEY"), 404, {});
  }
  const key: string = process.env.JWT_CIPHER_KEY || "";
  try {
    const encryptedArray: string[] = token.split(":");
    const iv: Buffer = Buffer.from(encryptedArray[0], "hex");
    const encrypted: Buffer = Buffer.from(encryptedArray[1], "hex");
    const decipher: Decipher = createDecipheriv(
      "aes-128-cbc",
      Buffer.from(key),
      iv
    );
    const decrypted: Buffer = decipher.update(encrypted);
    const clearText: string = Buffer.concat([
      decrypted,
      decipher.final(),
    ]).toString();

    const decoded: string | object = verify(clearText, process.env.JWP_APP_KEY);
    logger().log("debug", {
      function: "verifyToken",
      decoded,
    });
    return decoded;
  } catch (exc) {
    throw new Error(exc);
  }
}
