import { useState } from 'react'
import Header from '@/components/Header'

const AdminPage = () => {
  const [activeAction, setActiveAction] = useState<string | null>(null)

  const handleAction = (action: string) => {
    setActiveAction(action)
    // Функционал будет добавлен позже
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Административная панель</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => handleAction('change-member-team')}
            className="bg-brand text-white px-6 py-4 rounded-lg font-medium hover:bg-brand/90 transition-colors text-left"
          >
            <h3 className="text-lg font-semibold mb-2">Смена команды у участника</h3>
            <p className="text-sm opacity-90">Изменить команду участника</p>
          </button>

          <button
            onClick={() => handleAction('delete-member')}
            className="bg-red-500 text-white px-6 py-4 rounded-lg font-medium hover:bg-red-600 transition-colors text-left"
          >
            <h3 className="text-lg font-semibold mb-2">Удаление участника</h3>
            <p className="text-sm opacity-90">Удалить участника из системы</p>
          </button>

          <button
            onClick={() => handleAction('delete-team')}
            className="bg-red-500 text-white px-6 py-4 rounded-lg font-medium hover:bg-red-600 transition-colors text-left"
          >
            <h3 className="text-lg font-semibold mb-2">Удаление команды</h3>
            <p className="text-sm opacity-90">Удалить команду из системы</p>
          </button>

          <button
            onClick={() => handleAction('delete-structure')}
            className="bg-red-500 text-white px-6 py-4 rounded-lg font-medium hover:bg-red-600 transition-colors text-left"
          >
            <h3 className="text-lg font-semibold mb-2">Удаление структуры</h3>
            <p className="text-sm opacity-90">Удалить пользователя структуры</p>
          </button>

          <button
            onClick={() => handleAction('change-structure')}
            className="bg-brand text-white px-6 py-4 rounded-lg font-medium hover:bg-brand/90 transition-colors text-left"
          >
            <h3 className="text-lg font-semibold mb-2">Смена структуры</h3>
            <p className="text-sm opacity-90">Изменить данные пользователя структуры</p>
          </button>
        </div>

        {activeAction && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">
              Выбрано действие: <span className="font-semibold">{activeAction}</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">Функционал будет реализован позже</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage

