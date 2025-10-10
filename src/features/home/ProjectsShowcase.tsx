import { useRef, useState, useCallback } from 'react';

const Card = ({ title, subtitle, image }: { title?: string, subtitle?:string, image?: string }) => {
  const isYourProject = title === "ТВОЙ ПРОЕКТ";
  const textColorClass = isYourProject ? "text-pink" : "text-brand";
  
  return (
    <div className='flex flex-col'>
      <div className="relative rounded-xl h-36 w-48 md:w-64 md:h-48 flex-shrink-0 overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${image}')` }}>
        {title && (
          <div className="absolute bottom-4 left-0 right-0">     
            <div className="absolute bottom-0 w-full px-2 py-0.5 flex items-center bg-gradient-to-r from-white via-white to-transparent">
              <h2 className={`text-left font-bold text-xs normal-case ${textColorClass}`}>
                {title}
              </h2>
            </div>
          </div>
        )}
      </div>
      <p className={`text-left text-[10px] italic pl-1 mt-1 ${textColorClass}`}>
        {subtitle}
      </p>
    </div>
  )
}

const ProjectsShowcase = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  const projects = [
    { title: "NutriCheck", subtitle: 'Приложение, которое создает разнообразные рационы с учетом повышенного потребления продуктов с дефицитными показателями', image: 'images/nutricheck.png' },
    { title: "Модуль", subtitle: 'Производство модульных ювелирных украшений — можно комбинировать детали между собой, получая уникальный результат из компонентов', image: 'images/module.png' },
    { title: "ПроОбраз-21", subtitle: 'Образовательная экосистема для школьников и педагогов. Помогаем школьникам с профориентацией, а педагогам — осваивать новые технологии через офлайн-кружки, экспертные встречи и онлайн-школу.', image: 'images/proobraz.png' },
    { title: "PyramidPack", subtitle: 'Защищаем товары от повреждений при перевозке с помощью амортизирующего каркаса из перерабатываемых материалов.', image: 'images/pyramidpack.png' },
    { title: "Fillfood", subtitle: 'Фестиваль уличной еды со всего мира. Объединяем лучшие блюда разных культур — от привычных вкусов до редкой экзотики, чтобы открыть гастрономию планеты каждому.', image: 'images/fillfood.png' },
    { title: "FUN", subtitle: 'Цифровой сервис для соседей. Помогаем людям быстрее адаптироваться к новому месту через Telegram-бот: ищем соседей, объединяем в чаты и поддерживаем', image: 'images/fun.png' },
    { title: "fatdata", subtitle: 'Сервис BI-аналитики социальных сетей. Помогаем интернет-маркетологам собирать статистику и проводить всесторонний анализ текста и контента для эффективных решений', image: 'images/fatdata.png' },
    { title: "TeaVibe", subtitle: 'Умная чаеварка TeaVibe. Даем возможность быстро и без усилий получать идеально приготовленный чай — как в кофемашине, но для ценителей чая.', image: 'images/teavibe.png' },
    { title: "Бионический протез пальца", subtitle: 'Бионический протез пальца. Возвращаем людям утраченный функционал и расширяем взаимодействие с цифровым миром благодаря микроэлектронике.', image: 'images/palets.png' },
    { title: "Н - Водород", subtitle: 'Материалы для безопасного хранения водорода. Снижаем риски утечек и повышаем устойчивость к внешним воздействиям благодаря новым композиционным решениям.', image: 'images/h.png' },
    { title: "ТВОЙ ПРОЕКТ", subtitle: 'Да, совсем скоро здесь может оказаться и твой проект!', image: 'images/yourproject.jpeg' }
  ];

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const cardWidth = 192; // w-48 = 192px
    const gap = 12; // space-x-3 = 12px
    
    // Вычисляем индекс активной карточки
    const scrollPosition = scrollLeft + containerWidth / 2;
    const activeIndex = Math.floor(scrollPosition / (cardWidth + gap));
    
    setActiveDot(Math.min(activeIndex, projects.length - 1));
  }, [projects.length]);

  // Функция для скролла к определенной точке
  const scrollToDot = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 192; // w-48 = 192px
    const gap = 12; // space-x-3 = 12px
    const scrollPosition = index * (cardWidth + gap);
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  return (
    <section className="space-y-3 relative">
      <div
        style={{ backgroundColor: '#08A6A5'}}
        className="h-px w-auto"
      />
      <h3 className="text-center text-brand font-extrabold text-[18px] uppercase pb-3">витрина проектов</h3>
      
      {/* Обертка для скроллящейся области */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-3 hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                      [-webkit-overflow-scrolling:touch] pb-4 snap-x snap-mandatory"
          onScroll={handleScroll}
        >
          {projects.map((project, index) => (
            <div key={index} className="snap-start">
              <Card 
                title={project.title}
                subtitle={project.subtitle}
                image={project.image}
              />
            </div>
          ))}
        </div>
        
        {/* Точки прогресса */}
        <div className="flex justify-center space-x-2 mt-2">
          {projects.map((_, index) => (
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

export default ProjectsShowcase