import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { structureApi } from '@/services/api'

// Базовый URL для API
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'https://api-production-2fd7.up.railway.app/api')

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
  photo?: FileList
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
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
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

  // Следим за изменением позиции
  const watchPosition = watch('pos')
  const watchAllFields = watch() // Следим за всеми полями

  // Проверяем валидность первого шага
  const isStep1Complete = () => {
    const requiredFields = [
      'last_name', 'first_name', 'birth_date', 
      'gender', 'vk_link','phone', 'education','grade', 'pos'
    ]
    
    const fieldsValid = requiredFields.every(field => {
      const value = watchAllFields[field as keyof FormValues]
      return value !== undefined && value !== null && value !== ''
    })
    
    return fieldsValid && selectedPhoto !== null
  }

  const nextStep = () => {
    if (isStep1Complete()) {
      if (watchPosition) {
        setSelectedPosition(watchPosition)
      }
      // Don't reset the form - just clear step 2 specific fields
      setValue('username', '')
      setValue('password', '')
      setValue('high_mentor', '')
      setValue('coord', '')
      setValue('ro', '')
      setValue('privacy_policy', false)
      setStep(2)
    } else {
      // Show validation errors for incomplete fields by triggering validation
      const requiredFields = [
        'last_name', 'first_name', 'birth_date', 
        'gender', 'vk_link', 'phone', 'education', 'grade', 'pos'
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

  const onSubmit = async (data: FormValues) => {
    // Проверяем, что все обязательные поля заполнены
    const requiredFields = [
      'last_name', 'first_name', 'birth_date', 'gender', 'vk_link', 
      'phone', 'education', 'grade', 'pos', 'username', 'password', 'privacy_policy'
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
      // Загружаем фото, если оно выбрано
      let photoUrl = undefined
      if (selectedPhoto) {
        const formData = new FormData()
        formData.append('photo', selectedPhoto)
        
        const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        })
        
        if (!uploadResponse.ok) {
          throw new Error('Ошибка загрузки фото')
        }
        
        const uploadData = await uploadResponse.json()
        photoUrl = uploadData.photoUrl
        console.log('Photo uploaded:', photoUrl)
      }
      
      const payload = {
        last_name: data.last_name,
        first_name: data.first_name,
        patronymic: data.patronymic || undefined,
        birth_date: data.birth_date,
        gender: data.gender,
        vk_link: data.vk_link,
        phone: data.phone,
        grade: data.grade,
        education: data.education,
        photo_url: photoUrl,
        pos: data.pos,
        username: data.username,
        password: data.password,
        high_mentor: data.high_mentor || undefined,
        coord: data.coord || undefined,
        ro: data.ro || undefined,
        privacy_policy: data.privacy_policy === true,
      }
      
      console.log('Sending payload:', JSON.stringify(payload, null, 2))
      
      await structureApi.create(payload as any)
      navigate('/profile')
    } catch (e: any) {
      console.error('structure registration failed', e)
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
        <label className="block text-s font-semibold text-white mb-2">Отчество</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('patronymic')}
        />
        <label className="text-xs text-white italic">
            При наличии
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
                className="mr-2 w-7 h-7 border-white checked:bg-pink checked:border-4 checked:border-white cursor-pointer"
              />
              <span className="text-s font-semibold text-white">М</span>
            </label>
            <label className="flex items-center px-2 py-2 rounded-full">
              <input 
                type="radio" 
                value="F" 
                {...register('gender')}
                className="mr-2 w-7 h-7 border-white checked:bg-pink checked:border-4 checked:border-white cursor-pointer"
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

      <div>
        <label className="block text-s font-semibold text-white mb-2">Курс обучения *</label>
        <select 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink"
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
        <label className="block text-s font-semibold text-white mb-2">Фото для кадровой карты *</label>
        <div className="border-2 border-dashed border-gray-300 rounded-full p-4 text-center">
          <input 
            type="file"
            accept="image/*"
            className="hidden"
            id="photo-upload"
            {...register('photo', { 
              required: 'Фото обязательно',
              validate: {
                hasFile: () => selectedPhoto !== null || 'Фото обязательно',
                lessThan2MB: files => 
                  !files?.[0] || files[0].size <= 2 * 1024 * 1024 || 'Максимальный размер файла 2MB',
                acceptedFormats: files => 
                  !files?.[0] || ['image/jpeg', 'image/png'].includes(files[0].type) || 
                  'Только JPEG и PNG форматы'
              }
            })}
            onChange={handlePhotoChange}
          />
          <label htmlFor="photo-upload" className="cursor-pointer text-xs text-white">
            Загрузи портретное фото 2х2 в формате PNG/JPEG не более 2 Мб
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
        <label className="block text-s font-semibold text-white mb-2">Твоя позиция *</label>
        <select 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink appearance-none"
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
        className="w-full font-bold py-4 px-6 rounded-full transition-colors text-lg"
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
          <label className="block text-s font-semibold text-white mb-2">Электронная почта *</label>
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
          <label className="text-xs text-white italic">
          Твой логин от учетной записи. Через нее можно восстановить доступ, рекомендуем писать актуальную почту
          </label>
        </div>

        <div>
          <label className="block text-s font-semibold text-white mb-2">Пароль для личного кабинета *</label>
          <input 
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink"
            {...register('password', { 
              required: 'Пароль обязателен'
            })}
          />
          {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Старший наставник (виден для наставника) */}
        {(showAllFields) && (
          <div>
            <label className="block text-s font-semibold text-white mb-2">Твой старший наставник *</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('high_mentor', { 
                required: 'Старший наставник обязателен'
              })}
            />
            {errors.high_mentor && <p className="text-red-300 text-xs mt-1">{errors.high_mentor.message}</p>}
            <label className="text-xs text-white italic">
            Введи Фамилию и Имя. Если забыл, уточни в чате!
          </label>
          </div>
        )}

        {/* Координатор (виден для наставника и старшего наставника) */}
        {(showAllFields || showSeniorMentorFields) && (
          <div>
            <label className="block text-s font-semibold text-white mb-2">Твой координатор в структуре *</label>
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
            <label className="block text-s font-semibold text-white mb-2">Твой Руководитель округа *</label>
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