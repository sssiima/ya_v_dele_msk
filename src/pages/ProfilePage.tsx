import { useState, useEffect, useRef, useCallback } from 'react';
import { structureApi, teamsApi, teamMembersApi, membersApi, homeworksApi, Homework } from '@/services/api'
import { useNavigate } from 'react-router-dom'
import CalendarPage from '@/components/CalendarPage';

interface Mk {
  title: string;
  subtitle: string;
  image: string;
  tz?: string;
  pres: string;
  method: string;
  disabled?: boolean;
  criteria?: string;
  template?: string;
  fulldesc?: string;
  track?: string;
}

const Card = ({ title, subtitle, image, link, disabled }: { title?: string, subtitle?: string, image?: string, link?: string, disabled?: boolean }) => (
  <div className="flex flex-col w-[210px] flex-shrink-0">
    {link && !disabled ? (
      <a href={link} target="_blank">
        <img src={image} className="rounded-xl w-64 cursor-pointer hover:opacity-90 transition-opacity" />
      </a>
    ) : (
      <img src={image} className="rounded-xl w-64" />
    )}
    {title && (
      <>
        <p className="text-center text-brand font-bold text-sm mt-2 mb-1">
          {title}
        </p>
      </>
    )}
    {subtitle && (
      <>
        <p className="text-center text-black font-bold text-xs">
          {subtitle}
        </p>
      </>
    )}
  </div>
)


