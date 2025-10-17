import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const MyTeam = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sect, setSect] = useState('myteam');

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
              <button onClick={() => {pageSelected('profile')}} className={`flex items-center text-center space-x-4 p-2 text-xl text-white hover:font-bold`}>
                <span>Личный кабинет</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('myteam')}} className={`flex items-center space-x-4 p-2 text-xl text-white font-bold`}>
                <span>Моя команда</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('calendar')}} className={`flex items-center space-x-4 p-2 text-xl text-white hover:font-bold`}>
                <span>Календарь программы</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('team')}} className={`flex items-center space-x-4 p-2 text-xl text-white hover:font-bold`}>
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
          <Navigate to="/profile-member" />
        )}
        {sect==='myteam' && (
          <div className="lg:flex lg:gap-20 lg:items-start">
            {/* Левая колонка - основная информация о команде */}
            <div className='flex flex-col justify-center items-start mt-5 lg:flex-1'>
              <div className='flex flex-col lg:flex-row lg:items-start lg:gap-8 w-full'>
                {/* Аватар/изображение проекта */}
                <div className='flex flex-row py-4 relative lg:flex-col lg:items-start'>
                  <div className='bg-[#D9D9D9] rounded-lg w-44 aspect-square'></div>
                </div>
                
                {/* Основные поля команды */}
                <div className='lg:flex-1 lg:w-full'>
                  <div className='w-full text-sm'>
                    <div className='flex flex-row gap-3 mb-3'>
                      <div className='flex-1'>
                        <p className="text-sm font-semibold mb-1"><strong>Название команды</strong></p>
                        <input value="Название команды" disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[40px] flex items-center italic text-sm"/>
                      </div>
                      <div className='flex-1'>
                        <p className="text-sm font-semibold mb-1"><strong>Наставник</strong></p>
                        <input value="Наставник" disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[40px] flex items-center italic text-sm"/>
                      </div>
                    </div>
                    
                    <div className='flex flex-row gap-3 mb-3'>
                      <div className='flex-1'>
                        <p className="text-sm font-semibold mb-1"><strong>Трек</strong></p>
                        <input value="Трек" disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[40px] flex items-center italic text-sm"/>
                      </div>
                      <div className='flex-1'>
                        <p className="text-sm font-semibold mb-1"><strong>Координатор</strong></p>
                        <input value="Координатор" disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[40px] flex items-center italic text-sm"/>
                      </div>
                    </div>

                    <div className='flex flex-row gap-3 mb-3'>
                      <div className='flex-1'>
                        <p className="text-sm font-semibold mb-1"><strong>Код команды</strong></p>
                        <input value="Код команды" disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[40px] flex items-center italic text-sm"/>
                      </div>
                      <div className='flex-1'>
                        <p className="text-sm font-semibold mb-1"><strong>Руководитель округа</strong></p>
                        <input value="Руководитель округа" disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[40px] flex items-center italic text-sm"/>
                      </div>
                    </div>

                    {/* Описание проекта */}
                    <div className='mb-3'>
                      <p className="text-sm font-semibold mb-1"><strong>Описание проекта</strong></p>
                      <textarea 
                        value="Описание проекта пока не добавлено"
                        disabled 
                        className="w-full px-4 py-3 border border-brand rounded-2xl bg-white h-24 flex items-start text-sm resize-none"
                        rows={3}
                      />
                    </div>

                    {/* Сайт проекта */}
                    <div className='mb-4'>
                      <p className="text-sm font-semibold mb-1"><strong>Сайт проекта</strong></p>
                      <input value="Сайт проекта" disabled className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[40px] flex items-center italic text-sm"/>
                    </div>
                    
                    <div className='w-full flex flex-col items-center'>
                      <button className='text-brand text-sm hover:underline'>
                        Редактировать данные
                      </button>
                    </div>

                    <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto mt-6 mb-4 lg:hidden" />

                    {/* Команда проекта */}
                    <div className='mt-6 mb-2'>
                      <p className="text-sm font-semibold mb-3"><strong>Команда проекта:</strong></p>
                      <div className='w-full px-3 py-4 border border-brand rounded-2xl bg-white items-center'>
                        <div className='w-full flex flex-row items-center justify-between px-2 py-2'>
                          <div className='flex flex-row items-center gap-3 flex-1'>
                            <p className="text-brand text-sm min-w-[20px]">1</p>
                            <p className="text-sm flex-1">Фамилия Имя Отчество</p>
                          </div>
                          <div className="w-3 h-3 lg:mr-10" title="Капитан команды"><img src='images/star.png' alt='star'></img></div>
                        </div>
                        <div className='w-full flex flex-row items-center justify-between px-2 py-2'>
                          <div className='flex flex-row items-center gap-3 flex-1'>
                            <p className="text-brand text-sm min-w-[20px]">2</p>
                            <p className="text-sm flex-1">Фамилия Имя Отчество</p>
                          </div>
                        </div>
                        <div className='w-full flex flex-row items-center justify-between px-2 py-2'>
                          <div className='flex flex-row items-center gap-3 flex-1'>
                            <p className="text-brand text-sm min-w-[20px]">3</p>
                            <p className="text-sm flex-1">Фамилия Имя Отчество</p>
                          </div>
                        </div>
                        <div className='w-full flex flex-row items-center justify-between px-2 py-2'>
                          <div className='flex flex-row items-center gap-3 flex-1'>
                            <p className="text-brand text-sm min-w-[20px]">4</p>
                            <p className="text-sm flex-1">Фамилия Имя Отчество</p>
                          </div>
                        </div>
                        <div className='w-full flex flex-row items-center justify-between px-2 py-2'>
                          <div className='flex flex-row items-center gap-3 flex-1'>
                            <p className="text-brand text-sm min-w-[20px]">5</p>
                            <p className="text-sm flex-1">Фамилия Имя Отчество</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Правая колонка - рейтинг и баллы */}
            <div className="lg:w-80 mt-4">
              <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4 lg:hidden" />
              
              <div className='leaders mb-4 text-sm'>

                {/* Рейтинг */}
                <div className='mb-4'>
                  <div className='flex justify-between items-center mb-3'>
                    <span className="text-sm font-bold">Место в общем рейтинге:</span>
                    <span className="text-2xl font-bold text-brand">1/100</span>
                  </div>
                  <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-3" />
                  <div className='flex justify-between items-center'>
                    <span className="text-sm font-bold">Место в рейтинге трека:</span>
                    <span className="text-2xl font-bold text-brand">1/100</span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />

                {/* Получено баллов */}
                <div>
                  <p className="text-sm font-semibold mb-4">Получено баллов:</p>
                  
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span className="text-sm">Первое д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="w-6 h-6 bg-brand rounded flex items-center justify-center">
                          <img src="/images/check.png" alt="check" className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold">15</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm">Второе д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="w-6 h-6 bg-brand rounded flex items-center justify-center">
                          <img src="/images/check.png" alt="check" className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold">15</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm">Третье д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="w-6 h-6 bg-brand rounded flex items-center justify-center">
                          <img src="/images/check.png" alt="check" className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold">15</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm">Четвертое д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="w-6 h-6 bg-brand rounded flex items-center justify-center">
                          <img src="/images/check.png" alt="check" className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold">15</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm">Промежуточный ВШ</span>
                      <div className="flex items-center gap-2">
                        <button className="w-6 h-6 bg-brand rounded flex items-center justify-center">
                          <img src="/images/check.png" alt="check" className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold">15</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm">Пятое д/з</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">15</span>
                        <button className="bg-brand text-white px-3 py-1 rounded text-sm">
                          Загрузить
                        </button>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm">Шестое д/з</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">15</span>
                        <button className="bg-brand text-white px-3 py-1 rounded text-sm">
                          Загрузить
                        </button>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm">Седьмое д/з</span>
                      <button className="bg-brand text-white px-3 py-1 rounded text-sm">
                        Загрузить
                      </button>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm">Восьмое д/з</span>
                      <button className="bg-gray-400 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                        <img src="/images/check.png" alt="lock" className="w-3 h-3" />
                        Загрузить
                      </button>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className="text-sm">Финальный ВШ</span>
                      <button className="bg-gray-400 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                        <img src="/images/web-site.png" alt="upload" className="w-3 h-3" />
                        Загрузить
                      </button>
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

export default MyTeam