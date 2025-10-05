// import { useNavigate } from 'react-router-dom'

const Partner = ({ name, image }: { name?: string, image?: string }) => (
  <div className="flex justify-center">
    <div className="w-full max-w-[120px]">
      <img src={image} alt='vus' className="w-full rounded-xl" />
      <div className="text-[8px] text-center text-gray-500 mt-1">
            {name}
      </div>
    </div>
  </div>
)

const FooterNote = () => (
  <div className="text-center text-brand text-sm font-semibold italic">
    © Я в деле — программа развития молодёжного предпринимательства, 2025
  </div>
)

const VusesGrid = () => {

  return (
    <section className="space-y-4">
        <div
        style={{ backgroundColor: '#08A6A5' }}
        className="h-px w-auto"
      />
      <h3 className="text-center text-brand font-extrabold  text-[18px]">Вузы</h3>
      <div className="flex flex-wrap justify-center gap-3 px-4">
            <Partner image='images/reu.png' name='РЭУ им. Г.В. Плеханова' />   
            <Partner image='images/sech.png' name='Сеченовский университет' />   
            <Partner image='images/hse.png' name='НИУ ВШЭ' />  
            <Partner image='images/gaugn.png' name='ГАУГН' />  
            <Partner image='images/atiso.png' name='АТиСО' />  
            <Partner image='images/imes.png' name='ИМЭС' />  
            <Partner image='images/mai.png' name='МАИ' />  
            <Partner image='images/mgua.png' name='МГЮА' />  
            <Partner image='images/misis.png' name='МИСИС' />  
            <Partner image='images/ranepa.png' name='РАНХиГС' />  
            <Partner image='images/mei.png' name='НИУ МЭИ' />  
            <Partner image='images/guu.png' name='ГУУ' />  
            <Partner image='images/rgais.png' name='РГАИС' />  
            <Partner image='images/mosap.png' name='МосАП' />  
            <Partner image='images/guz.png' name='ГУЗ' />  
            <Partner image='images/madi.png' name='МАДИ' />  
            <Partner image='images/mgppu.png' name='МГППУ' />  
            <Partner image='images/mgsu.png' name='НИУ МГСУ' />  
            <Partner image='images/rgau.png' name='РГАУ - МСХА имени Тимирязева' />  
            <Partner image='images/fin.png' name='Финансовый университет' />  
            <Partner image='images/rut.png' name='РУТ (МИИТ)' />  
            <Partner image='images/rum.png' name='РУМ Минздрава России' />  
            <Partner image='images/rghpu.png' name='РГХПУ им. С.Г. Строганова' />  
            <Partner image='images/rgu.png' name='РГУ нефти и газа (НИУ) имени И.М. Губкина' />  
            <Partner image='images/mba.png' name='МГАВМиБ – МВА имени К.И. Скрябина' />  
            <Partner image='images/mirea.png' name='РТУ МИРЭА' />  
            <Partner image='images/rudn.png' name='РУДН' />  
            <Partner image='images/synergy.png' name='Университет «Синергия»' />  
            <Partner image='images/rnimu.png' name='РНИМУ им. Н.И. Пирогова Минздрава России' />  
      </div>
      <div
        style={{ backgroundColor: '#08A6A5' }}
        className="h-px w-auto"
      />
      <FooterNote />
    </section>
  )
}

export default VusesGrid