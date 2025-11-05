import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { authUtilsApi } from '@/services/api'

interface RecoveryValues {
  last_name: string
  first_name: string
  patronymic: string
  recovery_email: string
}

const ResetPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RecoveryValues>()
  const [emailError, setEmailError] = useState<string | null>(null)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const watchedEmail = watch('recovery_email')

  // Проверка существования пользователя при изменении email
  useEffect(() => {
    const checkEmailExists = async () => {
      if (!watchedEmail || errors.recovery_email) {
        setEmailError(null)
        return
      }

      setCheckingEmail(true)
      try {
        const exists = await authUtilsApi.checkUsername(watchedEmail)
        const foundIn = exists?.data?.foundIn as 'member' | 'structure' | 'both' | null
        
        if (!foundIn) {
          setEmailError('Пользователь не найден')
        } else {
          setEmailError(null)
        }
      } catch (error) {
        console.error('Ошибка проверки email:', error)
        setEmailError('Ошибка проверки пользователя')
      } finally {
        setCheckingEmail(false)
      }
    }

    // Дебаунс проверки
    const timeoutId = setTimeout(checkEmailExists, 500)
    return () => clearTimeout(timeoutId)
  }, [watchedEmail, errors.recovery_email])

  const onSubmit = async (data: RecoveryValues) => {
    setSubmitting(true)
    setEmailError(null)
    
    try {
      // Проверяем данные пользователя через новый эндпоинт
      const resetInfo = await authUtilsApi.getResetInfo(data.recovery_email)
      
      if (resetInfo.success) {
        const userData = resetInfo.data
        
        // Сравниваем введенные данные с данными из БД
        const isLastNameMatch = userData.last_name?.toLowerCase().trim() === data.last_name.toLowerCase().trim()
        const isFirstNameMatch = userData.first_name?.toLowerCase().trim() === data.first_name.toLowerCase().trim()
        const isPatronymicMatch = userData.patronymic?.toLowerCase().trim() === data.patronymic.toLowerCase().trim()
        
        if (isLastNameMatch && isFirstNameMatch && isPatronymicMatch) {
          // Данные верны
          alert('OK')
          console.log('Данные верны, пользователь подтвержден:', userData)
        } else {
          // Данные не совпадают
          setEmailError('Неверные данные пользователя')
        }
      } else {
        setEmailError('Ошибка проверки данных')
      }
    } catch (error: any) {
      console.error('Ошибка при проверке данных:', error)
      setEmailError(error.message || 'Ошибка при проверке данных')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-brand rounded-2xl shadow-lg p-6">
        <h1 className="text-xl font-bold text-white text-center mb-6 uppercase">ВОССТАНОВЛЕНИЕ</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-s font-semibold text-white mb-2">Фамилия</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('last_name', { required: 'Фамилия обязательна' })}
            />
            {errors.last_name && <p className="text-red-300 text-xs mt-1">{errors.last_name.message}</p>}
          </div>

          <div>
            <label className="block text-s font-semibold text-white mb-2">Имя</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('first_name', { required: 'Имя обязательно' })}
            />
            {errors.first_name && <p className="text-red-300 text-xs mt-1">{errors.first_name.message}</p>}
          </div>

          <div>
            <label className="block text-s font-semibold text-white mb-2">Отчество</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('patronymic', { required: 'Отчество обязательно' })}
            />
            {errors.patronymic && <p className="text-red-300 text-xs mt-1">{errors.patronymic.message}</p>}
          </div>

          <div>
            <label className="block text-s font-semibold text-white mb-2">Почта для восстановления</label>
            <input 
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('recovery_email', { 
                required: 'Email обязателен',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Введите корректный email'
                }
              })}
            />
            {checkingEmail && (
              <p className="text-blue-300 text-xs mt-1">Проверка...</p>
            )}
            {errors.recovery_email && (
              <p className="text-red-300 text-xs mt-1">{errors.recovery_email.message}</p>
            )}
            {emailError && !checkingEmail && !errors.recovery_email && (
              <p className="text-red-300 text-xs mt-1">{emailError}</p>
            )}
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full bg-brand font-bold py-4 px-6 rounded-full transition-colors mt-6 disabled:opacity-50"
          >
            <h2 className="uppercase text-white">
              {submitting ? 'Проверка...' : 'Отправить форму'}
            </h2>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPage