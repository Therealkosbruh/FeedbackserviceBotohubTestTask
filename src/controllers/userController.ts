import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { validateRegisterData } from "../services/userValidationService";

const prisma = new PrismaClient();

const generateToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, avatar } = req.body;

    const errors = validateRegisterData(email, password, avatar);
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ errors: ["Email уже используется."] });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, avatar },
    });

    const token = generateToken(newUser.id);
    res.json({
      token,
      user: { id: newUser.id, email: newUser.email, avatar: newUser.avatar },
    });
  } catch (error) {
    res.status(500).json({ errors: ["Ошибка регистрации. Пожалуйста, попробуйте позже."] });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ errors: ["Неверный email или пароль."] });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ errors: ["Неверный email или пароль."] });
      return;
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    res.status(500).json({ errors: ["Ошибка авторизации. Пожалуйста, попробуйте позже."] });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(400).json({ errors: ["Пользователь не авторизован."] });
      return;
    }

    res.json({ id: req.user.id, email: req.user.email, avatar: req.user.avatar });
  } catch (error) {
    res.status(500).json({ errors: ["Ошибка получения данных. Пожалуйста, попробуйте позже."] });
  }
};
