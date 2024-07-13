import jwt, { type VerifyErrors } from "jsonwebtoken";
import logger from "./logger";
import fs from "fs";
import path from "path";

interface ObjectToSign {
  id: string;
}


const publicKey = fs.readFileSync(
  path.join(__dirname, "..", "public.key"),
  "utf8"
);


export function verifyJwt(token: string): any {
  jwt.verify(
    token,
    publicKey,
    { algorithms: ["RS256"] },
    (error: VerifyErrors | null, decoded: any | undefined) => {
      if (error) {
        logger.error(error);
        return { valid: false, expired: true };
      } else {
        return { valid: true, expired: false, decoded };
      }
    }
  );
}