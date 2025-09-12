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
  mentor: string
  username: string
  password: string
  team_code: string
  privacy_policy: boolean
  role: 'member' | 'captain'
}

const RegistrationPage = () => {
  const [step, setStep] = useState(1)
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    reset,
    formState: { errors, isValid: isStep1Valid } 
  } = useForm<FormValues>({
    defaultValues: {
      role: 'member'
    },
    mode: 'onChange' // Валидация при изменении полей
  })

  const navigate = useNavigate()

  const selectedRole = watch('role')
  const watchAllFields = watch() // Следим за всеми полями

  // Проверяем валидность первого шага
  const isStep1Complete = () => {
    const requiredFields = [
      'last_name', 'first_name', 'birth_date', 
      'gender', 'vk_link', 'education', 'mentor'
    ]
    
    const fieldsValid = requiredFields.every(field => {
      const value = watchAllFields[field as keyof FormValues]
      return value !== undefined && value !== null && value !== ''
    })
    
    return fieldsValid && selectedPhoto !== null
  }

  const nextStep = () => {
    if (isStep1Complete()) {
      // Clear step 2 fields to prevent auto-filling
      reset({
        role: 'member',
        username: '',
        password: '',
        team_code: '',
        privacy_policy: false
      })
      setStep(2)
    } else {
      // Show validation errors for incomplete fields by triggering validation
      const requiredFields = [
        'last_name', 'first_name', 'birth_date', 
        'gender', 'vk_link', 'education', 'mentor'
      ]
      
      requiredFields.forEach(field => {
        const value = watchAllFields[field as keyof FormValues]
        if (!value || value === '') {
          // Trigger validation by setting empty value to show error
          setValue(field as keyof FormValues, '', { shouldValidate: true })
        }
      })
      
      // Show photo validation error if no photo selected
      if (!selectedPhoto) {
        setValue('photo', undefined as any, { shouldValidate: true })
      }
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedPhoto(file)
      setValue('photo', e.target.files as any, { shouldValidate: true })
    }
  }

  const handlePhotoRemove = () => {
    setSelectedPhoto(null)
    setValue('photo', undefined as any, { shouldValidate: true })
    // Reset the file input
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
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
                  files?.[0]?.size <= 2 * 1024 * 1024 || 'Максимальный размер файла 2MB',
                acceptedFormats: files => 
                  ['image/jpeg', 'image/png'].includes(files?.[0]?.type) || 
                  'Только JPEG и PNG форматы'
              }
            })}
            onChange={handlePhotoChange}
          />
          <label htmlFor="photo-upload" className="cursor-pointer text-xs text-white">
            Загрузи фото в формате PNG/JPEG не более 2 Мб
          </label>
        </div>
        {selectedPhoto && (
          <div className="mt-2 flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-2">
            <span className="text-xs text-white truncate flex-1">
              {selectedPhoto.name}
            </span>
            <button
              type="button"
              onClick={handlePhotoRemove}
              className="ml-2 text-red-300 hover:text-red-200 text-xs"
            >
              ✕
            </button>
          </div>
        )}
        {errors.photo && <p className="text-red-300 text-xs mt-1">{errors.photo.message}</p>}
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Твой наставник</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('mentor', { 
            required: 'Имя наставника обязательно'
          })}
        />
        {errors.mentor && <p className="text-red-300 text-xs mt-1">{errors.mentor.message}</p>}
      </div>

      <button 
        type="button"
        onClick={nextStep}
        className="w-full font-bold py-4 px-6 rounded-full transition-colors text-lg"
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
        <label className="block text-s font-semibold text-white mb-2">Введи почту</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <div>
        <label className="block text-s font-semibold text-white mb-2">
          {selectedRole === 'member' ? 'Введи код команды' : 'Придумай код команды'}
        </label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('team_code', { 
            required: 'Код команды обязателен',
            minLength: {
              value: 4,
              message: 'Код команды должен содержать минимум 4 символа'
            }
          })}
        />
        <p className="text-xs text-white mt-1 italic">
          {selectedRole === 'member' 
            ? 'Код команды нужно узнать у капитана команды' 
            : 'Код команды должен быть уникальным'
          }
        </p>
        {errors.team_code && <p className="text-red-300 text-xs mt-1">{errors.team_code.message}</p>}
      </div>

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
          isStep1Valid ? '' : 'cursor-not-allowed'
        }`}
        // disabled={!isStep1Valid}
      >
        <h2 className="text-white">Продолжить</h2>
      </button>
    </>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-32">
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