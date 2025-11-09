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
    <div className="min-h-screen">
      <Header />
      
      <div className="px-6 py-4">
        <h1 className="text-md font-bold text-brand mb-4 text-center">Проверка домашних заданий</h1>
        
        <div className="border-t border-brand pt-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Загрузка...</div>
          ) : homeworks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Нет домашних заданий на проверке</div>
          ) : (
            <div>
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-brand">
                    <th className="text-left py-2 px-1.5 text-xs font-medium text-gray-700" style={{ width: '30%' }}>Код команды</th>
                    <th className="text-left py-2 px-1.5 text-xs font-medium text-gray-700" style={{ width: '47%' }}>Название</th>
                    <th className="text-left py-2 px-1.5 text-xs font-medium text-gray-700" style={{ width: '23%' }}>Оценить</th>
                  </tr>
                </thead>
                <tbody>
                  {homeworks.map((homework) => (
                    <tr key={homework.id} className="border-b border-gray-100">
                      <td className="py-2 px-1.5">
                        <input
                          type="text"
                          value={homework.team_code || ''}
                          readOnly
                          className="w-full px-1.5 py-1.5 border border-brand rounded-full bg-white text-xs focus:outline-none"
                        />
                      </td>
                      <td className="py-2 px-1.5">
                        <span className="text-brand font-medium text-xs break-words">{homework.hw_name}</span>
                      </td>
                      <td className="py-2 px-1.5">
                        <button
                          onClick={() => handleEvaluate(homework)}
                          className="px-2 py-1.5 bg-brand text-white rounded-full text-xs font-medium hover:bg-brand/90 transition-colors whitespace-nowrap"
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

