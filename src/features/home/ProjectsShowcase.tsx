const Card = ({ title, subtitle, image }: { title?: string, subtitle?:string, image?: string }) => (
  <div className='flex flex-col'>
  <div className="relative rounded-xl h-36 w-48 md:w-64 md:h-48 flex-shrink-0 overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${image}')` }}>
    {title && (
      <div className="absolute bottom-4 left-0 right-0">     
        <div className="absolute bottom-0  w-full px-2 py-0.5 flex items-center bg-gradient-to-r from-white via-white to-transparent ">
          <h2 className="text-left text-brand font-bold text-xs normal-case">
            {title}
          </h2>
        </div>
      </div>
    )}
    
  </div>
  <p className='text-left text-brand text-[10px] italic pl-1 mt-1'>{subtitle}</p>
  </div>
)

const ProjectsShowcase = () => {
  return (
    <section className="space-y-3 relative">
      <div
        style={{ backgroundColor: '#08A6A5'}}
        className="h-px w-auto"
      />
      <h3 className="text-center text-brand font-extrabold text-[18px] uppercase pb-3">витрина проектов</h3>
      
      {/* Обертка для скроллящейся области со стрелочкой */}
      <div className="relative">
        <div className="flex overflow-x-auto space-x-3 hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                        [-webkit-overflow-scrolling:touch]">
          <Card title="NutriCheck" subtitle='Приложение, которое создает разнообразные рационы с учетом повышенного потребления продуктов с дефицитными показателями' image='images/nutricheck.png'/>
          <Card title="Модуль" subtitle='Производство модульных ювелирных украшений — можно комбинировать детали между собой, получая уникальный результат из компонентов' image='images/module.png'/>
          <Card title="ПроОбраз-21" subtitle='Образовательная экосистема для школьников и педагогов. Помогаем школьникам с профориентацией, а педагогам — осваивать новые технологии через офлайн-кружки, экспертные встречи и онлайн-школу.' image='images/proobraz.png'/>
          <Card title="PyramidPack" subtitle='Защищаем товары от повреждений при перевозке с помощью амортизирующего каркаса из перерабатываемых материалов.' image='images/pyramidpack.png'/>
          <Card title="Fillfood" subtitle='Фестиваль уличной еды со всего мира. Объединяем лучшие блюда разных культур — от привычных вкусов до редкой экзотики, чтобы открыть гастрономию планеты каждому.' image='images/fillfood.png'/>
          <Card title="FUN" subtitle='Цифровой сервис для соседей. Помогаем людям быстрее адаптироваться к новому месту через Telegram-бот: ищем соседей, объединяем в чаты и поддерживаем' image='images/fun.png'/>
          <Card title="fatdata" subtitle='Сервис BI-аналитики социальных сетей. Помогаем интернет-маркетологам собирать статистику и проводить всесторонний анализ текста и контента для эффективных решений' image='images/fatdata.png'/>
          <Card title="ШЕПот" subtitle='Телеграм-бот для студентов. Помогаем адаптироваться в университете: отвечаем на бытовые вопросы и упрощаем поиск нужной информации.' image='images/shepot.png'/>
          <Card title="Вглубь" subtitle='Мастер-классы по медиа для школьников в регионах. Даем подросткам новые знания в сфере медиа и возможность создать документальные фильмы о своей малой родине.' image='images/vblub.png'/>
          <Card title="TeaVibe" subtitle='Умная чаеварка TeaVibe. Даем возможность быстро и без усилий получать идеально приготовленный чай — как в кофемашине, но для ценителей чая.' image='images/teavibe.png'/>
          <Card title="Бионический протез пальца" subtitle='Бионический протез пальца. Возвращаем людям утраченный функционал и расширяем взаимодействие с цифровым миром благодаря микроэлектронике.' image='images/palets.png'/>
          <Card title="Н - Водород" subtitle='Материалы для безопасного хранения водорода. Снижаем риски утечек и повышаем устойчивость к внешним воздействиям благодаря новым композиционным решениям.' image='images/h.png'/>
          <Card title="ТВОЙ ПРОЕКТ" subtitle='Да, совсем скоро здесь может оказаться и твой проект!' image='images/yourproject.jpeg'/>
        </div>
        
        {/* Стрелочка справа - теперь вне скроллящегося контейнера */}
        <div className="absolute right-2 top-1/3 transform -translate-y-1/2 pointer-events-none">
          <div className="bg-white bg-opacity-80 rounded-full p-2 shadow-lg">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-brand"
            >
              <path 
                d="M9 18L15 12L9 6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectsShowcase