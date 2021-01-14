import { randomBytes, createCipheriv, createDecipheriv } from "crypto";
import { sign, verify } from "jsonwebtoken";
import { generateCustomError, level } from "../config/error";
import { logger } from "../config/logger";

export function encryptToken(object: any) {
  if (!process.env.JWP_APP_KEY || !process.env.JWT_CIPHER_KEY) {
    throw generateCustomError(level.ERROR, new Error("BAD_JWT_KEY"), 404, {});
  }

  const key: string = process.env.JWT_CIPHER_KEY || "";
  const iv: Buffer = randomBytes(16);

  const content = sign(object, process.env.JWP_APP_KEY || "");
  const cipher = createCipheriv("aes-128-cbc", Buffer.from(key), iv);
  const crypted = cipher.update(content);
  const finalBuffer = Buffer.concat([crypted, cipher.final()]);
  const encryptedHex = `${iv.toString("hex")}:${finalBuffer.toString("hex")}`;

  return encryptedHex;
}
export function verifyToken(token: string) {
  if (!process.env.JWP_APP_KEY) {
    throw generateCustomError(level.ERROR, new Error("BAD_JWT_KEY"), 404, {});
  }
  const key = process.env.JWT_CIPHER_KEY || "";
  try {
    const encryptedArray = token.split(":");
    const iv = Buffer.from(encryptedArray[0], "hex");
    const encrypted = Buffer.from(encryptedArray[1], "hex");
    const decipher = createDecipheriv("aes-128-cbc", Buffer.from(key), iv);
    const decrypted = decipher.update(encrypted);
    const clearText = Buffer.concat([decrypted, decipher.final()]).toString();
    const decoded = verify(clearText, process.env.JWP_APP_KEY);
    logger().log("debug", {
      function: "verifyToken",
      decoded,
    });
    return decoded;
  } catch (exc) {
    throw new Error(exc);
  }
}
