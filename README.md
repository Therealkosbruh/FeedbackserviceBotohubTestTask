### Установка проекта
## 1. С помощью Docker
+ Клонируйте репозиторий командой:
```
git clone https://github.com/Therealkosbruh/FeedbackserviceBotohubTestTask.git
```
+ В редакторе перейдите в директорию проекта командой:
```
cd FeedbackserviceBotohubTestTask
```
+ В `.env` файле вставте свои актуальные данные
+ Разверните докер контейнер командой:
```
docker-compose up --build
```
После этого создастся БД, применятся миграции, заполнится тестовыми данными. 
Документация будет доступна по ссылке `http://localhost:5000/api-docs/`
Сам сервер будет доступен по ссылке 
`http://localhost:5000`
