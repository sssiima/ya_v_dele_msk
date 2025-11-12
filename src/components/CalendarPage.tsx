import { useState, useEffect, useRef } from 'react';
import { membersApi, structureApi, teamsApi, meroRegApi, homeworksApi } from '@/services/api';

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
  const [isDesktop, setIsDesktop] = useState(false);
  const lastSubmitTimeRef = useRef<number>(0);
  
  // Состояния формы
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [teamName, setTeamName] = useState('');
  const [passportData, setPassportData] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [selectedSpheres, setSelectedSpheres] = useState<string[]>([]);
  const [showSphereSelector, setShowSphereSelector] = useState(false);
  const [customSphere, setCustomSphere] = useState('');
  const [confirmParticipation, setConfirmParticipation] = useState(false);
  const daySelectorRef = useRef<HTMLDivElement>(null);
  const sphereSelectorRef = useRef<HTMLDivElement>(null);
  
  const spheres = [
    'Медицинские проекты',
    'Спортивные проекты',
    'Робототехнические проекты',
    'Городские проекты',
    'Образовательные проекты',
    'Творческие проекты',
    'Ни одна сфера не подходит'
  ];
  
  // Данные пользователя для отправки
  const [userEmail, setUserEmail] = useState('');
  const [userPos, setUserPos] = useState('');
  const [userTeamCode, setUserTeamCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hasWorkshopHomework, setHasWorkshopHomework] = useState<boolean | null>(null);
  
  const availableDays = ['15 ноября 16:00-17:30',
    '15 ноября 17:45-19:15',
    '15 ноября 19:30-21:00',
    '18 ноября 16:30-17:30',
    '18 ноября 18:15-19:45',
    '18 ноября 20:00-21:30'
  ];
  // Определяем, является ли пользователь участником и загружаем данные
  useEffect(() => {
    const loadUserData = async () => {
      const memberId = localStorage.getItem('member_id');
      const structureCtid = localStorage.getItem('structure_ctid');
      
      if (memberId) {
        setIsMember(true);
        try {
          // Загружаем данные участника
          const memberResp = await membersApi.getById(Number(memberId));
          const member = memberResp?.data;
          
          if (member) {
            setLastName(member.last_name || 'отсутствует');
            setFirstName(member.first_name || 'отсутствует');
            setPatronymic(member.patronymic || 'отсутствует');
            setUserEmail(member.username || '');
            // Для участников pos = role (captain или member)
            setUserPos(member.role || 'member');
            setUserTeamCode(member.team_code || null);
            
            // Загружаем название команды
            if (member.team_code) {
              try {
                const teamResp = await teamsApi.getByCode(member.team_code);
                if (teamResp?.success && teamResp.data) {
                  setTeamName(teamResp.data.name || '');
                } else if (member.team_name) {
                  // Если не удалось получить через API, используем team_name из данных участника
                  setTeamName(member.team_name || '');
                }
              } catch (error) {
                // Используем team_name из данных участника как fallback
                if (member.team_name) {
                  setTeamName(member.team_name);
                }
              }
              
              // Проверяем наличие домашнего задания "Промежуточный ВШ"
              try {
                const homeworksResp = await homeworksApi.getByTeamCode(member.team_code);
                if (homeworksResp?.success && homeworksResp.data) {
                  const hasHomework = homeworksResp.data.some((hw: any) => {
                    const normalizedHwName = (hw.hw_name || '').trim();
                    return normalizedHwName === 'Промежуточный ВШ';
                  });
                  setHasWorkshopHomework(hasHomework);
                } else {
                  setHasWorkshopHomework(false);
                }
              } catch (error) {
                setHasWorkshopHomework(false);
              }
            } else {
              setHasWorkshopHomework(false);
            }
          }
        } catch (error) {
        }
      } else if (structureCtid) {
        setIsMember(false);
        setHasWorkshopHomework(null); // Для структуры проверка не нужна
        try {
          // Загружаем данные структуры
          const structureResp = await structureApi.getByCtid(structureCtid);
          const structure = structureResp?.data;
          
          if (structure) {
            setLastName(structure.last_name || 'отсутствует');
            setFirstName(structure.first_name || 'отсутствует');
            setPatronymic(structure.patronymic || 'отсутствует');
            setUserEmail(structure.username || '');
            setUserPos(structure.pos || '');
          }
        } catch (error) {
        }
      } else {
        // Если пользователь не авторизован, сбрасываем состояние
        setHasWorkshopHomework(null);
      }
    };
    
    // Загружаем данные только если открыта форма регистрации (промежуточный воркшоп)
    if (selectedEvent?.id === 3) {
      loadUserData();
    }
  }, [selectedEvent]);
  
  // Обработка клика вне селекторов
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (daySelectorRef.current && !daySelectorRef.current.contains(event.target as Node)) {
        setShowDaySelector(false);
      }
      if (sphereSelectorRef.current && !sphereSelectorRef.current.contains(event.target as Node)) {
        setShowSphereSelector(false);
      }
    };
    if (showDaySelector || showSphereSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDaySelector, showSphereSelector]);
  
  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSphereToggle = (sphere: string) => {
    if (sphere === 'Ни одна сфера не подходит') {
      // Если выбрана эта опция, очищаем все остальные
      setSelectedSpheres(['Ни одна сфера не подходит']);
      setCustomSphere(''); // Очищаем поле ввода при выборе
    } else {
      // Проверяем, была ли выбрана "Ни одна сфера не подходит" до изменения
      const hadNoSphereOption = selectedSpheres.includes('Ни одна сфера не подходит');
      
      // Убираем "Ни одна сфера не подходит" если она была выбрана
      const newSpheres = selectedSpheres.filter(s => s !== 'Ни одна сфера не подходит');
      
      // Переключаем выбранную сферу
      if (newSpheres.includes(sphere)) {
        setSelectedSpheres(newSpheres.filter(s => s !== sphere));
      } else {
        setSelectedSpheres([...newSpheres, sphere]);
      }
      
      // Если убрали "Ни одна сфера не подходит", очищаем поле ввода
      if (hadNoSphereOption) {
        setCustomSphere('');
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка задержки между нажатиями (500 мс)
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 500) {
      return;
    }
    lastSubmitTimeRef.current = now;
    
    if (!confirmParticipation) {
      alert('Пожалуйста, подтвердите свое участие');
      return;
    }
    
    if (isMember && selectedDays.length === 0) {
      alert('Пожалуйста, выберите день и волну для выступления');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const registrationData = {
        mero: 'Промежуточный воркшоп',
        last_name: lastName,
        first_name: firstName,
        patronymic: patronymic || null,
        email: userEmail,
        team_code: isMember ? userTeamCode : null,
        pos: userPos,
        passport: passportData,
        team_name: isMember ? teamName : null,
        date: isMember ? (selectedDays.length > 0 ? selectedDays.join(', ') : null) : null,
        comment: isMember && selectedSpheres.length > 0 
          ? (selectedSpheres.includes('Ни одна сфера не подходит') && customSphere.trim() 
              ? customSphere.trim() 
              : selectedSpheres.join(', '))
          : null
      };
      
      const result = await meroRegApi.register(registrationData);
      
      if (result?.success) {
        alert('Заявка успешно отправлена!');
        // Очищаем форму
        setPassportData('');
        setSelectedDays([]);
        setSelectedSpheres([]);
        setCustomSphere('');
        setConfirmParticipation(false);
      } else {
        throw new Error(result?.message || 'Ошибка при отправке заявки');
      }
    } catch (error: any) {
      // Показываем сообщение об ошибке от сервера или общее сообщение
      // Axios выбрасывает исключение при статусе 400+, поэтому проверяем response.data
      let errorMessage = 'Ошибка при отправке заявки. Попробуйте еще раз.';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
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
      image: 'images/vsh.png',
      description: 'Время подвести итоги и скорректировать курс. Команды представят первые результаты и получат обратную связь от экспертов, чтобы двигаться дальше ещё увереннее.',
      location: 'РЭУ им.Плеханова',
      time: 'Выберите удобное',
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

  const calendarEvents = [
    // { id: 2, title: 'Открытие', date: '7 ноября' },
    { id: 4, title: 'Промежуточный воркшоп', date: '15 и 18 ноября' },
    { id: 5, title: '«Прожарка от Сбера»', date: '4 декабря' },
    { id: 6, title: 'Финальный воркшоп', date: '6-7 декабря' },
    { id: 7, title: 'Битва проектов', date: '14 декабря' }

  ];

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    // Сбрасываем состояние проверки домашнего задания при смене события
    setHasWorkshopHomework(null);
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
              <img 
                src={selectedEvent.image} 
                className="rounded-lg h-48 mb-6 object-cover w-full"
                style={selectedEvent.id === 4 && isDesktop ? { objectPosition: 'center top 33%' } : undefined}
              ></img>
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
                <div className='flex items-center justify-center mb-48'>
                  <div className="card w-full lg:mx-80 bg-brand rounded-2xl shadow-lg p-6">
                    {/* Для участников: проверяем наличие домашнего задания */}
                    {isMember ? (
                      hasWorkshopHomework === false ? (
                        <p className="text-white text-center">
                          Регистрация будет доступна после загрузки презентации в ДЗ "Промежуточный ВШ"
                        </p>
                      ) : hasWorkshopHomework === true ? (
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
                          placeholder="Номер и серия"
                          className="w-full px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      {/* Выбор сфер - только для участников */}
                      {isMember && (
                        <div className="relative" ref={sphereSelectorRef}>
                          <label className="block text-sm font-semibold text-white mb-2">К какой сфере вы бы могли отнести ваш проект?</label>
                          <button
                            type="button"
                            onClick={() => setShowSphereSelector(!showSphereSelector)}
                            className="w-full px-4 py-1 border border-gray-300 rounded-full bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {selectedSpheres.length > 0 
                              ? (selectedSpheres.includes('Ни одна сфера не подходит') && customSphere.trim()
                                  ? customSphere.trim()
                                  : selectedSpheres.join(', '))
                              : 'Выберите сферы'}
                          </button>
                          {showSphereSelector && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                              {spheres.map((sphere) => (
                                <label
                                  key={sphere}
                                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedSpheres.includes(sphere)}
                                    onChange={() => handleSphereToggle(sphere)}
                                    className="mr-2"
                                  />
                                  <span className="text-sm text-black">{sphere}</span>
                                </label>
                              ))}
                            </div>
                          )}
                          {/* Поле для ввода своей сферы, если выбрано "Ни одна сфера не подходит" */}
                          {selectedSpheres.includes('Ни одна сфера не подходит') && (
                            <div className="mt-3">
                              <label className="block text-sm font-semibold text-white mb-2">Укажите вашу сферу:</label>
                              <input
                                type="text"
                                value={customSphere}
                                onChange={(e) => setCustomSphere(e.target.value)}
                                placeholder="Введите название сферы"
                                className="w-full px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          )}
                        </div>
                      )}

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
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
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
                        disabled={submitting}
                        className="w-full text-white font-bold py-2 px-6 rounded-full transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <h2 className="uppercase text-white">{submitting ? 'Отправка...' : 'Отправить заявку'}</h2>
                      </button>
                        </form>
                      ) : (
                        <p className="text-gray-400 text-center">Загрузка...</p>
                      )
                    ) : (
                      // Для структуры форма всегда доступна
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

                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">Паспортные данные</label>
                          <input 
                            value={passportData}
                            onChange={(e) => setPassportData(e.target.value)}
                            placeholder="Номер и серия"
                            className="w-full px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        {/* Выбор сфер - только для участников */}
                        {isMember && (
                          <div className="relative" ref={sphereSelectorRef}>
                            <label className="block text-sm font-semibold text-white mb-2">К какой сфере вы бы могли отнести ваш проект?</label>
                            <button
                              type="button"
                              onClick={() => setShowSphereSelector(!showSphereSelector)}
                              className="w-full px-4 py-1 border border-gray-300 rounded-full bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {selectedSpheres.length > 0 
                                ? (selectedSpheres.includes('Ни одна сфера не подходит') && customSphere.trim()
                                    ? customSphere.trim()
                                    : selectedSpheres.join(', '))
                                : 'Выберите сферы'}
                            </button>
                            {showSphereSelector && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {spheres.map((sphere) => (
                                  <label
                                    key={sphere}
                                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedSpheres.includes(sphere)}
                                      onChange={() => handleSphereToggle(sphere)}
                                      className="mr-2"
                                    />
                                    <span className="text-sm text-black">{sphere}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                            {/* Поле для ввода своей сферы, если выбрано "Ни одна сфера не подходит" */}
                            {selectedSpheres.includes('Ни одна сфера не подходит') && (
                              <div className="mt-3">
                                <label className="block text-sm font-semibold text-white mb-2">Укажите вашу сферу:</label>
                                <input
                                  type="text"
                                  value={customSphere}
                                  onChange={(e) => setCustomSphere(e.target.value)}
                                  placeholder="Введите название сферы"
                                  className="w-full px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
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
                          disabled={submitting}
                          className="w-full text-white font-bold py-2 px-6 rounded-full transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <h2 className="uppercase text-white">{submitting ? 'Отправка...' : 'Отправить заявку'}</h2>
                        </button>
                      </form>
                    )}
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