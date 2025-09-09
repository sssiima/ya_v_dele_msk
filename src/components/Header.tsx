// import { useNavigate } from 'react-router-dom'
// import { ArrowLeft, Menu } from 'lucide-react'
// import { useTelegram } from '../hooks/useTelegram'

const Header = () => {
  return (
    <header className="flex flex-col">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <div aria-hidden>
            <img src="/images/location.png" alt="локация" className="w-4" />
          </div>
          <span className="text-sm font-semibold text-brand text-[16px]">Москва</span>
        </div>
        <div className="flex items-center space-x-4 px-2">
          <div aria-hidden>
            <a href='https://vk.com/yavdele.moscow'><img src="/images/vk.png" alt="vk" className="w-9"></img></a>
          </div>
          <div aria-hidden>
            <a href='https://явделе.рф/'><img src="/images/web-site.png" alt="web" className="w-9"></img></a>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto" />
    </header>
  )
}

export default Header
