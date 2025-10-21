// components/CalendarPage.tsx
import { useState } from 'react';

const CalendarPage = () => {
  // Моковые данные для событий
  const upcomingEvents = [
    {
      id: 1,
      title: 'Воркшоп по лидерству',
      date: '15 декабря 2024',
      image: '/images/event1.jpg'
    },
    {
      id: 2,
      title: 'Мастер-класс по проектной деятельности',
      date: '20 декабря 2024',
      image: '/images/event2.jpg'
    }
  ];

  const partnerEvents = [
    {
      id: 1,
      title: 'Конференция от партнера "Росатом"',
      date: '25 декабря 2024',
      image: '/images/partner1.jpg'
    },
    {
      id: 2,
      title: 'Хакатон от VK',
      date: '30 декабря 2024',
      image: '/images/partner2.jpg'
    }
  ];

  const calendarEvents = [
    { id: 1, title: 'Онбординг новых участников', date: '10 января 2025' },
    { id: 2, title: 'Промежуточная презентация проектов', date: '25 января 2025' },
    { id: 3, title: 'Финальный демо-день', date: '15 февраля 2025' },
    { id: 4, title: 'Встреча с наставниками', date: '5 марта 2025' },
    { id: 5, title: 'Итоговая конференция', date: '20 марта 2025' }
  ];

  return (
    <div className="px-4 pb-6">
      {/* Ближайшие события */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-brand mb-4">Ближайшие события</h2>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-4 p-3 border border-brand rounded-2xl bg-white">
              <div className="bg-[#D9D9D9] rounded-lg w-16 h-16 flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="text-brand font-semibold text-sm">{event.title}</h3>
                <p className="text-black text-xs mt-1">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-6" />

      {/* События партнеров */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-brand mb-4">События партнеров</h2>
        <div className="space-y-4">
          {partnerEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-4 p-3 border border-brand rounded-2xl bg-white">
              <div className="bg-[#D9D9D9] rounded-lg w-16 h-16 flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="text-brand font-semibold text-sm">{event.title}</h3>
                <p className="text-black text-xs mt-1">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-6" />

      {/* Календарь событий */}
      <div>
        <h2 className="text-lg font-bold text-brand mb-4">Календарь событий</h2>
        <div className="border border-brand rounded-2xl bg-white overflow-hidden">
          {/* Заголовки таблицы */}
          <div className="flex border-b border-brand bg-gray-50">
            <div className="flex-1 px-4 py-3 font-semibold text-brand text-sm">Мероприятие</div>
            <div className="flex-1 px-4 py-3 font-semibold text-brand text-sm border-l border-brand">Дата</div>
          </div>
          
          {/* Список событий */}
          {calendarEvents.map((event, index) => (
            <div 
              key={event.id} 
              className={`flex ${
                index !== calendarEvents.length - 1 ? 'border-b border-brand' : ''
              }`}
            >
              <div className="flex-1 px-4 py-3 text-sm text-black">{event.title}</div>
              <div className="flex-1 px-4 py-3 text-sm text-black border-l border-brand">{event.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;