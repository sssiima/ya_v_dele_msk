import { useState, useEffect, useRef } from 'react'
import { homeworksApi, Homework, teamsApi } from '@/services/api'
import Header from '@/components/Header'

interface TeamData {
  code: string
  name: string
  mentor: string
  coord?: string
  ro?: string
  track?: string
}

const MethodPage = () => {
  const [homeworks, setHomeworks] = useState<Homework[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null)
  const [teamData, setTeamData] = useState<TeamData | null>(null)
  const [comment, setComment] = useState('')
  const [selectedMark, setSelectedMark] = useState<number | null>(null)
  const [showMarkSelector, setShowMarkSelector] = useState(false)
  const [saving, setSaving] = useState(false)
  const markSelectorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadHomeworks = async () => {
      try {
        setLoading(true)
        const result = await homeworksApi.getUploaded()
        if (result?.success && result.data) {
          setHomeworks(result.data)
        }
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    loadHomeworks()
  }, [])

  // Закрытие селектора баллов при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (markSelectorRef.current && !markSelectorRef.current.contains(event.target as Node)) {
        setShowMarkSelector(false)
      }
    }

    if (showMarkSelector) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMarkSelector])

  const handleEvaluate = async (homework: Homework) => {
    setSelectedHomework(homework)
    setComment('')
    setSelectedMark(null)
    setShowMarkSelector(false)
    setTeamData(null)
    
    if (homework.team_code) {
      try {
        const result = await teamsApi.getByCode(homework.team_code)
        if (result?.success && result.data) {
          setTeamData(result.data)
        }
      } catch (error) {
      }
    }
  }

  const handleOpenFile = () => {
    if (selectedHomework?.file_url) {
      window.open(selectedHomework.file_url, '_blank')
    }
  }

  const handleSave = async () => {
    if (!selectedHomework || selectedMark === null) {
      alert('Пожалуйста, выберите балл')
      return
    }

    try {
      setSaving(true)
      const result = await homeworksApi.review(selectedHomework.id, selectedMark, comment)
      if (result?.success) {
        // Обновляем список домашних заданий
        const updatedResult = await homeworksApi.getUploaded()
        if (updatedResult?.success && updatedResult.data) {
          setHomeworks(updatedResult.data)
        }
        setSelectedHomework(null)
        setComment('')
        setSelectedMark(null)
        setShowMarkSelector(false)
        setTeamData(null)
      }
    } catch (error) {
      alert('Ошибка при сохранении результата')
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    setSelectedHomework(null)
    setComment('')
    setSelectedMark(null)
    setShowMarkSelector(false)
    setTeamData(null)
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {!selectedHomework ? (
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
                      <th className="text-left pb-2 px-1.5 text-xs font-medium text-gray-700" style={{ width: '30%' }}>Код команды</th>
                      <th className="text-left pb-2 px-1.5 text-xs font-medium text-gray-700" style={{ width: '46%' }}>Название</th>
                      <th className="text-left pb-2 px-1.5 text-xs font-medium text-gray-700" style={{ width: '24%' }}>Оценить работу</th>
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
                            className="px-2 py-1.5 bg-brand text-white rounded-lg text-xs font-medium hover:bg-brand/90 transition-colors whitespace-nowrap"
                          >
                            Оценить
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
      ) : (
        <div className="px-6 py-4">
          <h1 className="text-md font-bold text-brand mb-4 text-center">Проверка домашних заданий</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Код команды</label>
              <input
                type="text"
                value={selectedHomework.team_code || ''}
                readOnly
                className="w-full px-4 py-2 border border-brand rounded-full bg-white text-sm focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Трек</label>
              <input
                type="text"
                value={teamData?.track || ''}
                readOnly
                className="w-full px-4 py-2 border border-brand rounded-full bg-white text-sm focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Наставник</label>
              <input
                type="text"
                value={teamData?.mentor || ''}
                readOnly
                className="w-full px-4 py-2 border border-brand rounded-full bg-white text-sm focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название работы</label>
              <input
                type="text"
                value={selectedHomework.hw_name || ''}
                readOnly
                className="w-full px-4 py-2 border border-brand rounded-full bg-white text-sm focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Файл задания</label>
              <button
                onClick={handleOpenFile}
                className="px-4 py-2 bg-brand text-white rounded-lg text-xs font-medium hover:bg-brand/90 transition-colors whitespace-nowrap"
              >
                Открыть файл
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Оставить комментарий</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2 border border-brand rounded-lg bg-white text-sm focus:outline-none min-h-[100px]"
                placeholder="Введите комментарий..."
              />
            </div>
            
            <div className="border-t border-brand pt-2"></div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-3 relative">
                <div className="relative" ref={markSelectorRef}>
                  <button
                    onClick={() => setShowMarkSelector(!showMarkSelector)}
                    className="px-3 py-2 border border-brand rounded-lg bg-white text-brand text-xs font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    Ввести балл {selectedMark !== null ? `(${selectedMark})` : ''}
                  </button>
                  
                  {showMarkSelector && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-brand rounded-lg p-2 shadow-lg z-10">
                      <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 16 }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedMark(i)
                              setShowMarkSelector(false)
                            }}
                            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                              selectedMark === i
                                ? 'bg-brand text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleSave}
                  disabled={saving || selectedMark === null}
                  className="px-3 py-2 bg-brand text-white rounded-lg text-xs font-medium hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {saving ? 'Сохранение...' : 'Отправить результат'}
                </button>
              </div>
              
              <button
                onClick={handleBack}
                className="text-brand text-sm hover:underline"
              >
                Вернуться к другим
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MethodPage

