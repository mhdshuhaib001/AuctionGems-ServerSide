import { sign, verify, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { jwtDecode } from 'jwt-decode';

dotenv.config();

class JWT {
  private _secretKey: string | undefined;
  private _refreshSecretKey: string | undefined;

  constructor() {
    this._secretKey = process.env.JWT_KEY;
    this._refreshSecretKey = process.env.JWT_KEY; 

  }

  createAccessToken(email: string, role: 'user' | 'seller' | 'admin') {
    if (!this._secretKey) {
      throw new Error('Secret key is undefined');
    }
    const payload = { email, role };
    return sign(payload, this._secretKey, { expiresIn: '24h' });
  }

  createResetPasswordToken(email: string, role: 'user' | 'seller' | 'admin') {
    if (!this._secretKey) {
      throw new Error('Secret key is undefined');
    }
    const payload = { email, role };
    return sign(payload, this._secretKey, { expiresIn: '1h' });
  }


  createRefreshToken(email: string, role: 'user' | 'seller' | 'admin') {
    if (!this._refreshSecretKey) {
      throw new Error('Refresh secret key is undefined');
    }
    const payload = { email, role };
    return sign(payload, this._refreshSecretKey, { expiresIn: '7d' }); 
  }

  verifyToken(token: string, isRefreshToken = false): JwtPayload | string | null {
    try {
      const key = isRefreshToken ? this._refreshSecretKey : this._secretKey;
      if (!key) {
        throw new Error('Secret key is undefined');
      }
      return verify(token, key);
    } catch (error) {
      console.error('JWT Verification Error:', error);
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
