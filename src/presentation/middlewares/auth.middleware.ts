import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../config';
import { prisma } from '../../data/prisma/prisma-db';
import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export class AuthMiddleware {
  static async validateJWT(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void > {
    const authorization = req.header('Authorization');
    if (!authorization) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    if (!authorization?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Invalid Bearer token' });
      return;
    }

    const token = authorization!.split(' ')[1] || '';

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) {
        res.status(401).json({ error: 'Invalid token - user' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: payload!.id },
        include: { Links: true },
      });
      if (!user) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      //todo: validar si el usuario esta activo
      if (!user?.isActive) {
        res.status(401).json({ error: 'User is not active' });
        return;
      }

      req.user = user!;
      next();
    } catch (error) {
      console.log(error);
      res.status(200).json({ error: 'Internal server error' });
      return;
    }
  }
}
