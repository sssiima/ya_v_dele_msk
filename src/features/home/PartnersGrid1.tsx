// import { useNavigate } from 'react-router-dom'

  const PartnersGrid1 = () => {
    // const navigate = useNavigate()
  
    return (
      <section className="space-y-4">
          <div
          style={{ backgroundColor: '#08A6A5' }}
          className="h-px w-auto"
        />
        <h3 className="text-center text-brand font-extrabold  text-[18px]">Организаторы</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="flex flex-row items-center justify-start gap-4 p-4">
            <img
              src='images/kapitany.png'
              alt='Капитаны'
              className="rounded-xl w-14 h-14 object-contain flex-shrink-0 lg:h-20 lg:w-20"
            />
            <div className="text-[14px] text-left text-gray-500 leading-snug">
              Благотворительный фонд поддержки образовательных программ «Капитаны»
            </div>
          </div>

          <div className="flex flex-row items-center justify-end gap-4 p-4">
            <div className="text-[14px] text-right text-gray-500 leading-snug">
              Департамент предпринимательства и инновационного развития города Москвы
            </div>
            <img
              src='images/deppr.png'
              alt='Департамент'
              className="rounded-xl w-14 h-14 object-contain flex-shrink-0 lg:h-24 lg:w-24"
            />
          </div>
        </div>
        
      </section>
    )
  }
  
  export default PartnersGrid1
  