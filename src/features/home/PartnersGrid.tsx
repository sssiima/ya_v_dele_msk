// import { useNavigate } from 'react-router-dom'

const Partner = () => (
  <div className="w-full aspect-square rounded-xl bg-gray-200" />
)

const FooterNote = () => (
  <div className="text-center text-brand text-sm font-semibold italic">
    © Я в деле — программа развития молодёжного предпринимательства, 2022-2025
    <div className="mt-5">
      Благотворительный фонд поддержки образовательных программ «КАПИТАНЫ»
    </div>
  </div>
)

const PartnersGrid = () => {
  // const navigate = useNavigate()

  return (
    <section className="space-y-4">
        <div
        style={{ backgroundColor: '#08A6A5' }}
        className="h-px w-auto"
      />
      <h3 className="text-center text-brand font-extrabold  text-[18px]">При поддержке</h3>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Partner />
            <div className="text-[10px] text-center text-gray-500">
              Благотворительный фонд поддержки образовательных программ «Капитаны»
            </div>
          </div>
        ))}
      </div>
      {/* <div className='flex justify-center space-x-4'>
      <button onClick={() => navigate('/regstruct')}
              className="w-[180px] h-[34px] rounded-lg bg-brand hover:bg-teal-600 text-white font-bold text-[10px]">
        Регистрация для наставников
      </button>
      <button 
              className="w-[180px] h-[34px] rounded-lg bg-brand hover:bg-teal-600 text-white font-bold text-[10px]">
        Регистрация для экспертов
      </button>
      </div> */}
      <div
        style={{ backgroundColor: '#08A6A5' }}
        className="h-px w-auto"
      />
      <FooterNote />
    </section>
  )
}

export default PartnersGrid
