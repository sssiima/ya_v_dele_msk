import { useState, useEffect, useRef } from 'react';

interface Event {
  id: number;
  title: string;
  date: string;
  image: string;
  description?: string;
  location?: string;
  time?: string;
}

const CalendarPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isMember, setIsMember] = useState(false);
  
  // Состояния формы
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [teamName, setTeamName] = useState('');
  const [passportData, setPassportData] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [confirmParticipation, setConfirmParticipation] = useState(false);
  const daySelectorRef = useRef<HTMLDivElement>(null);
  
  const availableDays = ['15 ноября', '18 ноября'];
  
  // Определяем, является ли пользователь участником
  useEffect(() => {
    const memberId = localStorage.getItem('member_id');
    setIsMember(!!memberId);
  }, []);
  
  // Обработка клика вне селектора дней
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (daySelectorRef.current && !daySelectorRef.current.contains(event.target as Node)) {
        setShowDaySelector(false);
      }
    };
    if (showDaySelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDaySelector]);
  
  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log({
      lastName,
      firstName,
      patronymic,
      teamName: isMember ? teamName : undefined,
      passportData,
      selectedDays: isMember ? selectedDays : undefined,
      confirmParticipation
    });
    alert('Заявка отправлена!');
  };

  // Моковые данные для событий
  const upcomingEvents: Event[] = [
    // {
    //   id: 2,
    //   title: 'Открытие',
    //   date: '7 ноября',
    //   image: 'images/opening.jpeg',
    //   description: 'Торжественный старт нового этапа программы! Яркие выступления, вдохновляющие истории и знакомство участников с командой проекта.',
    //   location: 'ЦДП (ул. Покровка, д. 47)',
    //   time: '16:00',
    // },
    {
      id: 3,
      title: 'Промежуточный воркшоп',
      date: '15 и 18 ноября',
      image: 'images/vsh.jpeg',
      description: 'Время подвести итоги и скорректировать курс. Команды представят первые результаты и получат обратную связь от экспертов, чтобы двигаться дальше ещё увереннее.',
      location: 'РЭУ им.Плеханова',
      time: 'уточняется',
    },
    {
      id: 4,
      title: '«Прожарка от Сбера»',
      date: '4 декабря',
      image: 'images/prozh.jpeg',
      description: 'Жёстко, честно и по делу — команды представят свои проекты перед экспертами Сбера и получат ценные инсайты для доработки. Настоящая тренировка перед финалом!',
      location: 'СберСити',
      time: '10:00',
    },
    // {
    //   id: 5,
    //   title: 'Финальный воркшоп',
    //   date: '6-7 декабря',
    //   image: 'images/event2.jpeg',
    //   description: 'Последние штрихи перед главным событием. Финальные репетиции, доработка презентаций и советы от менторов — всё ради яркого выступления на Битве проектов.',
    //   location: '',
    //   time: '',
    // },
    // {
    //   id: 6,
    //   title: 'Битва проектов',
    //   date: '14 декабря',
    //   image: 'images/event2.jpeg',
    //   description: 'Финал программы! Лучшие команды презентуют свои идеи перед жюри и будут бороться за победу. Кульминация пути и праздник для участников и организаторов!',
    //   location: '',
    //   time: '',
    // }
  ];

  const partnerEvents: Event[] = [
    {
      id: 1,
      title: 'Форум YouLead',
      date: '8-9 ноября',
      image: 'images/youlead.jpeg',
      description: '',
      location: '',
      time: ''
    }
  ];

  const calendarEvents = [
    // { id: 2, title: 'Открытие', date: '7 ноября' },
    { id: 3, title: 'Форум YouLead', date: '8-9 ноября' },
    { id: 4, title: 'Промежуточный воркшоп', date: '15 и 18 ноября' },
    { id: 5, title: '«Прожарка от Сбера»', date: '4 декабря' },
    { id: 6, title: 'Финальный воркшоп', date: '6-7 декабря' },
    { id: 7, title: 'Битва проектов', date: '14 декабря' }

  ];

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
  };

  // Если выбрано мероприятие, показываем интерфейс регистрации
  if (selectedEvent) {
    return (
      <div className="py-4">
        <div className="">
          {/* Кнопка назад */}
          <button 
            onClick={handleBackToEvents}
            className="flex items-center text-brand mb-2 hover:underline"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад к событиям
          </button>

          {/* Детали мероприятия */}
          <div className="p-4">
            <h2 className="text-lg font-bold text-brand mb-4 normal-case text-center">{selectedEvent.title}</h2>
            
            <div className='w-full lg:px-8'>
              <img src={selectedEvent.image} className="rounded-lg h-48 mb-6 object-cover w-full"></img>
            </div>

            <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />
            
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-8 lg:px-8">
              {/* Левая колонка - описание */}
              <div className="lg:flex-1 lg:min-h-0 lg:mb-7">
                <div className="h-full">
                  <p className="text-sm font-semibold text-black mb-2">Описание</p>
                  <div className="h-full">
                    <p className="text-black text-sm leading-relaxed border border-brand rounded-2xl p-2 pl-4 lg:h-full">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Правая колонка - информация */}
              <div className="lg:w-80 lg:flex lg:flex-col">
                <div className="lg:flex-1 lg:flex lg:flex-col lg:justify-between">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-semibold text-black mb-2">Дата</p>
                      <p className="text-black border border-brand rounded-full p-1 pl-3 text-left text-sm">{selectedEvent.date}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-black mb-2">Время</p>
                      <p className="text-black border border-brand rounded-full p-1 pl-3 text-left text-sm">{selectedEvent.time}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-black mb-2">Место</p>
                      <p className="text-black border border-brand rounded-2xl p-1 pl-3 text-left text-sm lg:mb-0">{selectedEvent.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Форма регистрации только для промежуточного воркшопа */}
            {selectedEvent.id === 3 && (
              <>
                <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4 mt-6" />

                <h3 className='text-lg font-bold text-brand mb-4 normal-case text-center mt-4'>Регистрация на событие</h3>
                <div className='flex items-center justify-center'>
                  <div className="card w-full lg:mx-80 bg-brand rounded-2xl shadow-lg p-6">        
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Фамилия</label>
                        <input 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Имя</label>
                        <input 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Отчество</label>
                        <input 
                          value={patronymic}
                          onChange={(e) => setPatronymic(e.target.value)}
                          className="w-full px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Название команды - только для участников */}
                      {isMember && (
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">Название команды</label>
                          <input 
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Паспортные данные</label>
                        <input 
                          value={passportData}
                          onChange={(e) => setPassportData(e.target.value)}
                          className="w-full px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      {/* Выбор дня и волны - только для участников */}
                      {isMember && (
                        <div className="relative" ref={daySelectorRef}>
                          <label className="block text-sm font-semibold text-white mb-2">Выбери день и волну для выступления</label>
                          <button
                            type="button"
                            onClick={() => setShowDaySelector(!showDaySelector)}
                            className="w-full px-4 py-1 border border-gray-300 rounded-full bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {selectedDays.length > 0 
                              ? selectedDays.join(', ') 
                              : 'Выберите дни'}
                          </button>
                          {showDaySelector && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                              {availableDays.map((day) => (
                                <label
                                  key={day}
                                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedDays.includes(day)}
                                    onChange={() => toggleDay(day)}
                                    className="mr-2"
                                  />
                                  <span className="text-sm text-black">{day}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-start">
                        <input 
                          type="checkbox"
                          id="confirm-participation"
                          checked={confirmParticipation}
                          onChange={(e) => setConfirmParticipation(e.target.checked)}
                          className="mr-3 mt-1"
                          required
                        />
                        <label htmlFor="confirm-participation" className="text-xs text-white italic">
                          Нажимая на кнопку, вы подтверждаете свое участие
                        </label>
                      </div>

                      <button 
                        type="submit"
                        className="w-full text-white font-bold py-2 px-6 rounded-full transition-colors mt-6"
                      >
                        <h2 className="uppercase">Отправить заявку</h2>
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Основной интерфейс с мероприятиями
  return (
    <div className="pb-6 text-center">
      {/* Ближайшие события */}
      <div>
        <h2 className="my-4 normal-case">Ближайшие события</h2>
        <div className="flex flex-row justify-center gap-4 lg:gap-8">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex flex-col items-center cursor-pointer">
              <img src={event.image}
                className="rounded-lg w-36 h-20 lg:w-60 lg:h-40 hover:opacity-80 transition-opacity object-cover"
                onClick={() => handleEventClick(event)}
              ></img>
              <div className="flex-1">
                <p className="text-brand font-semibold text-xs mt-2 lg:text-sm">{event.title}</p>
                <p className="text-black font-semibold text-xs mt-1 lg:text-sm">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />

      {/* События партнеров */}
      <div>
        <h2 className="my-2 mb-4 normal-case">События партнеров</h2>
        <div className="flex flex-row justify-center gap-4 lg:gap-8">
          {partnerEvents.map((event) => (
            <div key={event.id} className="flex flex-col items-center cursor-pointer">
              <img src={event.image}
                className="bg-[#D9D9D9] rounded-lg w-36 h-20 lg:w-60 lg:h-40 hover:opacity-80 transition-opacity object-cover"
                onClick={() => handleEventClick(event)}
              ></img>
              <div className="flex-1">
                <p className="text-brand font-semibold text-xs mt-2 lg:text-sm">{event.title}</p>
                <p className="text-black font-semibold text-xs mt-1 lg:text-sm">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />

      {/* Календарь событий */}
      <div>
        <h2 className="my-3 normal-case">Календарь событий</h2>
        <div>
          {/* Заголовки таблицы */}
          <div className="flex lg:gap-8">
            <div className="flex-[1.8] py-1 font-semibold text-black text-sm text-left">Мероприятие</div>
            <div className="flex-1 px-2 py-1 font-semibold text-black text-sm text-left">Дата</div>
          </div>
          
          {/* Список событий */}
          {calendarEvents.map((event) => (
            <div 
              key={event.id} 
              className='flex items-center gap-2 lg:gap-8'
            >
              <div className="flex-[1.8] px-2 py-1 text-[10px] text-black border border-brand rounded-full my-1 text-left lg:text-xs">{event.title}</div>
              <div className="flex-1 px-2 py-1 text-[10px] text-black border border-brand rounded-full my-1 text-left lg:text-xs">{event.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;