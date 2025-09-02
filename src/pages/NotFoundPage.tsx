import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-primary-600 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Страница не найдена
        </h1>
        <p className="text-gray-600 mb-8 max-w-md">
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Назад</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Home size={20} />
            <span>На главную</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
