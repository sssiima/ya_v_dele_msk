const FeatureItem = ({ icon, title, text }: { icon: string; title: string; text: React.ReactNode }) => (
  <div className="flex items-start space-x-6">
    <div className="w-[4rem] md:w-[6rem] h-[4rem] md:h-[6rem] min-w-[3rem] min-h-[3rem] rounded-full bg-brand flex items-center justify-center text-4xl md:text-6xl flex-shrink-0">
      <span>{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-gray-900">{title}</div>
      <div className="text-sm text-gray-600">{text}</div>
    </div>
  </div>
)

const FeaturesList = () => {
  return (
    <section className="card space-y-4 relative"> 
      
      <div className="relative z-10"> 
        <div
          style={{ backgroundColor: '#08A6A5', margin: '0 -20px' }}
          className="h-px w-auto"
        />
        
        <h3 className="text-brand font-extrabold text-center pb-4 pt-3 text-[18px]">Как мы обучаем</h3>
        
        <div className="space-y-5 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-6">
          <FeatureItem icon="🎲" title="70% практики и инновационный подход" text={<>Обучаем сложным вещам легко и на <br />практике: через игры,<br />тренинги и креативы</>} />
          <FeatureItem icon="👀" title="Личный ментор" text={<>Сопровождение <br />от наставника на протяжении<br />всего обучения </>}/>
          <FeatureItem icon="🛠️" title="Командная работа" text={<>Если у тебя нет команды<br />для создания проекта,<br />поможем ее сформировать</>} />
          <FeatureItem icon="🗺️" title="Выезды" text={<>Проводим масштабные<br />форумы для участников<br />со всей России</>} />
          <FeatureItem icon="🤝🏻" title="Встречи с предпринимателями" text={<>Устраиваем встречи, на которых<br />ты получишь обратную связь по своему<br />проекту от опытных экспертов</>} />
          <FeatureItem icon="💎" title="Бесплатное участие" text={<>Совсем!<br />Совершенно<br />бесплатное</>} />
        </div>
      </div>
    </section>
  )
}

export default FeaturesList