const ProfilePage = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sect, setSect] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isProfileExpanded, setIsProfileExpanded] = useState(false)
  const [lastname, setLastname] = useState('Фамилия')
  const [firstname, setFirstname] = useState('Имя')
  const [patronymic, setPatronymic] = useState('Отчество')
  const [email, setEmail] = useState('email@example.com')
  const [university, setUniversity] = useState('Название ВУЗа')
  const [educationLevel, setEducationLevel] = useState('не указан')
  const [course, setCourse] = useState('не указан')
  const [faculty, setFaculty] = useState('не указан')
  const [educationForm, setEducationForm] = useState('не указан')
  const [phone, setPhone] = useState('+7 (999) 999-99-99')
  const [vkLink, setVkLink] = useState('https://vk.com/username')
  const [birthDate, setBirthDate] = useState('2000-01-01')
  const [gender, setGender] = useState('Мужской')
  const [userRole, setUserRole] = useState('')
  const [coordinator, setCoordinator] = useState('')
  const [districtManager, setDistrictManager] = useState('')
  const [coordinators, setCoordinators] = useState<any[]>([])
  const [seniorMentors, setSeniorMentors] = useState<any[]>([])
  const [mentors, setMentors] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<{[key: string]: any[]}>({})
  const [expandedTeams, setExpandedTeams] = useState<{[key: string]: boolean}>({})
  const [isTeamsEditMode, setIsTeamsEditMode] = useState(false)

  const [tempLastname, setTempLastname] = useState(lastname)
  const [tempFirstname, setTempFirstname] = useState(firstname)
  const [tempPatronymic, setTempPatronymic] = useState(patronymic)
  const [tempEmail, setTempEmail] = useState(email)
  const [tempUniversity, setTempUniversity] = useState(university)
  const [tempEducationLevel, setTempEducationLevel] = useState(educationLevel)
  const [tempCourse, setTempCourse] = useState(course)
  const [tempFaculty, setTempFaculty] = useState(faculty)
  const [tempEducationForm, setTempEducationForm] = useState(educationForm)
  const [tempPhone, setTempPhone] = useState(phone)
  const [tempVkLink, setTempVkLink] = useState(vkLink)
  const [tempBirthDate, setTempBirthDate] = useState(birthDate)
  const [tempGender, setTempGender] = useState(gender)

  const scrollContainerRefmk = useRef<HTMLDivElement>(null);
    const [activeDotmk, setActiveDotmk] = useState(0);
    const scrollContainerRefpr = useRef<HTMLDivElement>(null);
    const [activeDotpr, setActiveDotpr] = useState(0);
    const scrollContainerRefpod = useRef<HTMLDivElement>(null);
    const [activeDotpod, setActiveDotpod] = useState(0);

  
  //   const mk_list = [
  //     // { title: "Первый мастер-класс", subtitle: 'Проблема. Идея. Решение', image: '/images/mkfirst.png', pres: 'https://drive.google.com/file/d/1dJd3mA8eFmKksPX5FQrkTO7XF0mlkOZN/view?usp=drive_link', method: 'https://drive.google.com/file/d/1zvc9hahgqHwJcniHQXK7P4FcoCRE8R2I/view?usp=drive_link', disabled: false },
  //     // { title: "Второй мастер-класс", subtitle: 'Customer development. ЦА.', image: '/images/mksecond.png', pres: 'https://drive.google.com/file/d/1ET9n5nxgyf5KzRSqwBqRIb2v0aWFx84D/view?usp=drive_link', method: 'https://drive.google.com/file/d/1YJcxRITkuCXUAfaxH_XbmFZVISw6FvQV/view?usp=drive_link', disabled: true },
  //     { title: "Первый мастер-класс", subtitle: 'MVP. HADI - циклы.', image: '/images/mkthirdopen.png', pres: 'https://drive.google.com/file/d/1KACuNbGwN4b2DXXe3eXNz9pyIhoRO7Nu/view?usp=drive_link', method: 'https://drive.google.com/file/d/1TwhSS7atv5vVytlbJpkZr5ZQ0p-8QXjK/view?usp=drive_link', disabled: true },
  //     { title: "Второй мастер-класс", subtitle: 'Бизнес - модель. Базовый трек', image: '/images/mkfourthbase.png', pres: 'https://drive.google.com/file/d/15mRrdWcEHA_NtpT0QEaNv_pmSs9UJZAN/view?usp=drive_link', method: 'https://drive.google.com/file/d/18G_39Sqrx9LF39R1lcmusKPl-iH-LlYc/view?usp=drive_link', disabled: true },
  //     { title: "Третий мастер-класс", subtitle: 'Финансы. Базовый трек', image: '/images/mkfifthbase.png', pres: 'https://drive.google.com/file/d/1KZEn8Clb9KC1Lh4dR5GRtiI3YrU7CX_6/view?usp=drive_link', method: 'https://drive.google.com/file/d/11bUS0HCCpJCF8BBnOqdHh8bYnXvLKDBE/view?usp=drive_link', disabled: true },
  //     { title: "Четвертый мастер-класс", subtitle: 'Маркетинг. Базовый трек', image: '/images/mksixthbase.png', pres: 'https://drive.google.com/file/d/1-ICPM2FI3bkJuMimfSe2SUr2w8OPrcOE/view?usp=drive_link', method: 'https://drive.google.com/file/d/1z6bero0MFzAoajn_yn8QuayVtvG2FLHz/view?usp=drive_link', disabled: true },
  //     { title: "Второй мастер-класс", subtitle: 'Бизнес - модель. Социальный трек', image: '/images/mkfourthsoc.png', pres: 'https://drive.google.com/file/d/1kjEMVwHUYcX9UvqyAJizJohVFVeX_R0K/view?usp=drive_link', method: 'https://drive.google.com/file/d/1xYaAB6w8U_p_-TSIv8cN0a0zl6Kid7NH/view?usp=drive_link', disabled: true },
  //     { title: "Третий мастер-класс", subtitle: 'Финансы. Социальный трек', image: '/images/mkfifthsoc.png', pres: 'https://drive.google.com/file/d/1wJeZcuuyTVpy4pOunOH_5Z92d6eaxSMT/view?usp=drive_link', method: 'https://drive.google.com/file/d/1mcU4RSJkvnfJMDKz9wGOGkdx5-m87_pd/view?usp=drive_link', disabled: true },
  //     { title: "Четвертый мастер-класс", subtitle: 'Маркетинг. Социальный трек', image: '/images/mksixthsoc.png', pres: 'https://drive.google.com/file/d/1-bKB_NEDgbMvLkJpAvRq2b-3XDHTxawY/view?usp=drive_link', method: 'https://drive.google.com/file/d/1xlyLJVaxC_loHbwZOUTzaqxf6oSCeiI8/view?usp=drive_link', disabled: true },
  //     { title: "Второй мастер-класс", subtitle: 'Бизнес - модель. Инновационный трек', image: '/images/mkfourthinn.png', pres: 'https://drive.google.com/file/d/1O4tW61bHzY1YWLAqJ6bzGq09-VGUIKy5/view?usp=drive_link', method: 'https://drive.google.com/file/d/1qvYNoSvrr4RtpPGqImgyNgLWbw1VxGAq/view?usp=drive_link', disabled: true },
  //     { title: "Третий мастер-класс", subtitle: 'Финансы. Инновационный трек', image: '/images/mkfifthinn.png', pres: 'https://drive.google.com/file/d/1eEB2WVfku9Wg5x5salXk2Bh7Cc9rUUHv/view?usp=drive_link', method: 'https://drive.google.com/file/d/1MICAFnuaKzXGYfQImAHM-v5plljCqHZJ/view?usp=drive_link', disabled: true },
  //     { title: "Четвертый мастер-класс", subtitle: 'Маркетинг. Инновационный трек', image: '/images/mksixthinn.png', pres: 'https://drive.google.com/file/d/1Q48DKHZL36Rql5eG-7mzT2TfA1bpfuvO/view?usp=drive_link', method: 'https://drive.google.com/file/d/19vrlI9yMKf31pyzoJtFbSZd3RxW5PTNK/view?usp=drive_link', disabled: true },
  // ]
  const mk_list = [
          { title: "Первый мастер-класс", subtitle: 'Проблема. Идея. Решение', image: '/images/mkfirst.png',
            pres: 'https://drive.google.com/file/d/1dJd3mA8eFmKksPX5FQrkTO7XF0mlkOZN/view?usp=drive_link',
            description: 'Всем привет! Вот и пришло время для первого домашнего задания. Сегодня мы попробуем развить предпринимательское мышление через выявление реальных проблем в нашей повседневной жизни, подумаем над их решениями и сгенерируем собственные.',
            disabled: false,
            criteria: '',
            method: 'https://drive.google.com/file/d/10pjlknhA1hVwsJEKngIR_CUw9q0UqWRg/view?usp=drive_link',
            tz: '',
            template: '',
            fulldesc: '' },
          { title: "Второй мастер-класс", subtitle: 'Customer development. ЦА.', image: '/images/mksecond.png',
            pres: 'https://drive.google.com/file/d/1ET9n5nxgyf5KzRSqwBqRIb2v0aWFx84D/view?usp=drive_link',
            description: 'Пришло время учиться анализировать целевую аудиторию и проводить кастдевы. Сегодня вас ждут два увлекательных задания. Погнали!',
            disabled: false,
            criteria: '',
            method: 'https://drive.google.com/file/d/1e-MzVf__ZMZi6aoVI0iR1DobDdUeIirx/view?usp=drive_link',
            tz: '',
            template: '',
            fulldesc: '' },
          { title: "Третий мастер-класс", subtitle: 'MVP. HADI - циклы.', image: '/images/mkthirdopen.png',
            pres: 'https://drive.google.com/file/d/1KACuNbGwN4b2DXXe3eXNz9pyIhoRO7Nu/view?usp=drive_link',
            description: 'После мастер-класса вы сформировали представление о минимально жизнеспособном продукте (MVP), который каждый из вас будет готов представить на финальном воркшопе курса. Сегодня попробуем его визуально представить. Да, так тоже можно!',
            disabled: false,
            criteria: '',
            method: 'https://drive.google.com/file/d/1TwhSS7atv5vVytlbJpkZr5ZQ0p-8QXjK/view?usp=drive_link',
            tz: 'https://drive.google.com/file/d/16YNXVqiC3g4rq9C-XGzoGLNkUTTbkT7a/view?usp=drive_link',
            template: '',
            fulldesc: `Критерии оценки домашнего задания No 3: «MVP, НADI - циклы»
    
    1. Реалистичность MVP
    MVP возможно реализовать до конца курса в таком виде, в каком он сгенерирован на картинке.
    
    2. Качество и конкретность промта
    Промт чётко структурирован, содержит все необходимые параметры (описание проекта, ограничения по времени/ресурсам, требуемый функционал MVP), написан понятным языком.
    
    3. Соответствие MVP сути проекта MVP демонстрирует ключевую ценность проекта, показывает основную функцию или решает главную проблему целевой аудитории.`  },
          { title: "Четвертый мастер-класс", subtitle: 'Бизнес - модель. Базовый трек', image: '/images/mkfourthbase.png',
            pres: 'https://drive.google.com/file/d/15mRrdWcEHA_NtpT0QEaNv_pmSs9UJZAN/view?usp=drive_link',
            description: 'Поздравляем вас с прохождением половины предпринимательского курса! Теперь готовимся к финишной прямой - начинаем усердную подготовку к воркшопу. В этой домашней работе вы изучите идею проекта через призму различных элементов бизнес-модели. Это поможет вам увидеть возможности монетизации с разных сторон и понять, какие варианты заработка лучше всего подходят именно вашему проекту.',
            disabled: true, track: 'Базовый трек',
            criteria: '',
            method: 'https://drive.google.com/file/d/18G_39Sqrx9LF39R1lcmusKPl-iH-LlYc/view?usp=drive_link',
            tz: 'https://drive.google.com/file/d/1OBoQL-0RFGMyeiBA1dcWux3KqoIY3Q3R/view?usp=drive_link',
            template: '',
            fulldesc: `Критерии оценки домашнего задания No 4: «Бизнес -
    модель»
    
    1. Правильность выбора элементов бизнес-модели
    Участник выбрал три разных элемента из списка, приведённого в теории.
    Каждый элемент чётко соответствует понятию бизнес-модели, отсутствуют
    повторения. Элементы классифицированы правильно, с соблюдением
    терминологии.
    
    2. Применимость к проекту
    Каждый элемент подробно описан с чётким объяснением, как он
    функционирует в рамках конкретного проекта. Участник демонстрирует
    глубокое понимание механики монетизации и её связи с проектом.
    
    3. Определение целевой аудитории
    Для каждого бизнес-элемента чётко указана и описана целевая аудитория,
    отличающаяся по характеру для разных элементов. Описание глубокое и
    релевантное.
    
    4. Анализ выгод для проекта
    В каждом элементе описаны конкретные, разнообразные выгоды —
    например, финансовые (доход, прибыль), стратегические
    (масштабируемость), операционные (снижение затрат), маркетинговые ]
    (привлечение клиентов).
    
    5. Понимание ценностного предложения
    В четвёрке каждого элемента раскрыт смысл ценностного предложения:
    почему клиент выбирает этот элемент, какую проблему решает проект,
    какова выгода. Используется или хотя бы отражается формула «помогает...
    решить... благодаря... даёт...».
    
    6. Дополнительный балл за оригинальность и глубину проработки
    Ответ глубоко проработан, оригинален, содержит нестандартные идеи,
    творческий подход к применению элементов.`  },
          { title: "Пятый мастер-класс", subtitle: 'Финансы. Базовый трек', image: '/images/mkfifthbase.png',
            pres: 'https://drive.google.com/file/d/1KZEn8Clb9KC1Lh4dR5GRtiI3YrU7CX_6/view?usp=drive_link',
            description: 'Друзья, пришло время примерить на себя роль настоящих финансовых гениев! Сегодня вы не просто будете считать - вы станете финансовыми детективами, стратегами и магами цифр.',
            disabled: true, track: 'Базовый трек',
            criteria: '',
            method: 'https://drive.google.com/file/d/11bUS0HCCpJCF8BBnOqdHh8bYnXvLKDBE/view?usp=drive_link',
            tz: 'https://drive.google.com/file/d/1gC70ikWO7mt4GmWMfSbW4HaIVAcfQGZ9/view?usp=drive_link',
            template: '',
            fulldesc: `Критерии оценки домашнего задания No 5:
    «Финансы»
    
    Критерии оценки «Unit-экономика»
    
    1. Корректность расчётов и понимание формул
    Участник правильно использует формулы расчёта Unit Contribution и LTV. Все
    значения логически согласованы между собой, отсутствуют арифметические
    ошибки. Чётко видна связь между средним чеком, себестоимостью, CAC и
    итоговыми метриками.
    
    2. Разработка трёх сценариев
    Построены три реалистичных сценария — оптимистичный, реалистичный и
    пессимистичный. Отличия между ними логично объяснены и количественно
    обоснованы (например, через динамику удержания или CAC).
    
    3. Интерпретация показателей и выводы
    Участник не просто приводит цифры, но объясняет, что они означают для
    бизнеса: где «узкое место», в каком сценарии проект становится
    прибыльным, что влияет на устойчивость модели.
    
    4. Сравнение LTV и CAC
    Показано соотношение LTV/CAC, сделаны выводы о целесообразности
    бизнеса. Участник аргументирует, почему показатель выше или ниже
    единицы, и какие управленческие решения можно принять на основе
    данных.
    
    5. Применимость к проекту
    Все данные и гипотезы связаны с конкретным продуктом или идеей. Нет
    «абстрактных» чисел — чувствуется логика реального бизнеса (откуда берутся
    данные, какие каналы привлечения, какая структура цен).
    
    Дополнительный балл за аналитичность и визуализацию
    В таблице или слайде присутствует график/диаграмма, показывающий
    динамику или сравнение сценариев. Отчёт аккуратен, выводы кратки, но
    точны и осмысленны.
    
    Критерии оценки «Себестоимость под микроскопом»
    
    1. Полнота разбора себестоимости
    Себестоимость продукта разложена на отдельные элементы: материалы,
    упаковку, аренду, рекламу, труд и прочие расходы. Указаны конкретные цены
    и источники данных (магазины, прайс-листы, сайты поставщиков).
    
    2. Реалистичность и точность данных
    Все значения основаны на реальных рыночных данных. Расчёты корректны,
    логика формирования итоговой себестоимости понятна. Пропорции между
    статьями затрат соответствуют типу продукта.
    
    3. Сравнение с рыночной ценой
    Выполнено сопоставление итоговой себестоимости с ценами конкурентов
    или средними рыночными значениями. Участник объясняет, за что клиент
    платит и как формируется цена.
    
    4. Анализ издержек и возможностей оптимизации
    Для каждой статьи указаны точки оптимизации: где можно сократить
    расходы, не ухудшая качество, а где экономия нежелательна. Участник
    демонстрирует понимание приоритетов — что важно для ценности продукта.
    
    5. Осмысление ценностного предложения
    В работе объясняется, почему клиент готов платить эту цену — какие
    эмоциональные, функциональные или имиджевые выгоды получает.
    Участник показывает понимание связи между себестоимостью, ценой и
    восприятием продукта.
    
    6. Дополнительный балл за визуализацию и структурность
    Себестоимость представлена в виде схемы (Canva, Miro, таблица). Работа
    оформлена аккуратно, содержит пояснения, цвета или группировки для
    наглядности. Присутствует краткий итог с ключевыми выводами.`  },
          { title: "Шестой мастер-класс", subtitle: 'Маркетинг. Базовый трек', image: '/images/mksixthbase.png',
            pres: 'https://drive.google.com/file/d/1-ICPM2FI3bkJuMimfSe2SUr2w8OPrcOE/view?usp=drive_link',
            description: 'Помните ли вы завирусившуюся рекламу Тантум Верде Форте? А скитлстрянку? Или, быть может, легко можете напеть фразу “Мерси, благодарю тебя...” и даже вспомните её продолжение. Задумывались ли вы когда-то, почему эти фразы так въелись в вашу память? Все дело в качественно построенном маркетинге продукта и его удачной рекламной компании.',
            disabled: true, track: 'Базовый трек',
            criteria: '',
            method: 'https://drive.google.com/file/d/1z6bero0MFzAoajn_yn8QuayVtvG2FLHz/view?usp=drive_link',
            tz: 'https://drive.google.com/file/d/1NdI0WnrllO2GpxIeRIBDflf876xjdDDy/view?usp=drive_link',
            template: '',
            fulldesc: `Критерии оценки домашнего задания No 6: «Маркетинг»
    
    Задание 1: Анализ маркетингового кейса
    
    1. Глубина анализа проблемы
    Участники демонстрируют глубокий анализ:
    — Выявляют все ключевые психологические триггеры (социальное
    доказательство, FOMO, принадлежность к сообществу, игровой элемент)
    — Объясняют, почему именно эти триггеры сработали именно с молодежью
    — Приводят конкретные примеры из кейса, подтверждающие анализ
    — Ссылаются на теории маркетинга или поведения потребителей
    
    2. Понимание механики вирусности рекламы
    — Четко описано, в какой момент зритель становится участником
    — Названы все условия, необходимые для вирусности (простота
    воспроизведения, эмоциональность, социальная ценность контента,
    возможность адаптации)
    — Объяснено, почему другим брендам выгодно было поддержать кампанию
    
    3. Анализ рисков
    — Выявлены несколько серьезных рисков (потеря контроля над нарративом,
    критика, черный пиар, негативные коннотации, непредсказуемость толпы и
    т.д.)
    — Для каждого риска объяснено, как его можно было минимизировать
    
    4. Адаптация под собственный продукт
    — Выбран конкретный продукт и четко описана его суть
    Аналог билборда оригинален и уместен для продукта
    — Выбранный психологический механизм релевантен и хорошо объяснен
    — Персонажи (имена, характеристики) продуманы и логичны для целевой
    аудитории
    
    5. Измеримость результатов
    — Названо минимум 5 конкретных метрик (установки приложения, показы в
    соцсетях, CTR, конверсия, упоминания бренда, engagement и т.д.)
    — Четко определена самая важная метрика и объяснено почему
    — Описаны KPI для остановки кампании (например, падение engagement
    ниже 5% или отрицательный sentiment)
    
    Задание 2: Создание рекламного ролика для собственного продукта (дополнительное)
    
    1. Глубина раскрытия сути проекта.
    Смотря рекламу можно без проблем понять, о чем и для кого создан
    продукт/услуга.
    
    2. Способность увлечь.
    Реклама запоминается, завлекает внимание зрителя с первых секунд.
    
    3. Креативность и оригинальность идеи.
    Поддерживается творческий и нестандартный подход.`  },
          { title: "Четвертый мастер-класс", subtitle: 'Бизнес - модель. Социальный трек', image: '/images/mkfourthsoc.png',
            pres: 'https://drive.google.com/file/d/1kjEMVwHUYcX9UvqyAJizJohVFVeX_R0K/view?usp=drive_link',
            description: 'Поздравляем вас с прохождением половины предпринимательского курса! Теперь готовимся к финишной прямой - начинаем усердную подготовку к воркшопу. В этой домашней работе вы изучите идею проекта через призму различных элементов бизнес-модели. Это поможет вам увидеть возможности монетизации с разных сторон и понять, какие варианты заработка лучше всего подходят именно вашему проекту.',
            disabled: true, track: 'Социальный трек',
            criteria: '',
            method: 'https://drive.google.com/file/d/1xYaAB6w8U_p_-TSIv8cN0a0zl6Kid7NH/view?usp=drive_link',
            tz: 'https://drive.google.com/file/d/1sH-5hekaOJifBTJh7i3hHJTtDhsK0N7w/view?usp=drive_link',
            template: '', fulldesc: ''  },
          { title: "Пятый мастер-класс", subtitle: 'Финансы. Социальный трек', image: '/images/mkfifthsoc.png',
            pres: 'https://drive.google.com/file/d/1wJeZcuuyTVpy4pOunOH_5Z92d6eaxSMT/view?usp=drive_link',
            description: 'Друзья, пришло время примерить на себя роль настоящих финансовых гениев! Сегодня вы не просто будете считать - вы станете финансовыми детективами, стратегами и магами цифр.',
            disabled: true, track: 'Социальный трек',
            criteria: '',
            method: 'https://drive.google.com/file/d/1mcU4RSJkvnfJMDKz9wGOGkdx5-m87_pd/view?usp=drive_link',
            tz: 'https://drive.google.com/file/d/18l90yVyIsOemFnkyQcFAh3pxyZzS0pLG/view?usp=drive_link',
            template: '', fulldesc: ''  },
          { title: "Шестой мастер-класс", subtitle: 'Маркетинг. Социальный трек', image: '/images/mksixthsoc.png',
            pres: 'https://drive.google.com/file/d/1-bKB_NEDgbMvLkJpAvRq2b-3XDHTxawY/view?usp=drive_link',
            description: 'Помните ли вы завирусившуюся рекламу Тантум Верде Форте? А скитлстрянку? Или, быть может, легко можете напеть фразу “Мерси, благодарю тебя...” и даже вспомните её продолжение. Задумывались ли вы когда-то, почему эти фразы так въелись в вашу память? Все дело в качественно построенном маркетинге продукта и его удачной рекламной компании.',
            disabled: true, track: 'Социальный трек',
            criteria: '',
            method: 'https://drive.google.com/file/d/1xlyLJVaxC_loHbwZOUTzaqxf6oSCeiI8/view?usp=drive_link',
            tz: 'https://drive.google.com/file/d/1YRlVOwsQHohX7QqdbF2d2SIEiFJNhPWc/view?usp=drive_link',
            template: '', fulldesc: ''  },
          { title: "Четвертый мастер-класс", subtitle: 'Бизнес - модель. Инновационный трек', image: '/images/mkfourthinn.png',
            pres: 'https://drive.google.com/file/d/1O4tW61bHzY1YWLAqJ6bzGq09-VGUIKy5/view?usp=drive_link',
            description: 'Поздравляем вас с прохождением половины предпринимательского курса! Теперь готовимся к финишной прямой - начинаем усердную подготовку к воркшопу. В этой домашней работе вы изучите идею проекта через призму различных элементов бизнес-модели. Это поможет вам увидеть возможности монетизации с разных сторон и понять, какие варианты заработка лучше всего подходят именно вашему проекту.',
            disabled: true, track: 'Инновационный трек',
            criteria: '',
            method: 'https://drive.google.com/file/d/1qvYNoSvrr4RtpPGqImgyNgLWbw1VxGAq/view?usp=drive_link',
            tz: 'https://drive.google.com/file/d/12YITLqF4tidK-OWnO1C8W7XbfkYRhsqq/view?usp=drive_link',
            template: '', fulldesc: ''  },
          { title: "Пятый мастер-класс", subtitle: 'Финансы. Инновационный трек', image: '/images/mkfifthinn.png',
            pres: 'https://drive.google.com/file/d/1eEB2WVfku9Wg5x5salXk2Bh7Cc9rUUHv/view?usp=drive_link',
            description: 'Друзья, пришло время примерить на себя роль настоящих финансовых гениев! Сегодня вы не просто будете считать - вы станете финансовыми детективами, стратегами и магами цифр.',
            disabled: true, track: 'Инновационный трек',
            criteria: '',
            method: 'https://drive.google.com/file/d/1MICAFnuaKzXGYfQImAHM-v5plljCqHZJ/view?usp=drive_link',
            tz: 'https://drive.google.com/file/d/19QSMPcsMBtjyJdLJon0YfzNgHhn50mX9/view?usp=drive_link',
            template: '', fulldesc: ''  },
          { title: "Шестой мастер-класс", subtitle: 'Маркетинг. Инновационный трек', image: '/images/mksixthinn.png',
            pres: 'https://drive.google.com/file/d/1Q48DKHZL36Rql5eG-7mzT2TfA1bpfuvO/view?usp=drive_link',
            description: 'Помните ли вы завирусившуюся рекламу Тантум Верде Форте? А скитлстрянку? Или, быть может, легко можете напеть фразу “Мерси, благодарю тебя...” и даже вспомните её продолжение. Задумывались ли вы когда-то, почему эти фразы так въелись в вашу память? Все дело в качественно построенном маркетинге продукта и его удачной рекламной компании.',
            disabled: true, track: 'Инновационный трек',
            criteria: '',
            method: 'https://drive.google.com/file/d/19vrlI9yMKf31pyzoJtFbSZd3RxW5PTNK/view?usp=drive_link',
            tz: 'https://drive.google.com/file/d/1gULz1yHW8kMc1vYekqmFMbwcj2g3OAM8/view?usp=drive_link',
            template: '', fulldesc: ''  },
      ]

  const project_list = [
      { title: "NutriCheck", subtitle: 'Социальный трек', image: '/images/nutricheck.png' },
      { title: "Модуль", subtitle: 'Базовый трек', image: '/images/module.png' },
      { title: "ПроОбраз-21", subtitle: 'Социальный трек', image: '/images/proobraz.png' },
      { title: "PyramidPack", subtitle: 'Базовый трек', image: '/images/pyramidpack.png' },
      { title: "Fillfood", subtitle: 'Социальный трек', image: '/images/fillfood.png' },
      { title: "FUN", subtitle: 'Базовый трек', image: '/images/fun.png' },
      { title: "Бионический протез пальца", subtitle: 'Инновационный трек', image: '/images/palets.png' },
  ]

  const podcast_list = [
      { title: "С психологом", image: '/images/podcast_psy.png', link: 'https://vkvideo.ru/video-210144042_456239649?pl=-210144042_2&t=3s'},
      { title: "Про путешествия", image: '/images/podcast_travel.png', link: 'https://vkvideo.ru/video-210144042_456239626?pl=-210144042_2' },
      { title: "Про личный бренд", image: '/images/podcast_brand.png', link: 'https://vkvideo.ru/video-210144042_456239623?pl=-210144042_2' },
      { title: "Про креативность", image: '/images/podcast_create.png', link: 'https://vkvideo.ru/video-210144042_456239575?pl=-210144042_2' },
      { title: "Про страхи и рост", image: '/images/podcast_fear.png', link: 'https://vkvideo.ru/video-210144042_456239501?pl=-210144042_2' },
  ]

