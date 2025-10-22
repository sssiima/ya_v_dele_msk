const Ro = ({ title, image }: { title?: string, image?: string }) => {
    
    return (
        <div className="flex justify-center">
        <div className="w-full max-w-[95px]">
          <img src={image} alt='user' className="w-full rounded-xl bg-gray-200 w-[70px] h-28" />
          <div className="text-[8px] text-center text-black mt-1">
                {title}
          </div>
        </div>
      </div>
    )
  }

  const Rback = ({ title, subtitle, image }: { title?: string, subtitle?: string, image?: string }) => {
    
    return (
        <div className="flex justify-center">
        <div className="w-full max-w-[95px]">
          <img src={image} alt='user' className="w-full rounded-xl bg-gray-200 w-[70px] h-28" />
          <div className="text-[8px] text-center text-black mt-1">
                {title}
          </div>
          <div className="text-[6px] text-center text-black">
                {subtitle}
          </div>
        </div>
      </div>
    )
  }


const TeamPage = () => {
    return (
        <div className="text-center">
            <h2 className="normal-case mt-4">Команда программы</h2>
            <div className="flex flex-col items-center justify-center mt-4 text-xs">
                <div className="bg-gray-300 w-32 h-44 rounded-xl mb-2"></div>
                <p>Анисимов Максим</p>
                <p>Руководитель программы в г. Москва</p>
            </div>
            <div>
                <h3 className="normal-case mt-6 text-[12px]">Руководители округов</h3>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                    <Ro title='Навакова Мария' />
                    <Ro title='Навакова Мария' />
                    <Ro title='Навакова Мария' />
                    <Ro title='Навакова Мария' />
                    <Ro title='Навакова Мария' />
                    <Ro title='Навакова Мария' />
                    <Ro title='Навакова Мария' />
                    <Ro title='Навакова Мария' />
                </div>
            </div>
            <div>
                <h3 className="normal-case mt-4 text-[12px]">Руководители отделов</h3>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                    <Rback title='Навакова Мария' subtitle='HR-отдел' />
                    <Rback title='Навакова Мария' subtitle='HR-отдел' />
                    <Rback title='Навакова Мария' subtitle='HR-отдел' />
                    <Rback title='Навакова Мария' subtitle='HR-отдел' />
                    <Rback title='Навакова Мария' subtitle='HR-отдел' />
                    <Rback title='Навакова Мария' subtitle='HR-отдел' />
                    <Rback title='Навакова Мария' subtitle='HR-отдел' />
                    <Rback title='Навакова Мария' subtitle='HR-отдел' />
                </div>
            </div>
            <div>
                <h3 className="normal-case mt-4 text-[12px]">Координаторы</h3>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                    <Ro title='Навакова Мария' />
                    <Ro title='Навакова Мария' />
                    <Ro title='Навакова Мария' />
                    <Ro title='Навакова Мария' />
                    <Ro title='Навакова Мария' />
                    <Ro title='Навакова Мария' />
                    <Ro title='Навакова Мария' />
                    <Ro title='Навакова Мария' />
                </div>
            </div>
        </div>
    );
  };
  
  export default TeamPage;