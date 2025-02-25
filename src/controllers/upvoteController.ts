import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const upvotePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;  
    const postId = parseInt(req.params.postId);

    if (!userId) {
      res.status(400).json({ errors: ["Пользователь не авторизован."] });
      return; 
    }
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_postId: { userId, postId }
      }
    });

    if (existingUpvote) {
      res.status(400).json({ errors: ["Вы уже проголосовали за это предложение."] });
      return;
    }

    await prisma.upvote.create({
      data: {
        userId,
        postId
      }
    });

    res.status(200).json({ message: "Вы проголосовали за это предложение." });
  } catch (error) {
    res.status(500).json({ errors: ["Ошибка при голосовании. Пожалуйста, попробуйте позже."] });
  }
};

export const removeUpvote = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;  
    const postId = parseInt(req.params.postId);

    if (!userId) {
      res.status(400).json({ errors: ["Пользователь не авторизован."] });
      return;
    }

    const upvote = await prisma.upvote.findUnique({
      where: {
        userId_postId: { userId, postId }
      }
    });

    if (!upvote) {
      res.status(400).json({ errors: ["Вы не проголосовали за это предложение."] });
      return;
    }

    await prisma.upvote.delete({
      where: {
        userId_postId: { userId, postId }
      }
    });

    res.status(200).json({ message: "Вы отменили свой голос." });
  } catch (error) {
    res.status(500).json({ errors: ["Ошибка при удалении голоса. Пожалуйста, попробуйте позже."] });
  }
};
