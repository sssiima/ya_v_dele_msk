import { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sect, setSect] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [teamVisible, setTeamVisible] = useState(false)
  const [lastname, setLastname] = useState('Фамилия')
  const [firstname, setFirstname] = useState('Имя')

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

  // Определяем мобильное устройство
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
              <button onClick={() => {pageSelected('profile')}} className="flex items-center text-center space-x-4 p-2 text-xl text-white hover:font-bold">
                <span>Личный кабинет</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('calendar')}} className="flex items-center space-x-4 p-2 text-xl text-white hover:font-bold">
                <span>Календарь программы</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('team')}} className="flex items-center space-x-4 p-2 text-xl text-white hover:font-bold">
                <span>Команда программы</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('materials')}} className="flex items-center space-x-4 p-2 text-xl text-white hover:font-bold">
                <span>Материалы курса</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('handy')}} className="flex items-center space-x-4 p-2 text-xl text-white hover:font-bold">
                <span>Хэндик</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('rating')}} className="flex items-center space-x-4 p-2 text-xl text-white hover:font-bold">
                <span>Рейтинг команд</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('reporting')}} className="flex items-center space-x-4 p-2 text-xl text-white hover:font-bold">
                <span>Отчетность</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className='flex justify-center items-center'>
        <img src='images/logowhite.png' alt='logo' className='mt-0 w-80 z-0 '/>
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
                <button><img src="/images/ring.png" alt="notifications" className="w-5"></img></button>
              </div>
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
            <div className='baseinfo flex flex-col justify-center items-center'>
              <div className='flex flex-row py-4'>
                {/* <img src='' alt='photo' className='rounded-lg w-50 h-50 '/> */}
                <div className='bg-[#D9D9D9] rounded-lg w-40 h-40 aspect-square'></div>
                <img src='images/heading-icon.png' alt='logo' className='w-40'/>
              </div>
            {!isEditing && ( <div className='flex flex-col justify-center items-center'>
              <h1 className="capitalize text-2xl mt-4">{lastname} {firstname}</h1>
              <p className='text-s text-brand'>наставник</p>
              <button className='text-brand italic mt-6 mb-2 hover:underline' onClick={() => {setIsEditing(true)}}>Редактировать профиль</button>
            </div>)}
            {isEditing && (
              <div className='w-full text-xs'>
                <div className='mt-2 mb-4'>
                  <p><strong>Фамилия</strong></p>
                  <input value={lastname} onChange={(e) => setLastname(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mb-2"/>
                </div>
                <div className='mt-2 mb-4'>
                  <p><strong>Имя</strong></p>
                  <input value={firstname} onChange={(e) => setFirstname(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mb-2"/>
                </div>
                <div className='mt-2 mb-4'>
                  <p><strong>Отчество</strong></p>
                  <input className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mb-2"/>
                </div>
                <div className='mt-2 mb-4'>
                  <p><strong>Электронная почта</strong></p>
                  <input className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mb-2"/>
                </div>
                <div className='flex flex-row gap-2'>
                <div className='mb-2'>
                  <p><strong>ВУЗ</strong></p>
                  <input className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mb-2"/>
                </div>
                <div className='mb-2'>
                  <p><strong>Курс</strong></p>
                  <input className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mb-2"/>
                </div>
                </div>
                <div className='flex flex-row gap-2'>
                <div className='mb-2'>
                  <p><strong>Факультет</strong></p>
                  <input className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mb-2"/>
                </div>
                <div className='mb-2'>
                  <p><strong>Основа обучения</strong></p>
                  <input className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mb-2"/>
                </div>
                </div>
                <div className='mt-2 mb-4'>
                  <p><strong>Номер телефона</strong></p>
                  <input className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mb-2"/>
                </div>
                <div className='mt-2 mb-4'>
                  <p><strong>Ссылка на ВКонтакте</strong></p>
                  <input className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mb-2"/>
                </div>
                <div className='flex flex-row gap-2'>
                <div className='mb-2'>
                  <p><strong>Дата рождения</strong></p>
                  <input type='date' className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mb-2"/>
                </div>
                <div className='mb-2'>
                  <p><strong>Пол</strong></p>
                  <input className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mb-2"/>
                </div>
                </div>
                <button className='bg-brand text-white rounded-full w-full p-2 italic mt-2 mb-2 text-sm ' onClick={() => {setIsEditing(false)}}>Сохранить</button>
              </div>
            )}
            </div>
            <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto" />
            <div className='teams mt-2 mb-4'>
              <p><strong>Команды:</strong></p>
            <div className='flex flex-row gap-2 w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] flex items-center '>
              <button className='w-full flex flex-row gap-2' onClick={() => setTeamVisible(!teamVisible)}>
              <img src='/images/teamlist.png' alt='.' className="w-2 h-3"></img>
              <p className="italic text-xs">Команда</p>
              </button>
            </div>
            {teamVisible && (<div className='w-full px-4 py-3 border border-brand rounded-3xl bg-white min-h-[40px] items-center'>
              <button className='w-full flex flex-row gap-2 m-1'>
              <p className="text-brand text-xs">1</p>
              <p className="italic text-xs">Фамилия Имя Отчество</p>
              </button>
              <button className='w-full flex flex-row gap-2 m-1'>
              <p className="text-brand text-xs">2</p>
              <p className="italic text-xs">Фамилия Имя Отчество</p>
              </button>
              <button className='w-full flex flex-row gap-2 m-1'>
              <p className="text-brand text-xs">3</p>
              <p className="italic text-xs">Фамилия Имя Отчество</p>
              </button>
            </div>)}
            

            </div>
            <div className='members mt-2 mb-4'>
            <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto mb-2" />
              <p><strong>Участники без команды:</strong></p>
              <div className='flex flex-row gap-2 w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] flex items-center '>
              <p className="text-brand text-xs">1</p>
              <p className="italic text-xs">Фамилия Имя Отчество</p>
              </div>
              

            </div>
            <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto" />
            <div className='trophays mt-2 mb-4'>
              <p><strong>Достижения:</strong></p>
              <div className='flex flex-row gap-2 w-full  min-h-[140px] flex items-center '>
                <div className='border border-brand bg-white min-h-[140px] w-[50%] px-4 py-3 rounded-2xl'></div>
                <div className='border border-brand bg-white min-h-[140px] w-[50%] px-4 py-3 rounded-2xl'></div>
              </div>

            </div>
            <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto" />
            <div className='leaders mt-2 mb-4'>
              <p><strong>Координатор</strong></p>
              <p className="w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] flex items-center italic text-xs">Фамилия Имя</p>
              <p><strong>Руководитель округа</strong></p>
              <p className="w-full px-4 py-3 border border-brand rounded-full bg-white min-h-[40px] flex items-center italic text-xs">Фамилия Имя</p>

            </div>
          </div>
        )}
        {sect==='calendar' && (
          <div>Календарь программы</div>
        )}
        {sect==='team' && (
          <div>Команда программы</div>
        )}
        {sect==='materials' && (
          <div>Материалы курса</div>
        )}
        {sect==='handy' && (
          <div>handy</div>
        )}
        {sect==='rating' && (
          <div>Рейтинг</div>
        )}
        {sect==='reporting' && (
          <div>Отчетность</div>
        )}
      </div>
    </section>
  )
}

export default ProfilePage;