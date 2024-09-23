import { Request, Response, NextFunction } from 'express';
import JWT from '../providers/jwt'; 
import { JwtPayload } from 'jsonwebtoken';

export const userAuth = (roles: ('user' | 'seller' | 'admin')[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('Headers:', req.headers);

            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1]; 
            if (!token) {
                return res.status(401).json({ message: 'Access denied: No token provided' });
            }

            const jwt = new JWT(); 
            const decoded = jwt.verifyToken(token) as JwtPayload; 

            if (!decoded || typeof decoded !== 'object' || !decoded.role) {
                return res.status(403).json({ message: 'Invalid token: Role information is missing' });
            }

            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied: You do not have permission to perform this action' });
            }

            (req as any).user = decoded;
            next(); 
        } catch (error) {
            console.error('Error in user authentication middleware:', error);
            return res.status(500).json({ message: 'An error occurred while authenticating' });
        }
    };
};
