# Инструкции по развертыванию

## 🚀 Быстрое развертывание

### 1. Подготовка к продакшену

```bash
# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Проверка сборки
npm run preview
```

### 2. Развертывание на Vercel (Рекомендуется)

1. Создайте аккаунт на [Vercel](https://vercel.com)
2. Подключите ваш GitHub репозиторий
3. Настройте переменные окружения в Vercel Dashboard
4. Деплой произойдет автоматически

**Переменные окружения для Vercel:**
```
VITE_API_URL=https://your-api-domain.com/api
VITE_TELEGRAM_BOT_TOKEN=your_bot_token
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
```

### 3. Развертывание на Netlify

1. Создайте аккаунт на [Netlify](https://netlify.com)
2. Загрузите папку `dist` или подключите GitHub
3. Настройте переменные окружения

### 4. Развертывание на GitHub Pages

```bash
# Добавьте в package.json
"homepage": "https://yourusername.github.io/your-repo-name"

# Установите gh-pages
npm install --save-dev gh-pages

# Добавьте скрипты
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Деплой
npm run deploy
```

## 🔧 Настройка Telegram Bot

### 1. Создание бота

1. Найдите @BotFather в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Сохраните токен бота

### 2. Настройка Web App

1. Отправьте @BotFather команду `/mybots`
2. Выберите ваш бота
3. Перейдите в "Bot Settings" → "Menu Button"
4. Установите URL вашего приложения

### 3. Настройка команд

Отправьте @BotFather:

```
/setcommands
start - Запустить приложение
help - Помощь
events - События
profile - Профиль
```

## 📱 Тестирование

### 1. Локальное тестирование

```bash
# Запуск в режиме разработки
npm run dev

# Откройте http://localhost:3000
```

### 2. Тестирование в Telegram

1. Найдите ваш бота в Telegram
2. Нажмите кнопку "Start"
3. Проверьте работу всех функций

### 3. Тестирование на мобильных устройствах

1. Откройте приложение в Telegram на телефоне
2. Проверьте адаптивность
3. Протестируйте все интерактивные элементы

## 🔒 Безопасность

### 1. HTTPS

**Обязательно** для Telegram Mini App:
- Настройте SSL сертификат
- Используйте только HTTPS URL

### 2. Переменные окружения

- Никогда не коммитьте `.env` файлы
- Используйте секреты в CI/CD
- Ротация токенов

### 3. Валидация данных

- Всегда валидируйте входные данные
- Используйте TypeScript для типизации
- Проверяйте права доступа

## 📊 Мониторинг

### 1. Аналитика

```javascript
// Добавьте в main.tsx
if (import.meta.env.VITE_ENABLE_ANALYTICS) {
  // Google Analytics или другая аналитика
}
```

### 2. Логирование

```javascript
// Добавьте в api.ts
if (import.meta.env.VITE_ENABLE_LOGS) {
  console.log('API Request:', config)
}
```

### 3. Обработка ошибок

```javascript
// Добавьте Sentry или другой сервис
if (import.meta.env.VITE_SENTRY_DSN) {
  // Инициализация Sentry
}
```

## 🚀 Оптимизация производительности

### 1. Кэширование

- Настройте CDN
- Используйте кэширование браузера
- Оптимизируйте изображения

### 2. Сжатие

```bash
# В nginx.conf
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 3. Минификация

Vite автоматически минифицирует код в продакшене.

## 🔄 CI/CD

### GitHub Actions

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 Масштабирование

### Для 10,000 запросов в день:

1. **CDN**: Cloudflare или AWS CloudFront
2. **Хостинг**: Vercel Pro или AWS
3. **База данных**: PostgreSQL с пулом соединений
4. **Кэширование**: Redis
5. **Мониторинг**: Sentry + Analytics

### Рекомендуемая архитектура:

```
CDN → Load Balancer → App Servers → Database
                    ↓
                Cache Layer
```

## 🆘 Поддержка

### Полезные ссылки:

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Web App](https://core.telegram.org/bots/webapps)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

### Контакты:

- Email: support@yavdelemsk.ru
- Telegram: @yavdelemsk_support
- GitHub Issues: [Создать issue](https://github.com/your-repo/issues)
