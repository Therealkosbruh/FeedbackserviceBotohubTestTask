import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const createFeedbackPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, categoryId, statusId, authorId } = req.body;
    if (!title || !description || !categoryId || !statusId || !authorId) {
      res.status(400).json({ errors: ["Все поля обязательны."] });
      return;
    }
    const newPost = await prisma.feedbackPost.create({
      data: {
        title,
        description,
        categoryId,
        statusId,
        authorId,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ errors: ["Ошибка создания предложения."] });
  }
};

 export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await prisma.category.findMany();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ errors: ["Ошибка получения категорий."] });
    }
  };
  
  export const getStatuses = async (req: Request, res: Response): Promise<void> => {
    try {
      const statuses = await prisma.status.findMany();
      res.json(statuses);
    } catch (error) {
      res.status(500).json({ errors: ["Ошибка получения статусов."] });
    }
  };
  
  export const getAllFeedbackPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category, status, sortBy = "createdAt", order = "desc", page = "1" } = req.query;
      const pageSize = 5;
      const pageNumber = Number(page) || 1;
  
      const filters: any = {};
      if (category) filters.category = { name: category as string };
      if (status) filters.status = { name: status as string };
  
      let sortOptions: any = {};
      if (sortBy === "upvotes") {
        sortOptions = { upvotes: { _count: order === "asc" ? "asc" : "desc" } };
      } else if (["createdAt", "updatedAt", "title", "description"].includes(sortBy as string)) {
        sortOptions = { [sortBy as string]: order === "asc" ? "asc" : "desc" };
      } else {
        sortOptions = { createdAt: "desc" }; 
      }
  
      const feedbackPosts = await prisma.feedbackPost.findMany({
        where: filters,
        orderBy: sortOptions,
        include: {
          category: true,
          status: true,
          author: {
            select: { id: true, email: true, avatar: true, createdAt: true }, 
          },
          _count: { select: { upvotes: true } },
        },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      });
  
      const totalPosts = await prisma.feedbackPost.count({ where: filters });
      const totalPages = Math.ceil(totalPosts / pageSize);
  
      res.json({
        totalPages,
        currentPage: pageNumber,
        feedbackPosts,
      });
    } catch (error) {
      console.error("Ошибка получения предложений:", error);
      res.status(500).json({ errors: ["Ошибка получения предложений."] });
    }
  };
  

export const getFeedbackPostById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const feedbackPost = await prisma.feedbackPost.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        status: true,
        author: true,
      },
    });

    if (!feedbackPost) {
      res.status(404).json({ errors: ["Предложение не найдено."] });
      return;
    }

    res.json(feedbackPost);
  } catch (error) {
    res.status(500).json({ errors: ["Ошибка получения предложения."] });
  }
};

 export const updateFeedbackPost = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, description, categoryId, statusId } = req.body;

    try {
        const feedbackPost = await prisma.feedbackPost.update({
        where: { id: parseInt(id) },
        data: {
            title,
            description,
            categoryId,
            statusId,
        },
        });

        res.json(feedbackPost);
    } catch (error) {
        res.status(500).json({ errors: ["Ошибка обновления предложения."] });
    }
};

 export const deleteFeedbackPost = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        await prisma.feedbackPost.delete({
        where: { id: parseInt(id) },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ errors: ["Ошибка удаления предложения."] });
    }
};
