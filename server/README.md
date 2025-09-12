# API Server for Ya v dele MSK

## Деплой на Railway

1. Создайте новый сервис в Railway
2. Подключите папку `server/` как корень проекта
3. Установите переменные окружения:
   - `DATABASE_URL` - строка подключения к PostgreSQL
   - `PORT` - порт (Railway установит автоматически)

## Локальный запуск

```bash
cd server
npm install
npm start
```

## API Endpoints

- `GET /api/health` - проверка здоровья сервера
- `GET /api/test` - тестовый эндпоинт
- `POST /api/structure` - регистрация структуры

## CORS

API настроен для работы с фронтендом на `yavdelemsk-production.up.railway.app`
