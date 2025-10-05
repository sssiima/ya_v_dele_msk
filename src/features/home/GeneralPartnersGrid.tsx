// import { useNavigate } from 'react-router-dom'

  
  const GeneralPartnersGrid = () => {
  
    return (
        <section className="space-y-4">
            <div
            style={{ backgroundColor: '#08A6A5' }}
            className="h-px w-auto"
          />
          <h3 className="text-center text-brand font-extrabold  text-[18px]">Генеральный партнер</h3>
          <div className="flex flex-row p-6 pt-2 justify-center items-center">
                <img src='images/deppr.png' alt='logo' className="h-24 rounded-xl mr-4 md:h-40" />
                <div className="text-[14px] text-left text-gray-500">
                Департамент предпринимательства и инновационного развития города Москвы
                </div>
          </div>
        </section>
      )
  }
  
  export default GeneralPartnersGrid
  