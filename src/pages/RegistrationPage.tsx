import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mentorsApi, vusesApi } from '@/services/api'

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
  level: string
  grade: string
  format: string
  faculty: string
  specialty: string
  username: string
  password: string
  mentor: string
  team_code: string
  team_name: string
  privacy_policy: boolean
  role: 'member' | 'captain'
}

interface Vus {
  id: number
  vus: string
}

interface Mentor {
  id: number
  full_name: string
  first_name: string
  last_name: string
  pos: string
}

const RegistrationPage = () => {
  const [step, setStep] = useState(1)
  const [isDisabled, setIsDisabled] = useState(false);
  const [vuses, setVuses] = useState<Vus[]>([])
  const [filteredVuses, setFilteredVuses] = useState<Vus[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)

  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [showMentorSuggestions, setShowMentorSuggestions] = useState(false)
  const [mentorLoading, setMentorLoading] = useState(false)

  const [showEducationFields, setShowEducationFields] = useState(false)
  const [generatedTeamCode, setGeneratedTeamCode] = useState('')

  const handleClick = () => {
    if (isDisabled) return;
    
    setIsDisabled(true);

    setTimeout(() => {
      setIsDisabled(false);
    }, 1000);
  };

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    trigger,
    formState: { errors, isValid } 
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      education: '',
      role: 'member'
    }
  })
  const navigate = useNavigate()
  const selectedRole = watch('role')
  const educationValue = watch('education')
  const mentorValue = watch('mentor')

  // Функция для генерации кода команды в формате XXXX XXXX
  const generateTeamCode = () => {
    const numbers = '0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      if (i === 4) code += ' '
      code += numbers[Math.floor(Math.random() * numbers.length)]
    }
    return code
  }

  // Генерируем код команды при выборе роли капитана
  useEffect(() => {
    if (selectedRole === 'captain' && !generatedTeamCode) {
      const newCode = generateTeamCode()
      setGeneratedTeamCode(newCode)
      setValue('team_code', newCode, { shouldValidate: true })
    }
  }, [selectedRole, generatedTeamCode, setValue])

  // Сбрасываем сгенерированный код при смене роли на участника
  useEffect(() => {
    if (selectedRole === 'member') {
      setGeneratedTeamCode('')
      setValue('team_code', '', { shouldValidate: true })
    }
  }, [selectedRole, setValue])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedTeamCode)
    } catch (err) {
      console.error('Ошибка копирования: ', err)
      const textArea = document.createElement('textarea')
      textArea.value = generatedTeamCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  useEffect(() => {
    const fetchVuses = async () => {
      setLoading(true)
      try {
        const response = await vusesApi.getAll()
        if (response.success) {
          setVuses(response.data)
          setFilteredVuses(response.data)
        }
      } catch (error) {
        console.error('Ошибка загрузки ВУЗов:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVuses()
  }, [])

  useEffect(() => {
    const fetchMentors = async () => {
      setMentorLoading(true)
      try {
        const response = await mentorsApi.getAll()
        if (response.success) {
          setMentors(response.data)
          setFilteredMentors(response.data)
        }
      } catch (error) {
        console.error('Ошибка загрузки наставников:', error)
      } finally {
        setMentorLoading(false)
      }
    }
    fetchMentors()
  }, [])

  useEffect(() => {
    if (educationValue && educationValue.length > 1) {
      const filtered = vuses.filter(vus => 
        vus.vus.toLowerCase().includes(educationValue.toLowerCase())
      )
      setFilteredVuses(filtered)
      setShowSuggestions(true)
    } else {
      setFilteredVuses(vuses)
      setShowSuggestions(false)
    }
  }, [educationValue, vuses])

  useEffect(() => {
    if (mentorValue && mentorValue.length > 1) {
      const filtered = mentors.filter(mentor => 
        mentor.full_name.toLowerCase().includes(mentorValue.toLowerCase())
      )
      setFilteredMentors(filtered)
      setShowMentorSuggestions(true)
    } else {
      setFilteredMentors(mentors)
      setShowMentorSuggestions(false)
    }
  }, [mentorValue, mentors])

  // Следим за изменением поля "ВУЗ" для показа/скрытия дополнительных полей
  useEffect(() => {
    if (educationValue && educationValue.trim() !== '') {
      setShowEducationFields(true)
    } else {
      setShowEducationFields(false)
      setValue('level', '')
      setValue('grade', '')
      setValue('format', '')
      setValue('faculty', '')
      setValue('specialty', '')
    }
  }, [educationValue, setValue])

  const handleVusSelect = (vusName: string) => {
    setValue('education', vusName, { shouldValidate: true })
    setShowSuggestions(false)
  }

  const handleMentorSelect = (mentorName: string) => {
    setValue('mentor', mentorName, { shouldValidate: true })
    setShowMentorSuggestions(false)
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Проверяем валидность первого шага
  const isStep1Valid = async () => {
    const fieldsToValidate: (keyof FormValues)[] = [
      'last_name', 'first_name', 'patronymic', 'birth_date', 
      'gender', 'vk_link', 'phone', 'education', 'mentor'
    ]
    
    if (showEducationFields) {
      fieldsToValidate.push('level', 'grade', 'format', 'faculty', 'specialty')
    }
    
    const result = await trigger(fieldsToValidate)
    return result
  }

  const nextStep = async () => {
    const isValid = await isStep1Valid()
    if (isValid) {
      setStep(2)
    } else {
      const fieldsToValidate: (keyof FormValues)[] = [
        'last_name', 'first_name', 'patronymic', 'birth_date', 
        'gender', 'vk_link', 'phone', 'education', 'mentor'
      ]
      
      if (showEducationFields) {
        fieldsToValidate.push('level', 'grade', 'format', 'faculty', 'specialty')
      }
      
      await trigger(fieldsToValidate)
    }
  }

  // Проверяем валидность второго шага
  const isStep2Valid = async () => {
    const fieldsToValidate: (keyof FormValues)[] = [
      'username', 'password', 'team_code', 'role', 'privacy_policy'
    ]
    
    if (selectedRole === 'captain') {
      fieldsToValidate.push('team_name')
    }
    
    const result = await trigger(fieldsToValidate)
    return result
  }

  const prevStep = () => {
    setStep(1)
  }

  // Функция для отправки данных в таблицу members
  const createMember = async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error creating member:', error)
      throw error
    }
  }

  const onSubmit = async (data: FormValues) => {
    const isStep1ValidResult = await isStep1Valid()
    const isStep2ValidResult = await isStep2Valid()
    
    if (!isStep1ValidResult || !isStep2ValidResult) {
      alert('Пожалуйста, заполните все обязательные поля правильно')
      return
    }
  
    try {  
      const finalEducation = data.education.trim() === '' ? 'не обучаюсь в вузе' : data.education;
      
      const payload = {
        last_name: data.last_name,
        first_name: data.first_name,
        patronymic: data.patronymic,
        birth_date: data.birth_date,
        gender: data.gender,
        vk_link: data.vk_link,
        phone: data.phone,
        level: data.level,
        grade: data.grade,
        faculty: data.faculty,
        format: data.format,
        education: finalEducation,
        specialty: data.specialty,
        username: data.username,
        password: data.password,
        mentor: data.mentor,
        team_code: data.team_code,
        team_name: data.team_name,
        role: data.role,
        privacy_policy: data.privacy_policy === true,
      }
      
      console.log('Sending payload to members table:', JSON.stringify(payload, null, 2))
      
      // Отправляем данные в таблицу members
      await createMember(payload)
      
      alert('Регистрация прошла успешно!')
      navigate('/profile')
    } catch (e: any) {
      console.error('Member registration failed', e)
      console.error('Error details:', e.response?.data)
      alert(`Ошибка сохранения: ${e.response?.data?.message || e.message || 'Неизвестная ошибка'}. Попробуйте ещё раз.`)
    }
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
          {...register('patronymic', { 
            required: 'Поле обязательно'
          })}
        />
        {errors.patronymic && <p className="text-red-300 text-xs mt-1">{errors.patronymic.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 items-start">
        <div>
          <label className="block text-xs font-semibold text-white mb-2">Дата рождения</label>
          <input 
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-h-[48px]"
            {...register('birth_date', { 
              required: 'Дата рождения обязательна'
            })}
          />
          {errors.birth_date && <p className="text-red-300 text-xs mt-1">{errors.birth_date.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-white mb-2">Пол</label>
          <div className="flex space-x-1 h-[48px] items-center">
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
                {...register('gender', { required: 'Выберите пол' })}
                className="mr-2 w-7 h-7 border-white checked:bg-#000000 checked:border-4 checked:border-white cursor-pointer"
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
        <label className="block text-s font-semibold text-white mb-2">Номер телефона</label>
        <input 
          type="tel"
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="89999999999"
          {...register('phone', { 
            required: 'Номер телефона обязателен',
            pattern: {
              value: /^[0-9]{11}$/,
              message: 'Введите корректный номер телефона (11 цифр)'
            }
          })}
        />
        {errors.phone && <p className="text-red-300 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      <div className="relative">
        <label className="block text-s font-semibold text-white mb-2">ВУЗ</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('education')}
          placeholder="не обучаюсь в вузе"
          autoComplete="off"
          onFocus={() => educationValue && educationValue.length > 1 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        
        {showSuggestions && filteredVuses.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredVuses.map((vus) => (
              <div
                key={vus.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-800"
                onClick={() => handleVusSelect(vus.vus)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {vus.vus}
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="absolute right-3 top-10">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}

        {errors.education && <p className="text-red-300 text-xs mt-1">{errors.education.message}</p>}
      </div>

      {showEducationFields && (
        <>
          <div>
            <label className="block text-s font-semibold text-white mb-2">Уровень подготовки</label>
            <select 
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand"
              {...register('level', { 
                required: 'Уровень подготовки обязателен'
              })}
            >
              <option value="">Выберите уровень</option>
              <option value="бакалавриат">Бакалавриат</option>
              <option value="специалитет">Специалитет</option>
              <option value="магистратура">Магистратура</option>
              <option value="аспирантура">Аспирантура</option>
            </select>
            {errors.level && <p className="text-red-300 text-xs mt-1">{errors.level.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-2">Курс обучения</label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand"
                {...register('grade', { 
                  required: 'Курс обязателен'
                })}
              >
                <option value="">Выберите курс</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              {errors.grade && <p className="text-red-300 text-xs mt-1">{errors.grade.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-2">Форма обучения</label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand"
                {...register('format', { 
                  required: 'Форма обучения обязательна'
                })}
              >
                <option value="">Выберите форму</option>
                <option value="очная">Очная</option>
                <option value="очнозаочная">Очно-заочная</option>
                <option value="заочная">Заочная</option>
              </select>
              {errors.format && <p className="text-red-300 text-xs mt-1">{errors.format.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-s font-semibold text-white mb-2">Факультет</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand"
              {...register('faculty', { 
                required: 'Факультет обязателен'
              })}
              placeholder='Лечебный'
            />
            {errors.faculty && <p className="text-red-300 text-xs mt-1">{errors.faculty.message}</p>}
          </div>

          <div>
            <label className="block text-s font-semibold text-white mb-2">Специальность</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('specialty', { 
                required: 'Специальность обязательна'
              })}
              placeholder="31.05.01 Лечебное дело"
            />
            {errors.specialty && <p className="text-red-300 text-xs mt-1">{errors.specialty.message}</p>}
          </div>
        </>
      )}

      <div className="relative">
        <label className="block text-s font-semibold text-white mb-2">Твой наставник</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('mentor', { 
            required: 'Выберите наставника'
          })}
          autoComplete="off"
          onFocus={() => mentorValue && mentorValue.length > 1 && setShowMentorSuggestions(true)}
          onBlur={() => setTimeout(() => setShowMentorSuggestions(false), 200)}
        />
        
        {showMentorSuggestions && filteredMentors.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-800"
                onClick={() => handleMentorSelect(mentor.full_name)}
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="font-medium">{mentor.full_name}</div>
                <div className="text-xs text-gray-600">{mentor.pos}</div>
              </div>
            ))}
          </div>
        )}

        {mentorLoading && (
          <div className="absolute right-3 top-10">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
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
        <div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div 
              className={`text-center cursor-pointer py-2 rounded-lg ${
                watch('role') === 'member' ? 'bg-white bg-opacity-20' : ''
              }`}
              onClick={() => setValue('role', 'member', { shouldValidate: true })}
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
              onClick={() => setValue('role', 'captain', { shouldValidate: true })}
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
          <label className="block text-s font-semibold text-white mb-2">Электронная почта</label>
          <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand"
            {...register('username', { 
              required: 'Email обязателен',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Введите корректный email'
              }
            })}
            autoComplete="new-email"
          />
          {errors.username && <p className="text-red-300 text-xs mt-1">{errors.username.message}</p>}
          <label className="text-xs text-white italic">
            Твой логин от учетной записи. Через нее можно восстановить доступ, рекомендуем писать актуальную почту
          </label>
        </div>

        <div>
          <label className="block text-s font-semibold text-white mb-2">Пароль для личного кабинета</label>
          <input 
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand"
            {...register('password', { 
              required: 'Пароль обязателен'
            })}
            autoComplete="new-password"
          />
          {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-s font-semibold text-white mb-2">
            {selectedRole === 'member' ? 'Введи код команды' : 'Код вашей команды'}
          </label>
          {selectedRole === 'captain' ? (
            <div className="relative">
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
                value={generatedTeamCode}
                readOnly
                {...register('team_code', { 
                  required: 'Код команды обязателен'
                })}
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-brand text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-500 transition-colors"
              >
                Копировать
              </button>
            </div>
          ) : (
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('team_code', { 
                required: 'Код команды обязателен',
                minLength: {
                  value: 8,
                  message: 'Код команды должен содержать минимум 8 символов'
                }
              })}
            />
          )}
          <p className="text-xs text-white mt-1 italic">
            {selectedRole === 'member' 
              ? 'Код команды нужно узнать у капитана команды' 
              : 'Скопируйте и передайте этот код участникам команды'
            }
          </p>
          {errors.team_code && <p className="text-red-300 text-xs mt-1">{errors.team_code.message}</p>}
        </div>

        {selectedRole === 'captain' && (
          <div>
            <label className="block text-s font-semibold text-white mb-2">Название вашей команды</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('team_name', { 
                required: 'Название обязательно'
              })}
            />
            {errors.team_name && <p className="text-red-300 text-xs mt-1">{errors.team_name.message}</p>}
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

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={prevStep}
            className="flex-1 font-bold py-4 px-6 rounded-full transition-colors text-lg border border-white"
          >
            <h2 className="text-white">Назад</h2>
          </button>
          <button 
            type="submit"
            onClick={handleClick}
            disabled={isDisabled}
            className={`flex-1 font-bold py-4 px-6 rounded-full transition-colors text-lg ${
              isValid ? '' : 'cursor-not-allowed'
            }`}
          >
            <h2 className="text-white">Отправить</h2>
          </button>
        </div>
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