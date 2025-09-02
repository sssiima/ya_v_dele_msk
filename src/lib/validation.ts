import { VALIDATION_RULES } from '../constants'

// Типы для валидации
export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Валидация событий
export const validateEvent = (data: {
  title?: string
  description?: string
  fullDescription?: string
  location?: string
  address?: string
  maxParticipants?: number
  date?: string
  time?: string
}): ValidationResult => {
  const errors: ValidationError[] = []

  // Валидация заголовка
  if (data.title) {
    if (data.title.length < VALIDATION_RULES.TITLE.MIN_LENGTH) {
      errors.push({
        field: 'title',
        message: `Заголовок должен содержать минимум ${VALIDATION_RULES.TITLE.MIN_LENGTH} символа`,
      })
    }
    if (data.title.length > VALIDATION_RULES.TITLE.MAX_LENGTH) {
      errors.push({
        field: 'title',
        message: `Заголовок не должен превышать ${VALIDATION_RULES.TITLE.MAX_LENGTH} символов`,
      })
    }
  } else {
    errors.push({
      field: 'title',
      message: 'Заголовок обязателен',
    })
  }

  // Валидация описания
  if (data.description) {
    if (data.description.length < VALIDATION_RULES.DESCRIPTION.MIN_LENGTH) {
      errors.push({
        field: 'description',
        message: `Описание должно содержать минимум ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} символов`,
      })
    }
    if (data.description.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
      errors.push({
        field: 'description',
        message: `Описание не должно превышать ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} символов`,
      })
    }
  } else {
    errors.push({
      field: 'description',
      message: 'Описание обязательно',
    })
  }

  // Валидация полного описания
  if (data.fullDescription) {
    if (data.fullDescription.length < VALIDATION_RULES.FULL_DESCRIPTION.MIN_LENGTH) {
      errors.push({
        field: 'fullDescription',
        message: `Полное описание должно содержать минимум ${VALIDATION_RULES.FULL_DESCRIPTION.MIN_LENGTH} символов`,
      })
    }
    if (data.fullDescription.length > VALIDATION_RULES.FULL_DESCRIPTION.MAX_LENGTH) {
      errors.push({
        field: 'fullDescription',
        message: `Полное описание не должно превышать ${VALIDATION_RULES.FULL_DESCRIPTION.MAX_LENGTH} символов`,
      })
    }
  }

  // Валидация местоположения
  if (data.location) {
    if (data.location.length < VALIDATION_RULES.LOCATION.MIN_LENGTH) {
      errors.push({
        field: 'location',
        message: `Местоположение должно содержать минимум ${VALIDATION_RULES.LOCATION.MIN_LENGTH} символа`,
      })
    }
    if (data.location.length > VALIDATION_RULES.LOCATION.MAX_LENGTH) {
      errors.push({
        field: 'location',
        message: `Местоположение не должно превышать ${VALIDATION_RULES.LOCATION.MAX_LENGTH} символов`,
      })
    }
  } else {
    errors.push({
      field: 'location',
      message: 'Местоположение обязательно',
    })
  }

  // Валидация адреса
  if (data.address) {
    if (data.address.length < VALIDATION_RULES.ADDRESS.MIN_LENGTH) {
      errors.push({
        field: 'address',
        message: `Адрес должен содержать минимум ${VALIDATION_RULES.ADDRESS.MIN_LENGTH} символов`,
      })
    }
    if (data.address.length > VALIDATION_RULES.ADDRESS.MAX_LENGTH) {
      errors.push({
        field: 'address',
        message: `Адрес не должен превышать ${VALIDATION_RULES.ADDRESS.MAX_LENGTH} символов`,
      })
    }
  } else {
    errors.push({
      field: 'address',
      message: 'Адрес обязателен',
    })
  }

  // Валидация максимального количества участников
  if (data.maxParticipants) {
    if (data.maxParticipants < VALIDATION_RULES.MAX_PARTICIPANTS.MIN) {
      errors.push({
        field: 'maxParticipants',
        message: `Минимальное количество участников: ${VALIDATION_RULES.MAX_PARTICIPANTS.MIN}`,
      })
    }
    if (data.maxParticipants > VALIDATION_RULES.MAX_PARTICIPANTS.MAX) {
      errors.push({
        field: 'maxParticipants',
        message: `Максимальное количество участников: ${VALIDATION_RULES.MAX_PARTICIPANTS.MAX}`,
      })
    }
  } else {
    errors.push({
      field: 'maxParticipants',
      message: 'Максимальное количество участников обязательно',
    })
  }

  // Валидация даты
  if (data.date) {
    const date = new Date(data.date)
    const now = new Date()
    
    if (isNaN(date.getTime())) {
      errors.push({
        field: 'date',
        message: 'Неверный формат даты',
      })
    } else if (date < now) {
      errors.push({
        field: 'date',
        message: 'Дата события не может быть в прошлом',
      })
    }
  } else {
    errors.push({
      field: 'date',
      message: 'Дата обязательна',
    })
  }

  // Валидация времени
  if (data.time) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(data.time)) {
      errors.push({
        field: 'time',
        message: 'Неверный формат времени (HH:MM)',
      })
    }
  } else {
    errors.push({
      field: 'time',
      message: 'Время обязательно',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Валидация профиля пользователя
export const validateProfile = (data: {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  bio?: string
}): ValidationResult => {
  const errors: ValidationError[] = []

  // Валидация имени
  if (data.first_name) {
    if (data.first_name.length < 2) {
      errors.push({
        field: 'first_name',
        message: 'Имя должно содержать минимум 2 символа',
      })
    }
    if (data.first_name.length > 50) {
      errors.push({
        field: 'first_name',
        message: 'Имя не должно превышать 50 символов',
      })
    }
  }

  // Валидация фамилии
  if (data.last_name) {
    if (data.last_name.length < 2) {
      errors.push({
        field: 'last_name',
        message: 'Фамилия должна содержать минимум 2 символа',
      })
    }
    if (data.last_name.length > 50) {
      errors.push({
        field: 'last_name',
        message: 'Фамилия не должна превышать 50 символов',
      })
    }
  }

  // Валидация email
  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.push({
        field: 'email',
        message: 'Неверный формат email',
      })
    }
  }

  // Валидация телефона
  if (data.phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
      errors.push({
        field: 'phone',
        message: 'Неверный формат номера телефона',
      })
    }
  }

  // Валидация био
  if (data.bio) {
    if (data.bio.length > 500) {
      errors.push({
        field: 'bio',
        message: 'Био не должно превышать 500 символов',
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Валидация поискового запроса
export const validateSearchQuery = (query: string): ValidationResult => {
  const errors: ValidationError[] = []

  if (query.length > 100) {
    errors.push({
      field: 'search',
      message: 'Поисковый запрос не должен превышать 100 символов',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Валидация тегов
export const validateTags = (tags: string[]): ValidationResult => {
  const errors: ValidationError[] = []

  if (tags.length > 10) { // MAX_TAGS_COUNT
    errors.push({
      field: 'tags',
      message: 'Максимальное количество тегов: 10',
    })
  }

  tags.forEach((tag, index) => {
    if (tag.length > 20) { // MAX_TAG_LENGTH
      errors.push({
        field: `tags[${index}]`,
        message: 'Тег не должен превышать 20 символов',
      })
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Утилиты для валидации
export const getFieldError = (errors: ValidationError[], field: string): string | null => {
  const error = errors.find(err => err.field === field)
  return error ? error.message : null
}

export const hasFieldError = (errors: ValidationError[], field: string): boolean => {
  return errors.some(err => err.field === field)
}
