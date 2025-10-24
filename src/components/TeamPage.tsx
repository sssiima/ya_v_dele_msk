const Ro = ({ title, image }: { title?: string, image?: string }) => {
    
    return (
        <div className="w-[70px] flex flex-col items-center justify-center sm:w-32">
          <img src={image} alt='user' className="rounded-xl bg-gray-200 w-[70px] h-28 sm:w-32 sm:h-48" />
          <div className="text-[6px] text-center text-black mt-1 sm:text-[10px]">
                {title}
          </div>
        </div>
    )
  }

  const Rback = ({ title, subtitle, image }: { title?: string, subtitle?: string, image?: string }) => {
    
    return (
        <div className="flex justify-center">
        <div className="w-[70px] flex flex-col items-center justify-center sm:w-32">
          <img src={image} alt='user' className="rounded-xl bg-gray-200 w-[70px] h-28 sm:w-32 sm:h-48" />
          <div className="text-[6px] text-center text-black mt-1 sm:text-[10px]">
                {title}
          </div>
          <div className="text-[4px] text-center text-black sm:text-[8px]">
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
                <div className="bg-gray-300 w-32 h-48 rounded-xl mb-2"></div>
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
                    <Ro title='Бенескул Архип' image='images/Бенескул_Архип.jpg'/>
                    <Ro title='Кожурина Анастасия' image='images/Кожурина_Анастасия.jpg'/>
                    <Ro title='Семернина Полина' image='images/Семернина_Полина.jpg'/>
                    <Ro title='Слободина Юлия' image='images/Слободина_Юлия.jpg'/>
                    <Ro title='Терентьев Артем' image='images/Терентьев_Артем.jpg'/>
                    <Ro title='Алибашич Ясмина' image='images/Алибашич_Ясмина.jpg'/>
                    <Ro title='Васенина Дария' image='images/Васенина_Дария.jpg'/>
                    <Ro title='Пасько Александра' image='images/Пасько_Александра.jpg'/>
                    <Ro title='Старовойтова Галина' image='images/Старовоитова_Галина.jpg'/>
                    <Ro title='Шастина Злата' image='images/Шастина_Злата.jpg'/>
                    <Ro title='Назарук Александра' image='images/Назарук_Александра.jpg'/>
                    <Ro title='Осипова Наталья' image='images/Осипова_Наталья.jpg'/>
                    <Ro title='Стрюк Станислав' image='images/Стрюк_Станислав.jpg'/>
                    <Ro title='Губарева Софья' image='images/Губарева_Софья.jpg'/>
                    <Ro title='Корнева Ксения' image='images/Корнева_Ксения.jpg'/>
                    <Ro title='Милюхина Саша' image='images/Милюхина_Александра.jpg'/>
                    <Ro title='Позмогова Ксения' image='images/Позмогова_Ксения.jpg'/>
                    <Ro title='Шкурко Владислав' image='images/Шкурко_Владислав.jpg'/>
                    <Ro title='Алиев Руслан' image='images/Алиев_Руслан.jpg'/>
                    <Ro title='Бойко Илья' image='images/Бойко_Илья.jpg'/>
                    <Ro title='Брызжина Кристина' image='images/Брызжина_Кристина.jpg'/>
                    <Ro title='Салова Анна' image='images/Салова_Анна.jpg'/>
                    <Ro title='Кокодеев Леонид' image='images/Кокодеев_Леонид.jpg'/>
                    <Ro title='Малявко Илья' image='images/Малявко_Илья.jpg'/>
                    <Ro title='Мошенко Артем' image='images/Мошенко_Артем.jpg'/>
                    <Ro title='Ачето Максим' image='images/Ачето_Максим.jpg'/>
                    <Ro title='Зарецкий Артем' image='images/Зарецкий_Артем.jpg'/>
                    <Ro title='Тысячных Алёна' image='images/Тысячных_Алёна.jpg'/>
                    <Ro title='Братанов Илья' image='images/Братанов_Илья.jpg'/>
                    <Ro title='Ермашов Владимир' image='images/Ермашов_Владимир.jpg'/>
                    <Ro title='Россихин Евгений' image='images/Россихин_Евгении.jpg'/>
                    <Ro title='Тертычный Никита' image='images/Тертычныи_Никита.jpg'/>
                    <Ro title='Сорокина Вероника' image='images/Сорокина_Вероника.jpg'/>
                    <Ro title='Чемоданова Катерина' image='images/Чемоданова_Катерина.jpg'/>
                    <Ro title='Данилин Даниил' image='images/Данилин_Даниил.jpg'/>
                    <Ro title='Морозова Кира' image='images/Морозова_Кира.jpg'/>
                    <Ro title='Некрасова Ирина' image='images/Некрасова_Ирина.jpg'/>
                    <Ro title='Коломина Арина' image='images/Коломина_Арина.jpg'/>
                </div>
            </div>
        </div>
    );
  };
  
  export default TeamPage;