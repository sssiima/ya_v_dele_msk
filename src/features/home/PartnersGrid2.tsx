// import { useNavigate } from 'react-router-dom'

  
  const PartnersGrid2 = () => {
    // const navigate = useNavigate()
  
    return (
      <section className="space-y-4">
          <div
          style={{ backgroundColor: '#08A6A5' }}
          className="h-px w-auto"
        />
        <h3 className="text-center text-brand font-extrabold  text-[18px]">При поддержке</h3>
        <div className="grid grid-cols-3 gap-3">
            <div  className="space-y-1">
              <img src='images/minobr.png' alt='logo' className="w-full rounded-xl" />
                <div className="text-[10px] text-center text-gray-500">
                Министерство науки и высшего образования Российской Федерации
                </div>
            </div>
            <div  className="space-y-1">
              <img src='images/deppr.png' alt='logo' className="w-full rounded-xl " />
                <div className="text-[10px] text-center text-gray-500">
                Департамент предпринимательства и инновационного развития города Москвы
                </div>
            </div>
            <div  className="space-y-1">
              <img src='images/novlu.png' alt='logo' className="w-full rounded-xl" />
                <div className="text-[10px] text-center text-gray-500">
                Политическая партия “Новые люди”
                </div>
            </div>
        </div>
      </section>
    )
  }
  
  export default PartnersGrid2
  