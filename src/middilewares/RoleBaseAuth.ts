    import { Request, Response, NextFunction } from 'express';
    import JWT from '../providers/jwt'; 
    import { JwtPayload } from 'jsonwebtoken';
    export const userAuth = (roles: ('user' | 'seller' | 'admin')[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
          try {
            // Log the incoming headers for debugging
            // console.log('Request Headers:', req.headers);
      
            let authHeader: string | undefined;
            let token: string | undefined;
      
            // Check if the requested roles include 'seller', prioritize sellerauthorization header
            if (roles.includes('seller') && req.headers['sellerauthorization']) {
              authHeader = req.headers['sellerauthorization'] as string;
              console.log('Using sellerauthorization header');
            } else if (req.headers['userauthorization']) {
              authHeader = req.headers['userauthorization'] as string;
              console.log('Using userauthorization header');
            }
      
            // If no authorization header is found, respond with an error
            if (!authHeader) {
              console.log('No authorization header found');
              return res.status(401).json({ message: 'Access denied: No token provided' });
            }
      
            // Extract the token from the header (expected format: "Bearer <token>")
            token = authHeader.split(' ')[1];
      
            // Log the extracted token
            // console.log('Extracted Token:', token);
      
            if (!token) {
              console.log('No token found after splitting the authorization header');
              return res.status(401).json({ message: 'Access denied: No token provided' });
            }
      
            // Initialize JWT provider and verify the token
            const jwt = new JWT();
            const decoded = jwt.verifyToken(token) as JwtPayload;
      
            // Log the decoded token information
            // console.log('Decoded Token Payload:', decoded);
      
            if (!decoded || typeof decoded !== 'object' || !decoded.role) {
              console.log('Invalid token or role information missing');
              return res.status(403).json({ message: 'Invalid token: Role information is missing' });
            }
      
            // Check if the user's role is allowed
            if (!roles.includes(decoded.role)) {
              console.log(`Access denied for role: ${decoded.role}`);
              return res.status(403).json({ message: 'Access denied: You do not have permission to perform this action' });
            }
      
            // Attach user information to the request object
            (req as any).user = decoded;
      
            // Log success and proceed to the next middleware/handler
            console.log('User authenticated successfully with role:', decoded.role);
            next();
          } catch (error) {
            // Log the error
            console.error('Error in user authentication middleware:', error);
            return res.status(500).json({ message: 'An error occurred while authenticating' });
          }
        };
      };
      