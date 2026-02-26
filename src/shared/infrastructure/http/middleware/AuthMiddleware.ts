import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../../../config';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 1. Bypass for Testing Environment
  if (process.env.NODE_ENV === 'test') {
    (req as any).user = { userId: 'test-user-123', email: 'test@thinktrack.com' };
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatted' });
  }

  jwt.verify(token, config.api.secret, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Token invalid' });
    }

    (req as any).user = decoded;
    return next();
  });
};