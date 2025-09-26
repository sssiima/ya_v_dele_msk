
const Card = ({ title, subtitle, image }: { title?: string, subtitle?:string, image?: string }) => (
  <div className='flex flex-col'>
  <div className="relative rounded-xl h-36 w-48 flex-shrink-0 overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${image}')` }}>
    {title && subtitle && (
      <div className="absolute bottom-4 left-0 right-0">
        <div className="bg-gradient-to-r from-white via-white to-transparent h-4 w-full" />
        
        <div className="absolute bottom-0 left-0 right-0 px-2 py-0.5 h-4 flex items-center">
          <h2 className="text-left text-brand font-bold text-xs capitalize">
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
    <section className="space-y-3">
      <div
        style={{ backgroundColor: '#08A6A5'}}
        className="h-px w-auto"
      />
      <h3 className="text-center text-brand font-extrabold text-[18px] uppercase pb-3">витрина проектов</h3>
      
      <div className="flex overflow-x-auto space-x-3  hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                      [-webkit-overflow-scrolling:touch]">
        <Card title="NutriCheck" subtitle='Приложение, которое создает разнообразные рационы с учетом повышенного потребления продуктов с дефицитными показателями' image='images/nutricheck.png'/>
        <Card title="Модуль" subtitle='Производство модульных ювелирных украшений — можно комбинировать детали между собой, получая уникальный результат из компонентов' image='images/module.png'/>
      </div>
    </section>
  )
}

export default ProjectsShowcase