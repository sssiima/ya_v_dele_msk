// Основные типы приложения

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

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Типы для фильтров
export interface EventFilters {
  category?: string
  search?: string
  date?: string
  location?: string
  page?: number
  limit?: number
}

// Типы для форм
export interface CreateEventForm {
  title: string
  description: string
  fullDescription: string
  date: string
  time: string
  location: string
  address: string
  maxParticipants: number
  category: string
  tags: string[]
}

export interface UpdateProfileForm {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  bio?: string
}

// Типы для навигации
export interface NavigationItem {
  path: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

// Типы для уведомлений
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

// Типы для Telegram
export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  photo_url?: string
}

export interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  BackButton: {
    isVisible: boolean
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  initData: string
  initDataUnsafe: {
    query_id?: string
    user?: TelegramUser
    receiver?: TelegramUser
    chat?: any
    chat_type?: string
    chat_instance?: string
    start_param?: string
    can_send_after?: number
    auth_date?: number
    hash?: string
  }
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
    secondary_bg_color?: string
  }
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  isClosingConfirmationEnabled: boolean
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
  showPopup: (params: any, callback?: (buttonId: string) => void) => void
  showScanQrPopup: (params: any, callback?: (data: string) => void) => void
  closeScanQrPopup: () => void
  readTextFromClipboard: (callback?: (data: string) => void) => void
  requestWriteAccess: (callback?: (access: boolean) => void) => void
  requestContact: (callback?: (contact: any) => void) => void
  invokeCustomMethod: (method: string, params?: any) => void
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void
  openTelegramLink: (url: string) => void
  openInvoice: (url: string, callback?: (status: string) => void) => void
}
