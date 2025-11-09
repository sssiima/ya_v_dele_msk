import { useState, useEffect } from 'react'
import { homeworksApi, Homework } from '@/services/api'
import Header from '@/components/Header'

const MethodPage = () => {
  const [homeworks, setHomeworks] = useState<Homework[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHomeworks = async () => {
      try {
        setLoading(true)
        const result = await homeworksApi.getUploaded()
        if (result?.success && result.data) {
          setHomeworks(result.data)
        }
      } catch (error) {
        console.error('Error loading uploaded homeworks:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHomeworks()
  }, [])

  const handleEvaluate = (homework: Homework) => {
    // Пока не функциональная кнопка
    console.log('Evaluate homework:', homework)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-brand mb-4">Проверка домашних заданий</h1>
        
        <div className="border-t border-brand pt-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Загрузка...</div>
          ) : homeworks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Нет домашних заданий на проверке</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-700">Код команды</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-700">№</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-700">Оценить работу</th>
                  </tr>
                </thead>
                <tbody>
                  {homeworks.map((homework) => (
                    <tr key={homework.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={homework.team_code || ''}
                          readOnly
                          className="w-full px-3 py-2 border border-brand rounded-full bg-white text-sm focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-brand font-medium">{homework.hw_name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleEvaluate(homework)}
                          className="px-4 py-2 bg-brand text-white rounded-full text-sm font-medium hover:bg-brand/90 transition-colors"
                        >
                          Оценить работу
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MethodPage

