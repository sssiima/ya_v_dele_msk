import { ReactNode } from 'react'
// import { useLocation } from 'react-router-dom'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  // const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "url('./images/bg-main.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right top',
          backgroundSize: '500px auto'
        }}
      />

      <div className="relative z-10">
        <Header />
      </div>

      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-4">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
