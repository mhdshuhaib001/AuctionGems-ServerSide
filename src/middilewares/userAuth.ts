import { Request, Response, NextFunction } from 'express';
import JWT from '../providers/jwt';
import { JwtPayload } from 'jsonwebtoken';

export const userAuth = (roles: ('user' | 'seller' | 'admin')[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')[1]; 
            if (!token) {
                return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
            }

            const jwt = new JWT();
            const decoded = jwt.verifyToken(token) as JwtPayload;

            if (!decoded || typeof decoded === 'string') {
                return res.status(403).json({ message: 'Invalid token' });
            }

            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
            }

            (req as any).user = decoded;
            next();
        } catch (error) {
            res.status(500).json({ message: 'Failed to authenticate user', error });
        }
    };
};
