import { useQuery, useMutation, useQueryClient } from 'react-query'
import { eventsApi, Event, EventFilters } from '../services/api'
import { useTelegram } from './useTelegram'

export const useEvents = (filters?: EventFilters) => {
  return useQuery(
    ['events', filters],
    () => eventsApi.getAll(filters),
    {
      staleTime: 5 * 60 * 1000, // 5 минут
      cacheTime: 10 * 60 * 1000, // 10 минут
    }
  )
}

export const useEvent = (id: string) => {
  return useQuery(
    ['event', id],
    () => eventsApi.getById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  )
}

export const useCreateEvent = () => {
  const queryClient = useQueryClient()
  const { showAlert } = useTelegram()

  return useMutation(
    (eventData: Partial<Event>) => eventsApi.create(eventData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['events'])
        showAlert('Событие успешно создано!')
      },
      onError: (error: any) => {
        showAlert(`Ошибка при создании события: ${error.message}`)
      },
    }
  )
}

export const useUpdateEvent = () => {
  const queryClient = useQueryClient()
  const { showAlert } = useTelegram()

  return useMutation(
    ({ id, eventData }: { id: string; eventData: Partial<Event> }) =>
      eventsApi.update(id, eventData),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(['events'])
        queryClient.invalidateQueries(['event', id])
        showAlert('Событие успешно обновлено!')
      },
      onError: (error: any) => {
        showAlert(`Ошибка при обновлении события: ${error.message}`)
      },
    }
  )
}

export const useDeleteEvent = () => {
  const queryClient = useQueryClient()
  const { showAlert } = useTelegram()

  return useMutation(
    (id: string) => eventsApi.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['events'])
        showAlert('Событие успешно удалено!')
      },
      onError: (error: any) => {
        showAlert(`Ошибка при удалении события: ${error.message}`)
      },
    }
  )
}

export const useJoinEvent = () => {
  const queryClient = useQueryClient()
  const { showAlert } = useTelegram()

  return useMutation(
    (id: string) => eventsApi.join(id),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(['events'])
        queryClient.invalidateQueries(['event', id])
        showAlert('Вы успешно присоединились к событию!')
      },
      onError: (error: any) => {
        showAlert(`Ошибка при присоединении к событию: ${error.message}`)
      },
    }
  )
}

export const useLeaveEvent = () => {
  const queryClient = useQueryClient()
  const { showAlert } = useTelegram()

  return useMutation(
    (id: string) => eventsApi.leave(id),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(['events'])
        queryClient.invalidateQueries(['event', id])
        showAlert('Вы покинули событие')
      },
      onError: (error: any) => {
        showAlert(`Ошибка при выходе из события: ${error.message}`)
      },
    }
  )
}
