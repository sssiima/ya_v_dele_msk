import { useQuery, useMutation, useQueryClient } from 'react-query'
import { authApi, usersApi, User } from '../services/api'
import { useTelegram } from './useTelegram'
import { useAppStore } from '../store'

export const useAuth = () => {
  const { webApp, showAlert } = useTelegram()
  const { setUser } = useAppStore()

  const login = useMutation(
    () => {
      if (!webApp?.initData) {
        throw new Error('Telegram Web App не инициализирован')
      }
      return authApi.telegramAuth(webApp.initData)
    },
    {
      onSuccess: (response) => {
        const { token, user } = response.data
        localStorage.setItem('auth_token', token)
        setUser(user)
        showAlert('Успешная авторизация!')
      },
      onError: (error: any) => {
        showAlert(`Ошибка авторизации: ${error.message}`)
      },
    }
  )

  const logout = useMutation(
    () => authApi.logout(),
    {
      onSuccess: () => {
        localStorage.removeItem('auth_token')
        setUser(null)
        showAlert('Вы вышли из аккаунта')
      },
      onError: (error: any) => {
        showAlert(`Ошибка при выходе: ${error.message}`)
      },
    }
  )

  const refreshToken = useMutation(
    () => authApi.refreshToken(),
    {
      onSuccess: (response) => {
        const { token } = response.data
        localStorage.setItem('auth_token', token)
      },
      onError: () => {
        localStorage.removeItem('auth_token')
        setUser(null)
      },
    }
  )

  return {
    login,
    logout,
    refreshToken,
  }
}

export const useProfile = () => {
  return useQuery(
    ['profile'],
    () => usersApi.getProfile(),
    {
      staleTime: 10 * 60 * 1000, // 10 минут
      retry: 1,
    }
  )
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { showAlert } = useTelegram()

  return useMutation(
    (userData: Partial<User>) => usersApi.updateProfile(userData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['profile'])
        showAlert('Профиль успешно обновлен!')
      },
      onError: (error: any) => {
        showAlert(`Ошибка при обновлении профиля: ${error.message}`)
      },
    }
  )
}

export const useUserEvents = () => {
  return useQuery(
    ['user-events'],
    () => usersApi.getEvents(),
    {
      staleTime: 5 * 60 * 1000, // 5 минут
    }
  )
}

export const useUserFavorites = () => {
  return useQuery(
    ['user-favorites'],
    () => usersApi.getFavorites(),
    {
      staleTime: 5 * 60 * 1000, // 5 минут
    }
  )
}
