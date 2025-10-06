const Card = ({ title, subtitle, image }: { title?: string, subtitle?: string, image?: string }) => (
  <div className="flex flex-col w-[200px] flex-shrink-0">
  <img src={image} className=" rounded-xl h-[250px] w-full" />
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
  return (
    <section className="space-y-3">
      <div
        style={{ backgroundColor: '#08A6A5'}}
        className="h-px w-auto"
      />
      <h3 className="text-center text-brand font-extrabold text-[18px] uppercase pb-3">менторы</h3>

      {/* Обертка для скроллящейся области со стрелочкой */}
      <div className="relative">
        <div className="flex overflow-x-auto space-x-3 hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                        [-webkit-overflow-scrolling:touch]">
          <Card title="Чвыров Сергей" subtitle='Генеральный директор клиники лазерной и эстетической медицины «Абсолют Мед», интернет-магазина по продаже косметики и БАДов «Абсолют Косметик»' image='/images/chvyrov.png'/>
          <Card title="Лазарева Татьяна" subtitle='Генеральный директор "Караван Консультант"' image='/images/lazareva.png'/>
          <Card title="Солдаткин Павел" subtitle='Основатель кейтеринговой компании JL Catering, Академии деловых коммуникаций, бизнес-тренер' image='/images/soldatkin.png'/>
          <Card title="Харитонова Анна" subtitle='Генеральный директор Консалтинговая группа «Лидер Франшиз»' image='/images/haritonova.png'/>
          <Card title="Саллум Кристина" subtitle='Владелец ресторанов Vibes Cafe, Dionis Cafe, владелец медицинской клиники GoodLife Clinic в Москве' image='/images/sallum.png'/>
          <Card title="Абрамова Анастасия" subtitle='Лектор РО "Знание", директор по продвижению цифровой платформы SPACE' image='/images/abramova.png'/>
          <Card title="Заяц Павел" subtitle='Лектор РО "Знание", директор по продвижению цифровой платформы SPACE' image='/images/zayats.png'/>
          <Card title="Стукалова Елена" subtitle='Руководитель стартап-студии Финансового университета при правительстве РФ, трекер' image='/images/stukalova.png'/>
          <Card title="Масштабная Екатерина" subtitle='Бизнес-ментор, психолог, эксперт по маркетингу и продажам, психолог, эксперт федеральных СМИ' image='/images/masshtabnaya.png'/>
          <Card title="Власюк Елена" subtitle='Психолог оборонно-промышленного комплекса' image='/images/vlasuk.png'/>
          <Card title="Андреев Юрий" subtitle='Руководитель Revolso Marketing, Совладелец и коммерческий директор строительной компании «Народные Заборы»' image='/images/andreev.png'/>
          <Card title="Грибакин Сергей" subtitle='Бизнес-тренер, специалист по продажам и УТП, лектор российского общества "Знание", блогер, автор книг.' image='/images/gribakin.png'/>
          <Card title="Рубина Екатерина" subtitle='Маркетолог, директор студии-креатива "Рубин"' image='/images/rubina.png'/>
          <Card title="Коган Андрей" subtitle='Руководитель компании «ВсеИзКитая», руководитель российско-китайского комитета Ассоциации Экспортёров и Импортеров' image='/images/kogan.png'/>
          <Card title="Уклонский Кирилл" subtitle='Лектор Российского общества Знание, эксперт в сфере разработки ИТ-решений федеральных образовательных форумов' image='/images/uklonskiy.png'/>
          <Card title="Баканов Александр" subtitle='Директор по развитию ГК "Альфарма-М"' image='/images/bakanov.png'/>
          <Card title="Гусакова Юлия" subtitle='Руководитель консалтингового агентства "КУБ"' image='/images/gusakova.png'/>
          <Card title="Плешаков Алексей" subtitle='Генеральный директор ООО Румекон' image='/images/pleshakov.png'/>
          <Card title="Реброва Наталья" subtitle='Руководитель Reframe Consulting, председатель Комитета по наставничеству в Москве' image='/images/rebrova.png'/>
        </div>
        
        {/* Стрелочка справа - вне скроллящегося контейнера */}
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

export default MentorsList