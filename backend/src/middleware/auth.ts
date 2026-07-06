import { Request, Response, NextFunction } from 'express';
import { db } from '../models/db';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'parent' | 'delegate' | 'co_signer' | 'sibling' | 'advisor';
    familyId: string;
  };
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token = '';

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query && req.query.authorization) {
    const qAuth = req.query.authorization as string;
    if (qAuth.startsWith('Bearer ')) {
      token = qAuth.split(' ')[1];
    } else {
      token = qAuth;
    }
  } else if (req.query && req.query.token) {
    token = req.query.token as string;
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const user = await db.users.findById(token);
    if (!user) {
      return res.status(403).json({ message: 'Invalid or expired authentication.' });
    }

    req.user = {
      id: token,
      email: user.email,
      role: user.role as any,
      familyId: user.familyId
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired authentication.' });
  }
}
