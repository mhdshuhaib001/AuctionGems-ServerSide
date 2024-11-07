import { Request, Response, NextFunction } from 'express';
import JWT from '../providers/jwt';
import { JwtPayload } from 'jsonwebtoken';

export const userAuth = (roles: ('user' | 'seller' | 'admin')[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let authHeader: string | undefined;
      let token: string | undefined;

      if (roles.includes('seller') && req.headers['sellerauthorization']) {
        authHeader = req.headers['sellerauthorization'] as string;
      } else if (req.headers['userauthorization']) {
        authHeader = req.headers['userauthorization'] as string;
      }

      if (!authHeader) {
        return res.status(401).json({ message: 'Access denied: No token provided' });
      }
      token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Access denied: No token provided' });
      }

      const jwt = new JWT();
      let decoded = jwt.verifyToken(token) as JwtPayload;

      if (!decoded) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res.status(401).json({ message: 'Access denied: No valid token available' });
        }

        const refreshDecoded = jwt.verifyToken(refreshToken) as JwtPayload;
        if (!refreshDecoded) {
          return res.status(403).json({ message: 'Access denied: Invalid refresh token' });
        }

        const newAccessToken = jwt.createAccessToken(refreshDecoded.email, refreshDecoded.role as 'user' | 'seller' | 'admin');
        res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true });

        decoded = jwt.verifyToken(newAccessToken) as JwtPayload;
      }

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
