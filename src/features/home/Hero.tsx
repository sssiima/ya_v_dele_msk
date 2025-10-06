import Header from "@/components/Header"
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()
  
  return (
    <section className="card p-0 overflow-hidden">
      <div className="relative z-10">
        <Header />
      </div>
      
      {/* Основной контейнер */}
      <div className="flex flex-col md:flex-row items-stretch px-4 pb-2 gap-6 md:px-0">
        {/* Левая часть - картинка (50% ширины на md+) */}
        <div className="flex justify-center md:justify-start md:w-1/2">
          <img
            src="/images/heading-icon.png"
            alt="Элемент перед заголовком"
            className="-rotate-[7deg] w-100 max-w-[300px] md:max-w-[400px] lg:max-w-[700px]"
          />
        </div>
        
        {/* Правая часть - заголовок и кнопки (50% ширины на md+) */}
        <div className="md:w-1/2 flex flex-col items-center md:items-end justify-between gap-6 lg:gap-3 lg:justify-center lg:min-h-[70vh]">
          {/* Заголовок */}
          <div className="text-center md:text-right w-full lg:flex lg:items-end lg:justify-end">
            <h2 
              className="font-heading leading-tight md:text-right md:pt-8 lg:pt-0" 
              style={{ fontSize: '16px' }}
            >
              Всероссийская программа развития молодёжного предпринимательства
            </h2>
          </div>
          
          {/* Кнопки */}
          <div className="space-y-3 flex flex-col items-center md:items-end lg:items-center w-full lg:justify-start lg:pt-12">
            <button 
              onClick={() => navigate('/reg')}
              className="w-[350px] md:w-[300px] lg:w-[350px] max-w-[350px] h-[66px] rounded-3xl bg-brand hover:bg-teal-600 text-white font-bold text-[22px]"
            >
              Хочу участвовать!
            </button>
            <button 
              onClick={() => navigate('/auth')}
              className="w-[350px] md:w-[300px] lg:w-[350px] max-w-[350px] h-[66px] rounded-3xl bg-transparent border-2 border-brand text-brand font-medium text-[22px]"
            >
              Войти в ЛК
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero