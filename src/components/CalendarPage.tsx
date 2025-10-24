import { useState } from 'react';

interface Event {
  id: number;
  title: string;
  date: string;
  image: string;
  description?: string;
  location?: string;
  time?: string;
  maxParticipants?: number;
  currentParticipants?: number;
}

const CalendarPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Моковые данные для событий
  const upcomingEvents: Event[] = [
    {
      id: 1,
      title: 'Стартап за 5 часов',
      date: '31 октября',
      image: '/images/event1.jpg',
      description: 'Интенсивный воркшоп по созданию стартапа с нуля. Узнайте основы предпринимательства и создайте MVP вашего проекта.',
      location: 'Москва, ул. Тверская, 15',
      time: '10:00 - 15:00',
      maxParticipants: 50,
      currentParticipants: 32
    },
    {
      id: 2,
      title: 'Менторская гостиная',
      date: '5 ноября',
      image: '/images/event2.jpg',
      description: 'Неформальная встреча с опытными менторами. Получите персональные советы по развитию вашего проекта.',
      location: 'Москва, коворкинг "Сфера"',
      time: '18:00 - 20:00',
      maxParticipants: 30,
      currentParticipants: 25
    }
  ];

  const partnerEvents: Event[] = [
    {
      id: 1,
      title: 'Стартап за 5 часов',
      date: '31 октября',
      image: '/images/partner1.jpg',
      description: 'Специальный интенсив от наших партнеров с фокусом на технологические стартапы.',
      location: 'Онлайн',
      time: '12:00 - 17:00',
      maxParticipants: 100,
      currentParticipants: 78
    },
    {
      id: 2,
      title: 'Менторская гостиная',
      date: '5 ноября',
      image: '/images/partner2.jpg',
      description: 'Эксклюзивная встреча с партнерами программы. Обсуждение возможностей сотрудничества.',
      location: 'Москва, офис партнера',
      time: '16:00 - 18:00',
      maxParticipants: 40,
      currentParticipants: 35
    }
  ];

  const calendarEvents = [
    { id: 1, title: 'Открытие 8 сезона', date: '7 ноября' },
    { id: 2, title: 'Промежуточный воркшоп', date: '25 января' },
    { id: 3, title: 'Финальный демо-день', date: '15 февраля' },
    { id: 4, title: 'Встреча с наставниками', date: '5 марта' },
    { id: 5, title: 'Итоговая конференция', date: '20 марта' }
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
            
            {/* Заглушка изображения */}
            <div className='w-full lg:px-8'>
              <div className="bg-[#D9D9D9] rounded-lg h-48 mb-6"></div>
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

            <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4 mt-6" />

            <h3 className='text-lg font-bold text-brand mb-4 normal-case text-center mt-4'>Регистрация на событие</h3>
            <div className='flex items-center justify-center'>
              <div className="card w-full lg:mx-80 bg-brand rounded-2xl shadow-lg p-6">        
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Фамилия</label>
                    <input 
                      className="w-full px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Имя</label>
                    <input 
                      className="w-full px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Отчество</label>
                    <input 
                      className="w-full px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Электронная почта</label>
                    <input 
                      type="email"
                      required
                      className="w-full px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-start">
                    <input 
                      type="checkbox"
                      id="privacy-policy"
                      className="mr-3"
                      required
                    />
                    <label htmlFor="privacy-policy" className="text-xs text-white italic">
                      Нажимая на кнопку, вы подтверждаете свое участие
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-brand font-bold py-2 px-6 rounded-full transition-colorsmt-6"
                  >
                    <h2 className="uppercase text-white">Отправить заявку</h2>
                  </button>
                </form>
              </div>
            </div>
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
              <div 
                className="bg-[#D9D9D9] rounded-lg w-36 h-20 lg:w-60 lg:h-40 hover:opacity-80 transition-opacity"
                onClick={() => handleEventClick(event)}
              ></div>
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
              <div 
                className="bg-[#D9D9D9] rounded-lg w-36 h-20 lg:w-60 lg:h-40 hover:opacity-80 transition-opacity"
                onClick={() => handleEventClick(event)}
              ></div>
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