import { useState, useEffect, useRef, useCallback } from 'react';
import { structureApi, teamsApi, teamMembersApi, membersApi } from '@/services/api'
import { useNavigate } from 'react-router-dom'
import CalendarPage from '@/components/CalendarPage';

interface Mk {
  title: string;
  subtitle: string;
  image: string;
  link?: string;
  pres?: string;
  method?: string
  disabled?: boolean;
}

const Card = ({ title, subtitle, image, link, disabled }: { title?: string, subtitle?: string, image?: string, link?: string, disabled?: boolean }) => (
  <div className="flex flex-col w-[210px] flex-shrink-0">
    {link && !disabled ? (
      <a href={link} target="_blank">
        <img src={image} className="rounded-xl w-60 h-40 cursor-pointer hover:opacity-90 transition-opacity" />
      </a>
    ) : (
      <img src={image} className="rounded-xl w-60 h-40" />
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
    const scrollContainerRefvid = useRef<HTMLDivElement>(null);
    const [activeDotvid, setActiveDotvid] = useState(0);

  
    const mk_list = [
      { title: "Первый мастер-класс", subtitle: 'Проблема. Идея. Решение', image: '/images/mkfirst.png', pres: 'https://drive.google.com/file/d/1dJd3mA8eFmKksPX5FQrkTO7XF0mlkOZN/view?usp=drive_link', disabled: false },
      { title: "Второй мастер-класс", subtitle: 'Customer development. ЦА.', image: '/images/mksecond.png', pres: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1PjByX9ckPyi-1ANFeCrDKXq1_cso_4SQ?sort=13&direction=a', disabled: true },
      { title: "Третий мастер-класс", subtitle: 'MVP. HADI - циклы.', image: '/images/mkthird.png', pres: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
      { title: "Четвертый мастер-класс", subtitle: 'Бизнес - модель. Базовый трек', image: '/images/mkfourth.png', pres: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
      { title: "Пятый мастер-класс", subtitle: 'Финансы. Базовый трек', image: '/images/mkfifth.png', pres: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
      { title: "Шестой мастер-класс", subtitle: 'Маркетинг. Базовый трек', image: '/images/mksixth.png', pres: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
      { title: "Четвертый мастер-класс", subtitle: 'Бизнес - модель. Социальный трек', image: '/images/mkfourth.png', pres: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
      { title: "Пятый мастер-класс", subtitle: 'Финансы. Социальный трек', image: '/images/mkfifth.png', pres: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
      { title: "Шестой мастер-класс", subtitle: 'Маркетинг. Социальный трек', image: '/images/mksixth.png', pres: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
      { title: "Четвертый мастер-класс", subtitle: 'Бизнес - модель. Инновационный трек', image: '/images/mkfourth.png', pres: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
      { title: "Пятый мастер-класс", subtitle: 'Финансы. Инновационный трек', image: '/images/mkfifth.png', pres: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
      { title: "Шестой мастер-класс", subtitle: 'Маркетинг. Инновационный трек', image: '/images/mksixth.png', pres: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
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

  const video_lessons = [
    { title: "урок 1", subtitle: 'что-то там', image: '/images/' },
    { title: "урок 2", subtitle: 'что-то там', image: '/images/' },
]

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

    const handleScrollvid = useCallback(() => {
      const container = scrollContainerRefvid.current;
      if (!container) return;
  
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const cardWidth = 205; // w-[120px]
      const gap = 12; // space-x-3 = 12px
      
      // Вычисляем индекс активной карточки
      const scrollPosition = scrollLeft + containerWidth / 2;
      const activeIndex = Math.floor(scrollPosition / (cardWidth + gap));
      
      setActiveDotvid(Math.min(activeIndex, podcast_list.length - 1));
    }, [podcast_list.length]);
  
    // Функция для скролла к определенной точке
    const scrollToDotvid = (index: number) => {
      const container = scrollContainerRefvid.current;
      if (!container) return;
  
      const cardWidth = 205; // w-[200px]
      const gap = 12; // space-x-3 = 12px
      const scrollPosition = index * (cardWidth + gap);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }

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
        const currentUserFullName = `${item.last_name || ''} ${item.first_name || ''}`.trim()
        const subordinates = await loadRoleLists(item.pos || '', currentUserFullName);
        
        // Загружаем команды пользователя и подчиненных после загрузки списков
        await loadUserTeams(`${item.last_name || ''} ${item.first_name || ''}`.trim(), item.pos || '', subordinates);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load structure profile', e)
        // При ошибке загрузки перенаправляем на авторизацию
        localStorage.removeItem('structure_ctid')
        navigate('/auth')
      }
    };
    loadStructureProfile();
  }, [navigate]);

  // Функция для загрузки списков в зависимости от роли и привязки по ФИО
  const loadRoleLists = async (role: string, currentUserFullName: string) => {
    try {
      const allStructure = await structureApi.getAll()
      const allPeople = allStructure?.data || []
      console.log('All structure data') // Отладочная информация
      
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
        return isSameFirstLast(fieldValue, currentUserFullName)
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
        console.log('RO mentors') // Отладочная информация
        setMentors(mentorPeople)
      } else if (role === 'координатор') {
        // Координатор видит старших наставников своего кураторства (по полю coord)
        seniorMentorPeople = allPeople.filter(person => person.pos === 'старший наставник' && fieldMatchesUser(person.coord))
        setSeniorMentors(seniorMentorPeople)
        
        // Координатор видит наставников, которые прикреплены к нему (по полю coord)
        mentorPeople = allPeople.filter(person => person.pos === 'наставник' && fieldMatchesUser(person.coord))
        console.log('Coordinator mentors') // Отладочная информация
        setMentors(mentorPeople)
        
        setCoordinators([]) // Координаторы не видят других координаторов
      } else if (role === 'старший наставник') {
        // Старший наставник видит наставников своей группы (по полю high_mentor)
        mentorPeople = allPeople.filter(person => person.pos === 'наставник' && fieldMatchesUser(person.high_mentor))
        console.log('Senior mentor mentors') // Отладочная информация
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
      console.error('Failed to load role lists:', e)
      return {
        coordinators: [],
        seniorMentors: [],
        mentors: []
      }
    }
  }

  // Функция для загрузки команд пользователя и подчиненных
  const loadUserTeams = async (userFullName: string, userRole: string, subordinates?: {seniorMentors: any[], mentors: any[]}) => {
    try {
      if (!userFullName || userFullName === 'не указан') return
      
      let allTeams: any[] = []
      
      // Получаем команды где пользователь является наставником
      const userTeamsResult = await teamsApi.getByMentor(userFullName)
      const userTeams = userTeamsResult?.data || []
      allTeams = [...userTeams]
      
      // Для РО и координаторов - получаем команды от подчиненных
      if ((userRole === 'руководитель округа' || userRole === 'координатор') && subordinates) {
        // Получаем команды от старших наставников
        for (const seniorMentor of subordinates.seniorMentors) {
          const seniorMentorName = `${seniorMentor.last_name || ''} ${seniorMentor.first_name || ''}`.trim()
          if (seniorMentorName && seniorMentorName !== 'не указан') {
            try {
              const seniorTeamsResult = await teamsApi.getByMentor(seniorMentorName)
              const seniorTeams = seniorTeamsResult?.data || []
              allTeams = [...allTeams, ...seniorTeams]
            } catch (e) {
              console.error(`Failed to load teams for senior mentor ${seniorMentorName}:`, e)
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
              console.error(`Failed to load teams for mentor ${mentorName}:`, e)
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
            console.error(`Failed to load members for team ${team.code}:`, e)
            membersData[team.code] = []
          }
        }
      }
      setTeamMembers(membersData)
    } catch (e) {
      console.error('Failed to load user teams:', e)
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

  const handleMkClick = (mk: Mk) => {
    setSelectedMk(mk);
  };

  const handleBackToMks = () => {
    setSelectedMk(null);
  };

  const handleEditProfile = () => {
    setTempLastname(lastname)
    setTempFirstname(firstname)
    setTempPatronymic(patronymic)
    setTempEmail(email)
    setTempUniversity(university)
    setTempEducationLevel(educationLevel)
    setTempCourse(course)
    setTempFaculty(faculty)
    setTempEducationForm(educationForm)
    setTempPhone(phone)
    setTempVkLink(vkLink)
    setTempBirthDate(birthDate)
    setTempGender(gender)
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
        // eslint-disable-next-line no-console
        console.error('Failed to save structure profile', e)
      }
    }
    void save()
  }

  const handleCancelEdit = () => {
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
        <div className='flex justify-center items-center'>
          <img src='images/logowhite.png' alt='logo' className='mt-10 w-80 z-0'/>
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
                    <div className='bg-[#D9D9D9] rounded-lg w-44 aspect-square'></div>
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
                            <input value={lastname} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='mb-4 text-left'>
                            <p><strong>Имя</strong></p>
                            <input value={firstname} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
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
                            <input value={lastname} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='mb-2'>
                            <p><strong>Имя</strong></p>
                            <input value={firstname} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='mb-2'>
                            <p><strong>Отчество</strong></p>
                            <input value={patronymic} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='mb-2'>
                            <p><strong>Электронная почта</strong></p>
                            <input value={email} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='mb-2'>
                            <p><strong>ВУЗ</strong></p>
                            <input value={university} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='flex flex-row gap-2 mb-2'>
                            <div className='flex-1'>
                              <p><strong>Уровень подготовки</strong></p>
                              <input value={educationLevel} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Курс обучения</strong></p>
                              <input value={course} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                          </div>
                          <div className='flex flex-row gap-2 mb-2'>
                            <div className='flex-1'>
                              <p><strong>Факультет</strong></p>
                              <input value={faculty} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Форма обучения</strong></p>
                              <input value={educationForm} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                          </div>
                          <div className='mb-2'>
                            <p><strong>Номер телефона</strong></p>
                            <input value={phone} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='mb-2'>
                            <p><strong>Ссылка на ВКонтакте</strong></p>
                            <input value={vkLink} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='flex flex-row gap-2 mb-2'>
                            <div className='flex-1'>
                              <p><strong>Дата рождения</strong></p>
                              <input value={birthDate} type='date' disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Пол</strong></p>
                              <input value={gender} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
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
                            <input value={lastname} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='flex-1'>
                            <p><strong>Имя</strong></p>
                            <input value={firstname} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='flex-1'>
                            <p><strong>Отчество</strong></p>
                            <input value={patronymic} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                        </div>
                        
                        {/* Остальные поля на всю ширину */}
                        <div className='space-y-3'>
                          <div>
                            <p><strong>Электронная почта</strong></p>
                            <input value={email} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div>
                            <p><strong>ВУЗ</strong></p>
                            <input value={university} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='flex flex-row gap-2'>
                            <div className='flex-1'>
                              <p><strong>Уровень подготовки</strong></p>
                              <input value={educationLevel} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Курс обучения</strong></p>
                              <input value={course} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                          </div>
                          <div className='flex flex-row gap-2'>
                            <div className='flex-1'>
                              <p><strong>Факультет</strong></p>
                              <input value={faculty} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Форма обучения</strong></p>
                              <input value={educationForm} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                          </div>
                          <div>
                            <p><strong>Номер телефона</strong></p>
                            <input value={phone} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div>
                            <p><strong>Ссылка на ВКонтакте</strong></p>
                            <input value={vkLink} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1" />
                          </div>
                          <div className='flex flex-row gap-2'>
                            <div className='flex-1'>
                              <p><strong>Дата рождения</strong></p>
                              <input value={birthDate} type='date' disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Пол</strong></p>
                              <input value={gender} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
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
                          <div className='flex flex-row gap-2'>
                            <div className='flex-1'>
                              <p><strong>Уровень подготовки</strong></p>
                              <input value={tempEducationLevel} onChange={(e) => setTempEducationLevel(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Курс обучения</strong></p>
                              <input value={tempCourse} onChange={(e) => setTempCourse(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                          </div>
                          <div className='flex flex-row gap-2'>
                            <div className='flex-1'>
                              <p><strong>Факультет</strong></p>
                              <input value={tempFaculty} onChange={(e) => setTempFaculty(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
                            <div className='flex-1'>
                              <p><strong>Форма обучения</strong></p>
                              <input value={tempEducationForm} onChange={(e) => setTempEducationForm(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                            </div>
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
            {(userRole === 'руководитель округа' || userRole === 'координатор' || userRole === 'старший наставник') && (
               <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4 lg:hidden" />
            )}
             
              
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
                            <p className="text-brand text-xs">{index + 1}</p>
                            <p className="italic text-xs">{`${person.last_name || ''} ${person.first_name || ''} ${person.patronymic || ''}`.trim()}</p>
                          </div>
                          {userRole === 'руководитель округа' && (
                            <button title='Архивировать' onClick={async () => {
                              try {
                                if (!person.id) return
                                const fullName = `${person.last_name || ''} ${person.first_name || ''}`.trim()
                                const ok = window.confirm(`Действительно архивировать «${fullName}»?`)
                                if (!ok) return
                                await structureApi.archiveById(person.id)
                                await loadRoleLists(userRole, `${lastname} ${firstname}`.trim())
                              } catch (e) {
                                console.error('Archive structure user failed', e)
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
                            <p className="text-brand text-xs">{index + 1}</p>
                            <p className="italic text-xs">{`${person.last_name || ''} ${person.first_name || ''} ${person.patronymic || ''}`.trim()}</p>
                          </div>
                          {(userRole === 'руководитель округа' || userRole === 'координатор') && (
                            <button title='Архивировать' onClick={async () => {
                              try {
                                if (!person.id) return
                                const fullName = `${person.last_name || ''} ${person.first_name || ''}`.trim()
                                const ok = window.confirm(`Действительно архивировать «${fullName}»?`)
                                if (!ok) return
                                await structureApi.archiveById(person.id)
                                await loadRoleLists(userRole, `${lastname} ${firstname}`.trim())
                              } catch (e) {
                                console.error('Archive structure user failed', e)
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
                              <p className="text-brand text-xs">{index + 1}</p>
                              <p className="italic text-xs">{`${person.last_name || ''} ${person.first_name || ''} ${person.patronymic || ''}`.trim()}</p>
                            </div>
                            {(userRole === 'руководитель округа' || userRole === 'координатор' || userRole === 'старший наставник') && (
                              <button title='Архивировать' onClick={async () => {
                                try {
                                  console.log('Mentor data') // Отладочная информация
                                  if (!person.ctid) {
                                    console.warn('Mentor has no ctid:', person)
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
                                  console.error('Archive structure user failed', e)
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
                  {teams.length > 0 ? (
                    teams.map((team, index) => {
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
                                        <p className="text-brand text-xs">{memberIndex + 1}</p>
                                        <p className="italic text-xs">{`${member.last_name || ''} ${member.first_name || ''} ${member.patronymic || ''}`.trim()}</p>
                                      </div>
                                      <div className='flex items-center gap-3'>
                                        {member.role === 'captain' && (
                                          <div className="w-3 h-3" title="Капитан команды"><img src='images/star.png' alt='star' /></div>
                                        )}
                                        {(userRole === 'руководитель округа' || userRole === 'координатор' || userRole === 'старший наставник') && (
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
                                              console.error('Archive member failed', e)
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
                  )}
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
                          <p className="text-brand text-xs">{index + 1}</p>
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
                            <p className="text-brand text-xs">{index + 1}</p>
                            <p className="italic text-xs">{`${person.last_name || ''} ${person.first_name || ''} ${person.patronymic || ''}`.trim()}</p>
                          </div>
                          {(userRole === 'руководитель округа' || userRole === 'координатор') && (
                            <button title='Архивировать' onClick={async () => {
                              try {
                                if (!person.id) return
                                const fullName = `${person.last_name || ''} ${person.first_name || ''}`.trim()
                                const ok = window.confirm(`Действительно архивировать «${fullName}»?`)
                                if (!ok) return
                                await structureApi.archiveById(person.id)
                                await loadRoleLists(userRole, `${lastname} ${firstname}`.trim())
                              } catch (e) {
                                console.error('Archive structure user failed', e)
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
                            <p className="text-brand text-xs">{index + 1}</p>
                            <p className="italic text-xs">{`${person.last_name || ''} ${person.first_name || ''} ${person.patronymic || ''}`.trim()}</p>
                          </div>
                          {(userRole === 'руководитель округа' || userRole === 'координатор' || userRole === 'старший наставник') && (
                            <button title='Архивировать' onClick={async () => {
                              try {
                                console.log('Mentor data (desktop)') // Отладочная информация
                                if (!person.ctid) {
                                  console.warn('Mentor has no ctid (desktop):', person)
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
                                console.error('Archive structure user failed', e)
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
                  {teams.length > 0 ? (
                    teams.map((team, index) => {
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
                                        <p className="text-brand text-xs">{memberIndex + 1}</p>
                                        <p className="italic text-xs">{`${member.last_name || ''} ${member.first_name || ''} ${member.patronymic || ''}`.trim()}</p>
                                      </div>
                                      <div className='flex items-center gap-3'>
                                        {member.role === 'captain' && (
                                          <div className="w-3 h-3" title="Капитан команды"><img src='images/star.png' alt='star' /></div>
                                        )}
                                        {(userRole === 'руководитель округа' || userRole === 'координатор' || userRole === 'старший наставник') && (
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
                                              console.error('Archive member failed', e)
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
                  )}
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
                       <img src={selectedMk.image} className="rounded-lg w-full lg:w-60 lg:h-40 mb-6"></img>
                     </div>

                     <a download href={selectedMk.pres} className='text-brand italic hover:underline text-sm'>Скачать презентацию</a>
                     <a download href={selectedMk.method} className='text-brand italic hover:underline text-sm'>Скачать методический материал</a>
          
         
                     <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />
                     
                     <div className="flex w-full flex-col">
                        <p className="text-lg font-semibold text-black mb-2">Критерии домашнего задания</p>
                        <div className='rounded-lg border border-brand p-2'>
                          <p className='text-xs'>Что-то описание блабла</p>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />
                     
                     <div className="flex w-full flex-col gap-2">
                        <p className="text-lg font-semibold text-black mb-2">Отслеживание выполнения</p>
                        <div className='rounded-full border border-brand p-2'>
                          <p className='text-xs'>Название команды</p>
                        </div>
                        <div className='rounded-full border border-brand p-2'>
                          <p className='text-xs'>Название команды</p>
                        </div>
                        <div className='rounded-full border border-brand p-2'>
                          <p className='text-xs'>Название команды</p>
                        </div>
                    </div>

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
            <div className="flex justify-center space-x-2 mt-2">
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
            <div className="flex justify-center space-x-2 mt-2">
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

          <h3 className="text-left normal-case text-brand font-extrabold text-[18px] uppercase pb-3">Видео-уроки</h3>
          <div className="relative">
            <div 
              ref={scrollContainerRefvid}
              className="flex overflow-x-auto space-x-3 hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                          [-webkit-overflow-scrolling:touch] snap-x snap-mandatory"
              onScroll={handleScrollvid}
            >
              {video_lessons.map((video, index) => (
                <div key={index} className="snap-start">
                  <Card 
                    title={video.title}
                    subtitle={video.subtitle}
                    image={video.image}
                  />
                </div>
              ))}
            </div>
            
            {/* Точки прогресса */}
            <div className="flex justify-center space-x-2 mt-2">
              {video_lessons.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => scrollToDotvid(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeDotvid ? 'bg-brand scale-125' : 'bg-gray-300'
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
            <div className="flex justify-center space-x-2 mt-2">
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