const CalendarPage = () => {
  // Моковые данные для событий
  const upcomingEvents = [
    {
      id: 1,
      title: 'Стартап за 5 часов',
      date: '31 октября',
      image: '/images/event1.jpg'
    },
    {
      id: 2,
      title: 'Менторская гостиная',
      date: '20 декабря',
      image: '/images/event2.jpg'
    }
  ];

  const partnerEvents = [
    {
      id: 1,
      title: 'Стартап за 5 часов',
      date: '31 октября',
      image: '/images/partner1.jpg'
    },
    {
      id: 2,
      title: 'Менторская гостиная',
      date: '30 декабря',
      image: '/images/partner2.jpg'
    }
  ];

  const calendarEvents = [
    { id: 1, title: 'Открытие 8 сезона', date: '7 ноября' },
    { id: 2, title: 'Промежуточный воркшоп', date: '25 января' },
    { id: 3, title: 'Финальный демо-день', date: '15 февраля' },
    { id: 4, title: 'Встреча с наставниками', date: '5 марта' },
    { id: 5, title: 'Итоговая конференция', date: '20 марта' }
  ];

  return (
    <div className="pb-6 text-center">
      {/* Ближайшие события */}
      <div>
        <h2 className="my-4 normal-case">Ближайшие события</h2>
        <div className="flex flex-row justify-center gap-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex flex-col items-center">
              <div className="bg-[#D9D9D9] rounded-lg w-36 h-20"></div>
              <div className="flex-1">
                <p className="text-brand font-semibold text-xs mt-2">{event.title}</p>
                <p className="text-black font-semibold text-xs mt-1">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />

      {/* События партнеров */}
      <div>
        <h2 className="my-2 mb-4 normal-case">События партнеров</h2>
        <div className="flex flex-row justify-center gap-4">
          {partnerEvents.map((event) => (
            <div key={event.id} className="flex flex-col items-center">
              <div className="bg-[#D9D9D9] rounded-lg w-36 h-20"></div>
              <div className="flex-1">
                <p className="text-brand font-semibold text-xs mt-2">{event.title}</p>
                <p className="text-black font-semibold text-xs mt-1">{event.date}</p>
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
          <div className="flex">
            <div className="flex-[1.8] py-1 font-semibold text-black text-sm text-left">Мероприятие</div>
            <div className="flex-1 px-2 py-1 font-semibold text-black text-sm text-left">Дата</div>
          </div>
          
          {/* Список событий */}
          {calendarEvents.map((event) => (
            <div 
              key={event.id} 
              className='flex items-center gap-2'
            >
              <div className="flex-[1.8] px-2 py-1 text-[10px] text-black border border-brand rounded-full my-1 text-left">{event.title}</div>
              <div className="flex-1 px-2 py-1 text-[10px] text-black border border-brand rounded-full my-1 text-left">{event.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;