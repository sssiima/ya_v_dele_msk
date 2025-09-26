import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { structureApi } from '@/services/api'

// Базовый URL для API
// const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 
//   (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'https://api-production-2fd7.up.railway.app/api')

interface FormValues {
  last_name: string
  first_name: string
  patronymic: string
  birth_date: string
  gender: string
  vk_link: string
  phone: string
  education: string
  grade: string
  format: string
  faculty: string
  username: string
  password: string
  mentor: string
  team_code: string
  privacy_policy: boolean
  role: 'member' | 'captain'
}

const RegistrationPage = () => {
  const [step, setStep] = useState(1)
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors, isValid } 
  } = useForm<FormValues>({
    mode: 'onChange' // Валидация при изменении полей
  })
  const navigate = useNavigate()
  const selectedRole = watch('role')

  // Следим за изменением позиции
  const watchAllFields = watch() // Следим за всеми полями

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Проверяем валидность первого шага
  const isStep1Complete = () => {
    const requiredFields = [
      'last_name', 'first_name', 'birth_date', 
      'gender', 'vk_link','phone', 'education','grade', 'mentor'
    ]
    
    const fieldsValid = requiredFields.every(field => {
      const value = watchAllFields[field as keyof FormValues]
      return value !== undefined && value !== null && value !== ''
    })
    
    return fieldsValid !== null
  }

  const nextStep = () => {
    if (isStep1Complete()) {
      // Don't reset the form - just clear step 2 specific fields
      setValue('username', '')
      setValue('password', '')
      setValue('team_code', '')
      setValue('role', 'member')
      setValue('privacy_policy', false)
      setStep(2)
    } else {
      // Show validation errors for incomplete fields by triggering validation
      const requiredFields = [
        'last_name', 'first_name', 'patronymic', 'birth_date', 
        'gender', 'vk_link', 'phone', 'education', 'grade', 'mentor'
      ]
      
      requiredFields.forEach(field => {
        const value = watchAllFields[field as keyof FormValues]
        if (!value || value === '') {
          // Trigger validation by setting empty value to show error
          setValue(field as keyof FormValues, '', { shouldValidate: true })
        }
      })
      
    }
  }

  const onSubmit = async (data: FormValues) => {
    // Проверяем, что все обязательные поля заполнены
    const requiredFields = [
      'last_name', 'first_name', 'patronymic', 'birth_date', 'gender', 'vk_link', 
      'phone', 'education', 'grade', 'mentor', 'username', 'password', 'team_code', 'role', 'privacy_policy'
    ]
    
    const missingFields = requiredFields.filter(field => {
      const value = data[field as keyof FormValues]
      return value === undefined || value === null || value === '' || value === false
    })
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      alert(`Не заполнены обязательные поля: ${missingFields.join(', ')}`)
      return
    }
  
    try {  
      const payload = {
        last_name: data.last_name,
        first_name: data.first_name,
        patronymic: data.patronymic,
        birth_date: data.birth_date,
        gender: data.gender,
        vk_link: data.vk_link,
        phone: data.phone,
        grade: data.grade,
        education: data.education,
        username: data.username,
        password: data.password,
        mentor: data.mentor,
        team_code: data.team_code,
        role: data.role,
        privacy_policy: data.privacy_policy === true,
      }
      
      console.log('Sending payload:', JSON.stringify(payload, null, 2))
      
      await structureApi.create(payload as any)
      navigate('/profile')
    } catch (e: any) {
      console.error('user registration failed', e)
      console.error('Error details:', e.response?.data)
      alert(`Ошибка сохранения: ${e.response?.data?.message || e.message || 'Неизвестная ошибка'}. Попробуйте ещё раз.`)
    }
  }

  const renderStep1 = () => (
    <>
      <div>
        <label className="block text-s font-semibold text-white mb-2">Фамилия *</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('last_name', { 
            required: 'Фамилия обязательна'
          })}
        />
        {errors.last_name && <p className="text-red-300 text-xs mt-1">{errors.last_name.message}</p>}
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Имя *</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('first_name', { 
            required: 'Имя обязательно'
          })}
        />
        {errors.first_name && <p className="text-red-300 text-xs mt-1">{errors.first_name.message}</p>}
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Отчество *</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('patronymic', { 
            required: 'Поле обязательно'
          })}
        />
        {errors.patronymic && <p className="text-red-300 text-xs mt-1">{errors.patronymic.message}</p>}
        <label className="text-xs text-white italic">
            При наличии. Иначе поставь -
          </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-s font-semibold text-white mb-2">Дата рождения *</label>
          <input 
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            {...register('birth_date', { 
              required: 'Дата рождения обязательна'
            })}
          />
          {errors.birth_date && <p className="text-red-300 text-xs mt-1">{errors.birth_date.message}</p>}
        </div>
        <div>
          <label className="block text-s font-semibold text-white mb-2 mt-3 sm:mt-0">Пол *</label>
          <div className="flex space-x-1 mt-3">
            <label className="flex items-center px-2 py-2 rounded-full">
              <input 
                type="radio" 
                value="M" 
                {...register('gender', { required: 'Выберите пол' })}
                className="mr-2 w-7 h-7 border-white checked:bg-#000 checked:border-4 checked:border-white cursor-pointer"
              />
              <span className="text-s font-semibold text-white">М</span>
            </label>
            <label className="flex items-center px-2 py-2 rounded-full">
              <input 
                type="radio" 
                value="F" 
                {...register('gender')}
                className="mr-2 w-7 h-7 border-white checked:bg-#000000 checked:border-4 checked:border-white cursor-pointer"
              />
              <span className="text-s font-semibold text-white">Ж</span>
            </label>
          </div>
          {errors.gender && <p className="text-red-300 text-xs mt-1">{errors.gender.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Ссылка на ВКонтакте *</label>
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
        <label className="block text-s font-semibold text-white mb-2">Номер телефона *</label>
        <input 
          type="tel"
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="89999999999"
          {...register('phone', { 
            required: 'Номер телефона обязателен',
            pattern: {
              value: /^(\+7|8)[0-9]{10}$/,
              message: 'Введите корректный номер телефона'
            }
          })}
        />
        {errors.phone && <p className="text-red-300 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">ВУЗ *</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('education', { 
            required: 'Поле обязательно'
          })}
          />
        {errors.education && <p className="text-red-300 text-xs mt-1">{errors.education.message}</p>}
        <label className="text-xs text-white italic">
            Если ты не обучаешься в ВУЗе, поставь -
          </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-s font-semibold text-white mb-2">Курс обучения *</label>
        <select 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand"
          {...register('grade', { 
            required: 'Курс обязателен'
          })}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="0">Не обучаюсь в ВУЗе</option>
        </select>
        {errors.grade && <p className="text-red-300 text-xs mt-1">{errors.grade.message}</p>}
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Форма обучения *</label>
        <select 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand"
          {...register('format', { 
            required: 'Форма обязательна'
          })}
        >
          <option value="очная">Очная</option>
          <option value="очнозаочная">Очно-заочная</option>
          <option value="заочная">Заочная</option>
          <option value="нет">Не обучаюсь в ВУЗе</option>
        </select>
        {errors.format && <p className="text-red-300 text-xs mt-1">{errors.format.message}</p>}
      </div>
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Факультет *</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('faculty', { 
            required: 'Поле обязательно'
          })}
        />
        {errors.faculty && <p className="text-red-300 text-xs mt-1">{errors.faculty.message}</p>}
      </div>

      <div>
        <label className="block text-s font-semibold text-white mb-2">Твой наставник *</label>
        <select 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand appearance-none"
          {...register('mentor', { 
            required: 'Выберите наставника'
          })}
        >
          <option value="наставник">Наставник</option>
          <option value="старший наставник">Старший наставник</option>
          <option value="координатор">Координатор</option>
          <option value="РО">РО</option>
        </select>
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

  const renderStep2 = () => {

    return (
      <>
        {/* Почта и пароль всегда отображаются */}
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
          <label className="block text-s font-semibold text-white mb-2">Электронная почта *</label>
          <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand"
            {...register('username', { 
              required: 'Email обязателен',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Введите корректный email'
              }
            })}
          />
          {errors.username && <p className="text-red-300 text-xs mt-1">{errors.username.message}</p>}
          <label className="text-xs text-white italic">
          Твой логин от учетной записи. Через нее можно восстановить доступ, рекомендуем писать актуальную почту
          </label>
        </div>

        <div>
          <label className="block text-s font-semibold text-white mb-2">Пароль для личного кабинета *</label>
          <input 
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand"
            {...register('password', { 
              required: 'Пароль обязателен'
            })}
          />
          {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
        <label className="block text-s font-semibold text-white mb-2">
          {selectedRole === 'member' ? 'Введи код команды *' : 'Придумай код команды *'}
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
          Согласие на обработку персональных данных
          </label>
        </div>
        {errors.privacy_policy && <p className="text-red-300 text-xs mt-1">{errors.privacy_policy.message}</p>}

        <button 
          type="submit"
          className={`w-full font-bold py-4 px-6 rounded-full transition-colors text-lg ${
            isValid ? '' : 'cursor-not-allowed'
          }`}
          disabled={!isValid}
        >
          <h2 className="text-white">Отправить</h2>
        </button>
      </>
    )
  }

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