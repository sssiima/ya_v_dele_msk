import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface RecoveryValues {
  last_name: string
  first_name: string
  patronymic: string
  recovery_email: string
}

const ResetPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RecoveryValues>()

    const onSubmit = (data: RecoveryValues) => {
    console.log('recovery', data)
  }
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              {...register('patronymic')}
            />
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
            {errors.recovery_email && <p className="text-red-300 text-xs mt-1">{errors.recovery_email.message}</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-brand font-bold py-4 px-6 rounded-full transition-colorsmt-6"
          >
            <h2 className="uppercase text-white">Отправить форму</h2>
          </button>
        </form>
      </div>
    </div>
    )
}

export default ResetPage