# 1️⃣ Используем официальный Node.js образ
FROM node:18-alpine

# 2️⃣ Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# 3️⃣ Копируем package.json и package-lock.json перед установкой зависимостей
COPY package*.json ./

# 4️⃣ Устанавливаем зависимости
RUN npm install

# 5️⃣ Копируем весь код проекта внутрь контейнера
COPY . .

# 6️⃣ Собираем TypeScript (если нужно)
RUN npm run build

# 7️⃣ Ждём, пока поднимется БД (опционально, если используешь PostgreSQL)
RUN apk add --no-cache wait4

# 8️⃣ Запускаем миграции и сидер (если используешь Prisma)
RUN npx prisma migrate deploy
RUN npx ts-node prisma/seed.ts

# 9️⃣ Открываем порт (если нужно)
EXPOSE 5000

# 🔟 Запускаем сервер
CMD ["npm", "run", "start"]