const extractFileId = (url: string) => {
  if (!url) return '';
  const match = url.match(/\/file\/d\/([^\/]+)/);
  return match && match[1] ? match[1] : url;
};

// Функция для создания ссылки скачивания
const getDownloadLink = (url: string) => {
  const fileId = extractFileId(url);
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

  const handleScrollmk = useCallback(() => {
    const container = scrollContainerRefmk.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const cardWidth = 205; // w-[120px]
    const gap = 12; // space-x-3 = 12px
    
    // Вычисляем индекс активной карточки
    const scrollPosition = scrollLeft + containerWidth / 2;
    const activeIndex = Math.floor(scrollPosition / (cardWidth + gap));
    
    setActiveDotmk(Math.min(activeIndex, mk_list.length - 1));
  }, [mk_list.length]);

  // Функция для скролла к определенной точке
  const scrollToDotmk = (index: number) => {
    const container = scrollContainerRefmk.current;
    if (!container) return;

    const cardWidth = 205; // w-[205px]
    const gap = 12; // space-x-3 = 12px
    const scrollPosition = index * (cardWidth + gap);
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  const handleScrollpr = useCallback(() => {
      const container = scrollContainerRefpr.current;
      if (!container) return;
  
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const cardWidth = 205; // w-[120px]
      const gap = 12; // space-x-3 = 12px
      
      // Вычисляем индекс активной карточки
      const scrollPosition = scrollLeft + containerWidth / 2;
      const activeIndex = Math.floor(scrollPosition / (cardWidth + gap));
      
      setActiveDotpr(Math.min(activeIndex, project_list.length - 1));
    }, [project_list.length]);
  
    // Функция для скролла к определенной точке
    const scrollToDotpr = (index: number) => {
      const container = scrollContainerRefpr.current;
      if (!container) return;
  
      const cardWidth = 205; // w-[200px]
      const gap = 12; // space-x-3 = 12px
      const scrollPosition = index * (cardWidth + gap);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    };

    const handleScrollpod = useCallback(() => {
      const container = scrollContainerRefpod.current;
      if (!container) return;
  
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const cardWidth = 205; // w-[120px]
      const gap = 12; // space-x-3 = 12px
      
      // Вычисляем индекс активной карточки
      const scrollPosition = scrollLeft + containerWidth / 2;
      const activeIndex = Math.floor(scrollPosition / (cardWidth + gap));
      
      setActiveDotpod(Math.min(activeIndex, podcast_list.length - 1));
    }, [podcast_list.length]);
  
    // Функция для скролла к определенной точке
    const scrollToDotpod = (index: number) => {
      const container = scrollContainerRefpod.current;
      if (!container) return;
  
      const cardWidth = 205; // w-[200px]
      const gap = 12; // space-x-3 = 12px
      const scrollPosition = index * (cardWidth + gap);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Загрузка данных только из таблицы structure
  useEffect(() => {
    const loadStructureProfile = async () => {
      try {
        // Проверяем ctid в localStorage
        const savedCtid = localStorage.getItem('structure_ctid')
        if (!savedCtid) {
          // Если нет ctid, перенаправляем на авторизацию
          navigate('/auth')
          return
        }
        
        let item: any | undefined
        const r = await structureApi.getByCtid(savedCtid)
        item = r?.data
        
        if (!item) {
          // Если запись не найдена, очищаем localStorage и перенаправляем
          localStorage.removeItem('structure_ctid')
          navigate('/auth')
          return
        }

        setLastname(item.last_name || 'не указан');
        setFirstname(item.first_name || 'не указан');
        setPatronymic(item.patronymic || 'не указан');
        setEmail(item.username || 'не указан');
        setUniversity(item.education || 'не указан');
        setEducationLevel(item.level || 'не указан')
        setCourse(item.grade || 'не указан');
        setFaculty(item.faculty || 'не указан')
        setEducationForm(item.format || 'не указан')
        setPhone(item.phone || 'не указан');
        setVkLink(item.vk_link || 'не указан');
        setBirthDate(item.birth_date ? item.birth_date.substring(0,10) : '');
        setGender(item.gender === 'F' ? 'Женский' : item.gender === 'M' ? 'Мужской' : (item.gender || 'не указан'));
        setUserRole(item.pos || '');
        setCoordinator(item.coord || 'не указан');
        setDistrictManager(item.ro || 'не указан');
        
        // Загружаем списки после получения роли
        // Для руководителя округа используем полное ФИО (с отчеством, если есть)
        const currentUserFullName = item.pos === 'руководитель округа' 
          ? `${item.last_name || ''} ${item.first_name || ''} ${item.patronymic || ''}`.trim().replace(/\s+/g, ' ')
          : `${item.last_name || ''} ${item.first_name || ''}`.trim()
        const subordinates = await loadRoleLists(item.pos || '', currentUserFullName);
        
        // Загружаем команды пользователя и подчиненных после загрузки списков
        // Используем то же ФИО, что и для загрузки списков
        await loadUserTeams(currentUserFullName, item.pos || '', subordinates);
      } catch (e) {
        // При ошибке загрузки перенаправляем на авторизацию
        localStorage.removeItem('structure_ctid')
        navigate('/auth')
      }
    };
    loadStructureProfile();
  }, [navigate]);

  // Синхронизируем временные значения с исходными, когда данные загружаются (только если не в режиме редактирования)
  useEffect(() => {
    if (!isEditing) {
      // Обрабатываем "не указан" как пустую строку для редактирования
      setTempLastname(lastname === 'не указан' ? '' : (lastname || ''))
      setTempFirstname(firstname === 'не указан' ? '' : (firstname || ''))
      setTempPatronymic(patronymic === 'не указан' ? '' : (patronymic || ''))
      setTempEmail(email === 'не указан' ? '' : (email || ''))
      setTempUniversity(university === 'не указан' ? '' : (university || ''))
      setTempEducationLevel(educationLevel === 'не указан' ? '' : (educationLevel || ''))
      setTempCourse(course === 'не указан' ? '' : (course || ''))
      setTempFaculty(faculty === 'не указан' ? '' : (faculty || ''))
      setTempEducationForm(educationForm === 'не указан' ? '' : (educationForm || ''))
      setTempPhone(phone === 'не указан' ? '' : (phone || ''))
      setTempVkLink(vkLink === 'не указан' ? '' : (vkLink || ''))
      setTempBirthDate(birthDate || '')
      setTempGender(gender === 'не указан' ? '' : (gender || ''))
    }
  }, [lastname, firstname, patronymic, email, university, educationLevel, course, faculty, educationForm, phone, vkLink, birthDate, gender, isEditing])

  // Функция для загрузки списков в зависимости от роли и привязки по ФИО
  const loadRoleLists = async (role: string, currentUserFullName: string) => {
    try {
      const allStructure = await structureApi.getAll()
      const allPeople = allStructure?.data || []
      
      // Нормализация ФИО к нижнему регистру без лишних пробелов
      const normalizeName = (fullName: string) => fullName.trim().toLowerCase().replace(/\s+/g, ' ')

      // Проверка совпадения по имени и фамилии в любом порядке ("Фамилия Имя" или "Имя Фамилия")
      const isSameFirstLast = (a: string, b: string) => {
        const aParts = normalizeName(a).split(' ')
        const bParts = normalizeName(b).split(' ')
        if (aParts.length < 2 || bParts.length < 2) return false
        const [a1, a2] = [aParts[0], aParts[1]]
        const [b1, b2] = [bParts[0], bParts[1]]
        return (a1 === b1 && a2 === b2) || (a1 === b2 && a2 === b1)
      }

      // Проверка: строковое поле карточки человека (high_mentor/coord/ro) относится к текущему пользователю
      const fieldMatchesUser = (fieldValue?: string) => {
        if (!fieldValue) return false
        // Нормализуем оба значения для сравнения
        const normalizedField = normalizeName(fieldValue)
        const normalizedUser = normalizeName(currentUserFullName)
        // Проверяем точное совпадение или совпадение по фамилии и имени
        return normalizedField === normalizedUser || isSameFirstLast(fieldValue, currentUserFullName)
      }
      
      let coordPeople: any[] = []
      let seniorMentorPeople: any[] = []
      let mentorPeople: any[] = []
      
      // Загружаем списки в зависимости от роли
      if (role === 'руководитель округа') {
        // РО видит координаторов, у которых поле ro соответствует ФИО текущего пользователя
        coordPeople = allPeople.filter(person => person.pos === 'координатор' && fieldMatchesUser(person.ro))
        setCoordinators(coordPeople)
        
        // РО видит старших наставников своего округа (по полю ro)
        seniorMentorPeople = allPeople.filter(person => person.pos === 'старший наставник' && fieldMatchesUser(person.ro))
        setSeniorMentors(seniorMentorPeople)
        
        // РО видит наставников своего округа (по полю ro)
        mentorPeople = allPeople.filter(person => person.pos === 'наставник' && fieldMatchesUser(person.ro))
        setMentors(mentorPeople)
      } else if (role === 'координатор') {
        // Координатор видит старших наставников своего кураторства (по полю coord)
        seniorMentorPeople = allPeople.filter(person => person.pos === 'старший наставник' && fieldMatchesUser(person.coord))
        setSeniorMentors(seniorMentorPeople)
        
        // Координатор видит наставников, которые прикреплены к нему (по полю coord)
        mentorPeople = allPeople.filter(person => person.pos === 'наставник' && fieldMatchesUser(person.coord))
        setMentors(mentorPeople)
        
        setCoordinators([]) // Координаторы не видят других координаторов
      } else if (role === 'старший наставник') {
        // Старший наставник видит наставников своей группы (по полю high_mentor)
        mentorPeople = allPeople.filter(person => person.pos === 'наставник' && fieldMatchesUser(person.high_mentor))
        setMentors(mentorPeople)
        
        setCoordinators([])
        setSeniorMentors([])
      } else {
        // Наставник и другие роли не видят списков
        setCoordinators([])
        setSeniorMentors([])
        setMentors([])
      }
      
      return {
        coordinators: coordPeople,
        seniorMentors: seniorMentorPeople,
        mentors: mentorPeople
      }
    } catch (e) {
      return {
        coordinators: [],
        seniorMentors: [],
        mentors: []
      }
    }
  }

  // Функция для загрузки команд пользователя и подчиненных
  const loadUserTeams = async (userFullName: string, userRole: string, subordinates?: {coordinators: any[], seniorMentors: any[], mentors: any[]}) => {
    try {
      if (!userFullName || userFullName === 'не указан') return
      
      let allTeams: any[] = []
      
      // Получаем команды где пользователь является наставником
      const userTeamsResult = await teamsApi.getByMentor(userFullName)
      const userTeams = userTeamsResult?.data || []
      allTeams = [...userTeams]
      
      // Для РО и координаторов - получаем команды от подчиненных
      if ((userRole === 'руководитель округа' || userRole === 'координатор') && subordinates) {
        // Для РО также получаем команды от координаторов
        if (userRole === 'руководитель округа' && subordinates.coordinators) {
          for (const coordinator of subordinates.coordinators) {
            const coordinatorName = `${coordinator.last_name || ''} ${coordinator.first_name || ''}`.trim()
            if (coordinatorName && coordinatorName !== 'не указан') {
              try {
                const coordinatorTeamsResult = await teamsApi.getByMentor(coordinatorName)
                const coordinatorTeams = coordinatorTeamsResult?.data || []
                allTeams = [...allTeams, ...coordinatorTeams]
              } catch (e) {
              }
            }
          }
        }
        
        // Получаем команды от старших наставников
        for (const seniorMentor of subordinates.seniorMentors) {
          const seniorMentorName = `${seniorMentor.last_name || ''} ${seniorMentor.first_name || ''}`.trim()
          if (seniorMentorName && seniorMentorName !== 'не указан') {
            try {
              const seniorTeamsResult = await teamsApi.getByMentor(seniorMentorName)
              const seniorTeams = seniorTeamsResult?.data || []
              allTeams = [...allTeams, ...seniorTeams]
            } catch (e) {
            }
          }
        }
        
        // Получаем команды от наставников
        for (const mentor of subordinates.mentors) {
          const mentorName = `${mentor.last_name || ''} ${mentor.first_name || ''}`.trim()
          if (mentorName && mentorName !== 'не указан') {
            try {
              const mentorTeamsResult = await teamsApi.getByMentor(mentorName)
              const mentorTeams = mentorTeamsResult?.data || []
              allTeams = [...allTeams, ...mentorTeams]
            } catch (e) {
            }
          }
        }
      }
      
      // Удаляем дубликаты команд по коду
      const uniqueTeams = allTeams.filter((team, index, self) => 
        index === self.findIndex(t => t.code === team.code)
      )
      
      setTeams(uniqueTeams)
      
      // Загружаем участников для каждой команды
      const membersData: {[key: string]: any[]} = {}
      for (const team of uniqueTeams) {
        if (team.code) {
          try {
            const membersResult = await teamMembersApi.getByTeamCode(team.code)
            membersData[team.code] = membersResult?.data || []
          } catch (e) {
            membersData[team.code] = []
          }
        }
      }
      setTeamMembers(membersData)
    } catch (e) {
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const pageSelected = (page: string) => {
    setSect(page)
    setIsMenuOpen(!isMenuOpen)
  }

  // Функция для переключения раскрытия команды
  const toggleTeamExpansion = (teamCode: string) => {
    setExpandedTeams(prev => ({
      ...prev,
      [teamCode]: !prev[teamCode]
    }))
  }

  // Функция для подсчета общего количества участников
  const getTotalParticipantsCount = () => {
    let totalCount = 0
    Object.values(teamMembers).forEach(members => {
      totalCount += members.length
    })
    return totalCount
  }
  const [selectedMk, setSelectedMk] = useState<Mk | null>(null);
  
  // Состояния для статусов мастер-классов
  const [structureTeamsForMk, setStructureTeamsForMk] = useState<any[]>([]);
  const [teamsHomeworksForMk, setTeamsHomeworksForMk] = useState<{[teamCode: string]: Homework[]}>({});

  const handleMkClick = async (mk: Mk) => {
    setSelectedMk(mk);
    
    // Загружаем команды и их статусы для структуры только для мастер-классов с д/з
    // (у которых есть tz или fulldesc)
    if (!mk.tz && !mk.fulldesc) {
      setStructureTeamsForMk([]);
      setTeamsHomeworksForMk({});
      return;
    }
    
    const structureCtid = localStorage.getItem('structure_ctid');
    
    if (structureCtid) {
      try {
        const resp = await structureApi.getByCtid(structureCtid);
        const structure = resp?.data;
        
        if (structure) {
          const fullName = `${structure.last_name || ''} ${structure.first_name || ''}`.trim();
          let teams: any[] = [];
          
          if (structure.pos === 'наставник' || structure.pos === 'старший наставник' || structure.pos === 'координатор' || structure.pos === 'руководитель округа') {
            // Получаем команды наставника
            const userTeamsResult = await teamsApi.getByMentor(fullName);
            const userTeams = userTeamsResult?.data || [];
            teams = [...userTeams];
            
            // Для координаторов и РО - получаем команды подчиненных
            if ((structure.pos === 'координатор' || structure.pos === 'руководитель округа')) {
              const allStructure = await structureApi.getAll();
              const allPeople = allStructure?.data || [];
              
              if (structure.pos === 'руководитель округа') {
                const mentorPeople = allPeople.filter(person => 
                  person.pos === 'наставник' && person.ro === structure.ro
                );
                for (const mentor of mentorPeople) {
                  const mentorName = `${mentor.last_name || ''} ${mentor.first_name || ''}`.trim();
                  if (mentorName) {
                    try {
                      const mentorTeamsResult = await teamsApi.getByMentor(mentorName);
                      const mentorTeams = mentorTeamsResult?.data || [];
                      teams = [...teams, ...mentorTeams];
                    } catch (e) {
;
                    }
                  }
                }
              } else if (structure.pos === 'координатор') {
                const mentorPeople = allPeople.filter(person => 
                  person.pos === 'наставник' && person.coord === fullName
                );
                for (const mentor of mentorPeople) {
                  const mentorName = `${mentor.last_name || ''} ${mentor.first_name || ''}`.trim();
                  if (mentorName) {
                    try {
                      const mentorTeamsResult = await teamsApi.getByMentor(mentorName);
                      const mentorTeams = mentorTeamsResult?.data || [];
                      teams = [...teams, ...mentorTeams];
                    } catch (e) {
;
                    }
                  }
                }
              }
            } else if (structure.pos === 'старший наставник') {
              const allStructure = await structureApi.getAll();
              const allPeople = allStructure?.data || [];
              const mentorPeople = allPeople.filter(person => 
                person.pos === 'наставник' && person.high_mentor === fullName
              );
              for (const mentor of mentorPeople) {
                const mentorName = `${mentor.last_name || ''} ${mentor.first_name || ''}`.trim();
                if (mentorName) {
                  try {
                    const mentorTeamsResult = await teamsApi.getByMentor(mentorName);
                    const mentorTeams = mentorTeamsResult?.data || [];
                    teams = [...teams, ...mentorTeams];
                  } catch (e) {
;
                  }
                }
              }
            }
            
            // Удаляем дубликаты
            const uniqueTeams = teams.filter((team, index, self) => 
              index === self.findIndex(t => t.code === team.code)
            );
            
            setStructureTeamsForMk(uniqueTeams);
            
            // Загружаем домашние задания для всех команд
            const homeworksMap: {[teamCode: string]: Homework[]} = {};
            
            for (const team of uniqueTeams) {
              if (team.code) {
                try {
                  const homeworksResult = await homeworksApi.getByTeamCode(team.code);
                  if (homeworksResult?.success && homeworksResult.data) {
                    homeworksMap[team.code] = homeworksResult.data;
                  }
                } catch (e) {
                }
              }
            }
            setTeamsHomeworksForMk(homeworksMap);
          }
        }
      } catch (error) {
      }
    }
  };

  const handleBackToMks = () => {
    setSelectedMk(null);
    setStructureTeamsForMk([]);
    setTeamsHomeworksForMk({});
  };

  const handleEditProfile = () => {
    // Инициализируем все временные значения исходными данными
    // Обрабатываем "не указан" как пустую строку для редактирования
    setTempLastname(lastname === 'не указан' ? '' : (lastname || ''))
    setTempFirstname(firstname === 'не указан' ? '' : (firstname || ''))
    setTempPatronymic(patronymic === 'не указан' ? '' : (patronymic || ''))
    setTempEmail(email === 'не указан' ? '' : (email || ''))
    setTempUniversity(university === 'не указан' ? '' : (university || ''))
    setTempEducationLevel(educationLevel === 'не указан' ? '' : (educationLevel || ''))
    setTempCourse(course === 'не указан' ? '' : (course || ''))
    setTempFaculty(faculty === 'не указан' ? '' : (faculty || ''))
    setTempEducationForm(educationForm === 'не указан' ? '' : (educationForm || ''))
    setTempPhone(phone === 'не указан' ? '' : (phone || ''))
    setTempVkLink(vkLink === 'не указан' ? '' : (vkLink || ''))
    setTempBirthDate(birthDate || '')
    setTempGender(gender === 'не указан' ? '' : (gender || ''))
    setIsEditing(true)
    setIsProfileExpanded(true)
  }

  const handleSaveProfile = () => {
    setLastname(tempLastname)
    setFirstname(tempFirstname)
    setPatronymic(tempPatronymic)
    setEmail(tempEmail)
    setUniversity(tempUniversity)
    setEducationLevel(tempEducationLevel)
    setCourse(tempCourse)
    setFaculty(tempFaculty)
    setEducationForm(tempEducationForm)
    setPhone(tempPhone)
    setVkLink(tempVkLink)
    setBirthDate(tempBirthDate)
    setGender(tempGender)
    setIsEditing(false)

    // Сохраняем в БД (structure)
    const save = async () => {
      try {
        const savedCtid = localStorage.getItem('structure_ctid')
        if (!savedCtid) return
        const result = await structureApi.updateByCtid(savedCtid, {
          last_name: tempLastname,
          first_name: tempFirstname,
          patronymic: tempPatronymic,
          username: tempEmail,
          education: tempUniversity,
          level: tempEducationLevel,
          grade: tempCourse,
          faculty: tempFaculty,
          format: tempEducationForm,
          phone: tempPhone,
          vk_link: tempVkLink,
          birth_date: tempBirthDate,
          gender: tempGender === 'Женский' ? 'F' : tempGender === 'Мужской' ? 'M' : tempGender,
        })
        
        // Обновляем ctid в localStorage если он изменился
        if (result?.data?.ctid && result.data.ctid !== savedCtid) {
          localStorage.setItem('structure_ctid', result.data.ctid)
        }
      } catch (e) {
      }
    }
    void save()
  }

  const handleCancelEdit = () => {
    // Сбрасываем все временные значения к исходным
    setTempLastname(lastname || '')
    setTempFirstname(firstname || '')
    setTempPatronymic(patronymic || '')
    setTempEmail(email || '')
    setTempUniversity(university || '')
    setTempEducationLevel(educationLevel || '')
    setTempCourse(course || '')
    setTempFaculty(faculty || '')
    setTempEducationForm(educationForm || '')
    setTempPhone(phone || '')
    setTempVkLink(vkLink || '')
    setTempBirthDate(birthDate || '')
    setTempGender(gender || '')
    setIsEditing(false)
  }

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <section className="card p-0 overflow-hidden relative">
      
      <div className={`
        fixed top-0 right-0 h-full z-50
        transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        ${isMobile ? 'w-full' : 'w-[400px]'}
        bg-brand shadow-2xl 
      ` }>
        <div className="flex items-center justify-end p-6 pr-12">
          <button onClick={closeMenu} className="pr-4">
            <img src="/images/close.png" alt="close" className="w-6" />
          </button>
        </div>
        <div style={{ backgroundColor: 'white'}} className="h-px w-auto" />

        <nav className="p-6 pb-0">
          <ul className="space-y-2 flex flex-col items-center">
            <li>
              <button onClick={() => {pageSelected('profile')}} className={`flex items-center text-center space-x-4 p-2 text-xl text-white ${sect === 'profile' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Личный кабинет</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('calendar')}} className={`flex items-center space-x-4 p-2 text-xl text-white ${sect === 'calendar' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Календарь программы</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('materials')}} className={`flex items-center space-x-4 p-2 text-xl text-white ${sect === 'materials' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Материалы курса</span>
              </button>
            </li>
            {/* <li>
              <button onClick={() => {pageSelected('reporting')}} className={`flex items-center space-x-4 p-2 text-xl text-white ${sect === 'reporting' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Отчетность</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('handy')}} className={`flex items-center space-x-4 p-2 text-xl text-white ${sect === 'handy' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Хэндик</span>
              </button>
            </li> */}
          </ul>
        </nav>
        <div className='flex justify-center items-center flex-col'>
          <img src='images/logowhite.png' alt='logo' className='mt-10 w-80 z-0'/>
          <button onClick={() => {navigate('/')}} className='text-white font-semibold text-sm absolute bottom-6'>Выйти из аккаунта</button>
        </div>
      </div>

      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={closeMenu}
        />
      )}

      <div className="relative z-10">
        <header className="flex flex-col">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-2">
              <div aria-hidden>
                <img src="/images/location.png" alt="локация" className="w-4" />
              </div>
              <span className="text-sm font-semibold text-brand text-[16px]">Москва</span>
            </div>
            <div className="flex items-center space-x-4 px-2">
              <div aria-hidden>
                <button onClick={toggleMenu}>
                  <img 
                    src={isMenuOpen ? "/images/close.png" : "/images/menu.png"} 
                    alt={isMenuOpen ? "close" : "menu"} 
                    className="w-9"
                  />
                </button>
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto" />
        </header>
      </div>

      <div className="px-4 pb-0">
        {sect==='profile' && (
          <div className="lg:flex lg:gap-6">
            {/* Левая колонка - профиль и команды */}
            <div className="lg:flex-1">
              <div className='baseinfo flex flex-col justify-center items-start mt-4'>
                <div className='flex flex-col lg:flex-row lg:items-start lg:gap-6 w-full'>
                  {/* Аватар */}
                  <div className='flex flex-row py-4 relative lg:flex-col lg:items-start'>
                    <img src='images/logomember.png' className=' rounded-lg w-44 aspect-square'></img>
                    <img src='images/heading-icon.png' alt='logo' className='absolute w-48 right-5 lg:-right-0 lg:top-40'/>
                  </div>
                  
                  {/* Основные поля (ФИО и остальная информация) */}
                  <div className='lg:flex-1 lg:w-full'>
                    {/* Для мобильных устройств - обычное поведение */}
                    <div className='lg:hidden'>
                      {/* Режим 1: Только фамилия и имя + стрелка + кнопка редактировать */}
                      {!isProfileExpanded && !isEditing && (
                        <div className='w-full text-xs'>
                          <div className='mb-2 text-left'>
                            <p><strong>Фамилия</strong></p>
                            <input value={lastname} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='mb-4 text-left'>
                            <p><strong>Имя</strong></p>
                            <input value={firstname} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          
                          <div className='w-full flex flex-col items-center'>
                            <button onClick={() => setIsProfileExpanded(true)}>
                              <img 
                                src='images/arrow.png' 
                                alt='arrow' 
                                className='w-6 mt-2'
                              />
                            </button>
                            <button className='text-brand mt-2 hover:underline' onClick={handleEditProfile}>
                              Редактировать профиль
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Режим 2: Все поля (просмотр) + стрелка назад + кнопка редактировать */}
                      {isProfileExpanded && !isEditing && (
                        <div className='w-full text-xs'>
                          <div className='mb-2'>
                            <p><strong>Фамилия</strong></p>
                            <input value={lastname} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='mb-2'>
                            <p><strong>Имя</strong></p>
                            <input value={firstname} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='mb-2'>
                            <p><strong>Отчество</strong></p>
                            <input value={patronymic} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='mb-2'>
                            <p><strong>Электронная почта</strong></p>
                            <input value={email} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='mb-2'>
                            <p><strong>ВУЗ</strong></p>
                            <input value={university} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='flex flex-row gap-2 mb-2'>
                            <div className='flex-1'>
                              <p><strong>Уровень подготовки</strong></p>
                              <input value={educationLevel} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Курс обучения</strong></p>
                              <input value={course} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                          </div>
                          <div className='flex flex-row gap-2 mb-2'>
                            <div className='flex-1'>
                              <p><strong>Факультет</strong></p>
                              <input value={faculty} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Форма обучения</strong></p>
                              <input value={educationForm} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                          </div>
                          <div className='mb-2'>
                            <p><strong>Номер телефона</strong></p>
                            <input value={phone} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='mb-2'>
                            <p><strong>Ссылка на ВКонтакте</strong></p>
                            <input value={vkLink} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='flex flex-row gap-2 mb-2'>
                            <div className='flex-1'>
                              <p><strong>Дата рождения</strong></p>
                              <input value={birthDate} type='date' readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Пол</strong></p>
                              <input value={gender} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                          </div>
                          
                          <div className='w-full flex flex-col items-center'>
                            <button onClick={() => setIsProfileExpanded(false)}>
                              <img 
                                src='images/arrow.png' 
                                alt='arrow' 
                                className='w-6 mt-2 rotate-180'
                              />
                            </button>
                            <button className='text-brand mt-2 hover:underline' onClick={handleEditProfile}>
                              Редактировать профиль
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Десктоп версия - все поля под аватаром */}
                    {!isEditing && (
                      <div className='hidden lg:block w-full text-xs'>
                        {/* ФИО в одну строку */}
                        <div className='flex flex-col gap-2 mb-2'>
                          <div className='flex-1'>
                            <p><strong>Фамилия</strong></p>
                            <input value={lastname} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-wgite h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='flex-1'>
                            <p><strong>Имя</strong></p>
                            <input value={firstname} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-wgite h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='flex-1'>
                            <p><strong>Отчество</strong></p>
                            <input value={patronymic} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-wgite h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                        </div>
                        
                        {/* Остальные поля на всю ширину */}
                        <div className='space-y-3'>
                          <div>
                            <p><strong>Электронная почта</strong></p>
                            <input value={email} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-wgite h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div>
                            <p><strong>ВУЗ</strong></p>
                            <input value={university} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-wgite h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='flex flex-row gap-2'>
                            <div className='flex-1'>
                              <p><strong>Уровень подготовки</strong></p>
                              <input value={educationLevel} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-wgite h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Курс обучения</strong></p>
                              <input value={course} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-wgite h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                          </div>
                          <div className='flex flex-row gap-2'>
                            <div className='flex-1'>
                              <p><strong>Факультет</strong></p>
                              <input value={faculty} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-wgite h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Форма обучения</strong></p>
                              <input value={educationForm} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-wgite h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                          </div>
                          <div>
                            <p><strong>Номер телефона</strong></p>
                            <input value={phone} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-wgite h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div>
                            <p><strong>Ссылка на ВКонтакте</strong></p>
                            <input value={vkLink} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-wgite h-[30px] flex items-center italic text-xs mt-1" />
                          </div>
                          <div className='flex flex-row gap-2'>
                            <div className='flex-1'>
                              <p><strong>Дата рождения</strong></p>
                              <input value={birthDate} type='date' readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-wgite h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Пол</strong></p>
                              <input value={gender} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-wgite h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                          </div>
                        </div>
                        
                        <div className='w-full flex flex-col items-center mt-4'>
                          <button className='text-brand mt-2 hover:underline' onClick={handleEditProfile}>
                            Редактировать профиль
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Режим 3: Редактирование (все поля активны) + кнопки сохранить/отменить */}
                    {isEditing && (
                      <div className='w-full text-xs'>
                        {/* ФИО в одну строку */}
                        <div className='flex flex-col gap-2 mb-2'>
                          <div className='flex-1'>
                            <p><strong>Фамилия</strong></p>
                            <input value={tempLastname} onChange={(e) => setTempLastname(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='flex-1'>
                            <p><strong>Имя</strong></p>
                            <input value={tempFirstname} onChange={(e) => setTempFirstname(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='flex-1'>
                            <p><strong>Отчество</strong></p>
                            <input value={tempPatronymic} onChange={(e) => setTempPatronymic(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                        </div>
                        
                        {/* Остальные поля на всю ширину */}
                        <div className='space-y-3'>
                          <div>
                            <p><strong>Электронная почта</strong></p>
                            <input value={tempEmail} onChange={(e) => setTempEmail(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div>
                            <p><strong>ВУЗ</strong></p>
                            <input value={tempUniversity} onChange={(e) => setTempUniversity(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='mb-2'>
                            <p><strong>Уровень подготовки</strong></p>
                            <select 
                              value={tempEducationLevel} 
                              onChange={(e) => setTempEducationLevel(e.target.value)} 
                              className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                            >
                              <option value="">Выберите уровень</option>
                              <option value="бакалавриат">Бакалавриат</option>
                              <option value="специалитет">Специалитет</option>
                              <option value="магистратура">Магистратура</option>
                              <option value="аспирантура">Аспирантура</option>
                            </select>
                          </div>
                          <div className='flex flex-row gap-2 mb-2'>
                            <div className='flex-1'>
                              <p><strong>Курс обучения</strong></p>
                              <select 
                                value={tempCourse} 
                                onChange={(e) => setTempCourse(e.target.value)} 
                                className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                              >
                                <option value="">Выберите курс</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="0">Не обучаюсь в ВУЗе</option>
                              </select>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Форма обучения</strong></p>
                              <select 
                                value={tempEducationForm} 
                                onChange={(e) => setTempEducationForm(e.target.value)} 
                                className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                              >
                                <option value="">Выберите форму</option>
                                <option value="очная">Очная</option>
                                <option value="очнозаочная">Очно-заочная</option>
                                <option value="заочная">Заочная</option>
                              </select>
                            </div>
                          </div>
                          <div className='mb-2'>
                            <p><strong>Факультет</strong></p>
                            <input value={tempFaculty} onChange={(e) => setTempFaculty(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div>
                            <p><strong>Номер телефона</strong></p>
                            <input value={tempPhone} onChange={(e) => setTempPhone(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div>
                            <p><strong>Ссылка на ВКонтакте</strong></p>
                            <input value={tempVkLink} onChange={(e) => setTempVkLink(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='flex flex-row gap-4'>
                            <div className='flex-1'>
                              <p><strong>Дата рождения</strong></p>
                              <input value={tempBirthDate} onChange={(e) => setTempBirthDate(e.target.value)} type='date' className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Пол</strong></p>
                              <input value={tempGender} onChange={(e) => setTempGender(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                          </div>
                        </div>
                        
                        <div className='flex gap-4 mt-6'>
                          <button className='flex-1 bg-brand text-white rounded-full p-2 text-sm' onClick={handleSaveProfile}>
                            Сохранить
                          </button>
                          <button className='flex-1 border border-brand text-brand rounded-full p-2 text-sm' onClick={handleCancelEdit}>
                            Отмена
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Вертикальная разделительная линия */}
            <div className="hidden lg:block w-px bg-brand mx-4 mt-8"></div>

            {/* Правая колонка - списки координаторов, наставников и т.д. */}
            <div className="lg:flex-1">
            {/* {(userRole === 'руководитель округа' || userRole === 'координатор' || userRole === 'старший наставник') && (
               <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4 lg:hidden" />
            )} */}
             
              
              {/* Для мобильных - списки идут после профиля */}
              <div className="lg:hidden">
                {/* Координаторы - только для РО */}
                {userRole === 'руководитель округа' && coordinators.length > 0 && (
                  <div className='leaders mb-4 text-sm'>
                    <p><strong>Координаторы:</strong></p>
                    <div className='w-full px-1 py-3 border border-brand rounded-2xl bg-white items-center mt-2'>
                      {coordinators.map((person, index) => (
                        <div key={person.id || index} className='w-full flex flex-row justify-between items-center m-3 mb-1 mt-1 pr-6'>
                          <div className='flex flex-row gap-4 items-center'>
                            <p className="text-brand text-xs w-6 text-right">{index + 1}</p>
                            <p className="italic text-xs">{`${person.last_name || ''} ${person.first_name || ''} ${person.patronymic || ''}`.trim()}</p>
                          </div>
                          {userRole === 'руководитель округа' && isTeamsEditMode && (
                            <button title='Архивировать' onClick={async () => {
                              try {
                                if (!person.id) return
                                const fullName = `${person.last_name || ''} ${person.first_name || ''}`.trim()
                                const ok = window.confirm(`Действительно архивировать «${fullName}»?`)
                                if (!ok) return
                                await structureApi.archiveById(person.id)
                                await loadRoleLists(userRole, `${lastname} ${firstname}`.trim())
                              } catch (e) {
                              }
                            }}>
                              <img src='/images/archive.png' alt='bin' className='w-3 h-3' />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Старшие наставники - для РО и координаторов */}
                {(userRole === 'руководитель округа' || userRole === 'координатор') && seniorMentors.length > 0 && (
                  <>
                    <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />
                    <div className='leaders mb-4 text-sm'>
                      <p><strong>Старшие наставники:</strong></p>
                      <div className='w-full px-1 py-3 border border-brand rounded-2xl bg-white items-center mt-2'>
                      {seniorMentors.map((person, index) => (
                        <div key={person.id || index} className='w-full flex flex-row justify-between items-center m-3 mb-1 mt-1 pr-6'>
                          <div className='flex flex-row gap-4 items-center'>
                            <p className="text-brand text-xs w-6 text-right">{index + 1}</p>
                            <p className="italic text-xs">{`${person.last_name || ''} ${person.first_name || ''} ${person.patronymic || ''}`.trim()}</p>
                          </div>
                          {(userRole === 'руководитель округа' || userRole === 'координатор') && isTeamsEditMode && (
                            <button title='Архивировать' onClick={async () => {
                              try {
                                if (!person.id) return
                                const fullName = `${person.last_name || ''} ${person.first_name || ''}`.trim()
                                const ok = window.confirm(`Действительно архивировать «${fullName}»?`)
                                if (!ok) return
                                await structureApi.archiveById(person.id)
                                await loadRoleLists(userRole, `${lastname} ${firstname}`.trim())
                              } catch (e) {
                              }
                            }}>
                              <img src='/images/archive.png' alt='bin' className='w-3 h-3' />
                            </button>
                          )}
                        </div>
                      ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Наставники - для РО, координаторов и старших наставников */}
                {(userRole === 'руководитель округа' || userRole === 'координатор' || userRole === 'старший наставник') && mentors.length > 0 && (
                  <>
                    <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />
                    <div className='leaders mb-4 text-sm'>
                      <p><strong>Наставники:</strong></p>
                      <div className='w-full px-1 py-3 border border-brand rounded-2xl bg-white items-center mt-2'>
                        {mentors.map((person, index) => (
                          <div key={person.id || index} className='w-full flex flex-row justify-between items-center m-3 mb-1 mt-1 pr-6'>
                            <div className='flex flex-row gap-4 items-center'>
                              <p className="text-brand text-xs w-6 text-right">{index + 1}</p>
                              <p className="italic text-xs">{`${person.last_name || ''} ${person.first_name || ''} ${person.patronymic || ''}`.trim()}</p>
                            </div>
                            {(userRole === 'руководитель округа' || userRole === 'координатор' || userRole === 'старший наставник') && isTeamsEditMode && (
                              <button title='Архивировать' onClick={async () => {
                                try {
                                  if (!person.ctid) {
                                    alert('Ошибка: у наставника отсутствует ctid')
                                    return
                                  }
                                  const fullName = `${person.last_name || ''} ${person.first_name || ''}`.trim()
                                  const ok = window.confirm(`Действительно архивировать «${fullName}»?`)
                                  if (!ok) return
                                  await structureApi.archiveByCtid(person.ctid)
                                  // Обновляем списки после архивации
                                  await loadRoleLists(userRole, `${lastname} ${firstname}`.trim())
                                } catch (e) {
                                }
                              }}>
                                <img src='/images/archive.png' alt='bin' className='w-3 h-3' />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />
                
                <div className='teams mb-4 text-sm'>
                  <p><strong>Команды:</strong></p>
                  {(() => {
                    const teamsWithMembers = teams.filter(team => {
                      const members = teamMembers[team.code] || []
                      return members.length > 0
                    })
                    return teamsWithMembers.length > 0 ? (
                      teamsWithMembers.map((team, index) => {
                      const isExpanded = expandedTeams[team.code] || false
                      const members = teamMembers[team.code] || []
                      
                      return (
                        <div key={team.id || index}>
                          {!isExpanded ? (
                            <div className='flex flex-row gap-2 w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] items-center justify-center mt-2'>
                              <button 
                                className='w-full flex flex-row justify-between items-center' 
                                onClick={() => toggleTeamExpansion(team.code)}
                              >
                                <div className='flex flex-row gap-2 items-center'>
                                  <img src='/images/teamlist.png' alt='.' className="w-2 h-3"/>
                                  <p className="italic text-xs">{team.name || 'Название команды'}</p>
                                </div>
                                {/* <p className="text-xs text-brand">{members.length}/100</p> */}
                              </button>
                            </div>
                          ) : (
                            <div className='w-full px-0 mt-2'>
                              <div className='w-full border border-brand rounded-3xl bg-white'>
                                <button 
                                  className='w-full flex flex-row justify-between items-center px-4 py-3 min-h-[40px] rounded-t-3xl' 
                                  onClick={() => toggleTeamExpansion(team.code)}
                                >
                                  <div className='flex flex-row gap-2 items-center'>
                                    <img src='/images/teamlist.png' alt='.' className="w-2 h-3 rotate-90"/>
                                    <p className="italic text-xs">{team.name || 'Название команды'}</p>
                                  </div>
                                  {/* <p className="text-xs text-brand">{members.length}/100</p> */}
                                </button>
                                <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto mx-4 mb-2" />
                                <div className='w-full pb-2'>
                                  {members.map((member, memberIndex) => (
                                    <div key={member.id || memberIndex} className='w-full flex flex-row gap-4 px-4 mb-1 items-center justify-between'>
                                      <div className='flex flex-row items-center gap-4'>
                                        <p className="text-brand text-xs w-6 text-right">{memberIndex + 1}</p>
                                        <p className="italic text-xs">{`${member.last_name || ''} ${member.first_name || ''} ${member.patronymic || ''}`.trim()}</p>
                                      </div>
                                      <div className='flex items-center gap-3'>
                                        {member.role === 'captain' && (
                                          <div className="w-3 h-3" title="Капитан команды"><img src='images/star.png' alt='star' /></div>
                                        )}
                                        {(userRole === 'руководитель округа' || userRole === 'координатор' || userRole === 'старший наставник') && isTeamsEditMode && (
                                          <button title='Архивировать' onClick={async () => {
                                            try {
                                              if (!member.id) return
                                              const fullName = `${member.last_name || ''} ${member.first_name || ''}`.trim()
                                              const ok = window.confirm(`Действительно архивировать «${fullName}»?`)
                                              if (!ok) return
                                              await membersApi.archiveById(member.id)
                                              // Обновляем состав конкретной команды
                                              const updated = await teamMembersApi.getByTeamCode(team.code)
                                              setTeamMembers(prev => ({ ...prev, [team.code]: updated?.data || [] }))
                                            } catch (e) {
                                            }
                                          }}>
                                            <img src='/images/archive.png' alt='bin' className='w-3 h-3' />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className='flex flex-row gap-2 w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] items-center justify-center mt-2'>
                      <div className='flex flex-row gap-2 items-center'>
                        <img src='/images/teamlist.png' alt='.' className="w-2 h-3"/>
                        <p className="italic text-xs">Команды не найдены</p>
                      </div>
                    </div>
                    )
                  })()}
                  <button className='w-full mt-4 text-xs text-brand hover:underline' onClick={() => {
                    const next = !isTeamsEditMode
                    setIsTeamsEditMode(next)
                    const expanded: {[key:string]: boolean} = {}
                    for (const t of teams) {
                      if (t.code) expanded[t.code] = next
                    }
                    setExpandedTeams(expanded)
                  }}>{isTeamsEditMode ? 'Закончить редактирование' : 'Редактировать команды'}</button>
                </div>
                <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto mb-2" />

                <div>
                  <p><strong className='text-sm'>Количество участников: <span className="text-brand">{getTotalParticipantsCount()}</span></strong></p>
                </div>
                
                <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto mt-2 mb-2" />
                
                <div className='leaders text-sm'>
                  {/* Показываем поля в зависимости от роли */}
                  {(userRole === 'наставник' || userRole === 'старший наставник') && (
                    <>
                      <p><strong>Координатор:</strong></p>
                      <p className="w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] flex items-center italic text-xs mt-1">{coordinator}</p>
                      <p className='mt-4'><strong>Руководитель округа:</strong></p>
                      <p className="w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] flex items-center italic text-xs mt-1">{districtManager}</p>
                    </>
                  )}
                  {userRole === 'координатор' && (
                    <>
                      <p><strong>Руководитель округа:</strong></p>
                      <p className="w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] flex items-center italic text-xs mt-1">{districtManager}</p>
                    </>
                  )}
                  {/* Для РО и других ролей поля не показываем */}
                </div>
              </div>

              {/* Для десктоп версии - списки в правой колонке */}
              <div className="hidden lg:block space-y-6">
                {/* Координаторы - только для РО */}
                {(userRole === 'руководитель округа' || userRole === 'координатор' || userRole === 'старший наставник') && (
               <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4 lg:hidden" />
            )}
                {userRole === 'руководитель округа' && coordinators.length > 0 && (
                  <div className='leaders text-sm mt-4'>
                    <p><strong>Координаторы:</strong></p>
                    <div className='w-full px-1 py-3 border border-brand rounded-2xl bg-white items-center mt-2 pr-6'>
                      {coordinators.map((person, index) => (
                        <button key={person.id || index} className='w-full flex flex-row gap-4 m-3 mb-1 mt-1'>
                          <p className="text-brand text-xs w-6 text-right">{index + 1}</p>
                          <p className="italic text-xs">{`${person.last_name || ''} ${person.first_name || ''} ${person.patronymic || ''}`.trim()}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Старшие наставники - для РО и координаторов */}
                {(userRole === 'руководитель округа' || userRole === 'координатор') && seniorMentors.length > 0 && (
                  <div className='leaders text-sm'>
                    <p><strong>Старшие наставники:</strong></p>
                    <div className='w-full px-1 py-3 border border-brand rounded-2xl bg-white items-center mt-2'>
                      {seniorMentors.map((person, index) => (
                        <div key={person.id || index} className='w-full flex flex-row justify-between items-center m-3 mb-1 mt-1 pr-6'>
                          <div className='flex flex-row gap-4 items-center'>
                            <p className="text-brand text-xs w-6 text-right">{index + 1}</p>
                            <p className="italic text-xs">{`${person.last_name || ''} ${person.first_name || ''} ${person.patronymic || ''}`.trim()}</p>
                          </div>
                          {(userRole === 'руководитель округа' || userRole === 'координатор') && isTeamsEditMode && (
                            <button title='Архивировать' onClick={async () => {
                              try {
                                if (!person.id) return
                                const fullName = `${person.last_name || ''} ${person.first_name || ''}`.trim()
                                const ok = window.confirm(`Действительно архивировать «${fullName}»?`)
                                if (!ok) return
                                await structureApi.archiveById(person.id)
                                await loadRoleLists(userRole, `${lastname} ${firstname}`.trim())
                              } catch (e) {
                              }
                            }}>
                              <img src='/images/archive.png' alt='bin' className='w-3 h-3' />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Наставники - для РО, координаторов и старших наставников */}
                {(userRole === 'руководитель округа' || userRole === 'координатор' || userRole === 'старший наставник') && mentors.length > 0 && (
                  <div className='leaders text-sm'>
                    <p><strong>Наставники:</strong></p>
                    <div className='w-full px-1 py-3 border border-brand rounded-2xl bg-white items-center mt-2'>
                      {mentors.map((person, index) => (
                        <div key={person.id || index} className='w-full flex flex-row justify-between items-center m-3 mb-1 mt-1 pr-6'>
                          <div className='flex flex-row gap-4 items-center'>
                            <p className="text-brand text-xs w-6 text-right">{index + 1}</p>
                            <p className="italic text-xs">{`${person.last_name || ''} ${person.first_name || ''} ${person.patronymic || ''}`.trim()}</p>
                          </div>
                          {(userRole === 'руководитель округа' || userRole === 'координатор' || userRole === 'старший наставник') && isTeamsEditMode && (
                            <button title='Архивировать' onClick={async () => {
                              try {
                                if (!person.ctid) {
                                  alert('Ошибка: у наставника отсутствует ctid')
                                  return
                                }
                                const fullName = `${person.last_name || ''} ${person.first_name || ''}`.trim()
                                const ok = window.confirm(`Действительно архивировать «${fullName}»?`)
                                if (!ok) return
                                await structureApi.archiveByCtid(person.ctid)
                                // Обновляем списки после архивации
                                await loadRoleLists(userRole, `${lastname} ${firstname}`.trim())
                              } catch (e) {
                              }
                            }}>
                              <img src='/images/archive.png' alt='bin' className='w-3 h-3' />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}


                <div className="hidden lg:block">
                
                <div className='teams mb-6 text-sm mt-4'>
                  <p><strong>Команды:</strong></p>
                  {(() => {
                    const teamsWithMembers = teams.filter(team => {
                      const members = teamMembers[team.code] || []
                      return members.length > 0
                    })
                    return teamsWithMembers.length > 0 ? (
                      teamsWithMembers.map((team, index) => {
                      const isExpanded = expandedTeams[team.code] || false
                      const members = teamMembers[team.code] || []
                      
                      return (
                        <div key={team.id || index}>
                          {!isExpanded ? (
                            <div className='flex flex-row gap-2 w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] items-center justify-center mt-2'>
                              <button 
                                className='w-full flex flex-row justify-between items-center' 
                                onClick={() => toggleTeamExpansion(team.code)}
                              >
                                <div className='flex flex-row gap-2 items-center'>
                                  <img src='/images/teamlist.png' alt='.' className="w-2 h-3"/>
                                  <p className="italic text-xs">{team.name || 'Название команды'}</p>
                                </div>
                                {/* <p className="text-xs text-brand">{members.length}/100</p> */}
                              </button>
                            </div>
                          ) : (
                            <div className='w-full px-0 mt-2'>
                              <div className='w-full border border-brand rounded-3xl bg-white'>
                                <button 
                                  className='w-full flex flex-row justify-between items-center px-4 py-3 min-h-[40px] rounded-t-3xl' 
                                  onClick={() => toggleTeamExpansion(team.code)}
                                >
                                  <div className='flex flex-row gap-2 items-center'>
                                    <img src='/images/teamlist.png' alt='.' className="w-2 h-3 rotate-90"/>
                                    <p className="italic text-xs">{team.name || 'Название команды'}</p>
                                  </div>
                                  {/* <p className="text-xs text-brand">{members.length}/100</p> */}
                                </button>
                                <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto mx-4 mb-2" />
                                <div className='w-full pb-2'>
                                  {members.map((member, memberIndex) => (
                                    <div key={member.id || memberIndex} className='w-full flex flex-row gap-4 px-4 mb-1 items-center justify-between'>
                                      <div className='flex flex-row items-center gap-4'>
                                        <p className="text-brand text-xs w-6 text-right">{memberIndex + 1}</p>
                                        <p className="italic text-xs">{`${member.last_name || ''} ${member.first_name || ''} ${member.patronymic || ''}`.trim()}</p>
                                      </div>
                                      <div className='flex items-center gap-3'>
                                        {member.role === 'captain' && (
                                          <div className="w-3 h-3" title="Капитан команды"><img src='images/star.png' alt='star' /></div>
                                        )}
                                        {(userRole === 'руководитель округа' || userRole === 'координатор' || userRole === 'старший наставник') && isTeamsEditMode && (
                                          <button title='Архивировать' onClick={async () => {
                                            try {
                                              if (!member.id) return
                                              const fullName = `${member.last_name || ''} ${member.first_name || ''}`.trim()
                                              const ok = window.confirm(`Действительно архивировать «${fullName}»?`)
                                              if (!ok) return
                                              await membersApi.archiveById(member.id)
                                              const updated = await teamMembersApi.getByTeamCode(team.code)
                                              setTeamMembers(prev => ({ ...prev, [team.code]: updated?.data || [] }))
                                            } catch (e) {
                                            }
                                          }}>
                                            <img src='/images/archive.png' alt='bin' className='w-3 h-3' />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className='flex flex-row gap-2 w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] items-center justify-center mt-2'>
                      <div className='flex flex-row gap-2 items-center'>
                        <img src='/images/teamlist.png' alt='.' className="w-2 h-3"/>
                        <p className="italic text-xs">Команды не найдены</p>
                      </div>
                    </div>
                    )
                  })()}
                  <button className='w-full mt-4 text-xs text-brand hover:underline' onClick={() => {
                    const next = !isTeamsEditMode
                    setIsTeamsEditMode(next)
                    const expanded: {[key:string]: boolean} = {}
                    for (const t of teams) {
                      if (t.code) expanded[t.code] = next
                    }
                    setExpandedTeams(expanded)
                  }}>{isTeamsEditMode ? 'Закончить редактирование' : 'Редактировать команды'}</button>
                </div>
              </div>

                <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto" />

                <div>
                  <p><strong className='text-sm'>Количество участников: <span className="text-brand">{getTotalParticipantsCount()}</span></strong></p>
                </div>
                
                <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto" />
                
                <div className='leaders text-sm'>
                  {/* Показываем поля в зависимости от роли */}
                  {(userRole === 'наставник' || userRole === 'старший наставник') && (
                    <>
                      <p><strong>Координатор:</strong></p>
                      <p className="w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] flex items-center italic text-xs mt-1">{coordinator}</p>
                      <p className='mt-2'><strong>Руководитель округа:</strong></p>
                      <p className="w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] flex items-center italic text-xs mt-1">{districtManager}</p>
                    </>
                  )}
                  {userRole === 'координатор' && (
                    <>
                      <p><strong>Руководитель округа:</strong></p>
                      <p className="w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] flex items-center italic text-xs mt-1">{districtManager}</p>
                    </>
                  )}
                  {/* Для РО и других ролей поля не показываем */}
                </div>
              </div>
            </div>
          </div>
        )}
        {sect==='calendar' && (
          <CalendarPage />
        )}
        {sect==='materials' && (

          
          <section className="space-y-3">
          {selectedMk && (
                 <div className="py-4">
                 <div className="">
                   {/* Кнопка назад */}
                   <button 
                     onClick={handleBackToMks}
                     className="flex items-center text-brand mb-2 hover:underline"
                   >
                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                     </svg>
                     Назад к материалам
                   </button>
         
                   {/* Детали мероприятия */}
                   <div className="p-2">
                     <h2 className="text-lg font-bold text-brand mb-4 normal-case text-center">{selectedMk.title}</h2>

                     <div className='flex w-full lg:px-8 items-center justify-center text-left'>
                       <img src={selectedMk.image} className="rounded-lg w-full lg:w-96 mb-6"></img>
                     </div>

                     <a href={getDownloadLink(selectedMk.pres)} download className='text-brand italic hover:underline text-sm block'>Скачать презентацию</a>
                     {selectedMk.method && (
                       <a href={getDownloadLink(selectedMk.method)} download className='text-brand italic hover:underline text-sm block'>Скачать методический материал</a>
                     )}
          
         
                     {/* Показываем разделы только для мастер-классов с д/з (у которых есть tz или fulldesc) */}
                     {selectedMk.tz && selectedMk.fulldesc && (
                       <>
                         <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />
                         
                         <div className="flex w-full flex-col">
                            <p className="text-lg font-semibold text-black mb-2">Критерии домашнего задания</p>
                            <div className='rounded-lg border border-brand p-2'>
                              <p className='text-xs whitespace-pre-line'>{selectedMk.fulldesc}</p>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />
                         
                         {/* Отображение статусов для структуры */}
                         {structureTeamsForMk.length > 0 && (
                           <div className="mb-4">
                             <p className="text-sm font-semibold text-gray-700 mb-2">Отслеживание выполнения</p>
                             <div className="space-y-2">
                               {structureTeamsForMk.map((team) => {
                                 const teamHomeworks = teamsHomeworksForMk[team.code] || [];
                                 const normalizedSubtitle = (selectedMk?.subtitle || '').trim();
                                 const homework = teamHomeworks.find(hw => {
                                   const normalizedHwName = (hw.hw_name || '').trim();
                                   return normalizedHwName === normalizedSubtitle;
                                 });
                                 
                                 return (
                                   <div key={team.code} className="flex justify-between items-center border border-brand rounded-full p-2 px-4 bg-white">
                                     <span className="text-sm text-black">{team.name || team.code}</span>
                                     <div className="flex items-center gap-2">
                                       {homework ? (
                                         homework.status === 'uploaded' ? (
                                           <span className="text-xs lg:text-sm italic text-[#FF5500]">На проверке</span>
                                         ) : homework.status === 'reviewed' ? (
                                           <span className="text-xs lg:text-sm text-brand">
                                             <span className="font-bold">{homework.mark}</span> баллов
                                           </span>
                                         ) : (
                                           <span className="text-xs lg:text-sm text-pink italic">Не выполнили</span>
                                         )
                                       ) : (
                                         <span className="text-xs lg:text-sm text-pink italic">Не выполнили</span>
                                       )}
                                     </div>
                                   </div>
                                 );
                               })}
                             </div>
                           </div>
                         )}
                       </>
                     )}

                   </div>
                 </div>
               </div>
          )}
          
          { !selectedMk && (<div>
          <h3 className="text-left normal-case text-brand font-extrabold text-[18px] uppercase py-3">Мастер-классы</h3>
    
          <div className="relative">
            <div 
              ref={scrollContainerRefmk}
              className="flex overflow-x-auto space-x-3 hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                          [-webkit-overflow-scrolling:touch] pb-4 snap-x snap-mandatory"
              onScroll={handleScrollmk}
            >
              {mk_list.map((mk, index) => (
                <div key={index} className="snap-start cursor-pointer" onClick={() => handleMkClick(mk)}>
                  <Card 
                    title={mk.title}
                    subtitle={mk.subtitle}
                    image={mk.image}
                  />
                </div>
              ))}
            </div>
            
            {/* Точки прогресса */}
            <div className="flex justify-center space-x-2 my-2">
              {mk_list.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => scrollToDotmk(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeDotmk ? 'bg-brand scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
  
          <h3 className="text-left normal-case text-brand font-extrabold text-[18px] uppercase pb-3">Примеры проектов</h3>
          <div className="relative">
            <div 
              ref={scrollContainerRefpr}
              className="flex overflow-x-auto space-x-3 hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                          [-webkit-overflow-scrolling:touch] snap-x snap-mandatory"
              onScroll={handleScrollpr}
            >
              {project_list.map((project, index) => (
                <div key={index} className="snap-start">
                  <Card 
                    title={project.title}
                    subtitle={project.subtitle}
                    image={project.image}
                  />
                </div>
              ))}
            </div>
            
            {/* Точки прогресса */}
            <div className="flex justify-center space-x-2 my-2">
              {project_list.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => scrollToDotpr(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeDotpr ? 'bg-brand scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
  
          <h3 className="text-left normal-case text-brand font-extrabold text-[18px] uppercase pb-3">Подкаст "Давай по делу"</h3>
          <div className="relative">
            <div 
              ref={scrollContainerRefpod}
              className="flex overflow-x-auto space-x-3 hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                          [-webkit-overflow-scrolling:touch] snap-x snap-mandatory"
              onScroll={handleScrollpod}
            >
              {podcast_list.map((podcast, index) => (
                <div key={index} className="snap-start">
                  <Card 
                    title={podcast.title}
                    image={podcast.image}
                    link={podcast.link}
                  />
                </div>
              ))}
            </div>
            
            {/* Точки прогресса */}
            <div className="flex justify-center space-x-2 my-2 lg:hidden">
              {podcast_list.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => scrollToDotpod(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeDotpod ? 'bg-brand scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>)}
        </section>
        )}
        {sect==='handy' && (
          <div>Хэндик</div>
        )}
        {sect==='reporting' && (
          <div>Отчетность</div>
        )}
      </div>
    </section>
  )
}

export default ProfilePage;