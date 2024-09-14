import { sign, verify, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class JWT {
    private _secretKey: string | undefined;

    constructor() {
        this._secretKey = process.env.JWT_KEY;
    }

    createAccessToken(id: string, role: 'user' | 'seller' | 'admin'): string | undefined {
        try {
            if (!this._secretKey) {
                throw new Error('Secret key is undefined');
            }
            const payload = { id, role }; 
            const token = sign(payload, this._secretKey, { expiresIn: '24h' });
            return token;
        } catch (error) {
            console.error('JWT Error', error);
        }
    }

    verifyToken(token: string): JwtPayload | string | null {
        try {
            if (!this._secretKey) {
                throw new Error('Secret key is undefined');
            }
            return verify(token, this._secretKey);
        } catch (error) {
            console.error('JWT Verification Error:', error);
            return null;
        }
    }
}

export default JWT;
