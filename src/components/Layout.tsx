import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

// Конфигурация фона для разных страниц
const backgroundConfig: Record<string, {
  image: string
  position?: string
  size?: string
  repeat?: string
}> = {
  '/': {
    image: './images/bg-main.png',
    position: 'right top',
    size: '100% auto',
    repeat: 'no-repeat'
  },
  '/reg': {
    image: './images/bg-reg.png',
    position: 'center center',
    size: 'auto 103%',
    repeat: 'no-repeat'
  },
  '/regstruct': {
    image: './images/bg-regstruct.png',
    position: 'center center',
    size: 'auto 160%',
    repeat: 'no-repeat'
  }
  // Добавьте другие страницы по необходимости
}

// Фон по умолчанию
const defaultBackground = {
  image: './images/bg-main.png',
  position: 'right top',
  size: '100% auto',
  repeat: 'no-repeat'
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  
  // Получаем настройки фона для текущей страницы
  const currentBackground = backgroundConfig[location.pathname] || defaultBackground

  return (
    <div className="min-h-screen flex flex-col relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${currentBackground.image}')`,
          backgroundRepeat: currentBackground.repeat,
          backgroundPosition: currentBackground.position,
          backgroundSize: currentBackground.size
        }}
      />

      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-4">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout