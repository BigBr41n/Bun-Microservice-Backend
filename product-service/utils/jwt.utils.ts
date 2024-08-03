import jwt from "jsonwebtoken";
import logger from "./logger";
import fs from "fs";
import path from "path";

const publicKey = fs.readFileSync(
  path.join(__dirname, "..", "public.key"),
  "utf8"
);



export function verifyJwt(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      publicKey,
      { algorithms: ["RS256"] },
      (error, decoded) => {
        if (error) {
          logger.error(error);
          resolve({ valid: false, expired: true });
        } else {
          resolve({ valid: true, expired: false, decoded });
        }
      }
    );
  });
}