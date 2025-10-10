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
        <div className="grid grid-cols-4 gap-3">
            <div  className="space-y-1 flex flex-col justify-baseline items-center">
              <img src='images/minobr.png' alt='logo' className="rounded-xl object-contain h-12 sm:h-14 md:h-24 w-auto" />
                <div className="text-[9px] text-center text-gray-500 lg:text-xs">
                Министерство науки и высшего образования Российской Федерации
                </div>
            </div>
            <div  className="space-y-1 flex flex-col justify-baseline items-center">
              <img src='images/deppr.png' alt='logo' className="rounded-xl object-contain h-12 sm:h-14 md:h-24 w-auto" />
                <div className="text-[9px] text-center text-gray-500 lg:text-xs">
                Правительство города Москвы
                </div>
            </div>
            <div  className="space-y-1 flex flex-col justify-baseline items-center">
              <img src='images/sber.png' alt='logo' className="rounded-xl object-contain h-12 sm:h-14 md:h-24 w-auto" />
                <div className="text-[9px] text-center text-gray-500 lg:text-xs">
                ПАО «Сбербанк» 
                </div>
            </div>
            <div  className="space-y-1 flex flex-col justify-baseline items-center">
              <img src='images/chelkap.png' alt='logo' className="rounded-xl object-contain h-12 sm:h-14 md:h-24 w-auto" />
                <div className="text-[9px] text-center text-gray-500 lg:text-xs">
                Развитие человеческого капитала
                </div>
            </div>
        </div>
      </section>
    )
  }
  
  export default PartnersGrid2
  