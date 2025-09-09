import { useNavigate } from 'react-router-dom'

const CTA2 = () => {
  const navigate = useNavigate()

  return (
    <section className="space-y-4">
        <div
        style={{ backgroundColor: '#08A6A5' }}
        className="h-px w-auto"
      />
      <div className='text-center'>
      <button onClick={() => navigate('/reg')}
              className="w-[350px] h-[54px] rounded-2xl bg-brand hover:bg-teal-600 text-white font-bold text-[18px]">
        Оставить заявку на участие
      </button>
      </div>
    </section>
  )
}

export default CTA2