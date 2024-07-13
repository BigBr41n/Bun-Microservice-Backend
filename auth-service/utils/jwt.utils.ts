import jwt, { type VerifyErrors } from "jsonwebtoken";
import logger from "./logger";
import fs from "fs";
import path from "path";

interface ObjectToSign {
  id: string;
}

const privateKey = fs.readFileSync(
  path.join(__dirname, "..", "private.key"),
  "utf8"
);

const publicKey = fs.readFileSync(
  path.join(__dirname, "..", "public.key"),
  "utf8"
);

const refreshTokenPrivateKey = fs.readFileSync(
  path.join(__dirname, "..", "refTokenPrivate.key"),
  "utf-8"
);
const refreshTokenPublicKey = fs.readFileSync(
  path.join(__dirname, "..", "refTokenPublic.key"),
  "utf-8"
);

export function signJwt(object: ObjectToSign): string {
  const token = jwt.sign(object, privateKey, {
    algorithm: "RS256",
    expiresIn: "3h",
  });
  return token;
}


export function signRefreshToken(object: ObjectToSign): string {
  return jwt.sign(object, refreshTokenPrivateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
  });
}
