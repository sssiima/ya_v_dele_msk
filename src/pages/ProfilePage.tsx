import { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sect, setSect] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [teamVisible, setTeamVisible] = useState(false)
  const [isProfileExpanded, setIsProfileExpanded] = useState(false)
  const [lastname, setLastname] = useState('Фамилия')
  const [firstname, setFirstname] = useState('Имя')
  const [patronymic, setPatronymic] = useState('Отчество')
  const [email, setEmail] = useState('email@example.com')
  const [university, setUniversity] = useState('Название ВУЗа')
  const [educationLevel, setEducationLevel] = useState('Бакалавриат')
  const [course, setCourse] = useState('3')
  const [faculty, setFaculty] = useState('Факультет')
  const [educationForm, setEducationForm] = useState('Очная')
  const [phone, setPhone] = useState('+7 (999) 999-99-99')
  const [vkLink, setVkLink] = useState('https://vk.com/username')
  const [birthDate, setBirthDate] = useState('2000-01-01')
  const [gender, setGender] = useState('Мужской')

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
    setIsProfileExpanded(true) // Автоматически разворачиваем при редактировании
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
            <li>
              <button onClick={() => {pageSelected('reporting')}} className={`flex items-center space-x-4 p-2 text-xl text-white ${sect === 'reporting' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Отчетность</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('handy')}} className={`flex items-center space-x-4 p-2 text-xl text-white ${sect === 'handy' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Хэндик</span>
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
          <div>
            <div className='baseinfo flex flex-col justify-center items-start mt-4'>
              <div className='flex flex-row py-4 relative'>
                <div className='bg-[#D9D9D9] rounded-lg w-44 aspect-square'></div>
                <img src='images/logowhite.png' alt='logo' className='absolute -right-36 top-6 w-44 h-auto z-10'/>
              </div>
              
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

              {/* Режим 3: Редактирование (все поля активны) + кнопки сохранить/отменить */}
              {isEditing && (
                <div className='w-full text-xs'>
                  <div className='mb-2'>
                    <p><strong>Фамилия</strong></p>
                    <input value={tempLastname} onChange={(e) => setTempLastname(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                  </div>
                  <div className='mb-2'>
                    <p><strong>Имя</strong></p>
                    <input value={tempFirstname} onChange={(e) => setTempFirstname(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                  </div>
                  <div className='mb-2'>
                    <p><strong>Отчество</strong></p>
                    <input value={tempPatronymic} onChange={(e) => setTempPatronymic(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
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
                      <input value={tempGender} onChange={(e) => setTempGender(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
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
            <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />
            
            <div className='leaders mb-4 text-sm'>
              <p><strong>Координаторы:</strong></p>
              <div className='w-full px-1 py-3 border border-brand rounded-2xl bg-white items-center mt-2'>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1 mt-1'>
                    <p className="text-brand text-xs">1</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">2</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">3</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">4</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">5</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                </div>
             </div>

            <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />
            
            <div className='leaders mb-4 text-sm'>
              <p><strong>Старшие наставники:</strong></p>
              <div className='w-full px-1 py-3 border border-brand rounded-2xl bg-white items-center mt-2'>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1 mt-1'>
                    <p className="text-brand text-xs">1</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">2</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">3</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">4</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">5</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                </div>
            </div>

            <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />
            
            <div className='leaders mb-4 text-sm'>
              <p><strong>Наставники:</strong></p>
              <div className='w-full px-1 py-3 border border-brand rounded-2xl bg-white items-center mt-2'>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1 mt-1'>
                    <p className="text-brand text-xs">1</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">2</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">3</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">4</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">5</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                </div>
            </div>
          
            
            <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />
            
            
            <div className='teams mb-4 text-sm'>
              <p><strong>Команды:</strong></p>
              <div className='flex flex-row gap-2 w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] items-center justify-center mt-2'>
                  <button className='w-full flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-2 items-center'>
                      <img src='/images/teamlist.png' alt='.' className="w-2 h-3"/>
                      <p className="italic text-xs">Название команды</p>
                    </div>
                    <p className="text-xs text-brand">1/100</p>
                  </button>
                </div>
              {!teamVisible && (
                <div className='flex flex-row gap-2 w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] items-center justify-center mt-2'>
                  <button className='w-full flex flex-row justify-between items-center' onClick={() => setTeamVisible(!teamVisible)}>
                    <div className='flex flex-row gap-2 items-center'>
                      <img src='/images/teamlist.png' alt='.' className="w-2 h-3"/>
                      <p className="italic text-xs">Название команды</p>
                    </div>
                    <p className="text-xs text-brand">1/100</p>
                  </button>
                </div>
              )}
              {teamVisible && (
                <div className='w-full px-0 py-3 pt-0 border border-t-0 border-brand rounded-b-3xl rounded-t-none bg-white min-h-[40px] items-center mt-2'>
                  <button className='w-full flex flex-row justify-between items-center px-4 py-3 border border-brand rounded-full bg-white min-h-[40px]' onClick={() => setTeamVisible(!teamVisible)}>
                    <div className='flex flex-row gap-2 items-center'>
                      <img src='/images/teamlist.png' alt='.' className="w-2 h-3 rotate-90"/>
                      <p className="italic text-xs">Название команды</p>
                    </div>
                    <p className="text-xs text-brand">1/100</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">1</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">2</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">3</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">4</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                  <button className='w-full flex flex-row gap-4 m-3 mb-1'>
                    <p className="text-brand text-xs">5</p>
                    <p className="italic text-xs">Фамилия Имя Отчество</p>
                  </button>
                </div>
              )}
              <div className='flex flex-row gap-2 w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] items-center justify-center mt-2'>
                  <button className='w-full flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-2 items-center'>
                      <img src='/images/teamlist.png' alt='.' className="w-2 h-3"/>
                      <p className="italic text-xs">Название команды</p>
                    </div>
                    <p className="text-xs text-brand">1/100</p>
                  </button>
                </div>
                <button className=' w-full mt-4 text-xs text-brand hover:underline'>Редактировать команды</button>
            </div>


            {/* <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />
            
            <div className='trophays mb-4 text-sm'>
              <p><strong>Достижения:</strong></p>
              <div className='flex flex-row gap-2 w-full min-h-[140px] items-center mt-2'>
                <div className='border border-brand bg-white min-h-[140px] w-[50%] px-4 py-3 rounded-2xl'></div>
                <div className='border border-brand bg-white min-h-[140px] w-[50%] px-4 py-3 rounded-2xl flex items-center justify-center'>
                  <span className="text-4xl text-brand">+</span>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" /> */}

            <div>
            <p><strong className='text-sm'>Количество участников: <span className="text-brand">34/400</span></strong></p>
            </div>
            
            <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />
            
            <div className='leaders mb-4 text-sm'>
              <p><strong>Координатор:</strong></p>
              <p className="w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] flex items-center italic text-xs mt-1">Фамилия Имя</p>
              <p className='mt-4'><strong>Руководитель округа:</strong></p>
              <p className="w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] flex items-center italic text-xs mt-1">Фамилия Имя</p>
            </div>
          </div>
        )}
        {sect==='calendar' && (
          <div>Календарь программы</div>
        )}
        {sect==='materials' && (
          <div>Материалы курса</div>
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
