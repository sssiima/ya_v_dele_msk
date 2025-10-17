import { useState, useEffect } from 'react';
import { membersApi, structureApi } from '@/services/api'

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

const ProfilePageMember = () => {
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
      projectDescription: 'Описание проекта пока не добавлено',
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
            <li>
              <button onClick={() => {pageSelected('team')}} className={`flex items-center space-x-4 p-2 text-xl text-white ${sect === 'team' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Команда программы</span>
              </button>
            </li>
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
            {/* Левая колонка - профиль */}
            <div className='baseinfo flex flex-col justify-center items-start mt-4 lg:flex-1'>
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
    {/* Название команды (только просмотр) */}
    <div className='mb-2'>
      <p><strong>Название команды</strong></p>
      <input 
        value={teamData.teamName}
        disabled
        className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
      />
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
                      <input 
                        value={teamData.teamName}
                        disabled
                        className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                      />
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
                      <button className='text-brand mt-2 hover:underline italic'>
                        Редактировать данные
                      </button>
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
                    <span className="text-2xl font-bold text-brand lg:text-4xl">1/100</span>
                  </div>
                  <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-3" />
                  <div className='flex justify-between items-center lg:flex-col lg:items-start'>
                    <span className="text-sm font-bold lg:mb-2">Место в рейтинге трека:</span>
                    <span className="text-2xl font-bold text-brand lg:text-4xl">1/100</span>
                  </div>
                </div>
  <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto" />
  <div>
                  <p className="text-sm font-semibold my-4">Получено баллов:</p>
                  
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span className="text-sm text-brand">Первое д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-16" />
                        </button>
                        <span className="text-sm font-semibold"></span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm text-brand">Второе д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-16" />
                        </button>
                        <span className="text-sm font-semibold"></span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm text-brand">Третье д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-16" />
                        </button>
                        <span className="text-sm font-semibold"></span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm text-brand">Четвертое д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-16" />
                        </button>
                        <span className="text-sm font-semibold"></span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm text-brand">Промежуточный ВШ</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-16" />
                        </button>
                        <span className="text-sm font-semibold"></span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm text-brand">Пятое д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-16" />
                        </button>
                        <span className="text-sm font-semibold"></span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm text-brand">Шестое д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-16" />
                        </button>
                        <span className="text-sm font-semibold"></span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm text-brand">Седьмое д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-16" />
                        </button>
                        <span className="text-sm font-semibold"></span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm text-brand">Восьмое д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-16" />
                        </button>
                        <span className="text-sm font-semibold"></span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm text-brand">Финальный ВШ</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-16" />
                        </button>
                        <span className="text-sm font-semibold"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {sect==='calendar' && (
          <div>Календарь программы</div>
        )}
        {sect==='team' && (
          <div>Команда программы</div>
        )}
      </div>
    </section>
  )
}

export default ProfilePageMember;