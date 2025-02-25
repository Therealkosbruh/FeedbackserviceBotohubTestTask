# Используем Node.js с поддержкой Alpine для минимального размера образа
FROM node:18-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json, устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь проект
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Компилируем TypeScript (если используется)
RUN npm run build

# Указываем команду запуска
CMD ["npm", "run", "start"]
