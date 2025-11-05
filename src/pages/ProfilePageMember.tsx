import { useState, useEffect, useCallback, useRef } from 'react';
import { membersApi, structureApi, teamsApi } from '@/services/api'
import CalendarPage from '@/components/CalendarPage';
import TeamPage from '@/components/TeamPage';
import { useNavigate } from 'react-router-dom'


// Типы для данных
interface TeamMember {
  id: number;
  number: number;
  fullName: string;
  isCaptain: boolean;
}

interface TeamData {
  teamName: string;
  track: string;
  teamCode: string;
  mentor: string;
  coordinator: string;
  districtManager: string;
  projectDescription: string;
  projectSite: string;
  teamMembers: TeamMember[];
  isEditingTeamName: boolean;
  isEditingProjectDescription: boolean;
}

interface MemberData {
  id: number;
  last_name: string;
  first_name: string;
  patronymic: string;
  username: string;
  education: string;
  level: string;
  grade: string;
  faculty: string;
  format: string;
  phone: string;
  vk_link: string;
  birth_date: string;
  gender: string;
  team_code: string;
  role: string;
  team_name: string;
  mentor: string; 
}

const Card = ({ title, subtitle, image, link, disabled }: { title?: string, subtitle?: string, image?: string, link?: string, disabled?: boolean }) => (
  <div className="flex flex-col w-[210px] flex-shrink-0">
    {link && !disabled ? (
      <a href={link} target="_blank">
        <img src={image} className="rounded-xl h-[130px] w-full object-cover bg-gray-200 cursor-pointer hover:opacity-90 transition-opacity" />
      </a>
    ) : (
      <img src={image} className="rounded-xl h-[130px] w-full object-cover bg-gray-200" />
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



const ProfilePageMember = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sect, setSect] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isProfileExpanded, setIsProfileExpanded] = useState(false)
  const [lastname, setLastname] = useState('')
  const [firstname, setFirstname] = useState('')
  const [patronymic, setPatronymic] = useState('')
  const [email, setEmail] = useState('')
  const [university, setUniversity] = useState('')
  const [educationLevel, setEducationLevel] = useState('')
  const [course, setCourse] = useState('')
  const [faculty, setFaculty] = useState('')
  const [educationForm, setEducationForm] = useState('')
  const [phone, setPhone] = useState('')
  const [vkLink, setVkLink] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')

  const scrollContainerRefmk = useRef<HTMLDivElement>(null);
    const [activeDotmk, setActiveDotmk] = useState(0);
    const scrollContainerRefpr = useRef<HTMLDivElement>(null);
    const [activeDotpr, setActiveDotpr] = useState(0);
    const scrollContainerRefpod = useRef<HTMLDivElement>(null);
    const [activeDotpod, setActiveDotpod] = useState(0);

  
    const mk_list = [
      { title: "Первый мастер-класс", subtitle: 'Проблема. Идея. Решение', image: '/images/mkfirst.png', link: 'https://drive.google.com/drive/mobile/folders/1sb1L1MynvdLxU6jMOxTQR24-Nudx5-DD/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1I2AEC4OltOGGJWFncj8yS1Nqio9PczF3?sort=13&direction=a', disabled: true },
      { title: "Второй мастер-класс", subtitle: 'Customer development. ЦА.', image: '/images/mksecond.png', link: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1PjByX9ckPyi-1ANFeCrDKXq1_cso_4SQ?sort=13&direction=a', disabled: true },
      { title: "Третий мастер-класс", subtitle: 'MVP. HADI - циклы.', image: '/images/mkthird.png', link: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
      { title: "Четвертый мастер-класс", subtitle: 'Бизнес - модель.', image: '/images/mkfourth.png', link: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
      { title: "Пятый мастер-класс", subtitle: 'Финансы.', image: '/images/mkfifth.png', link: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
      { title: "Шестой мастер-класс", subtitle: 'Маркетинг.', image: '/images/mksixth.png', link: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
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

  // Данные команды
  const [teamData, setTeamData] = useState<TeamData>({
    teamName: '',
    track: '',
    teamCode: '',
    mentor: '',
    coordinator: '',
    districtManager: '',
    projectDescription: '',
    projectSite: '',
    teamMembers: [],
    isEditingTeamName: false,
    isEditingProjectDescription: false
  })
  const [isEditingTeamNameOnly, setIsEditingTeamNameOnly] = useState(false)
  const [tempTeamName, setTempTeamName] = useState('')
  const [isEditingTeamData, setIsEditingTeamData] = useState(false)
  const [tempTeamNameForEdit, setTempTeamNameForEdit] = useState('')

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const handleSaveProfile = async () => {
    // Оптимистично обновляем UI
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

    try {
      const memberId = Number(localStorage.getItem('member_id'))
      if (!memberId) return
      await membersApi.update(memberId, {
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
        gender: tempGender,
      })
    } catch (e) {
      console.error('Failed to save profile:', e)
      // опционально: показать уведомление об ошибке/вернуть старые значения
    }
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

  // Загрузка данных пользователя и команды
  useEffect(() => {
    const memberId = Number(localStorage.getItem('member_id'))
    if (!memberId) return
    
    const loadUserData = async () => {
      try {
        // Загрузка данных пользователя
        const resp = await membersApi.getById(memberId)
        const m: MemberData = resp?.data
        if (!m) return
        
        setLastname(m.last_name || '')
        setFirstname(m.first_name || '')
        setPatronymic(m.patronymic || '')
        setEmail(m.username || '')
        setUniversity(m.education || '')
        setEducationLevel(m.level || '')
        setCourse(m.grade || '')
        setFaculty(m.faculty || '')
        setEducationForm(m.format || '')
        setPhone(m.phone || '')
        setVkLink(m.vk_link || '')
        setBirthDate(m.birth_date ? m.birth_date.substring(0,10) : '')
        setGender(m.gender || '')

        // Если у пользователя есть код команды, загружаем данные команды
        if (m.team_code) {
          await loadTeamData(m.team_code)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }

    loadUserData()
  }, [])

// Функция для загрузки координатора и руководителя округа
const loadCoordRo = async (mentorFullName: string): Promise<{ coordinator: string; districtManager: string }> => {
  try {
    if (!mentorFullName || mentorFullName === 'Наставник не назначен') {
      return {
        coordinator: 'Координатор не назначен',
        districtManager: 'Руководитель округа не назначен'
      };
    }

    // Получаем все данные из structureApi
    const structureResp = await structureApi.getAll();
    const structureData = structureResp?.data || [];

    if (!structureData || structureData.length === 0) {
      return {
        coordinator: 'Координатор не назначен',
        districtManager: 'Руководитель округа не назначен'
      };
    }

    // Разделяем ФИО наставника на части
    const nameParts = mentorFullName.trim().split(/\s+/).filter(part => part.length > 0);
    
    if (nameParts.length < 2) {
      return {
        coordinator: 'Координатор не назначен',
        districtManager: 'Руководитель округа не назначен'
      };
    }

    let coordinator = 'Координатор не назначен';
    let districtManager = 'Руководитель округа не назначен';

    // Ищем в структуре по имени и фамилии
    for (const item of structureData) {
      // Проверяем разные комбинации имени и фамилии
      const matches = (
        (item.last_name === nameParts[0] && item.first_name === nameParts[1]) ||
        (item.last_name === nameParts[1] && item.first_name === nameParts[0])
      );

      if (matches) {
        coordinator = item.coord || coordinator;
        districtManager = item.ro || districtManager;
        break; // Нашли совпадение, выходим из цикла
      }
    }

    return {
      coordinator,
      districtManager
    };

  } catch (error) {
    console.error('Error loading coordinator and district manager:', error);
    return {
      coordinator: 'Координатор не назначен',
      districtManager: 'Руководитель округа не назначен'
    };
  }
};
// Функция загрузки данных команды
const loadTeamData = async (teamCode: string) => {
  try {
    // Загрузка всех участников команды
    const membersResp = await membersApi.getAll()
    const allMembers: MemberData[] = membersResp?.data || []
    
    // Фильтруем участников по коду команды
    const teamMembers = allMembers.filter((member: MemberData) => member.team_code === teamCode)
    
    // Находим капитана
    const captain = teamMembers.find((member: MemberData) => member.role === 'captain')

    // Получаем имя наставника из поля mentor любого участника команды
    const mentorName = teamMembers.length > 0 
      ? (teamMembers[0].mentor || 'Наставник не назначен')
      : 'Наставник не назначен'

    const { coordinator, districtManager } = await loadCoordRo(mentorName);
    
    // Форматируем участников для отображения
    const formattedMembers: TeamMember[] = teamMembers.map((member: MemberData, index: number) => ({
      id: member.id,
      number: index + 1,
      fullName: `${member.last_name || ''} ${member.first_name || ''} ${member.patronymic || ''}`.trim(),
      isCaptain: member.role === 'captain'
    }))

    setTeamData({
      teamName: captain?.team_name || 'Название команды не указано',
      track: 'Будет доступен после 1 Воркшопа',
      teamCode: teamCode,
      mentor: mentorName,
      coordinator: coordinator,
      districtManager: districtManager,
      projectDescription: 'Будет доступно на 2 неделе курса',
      projectSite: 'Сайт проекта пока не добавлен',
      teamMembers: formattedMembers,
      isEditingTeamName: false,
      isEditingProjectDescription: false,
    })
  } catch (error) {
    console.error('Error loading team data:', error)
  }
}

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
              <button onClick={() => {pageSelected('myteam')}} className={`flex items-center space-x-4 p-2 text-xl text-white ${sect === 'myteam' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Моя команда</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('calendar')}} className={`flex items-center space-x-4 p-2 text-xl text-white ${sect === 'calendar' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Календарь программы</span>
              </button>
            </li>
            {/* <li>
              <button onClick={() => {pageSelected('team')}} className={`flex items-center space-x-4 p-2 text-xl text-white ${sect === 'team' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Команда программы</span>
              </button>
            </li> */}
            <li>
              <button onClick={() => {pageSelected('courses')}} className={`flex items-center space-x-4 p-2 text-xl text-white ${sect === 'courses' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Материалы курса</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className='flex justify-center items-center flex-col'>
          <img src='images/logowhite.png' alt='logo' className='mt-10 w-80 z-0'/>
          <button onClick={() => {navigate('#')}} className='text-white font-semibold text-sm absolute bottom-6'>Выйти из аккаунта</button>
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
            {/* Левая колонка - профиль */}
            <div className='baseinfo flex flex-col justify-center items-start mt-4 lg:flex-1'>
              <div className='flex flex-col lg:flex-row lg:items-start lg:gap-6 w-full'>
                {/* Аватар */}
                <div className='flex flex-row py-4 relative lg:flex-col lg:items-start'>
                  <div className='bg-[#D9D9D9] rounded-lg w-44 aspect-square'><img src='images/logomember.png' alt='profpic' className='rounded-lg'></img></div>
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
                          <input value={lastname} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        <div className='mb-4 text-left'>
                          <p><strong>Имя</strong></p>
                          <input value={firstname} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
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
                          <input value={lastname} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        <div className='mb-2'>
                          <p><strong>Имя</strong></p>
                          <input value={firstname} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        <div className='mb-2'>
                          <p><strong>Отчество</strong></p>
                          <input value={patronymic} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
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
                            <input value={gender === 'F' ? 'Женский' : gender === 'M' ? 'Мужской' : gender}
                             disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                        </div>
                        
                        <div className='w-full flex flex-col items-center lg:hidden'>
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
                      <div className='flex flex-col gap-2 mb-4'>
                        <div>
                          <p><strong>Фамилия</strong></p>
                          <input value={lastname} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        <div>
                          <p><strong>Имя</strong></p>
                          <input value={firstname} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        <div>
                          <p><strong>Отчество</strong></p>
                          <input value={patronymic} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
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
                          <input value={gender === 'F' ? 'Женский' : gender === 'M' ? 'Мужской' : gender}
                           disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
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
                      <div className='flex flex-col gap-2 mb-4'>
                        <div>
                          <p><strong>Фамилия</strong></p>
                          <input value={tempLastname} onChange={(e) => setTempLastname(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        <div>
                          <p><strong>Имя</strong></p>
                          <input value={tempFirstname} onChange={(e) => setTempFirstname(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        <div>
                          <p><strong>Отчество</strong></p>
                          <input value={tempPatronymic} onChange={(e) => setTempPatronymic(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                      </div>
                      
                      <div className='mb-2'>
                        <p><strong>Электронная почта</strong></p>
                        <input value={tempEmail} onChange={(e) => setTempEmail(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                      <div className='mb-2'>
                        <p><strong>ВУЗ</strong></p>
                        <input value={tempUniversity} onChange={(e) => setTempUniversity(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                      <div className='flex flex-row gap-2 mb-2'>
                        <div className='flex-1'>
                          <p><strong>Уровень подготовки</strong></p>
                          <input value={tempEducationLevel} onChange={(e) => setTempEducationLevel(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                        <div className='flex-1'>
                          <p><strong>Курс обучения</strong></p>
                          <input value={tempCourse} onChange={(e) => setTempCourse(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                      </div>
                      <div className='flex flex-row gap-2 mb-2'>
                        <div className='flex-1'>
                          <p><strong>Факультет</strong></p>
                          <input value={tempFaculty} onChange={(e) => setTempFaculty(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                        <div className='flex-1'>
                          <p><strong>Форма обучения</strong></p>
                          <input value={tempEducationForm} onChange={(e) => setTempEducationForm(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                      </div>
                      <div className='mb-2'>
                        <p><strong>Номер телефона</strong></p>
                        <input value={tempPhone} onChange={(e) => setTempPhone(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                      <div className='mb-2'>
                        <p><strong>Ссылка на ВКонтакте</strong></p>
                        <input value={tempVkLink} onChange={(e) => setTempVkLink(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                      <div className='flex flex-row gap-2 mb-2'>
                        <div className='flex-1'>
                          <p><strong>Дата рождения</strong></p>
                          <input value={tempBirthDate} onChange={(e) => setTempBirthDate(e.target.value)} type='date' className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                        <div className='flex-1'>
                          <p><strong>Пол</strong></p>
                          <select 
                            value={gender === 'F' ? 'Женский' : gender === 'M' ? 'Мужской' : gender} 
                            disabled
                            className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                          >
                            <option value="M">Мужской</option>
                            <option value="F">Женский</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className='flex gap-2 mt-4'>
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

            {/* Вертикальная разделительная линия */}
            <div className="hidden lg:block w-px bg-brand mx-4 mt-8"></div>

            {/* Правая колонка - информация о команде и достижения */}
            <div className="lg:flex-1 mt-4">
  <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4 lg:hidden" />
  
  <div className='leaders mb-4 text-sm'>
    {/* Название команды с редактированием */}
    <div className='mb-2'>
      <p><strong>Название команды</strong></p>
      {!isEditingTeamNameOnly ? (
        <div className='flex gap-2 items-center'>
          <input 
            value={teamData.teamName}
            disabled
            className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
          />
          <button className='text-brand text-xs whitespace-nowrap hover:underline' onClick={() => { setIsEditingTeamNameOnly(true); setTempTeamName(teamData.teamName) }}>Редактировать</button>
        </div>
      ) : (
        <div className='flex gap-2 items-center'>
          <input 
            value={tempTeamName}
            onChange={(e) => setTempTeamName(e.target.value)}
            className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
          />
          <button className='text-brand text-xs whitespace-nowrap hover:underline' onClick={async () => {
            try {
              if (!teamData.teamCode) return
              const newName = (tempTeamName || '').trim()
              if (newName.length === 0) return
              await teamsApi.rename(teamData.teamCode, newName)
              // Обновляем локально
              setTeamData({ ...teamData, teamName: newName })
              setIsEditingTeamNameOnly(false)
            } catch (e) {
              console.error('Failed to rename team:', e)
            }
          }}>Сохранить</button>
          <button className='text-xs hover:underline' onClick={() => setIsEditingTeamNameOnly(false)}>Отмена</button>
        </div>
      )}
    </div>

    <div className='flex flex-row gap-2 mb-2'>
      <div className='flex-1'>
        <p><strong>Трек</strong></p>
        <input value={teamData.track} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
      </div>
      <div className='flex-1'>
        <p><strong>Код команды</strong></p>
        <input value={teamData.teamCode} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
      </div>
    </div>
    
    <div className='mb-2'>
      <p><strong>Наставник</strong></p>
      <input value={teamData.mentor} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
    </div>
    
    <div className='mb-2'>
      <p><strong>Координатор</strong></p>
      <input value={teamData.coordinator} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
    </div>
    
    <div className='mb-2'>
      <p><strong>Руководитель округа</strong></p>
      <input value={teamData.districtManager} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
    </div>

    {/* Описание проекта (только просмотр) */}
    <div className='mb-2'>
      <p><strong>Описание проекта</strong></p>
      <input 
        value={teamData.projectDescription}
        disabled
        className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
      />
    </div>
    
    <p><strong>Команда проекта:</strong></p>
    <div className='w-full px-1 py-3 border border-brand rounded-2xl bg-white items-center mt-2'>
      {teamData.teamMembers.map((member: TeamMember) => (
        <div key={member.id} className='w-full flex flex-row items-center justify-between px-4 py-2'>
          <div className='flex flex-row items-center gap-4 flex-1'>
            <p className="text-brand text-xs min-w-[20px]">{member.number}</p>
            <p className="italic text-xs flex-1 capitalize">{member.fullName}</p>
          </div>
          {member.isCaptain && (
            <div className="w-3 h-3 lg:mr-10" title="Капитан команды"><img src='images/star.png' alt='star'></img></div>
          )}
        </div>
      ))}
      {teamData.teamMembers.length === 0 && (
        <p className="italic text-xs text-center py-2">Участники не найдены</p>
      )}
    </div>
  </div>
</div>
          </div>
        )}
        {sect==='myteam' && (
          // <Navigate to="/my-team" />
          <div className="lg:flex lg:gap-6">
            {/* Левая колонка - информация о команде */}
            <div className='baseinfo flex flex-col justify-center items-start mt-4 lg:flex-1'>
              <div className='flex flex-col lg:flex-row lg:items-start lg:gap-6 w-full'>
                {/* Аватар */}
                <div className='flex flex-row py-4 relative lg:flex-col lg:items-start'>
                  <div className='bg-[#D9D9D9] rounded-lg w-44 aspect-square'></div>
                  <img src='images/heading-icon.png' alt='logo' className='absolute w-48 right-5 lg:-right-0 lg:top-40'/>
                </div>
                
                {/* Информация о команде */}
                <div className='lg:flex-1 lg:w-full'>
                  <div className='w-full text-xs'>
                    <div className='mb-2'>
                      <p><strong>Название команды</strong></p>
                      {!isEditingTeamData ? (
                        <input 
                          value={teamData.teamName}
                          disabled
                          className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                        />
                      ) : (
                        <input 
                          value={tempTeamNameForEdit}
                          onChange={(e) => setTempTeamNameForEdit(e.target.value)}
                          className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                        />
                      )}
                    </div>

                    <div className='flex flex-row gap-2 mb-2'>
                      <div className='flex-1'>
                        <p><strong>Трек</strong></p>
                        <input value={teamData.track} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                      <div className='flex-1'>
                        <p><strong>Код команды</strong></p>
                        <input value={teamData.teamCode} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                    </div>
                    
                    <div className='mb-2'>
                      <p><strong>Наставник</strong></p>
                      <input value={teamData.mentor} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                    </div>
                    
                    <div className='mb-2'>
                      <p><strong>Координатор</strong></p>
                      <input value={teamData.coordinator} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                    </div>
                    
                    <div className='mb-2'>
                      <p><strong>Руководитель округа</strong></p>
                      <input value={teamData.districtManager} disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                    </div>

                    {/* Описание проекта */}
                    <div className='mb-2'>
                      <p><strong>Описание проекта</strong></p>
                      <input 
                        value={teamData.projectDescription}
                        disabled
                        className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                      />
                    </div>

                    <div className='mb-2'>
                      <p><strong>Сайт проекта</strong></p>
                      <input 
                        value={teamData.projectSite}
                        disabled
                        className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                      />
                    </div>
                    
                    <p><strong>Команда проекта:</strong></p>
                    <div className='w-full px-1 py-3 border border-brand rounded-2xl bg-white items-center mt-2'>
                      {teamData.teamMembers.map((member: TeamMember) => (
                        <div key={member.id} className='w-full flex flex-row items-center justify-between px-4 py-2'>
                          <div className='flex flex-row items-center gap-4 flex-1'>
                            <p className="text-brand text-xs min-w-[20px]">{member.number}</p>
                            <p className="italic text-xs flex-1 capitalize">{member.fullName}</p>
                          </div>
                          {member.isCaptain && (
                            <div className="w-3 h-3 lg:mr-10" title="Капитан команды"><img src='images/star.png' alt='star'></img></div>
                          )}
                        </div>
                      ))}
                      {teamData.teamMembers.length === 0 && (
                        <p className="italic text-xs text-center py-2">Участники не найдены</p>
                      )}
                    </div>
                    
                    <div className='w-full flex flex-col items-center mt-4'>
                      {!isEditingTeamData ? (
                        <button 
                          className='text-brand mt-2 hover:underline italic'
                          onClick={() => {
                            setIsEditingTeamData(true)
                            setTempTeamNameForEdit(teamData.teamName)
                          }}
                        >
                          Редактировать данные
                        </button>
                      ) : (
                        <div className='flex gap-2'>
                          <button 
                            className='bg-brand text-white rounded-full px-4 py-2 text-sm'
                            onClick={async () => {
                              try {
                                if (!teamData.teamCode) return
                                const newName = (tempTeamNameForEdit || '').trim()
                                if (newName.length === 0) return
                                await teamsApi.rename(teamData.teamCode, newName)
                                // Обновляем локально
                                setTeamData({ ...teamData, teamName: newName })
                                setIsEditingTeamData(false)
                              } catch (e) {
                                console.error('Failed to rename team:', e)
                              }
                            }}
                          >
                            Сохранить
                          </button>
                          <button 
                            className='border border-brand text-brand rounded-full px-4 py-2 text-sm'
                            onClick={() => setIsEditingTeamData(false)}
                          >
                            Отмена
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Вертикальная разделительная линия */}
            <div className="hidden lg:block w-px bg-brand mx-4 mt-8"></div>
            <div className="lg:flex-1 mt-4">
  
  <div className='leaders mb-4 text-sm'>
  <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto lg:hidden" />
                <div className='mb-4'>
                  <div className='flex justify-between items-center my-3 lg:flex-col lg:items-start'>
                    <span className="text-sm font-bold lg:mb-2">Место в общем рейтинге:</span>
                    <span className="text-2xl font-bold text-brand lg:text-4xl">-</span>
                  </div>
                  <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-3" />
                  <div className='flex justify-between items-center lg:flex-col lg:items-start'>
                    <span className="text-sm font-bold lg:mb-2">Место в рейтинге трека:</span>
                    <span className="text-2xl font-bold text-brand lg:text-4xl">-</span>
                  </div>
                </div>
  <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto" />
  <div>
                  <p className="text-sm font-semibold my-4">Получено баллов:</p>
                  
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Первое д/з</span>
                      <div className="flex items-center gap-2 ">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm text-brand italic">Заблокировано</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Второе д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm  text-brand italic">Заблокировано</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Третье д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm  text-brand italic">Заблокировано</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Четвертое д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm  text-brand italic">Заблокировано</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Промежуточный ВШ</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm  text-brand italic">Заблокировано</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Пятое д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm  text-brand italic">Заблокировано</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Шестое д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm  text-brand italic">Заблокировано</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Седьмое д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm  text-brand italic">Заблокировано</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Восьмое д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm  text-brand italic">Заблокировано</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Финальный ВШ</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm  text-brand italic">Заблокировано</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {sect==='calendar' && (
          <CalendarPage />
        )}
        {sect==='team' && (
          <TeamPage />
        )}
        {sect==='courses' && (
              <section className="space-y-3">
              <h3 className="text-left normal-case text-brand font-extrabold text-[18px] uppercase py-3">Мастер-классы</h3>
        
              <div className="relative">
                <div 
                  ref={scrollContainerRefmk}
                  className="flex overflow-x-auto space-x-3 hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                              [-webkit-overflow-scrolling:touch] pb-4 snap-x snap-mandatory"
                  onScroll={handleScrollmk}
                >
                  {mk_list.map((mk, index) => (
                    <div key={index} className="snap-start">
                      <Card 
                        title={mk.title}
                        subtitle={mk.subtitle}
                        image={mk.image}
                        link={mk.link}
                        disabled={mk.disabled}
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
            </section>
        )}
      </div>
    </section>
  )
}

export default ProfilePageMember;