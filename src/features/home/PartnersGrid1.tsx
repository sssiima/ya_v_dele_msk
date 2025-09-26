// import { useNavigate } from 'react-router-dom'

  const PartnersGrid1 = () => {
    // const navigate = useNavigate()
  
    return (
      <section className="space-y-4">
          <div
          style={{ backgroundColor: '#08A6A5' }}
          className="h-px w-auto"
        />
        <h3 className="text-center text-brand font-extrabold  text-[18px]">При поддержке</h3>
        <div className="flex flex-row p-6 pt-2 justify-center items-center">
              <img src='images/kapitany.png' alt='logo' className="w-20 rounded-xl mr-4" />
              <div className="text-[14px] text-left text-gray-500">
                Благотворительный фонд поддержки образовательных программ «Капитаны»
              </div>
        </div>
      </section>
    )
  }
  
  export default PartnersGrid1
  