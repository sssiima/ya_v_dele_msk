import { useRef, useState, useCallback } from 'react';

const Card = ({ title, subtitle, image, link, disabled }: { title?: string, subtitle?: string, image?: string, link?: string, disabled?: boolean }) => (
  <div className="flex flex-col w-[210px] flex-shrink-0">
    {link && !disabled ? (
      <a href={link} target="_blank">
        <img src={image} className="rounded-xl h-[130px] w-full object-cover bg-gray-200 cursor-pointer hover:opacity-90 transition-opacity" />
      </a>
    ) : (
      <img src={image} className="rounded-xl h-[130px] w-full object-cover bg-gray-200" />
    )}
    {title && (
      <>
        <p className="text-center text-brand font-bold text-sm mt-2 mb-1">
          {title}
        </p>
      </>
    )}
    {subtitle && (
      <>
        <p className="text-center text-black font-bold text-xs">
          {subtitle}
        </p>
      </>
    )}
  </div>
)



const CoursesList = () => {
    const scrollContainerRefmk = useRef<HTMLDivElement>(null);
    const [activeDotmk, setActiveDotmk] = useState(0);
    const scrollContainerRefpr = useRef<HTMLDivElement>(null);
    const [activeDotpr, setActiveDotpr] = useState(0);
    const scrollContainerRefpod = useRef<HTMLDivElement>(null);
    const [activeDotpod, setActiveDotpod] = useState(0);

    const mk_list = [
        { title: "Первый мастер-класс", subtitle: 'Проблема. Идея. Решение', image: '/images/mkfirst.png', link: 'https://drive.google.com/drive/mobile/folders/1sb1L1MynvdLxU6jMOxTQR24-Nudx5-DD/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1I2AEC4OltOGGJWFncj8yS1Nqio9PczF3?sort=13&direction=a', disabled: false },
        { title: "Второй мастер-класс", subtitle: 'Customer development. ЦА.', image: '/images/mksecond.png', link: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1PjByX9ckPyi-1ANFeCrDKXq1_cso_4SQ?sort=13&direction=a', disabled: true },
        { title: "Третий мастер-класс", subtitle: 'MVP. HADI - циклы.', image: '/images/mkthird.png', link: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
        { title: "Четвертый мастер-класс", subtitle: 'Бизнес - модель.', image: '/images/mkfourth.png', link: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
        { title: "Пятый мастер-класс", subtitle: 'Финансы.', image: '/images/mkfifth.png', link: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
        { title: "Шестой мастер-класс", subtitle: 'Маркетинг.', image: '/images/mksixth.png', link: 'https://drive.google.com/drive/mobile/folders/1LOowiL6-yEtmQQSRNx-yhr07QqEnjPcF/1liKGGfATdDN_AvyhNXPN1ivVtvSVSreN?sort=13&direction=a', disabled: true },
    ]

    const project_list = [
        { title: "NutriCheck", subtitle: 'Социальный трек', image: '/images/nutricheck.png' },
        { title: "Модуль", subtitle: 'Базовый трек', image: '/images/module.png' },
        { title: "ПроОбраз-21", subtitle: 'Социальный трек', image: '/images/proobraz.png' },
        { title: "PyramidPack", subtitle: 'Базовый трек', image: '/images/pyramidpack.png' },
        { title: "Fillfood", subtitle: 'Социальный трек', image: '/images/fillfood.png' },
        { title: "FUN", subtitle: 'Базовый трек', image: '/images/fun.png' },
        { title: "Бионический протез пальца", subtitle: 'Инновационный трек', image: '/images/palets.png' },
    ]

    const podcast_list = [
        { title: "С психологом", image: '/images/podcast_psy.png', link: 'https://vkvideo.ru/video-210144042_456239649?pl=-210144042_2&t=3s'},
        { title: "Про путешествия", image: '/images/podcast_travel.png', link: 'https://vkvideo.ru/video-210144042_456239626?pl=-210144042_2' },
        { title: "Про личный бренд", image: '/images/podcast_brand.png', link: 'https://vkvideo.ru/video-210144042_456239623?pl=-210144042_2' },
        { title: "Про креативность", image: '/images/podcast_create.png', link: 'https://vkvideo.ru/video-210144042_456239575?pl=-210144042_2' },
        { title: "Про страхи и рост", image: '/images/podcast_fear.png', link: 'https://vkvideo.ru/video-210144042_456239501?pl=-210144042_2' },
    ]
  
    const handleScrollmk = useCallback(() => {
      const container = scrollContainerRefmk.current;
      if (!container) return;
  
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const cardWidth = 205; // w-[120px]
      const gap = 12; // space-x-3 = 12px
      
      // Вычисляем индекс активной карточки
      const scrollPosition = scrollLeft + containerWidth / 2;
      const activeIndex = Math.floor(scrollPosition / (cardWidth + gap));
      
      setActiveDotmk(Math.min(activeIndex, mk_list.length - 1));
    }, [mk_list.length]);
  
    // Функция для скролла к определенной точке
    const scrollToDotmk = (index: number) => {
      const container = scrollContainerRefmk.current;
      if (!container) return;
  
      const cardWidth = 205; // w-[205px]
      const gap = 12; // space-x-3 = 12px
      const scrollPosition = index * (cardWidth + gap);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    };

    const handleScrollpr = useCallback(() => {
        const container = scrollContainerRefpr.current;
        if (!container) return;
    
        const scrollLeft = container.scrollLeft;
        const containerWidth = container.clientWidth;
        const cardWidth = 205; // w-[120px]
        const gap = 12; // space-x-3 = 12px
        
        // Вычисляем индекс активной карточки
        const scrollPosition = scrollLeft + containerWidth / 2;
        const activeIndex = Math.floor(scrollPosition / (cardWidth + gap));
        
        setActiveDotpr(Math.min(activeIndex, project_list.length - 1));
      }, [project_list.length]);
    
      // Функция для скролла к определенной точке
      const scrollToDotpr = (index: number) => {
        const container = scrollContainerRefpr.current;
        if (!container) return;
    
        const cardWidth = 205; // w-[200px]
        const gap = 12; // space-x-3 = 12px
        const scrollPosition = index * (cardWidth + gap);
        
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      };

      const handleScrollpod = useCallback(() => {
        const container = scrollContainerRefpod.current;
        if (!container) return;
    
        const scrollLeft = container.scrollLeft;
        const containerWidth = container.clientWidth;
        const cardWidth = 205; // w-[120px]
        const gap = 12; // space-x-3 = 12px
        
        // Вычисляем индекс активной карточки
        const scrollPosition = scrollLeft + containerWidth / 2;
        const activeIndex = Math.floor(scrollPosition / (cardWidth + gap));
        
        setActiveDotpod(Math.min(activeIndex, podcast_list.length - 1));
      }, [podcast_list.length]);
    
      // Функция для скролла к определенной точке
      const scrollToDotpod = (index: number) => {
        const container = scrollContainerRefpod.current;
        if (!container) return;
    
        const cardWidth = 205; // w-[200px]
        const gap = 12; // space-x-3 = 12px
        const scrollPosition = index * (cardWidth + gap);
        
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      };
  
    return (
      <section className="space-y-3">
        <h3 className="text-left normal-case text-brand font-extrabold text-[18px] uppercase py-3">Мастер-классы</h3>
  
        <div className="relative">
          <div 
            ref={scrollContainerRefmk}
            className="flex overflow-x-auto space-x-3 hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                        [-webkit-overflow-scrolling:touch] pb-4 snap-x snap-mandatory"
            onScroll={handleScrollmk}
          >
            {mk_list.map((mk, index) => (
              <div key={index} className="snap-start">
                <Card 
                  title={mk.title}
                  subtitle={mk.subtitle}
                  image={mk.image}
                  link={mk.link}
                  disabled={mk.disabled}
                />
              </div>
            ))}
          </div>
          
          {/* Точки прогресса */}
          <div className="flex justify-center space-x-2 mt-2">
            {mk_list.map((_, index) => (
              <button 
                key={index}
                onClick={() => scrollToDotmk(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeDotmk ? 'bg-brand scale-125' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <h3 className="text-left normal-case text-brand font-extrabold text-[18px] uppercase pb-3">Примеры проектов</h3>
        <div className="relative">
          <div 
            ref={scrollContainerRefpr}
            className="flex overflow-x-auto space-x-3 hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                        [-webkit-overflow-scrolling:touch] snap-x snap-mandatory"
            onScroll={handleScrollpr}
          >
            {project_list.map((project, index) => (
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
            {project_list.map((_, index) => (
              <button 
                key={index}
                onClick={() => scrollToDotpr(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeDotpr ? 'bg-brand scale-125' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <h3 className="text-left normal-case text-brand font-extrabold text-[18px] uppercase pb-3">Подкаст "Давай по делу"</h3>
        <div className="relative">
          <div 
            ref={scrollContainerRefpod}
            className="flex overflow-x-auto space-x-3 hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                        [-webkit-overflow-scrolling:touch] snap-x snap-mandatory"
            onScroll={handleScrollpod}
          >
            {podcast_list.map((podcast, index) => (
              <div key={index} className="snap-start">
                <Card 
                  title={podcast.title}
                  image={podcast.image}
                  link={podcast.link}
                />
              </div>
            ))}
          </div>
          
          {/* Точки прогресса */}
          <div className="flex justify-center space-x-2 mt-2">
            {podcast_list.map((_, index) => (
              <button 
                key={index}
                onClick={() => scrollToDotpod(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeDotpod ? 'bg-brand scale-125' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }


export default CoursesList;