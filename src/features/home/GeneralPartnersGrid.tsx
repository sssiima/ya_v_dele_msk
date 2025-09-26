// import { useNavigate } from 'react-router-dom'

  
  const GeneralPartnersGrid = () => {
    // const navigate = useNavigate()
  
    return (
      <section className="space-y-4">
          <div
          style={{ backgroundColor: '#08A6A5' }}
          className="h-px w-auto"
        />
        <div>
        <h3 className="text-center text-brand font-extrabold text-[18px]">Генеральные партнеры</h3>
        <h5 className="text-center text-brand font-extrabold  text-[12px] normal-case">проектных треков</h5>
        </div>
        <div className="grid grid-cols-3 gap-3">
            <div  className="space-y-1">
              <img src='images/sberbusiness.png' alt='logo' className="w-full rounded-xl" />
                <div className="text-[10px] text-center text-gray-500">
                Сервис для предпринимателей “Сбер Бизнес”
                </div>
                <div className="text-[10px] text-center text-brand font-bold">
                Базовый
                </div>
            </div>
            <div  className="space-y-1">
              <img src='' alt='logo' className="w-full rounded-xl " />
                <div className="text-[10px] text-center text-gray-500">
                позже
                </div>
                <div className="text-[10px] text-center text-brand font-bold">
                Инновации
                </div>
            </div>
            <div  className="space-y-1">
              <img src='' alt='logo' className="w-full rounded-xl" />
                <div className="text-[10px] text-center text-gray-500">
                позже
                </div>
                <div className="text-[10px] text-center text-brand font-bold">
                Городской
                </div>
            </div>
        </div>
      </section>
    )
  }
  
  export default GeneralPartnersGrid
  