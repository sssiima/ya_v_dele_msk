import { useRef, useState, useCallback } from 'react';

const Card = ({ title, subtitle, image }: { title?: string, subtitle?: string, image?: string }) => (
  <div className="flex flex-col w-[200px] flex-shrink-0">
    <img src={image} className="rounded-xl h-[250px] w-full object-cover" />
    {title && subtitle && (
      <>
        <h2 className="text-center text-brand font-bold text-[12px] capitalize mt-2 mb-1">
          {title}
        </h2>
        <p className="text-center text-brand text-[10px] italic">
          {subtitle}
        </p>
      </>
    )}
  </div>
)

const MentorsList = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  const mentors = [
    { title: "Чвыров Сергей", subtitle: 'Генеральный директор клиники лазерной и эстетической медицины «Абсолют Мед», интернет-магазина по продаже косметики и БАДов «Абсолют Косметик»', image: '/images/chvyrov.png' },
    { title: "Лазарева Татьяна", subtitle: 'Генеральный директор "Караван Консультант"', image: '/images/lazareva.png' },
    { title: "Солдаткин Павел", subtitle: 'Основатель кейтеринговой компании JL Catering, Академии деловых коммуникаций, бизнес-тренер', image: '/images/soldatkin.png' },
    { title: "Харитонова Анна", subtitle: 'Генеральный директор Консалтинговая группа «Лидер Франшиз»', image: '/images/haritonova.png' },
    { title: "Саллум Кристина", subtitle: 'Владелец ресторанов Vibes Cafe, Dionis Cafe, владелец медицинской клиники GoodLife Clinic в Москве', image: '/images/sallum.png' },
    { title: "Абрамова Анастасия", subtitle: 'Лектор РО "Знание", директор по продвижению цифровой платформы SPACE', image: '/images/abramova.png' },
    { title: "Заяц Павел", subtitle: 'Лектор РО "Знание", директор по продвижению цифровой платформы SPACE', image: '/images/zayats.png' },
    { title: "Стукалова Елена", subtitle: 'Руководитель стартап-студии Финансового университета при правительстве РФ, трекер', image: '/images/stukalova.png' },
    { title: "Масштабная Екатерина", subtitle: 'Бизнес-ментор, психолог, эксперт по маркетингу и продажам, психолог, эксперт федеральных СМИ', image: '/images/masshtabnaya.png' },
    { title: "Власюк Елена", subtitle: 'Психолог оборонно-промышленного комплекса', image: '/images/vlasuk.png' },
    { title: "Андреев Юрий", subtitle: 'Руководитель Revolso Marketing, Совладелец и коммерческий директор строительной компании «Народные Заборы»', image: '/images/andreev.png' },
    { title: "Грибакин Сергей", subtitle: 'Бизнес-тренер, специалист по продажам и УТП, лектор российского общества "Знание", блогер, автор книг.', image: '/images/gribakin.png' },
    { title: "Рубина Екатерина", subtitle: 'Маркетолог, директор студии-креатива "Рубин"', image: '/images/rubina.png' },
    { title: "Коган Андрей", subtitle: 'Руководитель компании «ВсеИзКитая», руководитель российско-китайского комитета Ассоциации Экспортёров и Импортеров', image: '/images/kogan.png' },
    { title: "Уклонский Кирилл", subtitle: 'Лектор Российского общества Знание, эксперт в сфере разработки ИТ-решений федеральных образовательных форумов', image: '/images/uklonskiy.png' },
    { title: "Баканов Александр", subtitle: 'Директор по развитию ГК "Альфарма-М"', image: '/images/bakanov.png' },
    { title: "Гусакова Юлия", subtitle: 'Руководитель консалтингового агентства "КУБ"', image: '/images/gusakova.png' },
    { title: "Плешаков Алексей", subtitle: 'Генеральный директор ООО Румекон', image: '/images/pleshakov.png' },
    { title: "Реброва Наталья", subtitle: 'Руководитель Reframe Consulting, председатель Комитета по наставничеству в Москве', image: '/images/rebrova.png' }
  ];

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const cardWidth = 200; // w-[200px]
    const gap = 12; // space-x-3 = 12px
    
    // Вычисляем индекс активной карточки
    const scrollPosition = scrollLeft + containerWidth / 2;
    const activeIndex = Math.floor(scrollPosition / (cardWidth + gap));
    
    setActiveDot(Math.min(activeIndex, mentors.length - 1));
  }, [mentors.length]);

  // Функция для скролла к определенной точке
  const scrollToDot = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 200; // w-[200px]
    const gap = 12; // space-x-3 = 12px
    const scrollPosition = index * (cardWidth + gap);
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  return (
    <section className="space-y-3">
      <div
        style={{ backgroundColor: '#08A6A5'}}
        className="h-px w-auto"
      />
      <h3 className="text-center text-brand font-extrabold text-[18px] uppercase pb-3">эксперты</h3>

      {/* Обертка для скроллящейся области */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-3 hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                      [-webkit-overflow-scrolling:touch] pb-4 snap-x snap-mandatory"
          onScroll={handleScroll}
        >
          {mentors.map((mentor, index) => (
            <div key={index} className="snap-start">
              <Card 
                title={mentor.title}
                subtitle={mentor.subtitle}
                image={mentor.image}
              />
            </div>
          ))}
        </div>
        
        {/* Точки прогресса */}
        <div className="flex justify-center space-x-2 mt-2">
          {mentors.map((_, index) => (
            <button 
              key={index}
              onClick={() => scrollToDot(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeDot ? 'bg-brand scale-125' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default MentorsList