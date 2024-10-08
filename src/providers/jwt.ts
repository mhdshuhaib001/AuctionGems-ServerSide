import { sign, verify, JwtPayload, decode } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

import dotenv from "dotenv";

dotenv.config();

class JWT {
  private _secretKey: string | undefined;

  constructor() {
    this._secretKey = process.env.JWT_KEY;
  }

  createAccessToken(email: string, role: "user" | "seller" | "admin" ) {
    try {
      console.log(email,role,'this is jwt controeller ')
      if (!this._secretKey) {
        throw new Error("Secret key is undefined");
      }
      const payload = { email, role };
      const token = sign(payload, this._secretKey, { expiresIn: "24h" });
      return token;
    } catch (error) {
      console.error("JWT Error", error);
    }
  }

  createRefreshToken(email: string, role: "user" | "seller" | "admin" ) {
    try {
      if (!this._secretKey) {
        throw new Error("Secret key is undefined");
      }
      const payload = { email, role };
      const token = sign(payload, this._secretKey, { expiresIn: "7d" });
      return token;
    } catch (error) {
      console.error("JWT Error", error);
    }
  }

  verifyToken(token: string): JwtPayload | string | null {
    try {
      if (!this._secretKey) {
        throw new Error("Secret key is undefined");
      }
      return verify(token, this._secretKey);
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return null;
    }
  }
  decode(token: string): any {
    try {
      const decode = jwtDecode(token);
      return decode;
    } catch (error) {
      console.error("JWT Decode Error:", error);
      return null;
    }
  }
}

export default JWT;
