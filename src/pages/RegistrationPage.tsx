import { useForm } from 'react-hook-form'
import { useState } from 'react'

interface FormValues {
  last_name: string
  first_name: string
  patronymic: string
  birth_date: string
  gender: string
  vk_link: string
  photo: FileList
  mentor: string
  username: string
  password: string
  team_code: string
  privacy_policy: boolean
  role: 'member' | 'captain'
}

const RegistrationPage = () => {
  const [step, setStep] = useState(1)
  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      role: 'member'
    }
  })

  const selectedRole = watch('role')

  const nextStep = () => setStep(2)
  // const prevStep = () => setStep(1)

  const onSubmit = (data: FormValues) => {
    console.log('register', data)
  }

  const renderStep1 = () => (
    <>
      <div>
        <label className="block text-s font-semibold text-white mb-2">Фамилия</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('last_name')}
        />
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Имя</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('first_name')}
        />
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Отчество</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('patronymic')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-s font-semibold text-white mb-2">Дата рождения</label>
          <input 
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('birth_date')}
          />
        </div>
        <div>
          <label className="block text-s font-semibold text-white mb-2">Пол</label>
          <div className="flex space-x-3">
            <label className="flex items-center bg-gray-100 px-3 py-2 rounded-full">
              <input 
                type="radio" 
                value="M" 
                {...register('gender')}
                className="mr-2"
              />
              <span className="text-s font-medium">М</span>
            </label>
            <label className="flex items-center bg-gray-100 px-3 py-2 rounded-full">
              <input 
                type="radio" 
                value="F" 
                {...register('gender')}
                className="mr-2"
              />
              <span className="text-s font-medium">Ж</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Ссылка на ВКонтакте</label>
        <input 
          type="url"
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://vk.com/username"
          {...register('vk_link')}
        />
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Фото</label>
        <div className="border-2 border-dashed border-gray-300 rounded-full p-4 text-center">
          <input 
            type="file"
            accept="image/*"
            className="hidden"
            id="photo-upload"
            {...register('photo')}
          />
          <label htmlFor="photo-upload" className="cursor-pointer text-sm text-gray-600">
            Загрузи фото в формате jpeg не более 2 Мб
          </label>
        </div>
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Твой наставник</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('mentor')}
        />
      </div>

      <button 
        type="button"
        onClick={nextStep}
        className="w-full bg-brand font-bold py-4 px-6 rounded-full transition-colors text-lg"
      >
        <h2 className="text-white">Продолжить</h2>
      </button>
    </>
  )

  const renderStep2 = () => (
    <>
      <div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div 
          className={`text-center cursor-pointer py-2 rounded-lg ${
          watch('role') === 'member' ? 'bg-white bg-opacity-20' : ''
          }`}
          onClick={() => setValue('role', 'member')}
          >
            <span className={`text-s font-medium text-white ${
            watch('role') === 'member' ? 'font-bold' : 'font-normal'
            }`}>
            Я участник команды
            </span>
          </div>
  
          <div className="bg-white h-4 w-px mx-2"></div>
  
          <div 
          className={`text-center cursor-pointer py-2 rounded-lg ${
          watch('role') === 'captain' ? 'bg-white bg-opacity-20' : ''
          }`}
          onClick={() => setValue('role', 'captain')}
          >
            <span className={`text-s font-medium text-white ${
            watch('role') === 'captain' ? 'font-bold' : 'font-normal'
            }`}>
            Я капитан команды
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Придумай логин</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('username')}
        />
        <p className="text-xs text-white italic mt-1">
          Логин должен быть не менее 8 символов, включать буквы в верхнем и нижнем регистре
        </p>
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Придумай пароль</label>
        <input 
          type="password"
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('password')}
        />
        <p className="text-xs text-white mt-1 italic">
          Пароль должен быть не менее 8 символов, включать буквы в верхнем и нижнем регистре, содержать цифры и другие знаки
        </p>
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">
          {selectedRole === 'member' ? 'Введи код команды' : 'Придумай код команды'}
        </label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('team_code')}
        />
        <p className="text-xs text-white mt-1 italic">
          {selectedRole === 'member' 
            ? 'Код команды нужно узнать у капитана команды' 
            : 'Код команды должен быть уникальным'
          }
        </p>
      </div>

      <div className="flex items-start">
        <input 
          type="checkbox"
          id="privacy-policy"
          className="mt-1 mr-3"
          {...register('privacy_policy')}
        />
        <label htmlFor="privacy-policy" className="text-xs text-white italic">
          Отправляя данную форму, вы соглашаетесь с политикой конфиденциальности и правилами нашего сайта
        </label>
      </div>

      <button 
        type="button"
        // onClick={nextStep}
        className="w-full bg-brand font-bold py-4 px-6 rounded-full transition-colors text-lg"
      >
        <h2 className="text-white">Продолжить</h2>
      </button>
    </>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-brand rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white text-center mb-6 uppercase">РЕГИСТРАЦИЯ</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 ? renderStep1() : renderStep2()}
        </form>
      </div>
    </div>
  )
}

export default RegistrationPage