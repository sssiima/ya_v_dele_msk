import { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  photo_url?: string
}

interface TelegramWebApp {
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
  HapticFeedback: any
  CloudStorage: any
  Utils: any
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

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tgWebApp = (window as any).Telegram.WebApp as TelegramWebApp
      setWebApp(tgWebApp)
      
      // Инициализация
      tgWebApp.ready()
      tgWebApp.expand()
      
      // Получение данных пользователя
      if (tgWebApp.initDataUnsafe?.user) {
        setUser(tgWebApp.initDataUnsafe.user)
      }
      
      setIsReady(true)
    } else {
      // Fallback для разработки
      setWebApp(WebApp as any)
      setIsReady(true)
    }
  }, [])

  const showAlert = (message: string) => {
    if (webApp) {
      webApp.showAlert(message)
    } else {
      alert(message)
    }
  }

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showConfirm(message, resolve)
      } else {
        resolve(confirm(message))
      }
    })
  }

  const closeApp = () => {
    if (webApp) {
      webApp.close()
    }
  }

  return {
    webApp,
    user,
    isReady,
    showAlert,
    showConfirm,
    closeApp,
  }
}
