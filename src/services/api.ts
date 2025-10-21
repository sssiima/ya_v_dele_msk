import axios from 'axios'

// Базовый URL для API
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'https://api-production-2fd7.up.railway.app/api')

// Logging removed in production to avoid leaking environment details

// Создание экземпляра axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
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
  level?: string
  faculty?: string
  format?: string
  specialty?: string
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
      // Fallback to fetch if axios fails
      const response = await fetch(`${API_BASE_URL}/structure`, {
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
  getAll: async (search?: string): Promise<ApiResponse<StructurePayload[]>> => {
    const params = search ? { search } : {}
    const response = await api.get('/structure', { params })
    return response.data
  },
  getById: async (id: number): Promise<ApiResponse<StructurePayload>> => {
    const response = await api.get(`/structure/${id}`)
    return response.data
  },
  getByCtid: async (ctid: string): Promise<ApiResponse<StructurePayload>> => {
    const response = await api.get(`/structure/by-ctid/${ctid}`)
    return response.data
  },
  update: async (id: number, payload: Partial<StructurePayload>): Promise<ApiResponse<any>> => {
    const response = await api.put(`/structure/${id}`, payload)
    return response.data
  },
  updateByCtid: async (ctid: string, payload: Partial<StructurePayload>): Promise<ApiResponse<any>> => {
    const response = await api.put(`/structure/by-ctid/${ctid}`, payload)
    return response.data
  }
}
// Добавьте этот интерфейс после существующих интерфейсов
export interface Vus {
  id: number
  vus: string
}

// Добавьте этот API метод в конец файла, после structureApi
export const vusesApi = {
  // Получить все ВУЗы
  getAll: async (search?: string): Promise<ApiResponse<Vus[]>> => {
    const params = search ? { search } : {}
    const response = await api.get('/vuses', { params })
    return response.data
  },

  // Получить ВУЗ по ID
  getById: async (id: number): Promise<ApiResponse<Vus>> => {
    const response = await api.get(`/vuses/${id}`)
    return response.data
  },

  // Создать новый ВУЗ (если нужно)
  create: async (vusData: { vus: string }): Promise<ApiResponse<Vus>> => {
    const response = await api.post('/vuses', vusData)
    return response.data
  },
}

// Добавьте интерфейс для наставника
export interface Mentor {
  id: number
  full_name: string
  first_name: string
  last_name: string
  pos: string
}

// Добавьте API метод для наставников
export const mentorsApi = {
  // Получить всех наставников
  getAll: async (search?: string): Promise<ApiResponse<Mentor[]>> => {
    try {
      const params = search ? { search } : {}
      const response = await api.get('/mentors', { params })
      const raw: ApiResponse<Mentor[]> = response.data
      if (!raw?.success || !Array.isArray(raw.data)) return raw

      // Дедупликация по полю full_name на клиенте как дополнительная защита
      const seen = new Set<string>()
      const unique = raw.data.filter((m) => {
        const key = (m.full_name || `${m.first_name} ${m.last_name}`).trim().toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      return { success: true, data: unique }
    } catch (error) {
      console.warn('Mentors API failed, using fallback data:', error)
      // Заглушка будет добавлена позже
      return {
        success: true,
        data: []
      }
    }
  },
}

// src/services/membersApi.ts
export interface MemberData {
  last_name: string;
  first_name: string;
  patronymic: string;
  birth_date: string;
  gender: string;
  vk_link: string;
  phone: string;
  education: string;
  level?: string;
  grade?: string;
  format?: string;
  faculty?: string;
  specialty?: string;
  username: string;
  password: string;
  mentor: string;
  team_code: string;
  team_name?: string;
  role: 'member' | 'captain';
  privacy_policy: boolean;
}

export const membersApi = {
  async create(memberData: MemberData) {
    try {
      const response = await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating member:', error);
      throw error;
    }
  },

  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/members`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  }
  ,
  async getById(id: number) {
    const resp = await fetch(`${API_BASE_URL}/members/${id}`)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    return await resp.json()
  },
  async update(id: number, data: Partial<MemberData>) {
    const resp = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!resp.ok) {
      const details = await resp.json().catch(() => ({}))
      throw new Error(details.message || `HTTP ${resp.status}`)
    }
    return await resp.json()
  }
};

export const memberAuthApi = {
  async login(username: string, password: string) {
    const resp = await fetch(`${API_BASE_URL}/auth/member-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}))
      throw new Error(data.message || `HTTP ${resp.status}`)
    }
    return await resp.json()
  }
}

export const structureAuthApi = {
  async login(username: string, password: string) {
    const resp = await fetch(`${API_BASE_URL}/auth/structure-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}))
      throw new Error(data.message || `HTTP ${resp.status}`)
    }
    return await resp.json()
  }
}

export const authUtilsApi = {
  async checkUsername(username: string) {
    const resp = await fetch(`${API_BASE_URL}/auth/check-username`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    })
    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}))
      throw new Error(data.message || `HTTP ${resp.status}`)
    }
    return await resp.json()
  }
}

// API для работы с командами
export const teamsApi = {
  async getAll(): Promise<ApiResponse<any[]>> {
    const response = await api.get('/teams')
    return response.data
  },
  
  async getById(id: number): Promise<ApiResponse<any>> {
    const response = await api.get(`/teams/${id}`)
    return response.data
  },
  
  async getByMentor(mentorName: string): Promise<ApiResponse<any[]>> {
    const response = await api.get(`/teams/by-mentor/${encodeURIComponent(mentorName)}`)
    return response.data
  },
  async getByCode(code: string): Promise<ApiResponse<any>> {
    const response = await api.get(`/teams/by-code/${encodeURIComponent(code)}`)
    return response.data
  },
  async rename(code: string, newName: string): Promise<ApiResponse<void>> {
    const response = await api.put('/teams/rename', { code, newName })
    return response.data
  }
}

// API для получения участников команды
export const teamMembersApi = {
  async getByTeamCode(teamCode: string): Promise<ApiResponse<any[]>> {
    const response = await api.get(`/members/by-team-code/${encodeURIComponent(teamCode)}`)
    return response.data
  }
}