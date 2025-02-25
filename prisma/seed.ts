import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("Очистка базы данных...");
    await prisma.upvote.deleteMany({});
    await prisma.feedbackPost.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.status.deleteMany({});
    await prisma.user.deleteMany({});

    const user1 = await prisma.user.create({
      data: { email: "user1@example.com", password: "hashedpassword1", avatar: "avatar1.png" },
    });
    const user2 = await prisma.user.create({
      data: { email: "user2@example.com", password: "hashedpassword2", avatar: "avatar2.png" },
    });

    const category1 = await prisma.category.create({ data: { name: "UI" } });
    const category2 = await prisma.category.create({ data: { name: "UX" } });
    const category3 = await prisma.category.create({ data: { name: "Performance" } });

    const status1 = await prisma.status.create({ data: { name: "Planned" } });
    const status2 = await prisma.status.create({ data: { name: "In Progress" } });
    const status3 = await prisma.status.create({ data: { name: "Completed" } });

    const feedbackPosts = await prisma.feedbackPost.createMany({
      data: [
        {
          title: "Добавить темную тему",
          description: "Пользователи хотят темный режим.",
          categoryId: category1.id,
          statusId: status1.id,
          authorId: user1.id,
        },
        {
          title: "Новый дизайн кнопок",
          description: "Обновить стиль UI-кнопок.",
          categoryId: category1.id,
          statusId: status2.id,
          authorId: user2.id,
        },
        {
          title: "Оптимизировать загрузку страницы",
          description: "Сделать загрузку сайта быстрее.",
          categoryId: category3.id,
          statusId: status3.id,
          authorId: user1.id,
        },
        {
          title: "Добавить анимацию при клике",
          description: "Улучшить пользовательский опыт.",
          categoryId: category2.id,
          statusId: status1.id,
          authorId: user2.id,
        },
        {
          title: "Сделать поддержку RTL",
          description: "Добавить поддержку для арабского языка.",
          categoryId: category2.id,
          statusId: status3.id,
          authorId: user1.id,
        },
      ],
    });
    
    await prisma.upvote.createMany({
      data: [
        { userId: user1.id, postId: 1 },
        { userId: user2.id, postId: 1 },
        { userId: user1.id, postId: 2 },
        { userId: user2.id, postId: 3 },
        { userId: user1.id, postId: 4 },
        { userId: user2.id, postId: 5 },
      ],
    });

    console.log("База данных успешно заполнена тестовыми данными!");
  } catch (error) {
    console.error("Ошибка при заполнении базы данных:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
