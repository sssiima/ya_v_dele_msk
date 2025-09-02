// Константы приложения

export const APP_NAME = 'Я в деле МСК'
export const APP_VERSION = '1.0.0'

// API константы
export const API_ENDPOINTS = {
  EVENTS: '/events',
  USERS: '/users',
  AUTH: '/auth',
} as const

// Категории событий
export const EVENT_CATEGORIES = [
  { id: 'networking', name: 'Нетворкинг', color: 'bg-blue-500' },
  { id: 'sport', name: 'Спорт', color: 'bg-green-500' },
  { id: 'creative', name: 'Творчество', color: 'bg-purple-500' },
  { id: 'business', name: 'Бизнес', color: 'bg-orange-500' },
  { id: 'education', name: 'Образование', color: 'bg-indigo-500' },
  { id: 'entertainment', name: 'Развлечения', color: 'bg-pink-500' },
  { id: 'technology', name: 'Технологии', color: 'bg-gray-500' },
  { id: 'other', name: 'Другое', color: 'bg-yellow-500' },
] as const

// Статусы событий
export const EVENT_STATUSES = {
  UPCOMING: 'upcoming',
  PAST: 'past',
  ORGANIZED: 'organized',
} as const

// Лимиты
export const LIMITS = {
  MAX_PARTICIPANTS: 1000,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_FULL_DESCRIPTION_LENGTH: 2000,
  MAX_TAGS_COUNT: 10,
  MAX_TAG_LENGTH: 20,
} as const

// Пагинация
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const

// Кэширование
export const CACHE_TIMES = {
  EVENTS: 5 * 60 * 1000, // 5 минут
  USER_PROFILE: 10 * 60 * 1000, // 10 минут
  USER_EVENTS: 5 * 60 * 1000, // 5 минут
} as const

// Локальное хранилище
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  FAVORITES: 'favorites',
  JOINED_EVENTS: 'joined_events',
} as const

// Уведомления
export const NOTIFICATION_DURATION = 4000 // 4 секунды

// Цвета Telegram
export const TELEGRAM_COLORS = {
  PRIMARY: '#0088cc',
  SECONDARY: '#f0f8ff',
  SUCCESS: '#28a745',
  WARNING: '#ffc107',
  ERROR: '#dc3545',
} as const

// Размеры экранов
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE_DESKTOP: 1280,
} as const

// Анимации
export const ANIMATIONS = {
  FADE_IN: 'fadeIn 0.5s ease-in-out',
  SLIDE_UP: 'slideUp 0.3s ease-out',
  BOUNCE: 'bounce 0.6s ease-in-out',
} as const

// Ошибки
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  UNAUTHORIZED: 'Необходима авторизация.',
  FORBIDDEN: 'Доступ запрещен.',
  NOT_FOUND: 'Ресурс не найден.',
  SERVER_ERROR: 'Ошибка сервера. Попробуйте позже.',
  VALIDATION_ERROR: 'Ошибка валидации данных.',
  UNKNOWN_ERROR: 'Неизвестная ошибка.',
} as const

// Успешные сообщения
export const SUCCESS_MESSAGES = {
  EVENT_CREATED: 'Событие успешно создано!',
  EVENT_UPDATED: 'Событие успешно обновлено!',
  EVENT_DELETED: 'Событие успешно удалено!',
  EVENT_JOINED: 'Вы успешно присоединились к событию!',
  EVENT_LEFT: 'Вы покинули событие.',
  PROFILE_UPDATED: 'Профиль успешно обновлен!',
  LOGIN_SUCCESS: 'Успешная авторизация!',
  LOGOUT_SUCCESS: 'Вы вышли из аккаунта.',
} as const

// Валидация
export const VALIDATION_RULES = {
  TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },
  FULL_DESCRIPTION: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 2000,
  },
  LOCATION: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 200,
  },
  ADDRESS: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 300,
  },
  MAX_PARTICIPANTS: {
    MIN: 1,
    MAX: 1000,
  },
} as const

// Форматы дат
export const DATE_FORMATS = {
  DISPLAY: 'dd MMMM yyyy',
  TIME: 'HH:mm',
  DATETIME: 'dd MMMM yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
} as const

// Навигация
export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
  EVENT_DETAIL: '/events/:id',
  PROFILE: '/profile',
  MAP: '/map',
  SETTINGS: '/settings',
  NOT_FOUND: '*',
} as const
