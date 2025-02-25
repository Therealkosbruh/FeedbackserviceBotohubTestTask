import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from '@prisma/client';

export const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: User; 
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    res.status(401).json({ errors: ["Токен не найден."] });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({ errors: ["Пользователь не найден."] });
      return;
    }

    req.user = user; 
    next();
  } catch (error) {
    res.status(401).json({ errors: ["Неверный или просроченный токен."] });
  }
};
