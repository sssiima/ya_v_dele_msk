import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface FormValues {
  last_name: string
  first_name: string
  patronymic: string
  birth_date: string
  gender: string
  vk_link: string
  education: string
  photo: FileList
  pos: string
  username: string
  password: string
  high_mentor: string
  coord: string
  ro: string
  privacy_policy: boolean
}

const RegistrationPageStructure = () => {
  const [step, setStep] = useState(1)
  const [selectedPosition, setSelectedPosition] = useState('')
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors, isValid: isStep2Valid } 
  } = useForm<FormValues>({
    mode: 'onChange' // Валидация при изменении полей
  })
  const navigate = useNavigate()

  // Следим за изменением позиции
  const watchPosition = watch('pos')
  const watchAllFields = watch() // Следим за всеми полями

  // Проверяем валидность первого шага
  const isStep1Complete = () => {
    const requiredFields = [
      'last_name', 'first_name', 'birth_date', 
      'gender', 'vk_link', 'education', 'photo', 'pos'
    ]
    
    return requiredFields.every(field => {
      const value = watchAllFields[field as keyof FormValues]
      return value !== undefined && value !== null && value !== ''
    })
  }

  const nextStep = () => {
    if (isStep1Complete()) {
      if (watchPosition) {
        setSelectedPosition(watchPosition)
      }
      setStep(2)
    }
  }

  const onSubmit = (data: FormValues) => {
    console.log('register', data)
    navigate('/profile')
  }

  const renderStep1 = () => (
    <>
      <div>
        <label className="block text-s font-semibold text-white mb-2">Фамилия</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('last_name', { 
            required: 'Фамилия обязательна'
          })}
        />
        {errors.last_name && <p className="text-red-300 text-xs mt-1">{errors.last_name.message}</p>}
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Имя</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('first_name', { 
            required: 'Имя обязательно'
          })}
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-s font-semibold text-white mb-2">Дата рождения</label>
          <input 
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('birth_date', { 
              required: 'Дата рождения обязательна'
            })}
          />
          {errors.birth_date && <p className="text-red-300 text-xs mt-1">{errors.birth_date.message}</p>}
        </div>
        <div>
          <label className="block text-s font-semibold text-white mb-2">Пол</label>
          <div className="flex space-x-1">
            <label className="flex items-center px-2 py-2 rounded-full">
              <input 
                type="radio" 
                value="M" 
                {...register('gender', { required: 'Выберите пол' })}
                className="mr-2 w-10 h-10"
              />
              <span className="text-s font-semibold text-white">М</span>
            </label>
            <label className="flex items-center px-2 py-2 rounded-full">
              <input 
                type="radio" 
                value="F" 
                {...register('gender')}
                className="mr-2 w-10 h-10"
              />
              <span className="text-s font-semibold text-white">Ж</span>
            </label>
          </div>
          {errors.gender && <p className="text-red-300 text-xs mt-1">{errors.gender.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Ссылка на ВКонтакте</label>
        <input 
          type="url"
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://vk.com/username"
          {...register('vk_link', { 
            required: 'Ссылка на ВКонтакте обязательна',
            pattern: {
              value: /^(https?:\/\/)?(www\.)?vk\.com\/.+/,
              message: 'Введите корректную ссылку на ВКонтакте'
            }
          })}
        />
        {errors.vk_link && <p className="text-red-300 text-xs mt-1">{errors.vk_link.message}</p>}
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">ВУЗ</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('education', { 
            required: 'Название ВУЗа обязательно'
          })}
        />
        {errors.education && <p className="text-red-300 text-xs mt-1">{errors.education.message}</p>}
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Фото</label>
        <div className="border-2 border-dashed border-gray-300 rounded-full p-4 text-center">
          <input 
            type="file"
            accept="image/*"
            className="hidden"
            id="photo-upload"
            {...register('photo', { 
              required: 'Фото обязательно',
              validate: {
                lessThan2MB: files => 
                  files[0]?.size <= 2 * 1024 * 1024 || 'Максимальный размер файла 2MB',
                acceptedFormats: files => 
                  ['image/jpeg', 'image/png'].includes(files[0]?.type) || 
                  'Только JPEG и PNG форматы'
              }
            })}
          />
          <label htmlFor="photo-upload" className="cursor-pointer text-xs text-white">
            Загрузи фото в формате PNG/JPEG не более 2 Мб
          </label>
        </div>
        {errors.photo && <p className="text-red-300 text-xs mt-1">{errors.photo.message}</p>}
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Твоя позиция</label>
        <select 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink"
          {...register('pos', { 
            required: 'Выберите позицию'
          })}
        >
          <option value="наставник">Наставник</option>
          <option value="старший наставник">Старший наставник</option>
          <option value="координатор">Координатор</option>
          <option value="РО">РО</option>
        </select>
        {errors.pos && <p className="text-red-300 text-xs mt-1">{errors.pos.message}</p>}
      </div>

      <button 
        type="button"
        onClick={nextStep}
        className={`w-full font-bold py-4 px-6 rounded-full transition-colors text-lg ${
          isStep1Complete() ? '' : 'cursor-not-allowed'
        }`}
        // disabled={!isStep1Complete()}
      >
        <h2 className="text-white">Продолжить</h2>
      </button>
    </>
  )

  const renderStep2 = () => {
    // Определяем, какие поля показывать в зависимости от позиции
    const showAllFields = selectedPosition === 'наставник';
    const showSeniorMentorFields = selectedPosition === 'старший наставник';
    const showCoordinatorFields = selectedPosition === 'координатор';

    return (
      <>
        {/* Почта и пароль всегда отображаются */}
        <div>
          <label className="block text-s font-semibold text-white mb-2">Введи почту</label>
          <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink"
            {...register('username', { 
              required: 'Email обязателен',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Введите корректный email'
              }
            })}
          />
          {errors.username && <p className="text-red-300 text-xs mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-s font-semibold text-white mb-2">Придумай пароль</label>
          <input 
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink"
            {...register('password', { 
              required: 'Пароль обязателен',
              minLength: {
                value: 8,
                message: 'Пароль должен содержать минимум 8 символов'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Пароль должен содержать буквы в верхнем и нижнем регистре, цифры и специальные символы'
              }
            })}
          />
          <p className="text-xs text-white mt-1 italic">
            Пароль должен быть не менее 8 символов, включать буквы в верхнем и нижнем регистре, содержать цифры и другие знаки
          </p>
          {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Старший наставник (виден для наставника) */}
        {(showAllFields) && (
          <div>
            <label className="block text-s font-semibold text-white mb-2">Старший наставник</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('high_mentor', { 
                required: 'Старший наставник обязателен'
              })}
            />
            {errors.high_mentor && <p className="text-red-300 text-xs mt-1">{errors.high_mentor.message}</p>}
          </div>
        )}

        {/* Координатор (виден для наставника и старшего наставника) */}
        {(showAllFields || showSeniorMentorFields) && (
          <div>
            <label className="block text-s font-semibold text-white mb-2">Координатор</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('coord', { 
                required: 'Координатор обязателен'
              })}
            />
            {errors.coord && <p className="text-red-300 text-xs mt-1">{errors.coord.message}</p>}
          </div>
        )}

        {/* РО (виден для наставника, старшего наставника и координатора) */}
        {(showAllFields || showSeniorMentorFields || showCoordinatorFields) && (
          <div>
            <label className="block text-s font-semibold text-white mb-2">РО</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('ro', { 
                required: 'РО обязателен'
              })}
            />
            {errors.ro && <p className="text-red-300 text-xs mt-1">{errors.ro.message}</p>}
          </div>
        )}

        <div className="flex items-start">
          <input 
            type="checkbox"
            id="privacy-policy"
            className="mt-1 mr-3"
            {...register('privacy_policy', { 
              required: 'Необходимо согласие с политикой конфиденциальности'
            })}
          />
          <label htmlFor="privacy-policy" className="text-xs text-white italic">
            Отправляя данную форму, вы соглашаетесь с политикой конфиденциальности и правилами нашего сайта
          </label>
        </div>
        {errors.privacy_policy && <p className="text-red-300 text-xs mt-1">{errors.privacy_policy.message}</p>}

        <button 
          type="submit"
          className={`w-full font-bold py-4 px-6 rounded-full transition-colors text-lg ${
            isStep2Valid ? '' : 'cursor-not-allowed'
          }`}
          // disabled={!isStep2Valid}
        >
          <h2 className="text-white">Продолжить</h2>
        </button>
      </>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-32">
      <div className="card w-full max-w-md bg-pink rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white text-center mb-6 uppercase">РЕГИСТРАЦИЯ</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 ? renderStep1() : renderStep2()}
        </form>
      </div>
    </div>
  )
}

export default RegistrationPageStructure