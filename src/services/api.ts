import axios from 'axios'

// Базовый URL для API
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'https://api-production-2fd7.up.railway.app/api')

// Временная принудительная установка для продакшена
const FORCE_API_URL = 'https://yavdelemsk-production.up.railway.app/api'
const FINAL_API_URL = window.location.hostname === 'localhost' ? API_BASE_URL : FORCE_API_URL

console.log('API Base URL:', API_BASE_URL)
console.log('Final API URL:', FINAL_API_URL)
console.log('Environment check:', {
  VITE_API_URL: (import.meta as any).env?.VITE_API_URL,
  hostname: window.location.hostname,
  isLocalhost: window.location.hostname === 'localhost'
})

// Создание экземпляра axios с базовой конфигурацией
const api = axios.create({
  baseURL: FINAL_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Интерцептор для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Обработка неавторизованного доступа
      localStorage.removeItem('auth_token')
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

// Типы для API
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface Event {
  id: string
  title: string
  description: string
  fullDescription: string
  date: string
  time: string
  location: string
  address: string
  participants: number
  maxParticipants: number
  image?: string
  category: string
  organizer: {
    id: string
    name: string
    avatar?: string
  }
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  email?: string
  phone?: string
  bio?: string
  createdAt: string
  updatedAt: string
}

// Типы для фильтров событий
export interface EventFilters {
  page?: number
  limit?: number
  category?: string
  search?: string
  date?: string
}

// API методы для событий
export const eventsApi = {
  // Получить все события
  getAll: async (params?: EventFilters): Promise<ApiResponse<{ events: Event[]; total: number }>> => {
    const response = await api.get('/events', { params })
    return response.data
  },

  // Получить событие по ID
  getById: async (id: string): Promise<ApiResponse<Event>> => {
    const response = await api.get(`/events/${id}`)
    return response.data
  },

  // Создать новое событие
  create: async (eventData: Partial<Event>): Promise<ApiResponse<Event>> => {
    const response = await api.post('/events', eventData)
    return response.data
  },

  // Обновить событие
  update: async (id: string, eventData: Partial<Event>): Promise<ApiResponse<Event>> => {
    const response = await api.put(`/events/${id}`, eventData)
    return response.data
  },

  // Удалить событие
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/events/${id}`)
    return response.data
  },

  // Присоединиться к событию
  join: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/events/${id}/join`)
    return response.data
  },

  // Покинуть событие
  leave: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/events/${id}/leave`)
    return response.data
  },
}

// API методы для пользователей
export const usersApi = {
  // Получить профиль пользователя
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/users/profile')
    return response.data
  },

  // Обновить профиль пользователя
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/users/profile', userData)
    return response.data
  },

  // Получить события пользователя
  getEvents: async (): Promise<ApiResponse<Event[]>> => {
    const response = await api.get('/users/events')
    return response.data
  },

  // Получить избранные события
  getFavorites: async (): Promise<ApiResponse<Event[]>> => {
    const response = await api.get('/users/favorites')
    return response.data
  },
}

// API методы для аутентификации
export const authApi = {
  // Войти через Telegram
  telegramAuth: async (initData: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await api.post('/auth/telegram', { initData })
    return response.data
  },

  // Обновить токен
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    const response = await api.post('/auth/refresh')
    return response.data
  },

  // Выйти
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await api.post('/auth/logout')
    return response.data
  },
}

export default api

// API для регистрации структуры
export interface StructurePayload {
  last_name: string
  first_name: string
  patronymic?: string
  birth_date: string
  gender: string
  vk_link: string
  phone: string
  grade: string
  education: string
  photo_url?: string
  pos: string
  username: string
  password: string
  high_mentor?: string
  coord?: string
  ro?: string
  privacy_policy: boolean
}

export const structureApi = {
  create: async (payload: StructurePayload): Promise<ApiResponse<{ id: number }>> => {
    try {
      const response = await api.post('/structure', payload)
      return response.data
    } catch (error: any) {
      // Fallback to fetch if axios fails
      console.log('Axios failed, trying fetch...')
      const response = await fetch(`${FINAL_API_URL}/structure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    }
  },
}
