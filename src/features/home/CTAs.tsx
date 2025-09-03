import { useNavigate } from 'react-router-dom'

const CTAs = () => {
  const navigate = useNavigate()

  return (
    <section className="space-y-3 flex flex-col items-center">
      <button onClick={() => navigate('/reg')} className="w-[350px] h-[66px] rounded-3xl bg-brand hover:bg-teal-600 text-white font-bold text-[22px]">
        Хочу участвовать!
      </button>
      <button 
        className="w-[350px] h-[66px] rounded-3xl bg-transparent border-2 border-brand text-brand font-medium text-[22px]"
      >
        Авторизация
      </button>
    </section>
  )
}

export default CTAs