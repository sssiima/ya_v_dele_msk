import { useState } from 'react'
import Header from '@/components/Header'
import { teamMembersApi, teamsApi } from '@/services/api'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'https://api-production-2fd7.up.railway.app/api')

interface Member {
  id: number
  last_name: string
  first_name: string
  patronymic?: string
  team_code: string
  role?: string
}

const AdminPage = () => {
  const [activeAction, setActiveAction] = useState<string | null>(null)
  
  // Состояния для смены команды у участника
  const [teamCodeInput, setTeamCodeInput] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [newTeamCode, setNewTeamCode] = useState('')
  const [saving, setSaving] = useState(false)

  // Состояния для удаления участника
  const [deleteTeamCodeInput, setDeleteTeamCodeInput] = useState('')
  const [deleteMembers, setDeleteMembers] = useState<Member[]>([])
  const [loadingDeleteMembers, setLoadingDeleteMembers] = useState(false)
  const [selectedMemberToDelete, setSelectedMemberToDelete] = useState<Member | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Состояния для удаления команды
  const [deleteTeamCodeInputTeam, setDeleteTeamCodeInputTeam] = useState('')
  const [teamToDelete, setTeamToDelete] = useState<{
    code: string
    name: string
    mentor: string | null
    members: Member[]
  } | null>(null)
  const [loadingTeamToDelete, setLoadingTeamToDelete] = useState(false)
  const [deletingTeam, setDeletingTeam] = useState(false)

  const handleAction = (action: string) => {
    setActiveAction(action)
    // Сбрасываем состояния при смене действия
    if (action !== 'change-member-team') {
      setTeamCodeInput('')
      setMembers([])
      setSelectedMember(null)
      setNewTeamCode('')
    }
    if (action !== 'delete-member') {
      setDeleteTeamCodeInput('')
      setDeleteMembers([])
      setSelectedMemberToDelete(null)
    }
    if (action !== 'delete-team') {
      setDeleteTeamCodeInputTeam('')
      setTeamToDelete(null)
    }
  }

  const handleLoadMembers = async () => {
    if (!teamCodeInput.trim()) {
      alert('Введите код команды')
      return
    }

    setLoadingMembers(true)
    try {
      const result = await teamMembersApi.getByTeamCode(teamCodeInput.trim())
      if (result?.success && result.data) {
        setMembers(result.data)
      } else {
        setMembers([])
        alert('Участники с таким кодом команды не найдены')
      }
    } catch (error: any) {
      alert(`Ошибка при загрузке участников: ${error.message}`)
      setMembers([])
    } finally {
      setLoadingMembers(false)
    }
  }

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member)
    setNewTeamCode('')
  }

  const handleSaveNewTeamCode = async () => {
    if (!selectedMember || !newTeamCode.trim()) {
      alert('Введите новый код команды')
      return
    }

    setSaving(true)
    try {
      // Получаем название команды по новому коду
      let newTeamName = null
      try {
        const teamResult = await teamsApi.getByCode(newTeamCode.trim())
        if (teamResult?.success && teamResult.data?.name) {
          newTeamName = teamResult.data.name
        }
      } catch (e) {
        // Если команда не найдена, название будет null
      }

      // Обновляем код команды и название команды у участника
      const response = await fetch(`${API_BASE_URL}/members/${selectedMember.id}/change-team`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_code: newTeamCode.trim(),
          team_name: newTeamName
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Ошибка при обновлении команды участника')
      }

      alert('Команда участника успешно изменена')
      
      // Обновляем список участников
      const updatedMembers = members.map(m => 
        m.id === selectedMember.id 
          ? { ...m, team_code: newTeamCode.trim() }
          : m
      )
      setMembers(updatedMembers)
      
      // Сбрасываем выбранного участника
      setSelectedMember(null)
      setNewTeamCode('')
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleLoadDeleteMembers = async () => {
    if (!deleteTeamCodeInput.trim()) {
      alert('Введите код команды')
      return
    }

    setLoadingDeleteMembers(true)
    try {
      const result = await teamMembersApi.getByTeamCode(deleteTeamCodeInput.trim())
      if (result?.success && result.data) {
        setDeleteMembers(result.data)
      } else {
        setDeleteMembers([])
        alert('Участники с таким кодом команды не найдены')
      }
    } catch (error: any) {
      alert(`Ошибка при загрузке участников: ${error.message}`)
      setDeleteMembers([])
    } finally {
      setLoadingDeleteMembers(false)
    }
  }

  const handleSelectMemberToDelete = (member: Member) => {
    setSelectedMemberToDelete(member)
  }

  const handleDeleteMember = async () => {
    if (!selectedMemberToDelete) {
      return
    }

    if (!confirm(`Вы уверены, что хотите удалить участника ${selectedMemberToDelete.last_name} ${selectedMemberToDelete.first_name} ${selectedMemberToDelete.patronymic || ''}?`)) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/members/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          last_name: selectedMemberToDelete.last_name,
          first_name: selectedMemberToDelete.first_name,
          patronymic: selectedMemberToDelete.patronymic || null,
          team_code: selectedMemberToDelete.team_code
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Ошибка при удалении участника')
      }

      alert('Участник успешно удален')
      
      // Обновляем список участников
      const updatedMembers = deleteMembers.filter(m => m.id !== selectedMemberToDelete.id)
      setDeleteMembers(updatedMembers)
      
      // Сбрасываем выбранного участника
      setSelectedMemberToDelete(null)
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`)
    } finally {
      setDeleting(false)
    }
  }

  const handleLoadTeamToDelete = async () => {
    if (!deleteTeamCodeInputTeam.trim()) {
      alert('Введите код команды')
      return
    }

    setLoadingTeamToDelete(true)
    try {
      // Получаем информацию о команде
      const teamResult = await teamsApi.getByCode(deleteTeamCodeInputTeam.trim())
      if (!teamResult?.success || !teamResult.data) {
        alert('Команда с таким кодом не найдена')
        setTeamToDelete(null)
        return
      }

      const team = teamResult.data

      // Получаем участников команды
      const membersResult = await teamMembersApi.getByTeamCode(deleteTeamCodeInputTeam.trim())
      const members = membersResult?.success && membersResult.data ? membersResult.data : []

      setTeamToDelete({
        code: team.code,
        name: team.name || 'Не указано',
        mentor: team.mentor || null,
        members: members
      })
    } catch (error: any) {
      alert(`Ошибка при загрузке информации о команде: ${error.message}`)
      setTeamToDelete(null)
    } finally {
      setLoadingTeamToDelete(false)
    }
  }

  const handleDeleteTeam = async () => {
    if (!teamToDelete) {
      return
    }

    if (!confirm(`Вы уверены, что хотите удалить команду "${teamToDelete.name}" (${teamToDelete.code})?\n\nЭто действие удалит:\n- Команду из системы\n- ${teamToDelete.members.length} участников\n- Все домашние задания команды\n- Все регистрации на мероприятия\n\nЭто действие нельзя отменить.`)) {
      return
    }

    setDeletingTeam(true)
    try {
      const response = await fetch(`${API_BASE_URL}/teams/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_code: teamToDelete.code
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Ошибка при удалении команды')
      }

      alert('Команда и все связанные данные успешно удалены')
      
      // Сбрасываем состояние
      setTeamToDelete(null)
      setDeleteTeamCodeInputTeam('')
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`)
    } finally {
      setDeletingTeam(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Административная панель</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => handleAction('change-member-team')}
            className="bg-red-500 text-white px-6 py-4 rounded-lg font-medium hover:bg-red-600 transition-colors text-left"
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
            className="bg-red-500 text-white px-6 py-4 rounded-lg font-medium hover:bg-red-600 transition-colors text-left"
          >
            <h3 className="text-lg font-semibold mb-2">Смена структуры</h3>
            <p className="text-sm opacity-90">Изменить данные пользователя структуры</p>
          </button>
        </div>

        {activeAction === 'change-member-team' && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Смена команды у участника</h2>
            
            {/* Ввод кода команды */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Введите код команды для поиска участников:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={teamCodeInput}
                  onChange={(e) => setTeamCodeInput(e.target.value)}
                  placeholder="Код команды"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleLoadMembers()
                    }
                  }}
                />
                <button
                  onClick={handleLoadMembers}
                  disabled={loadingMembers}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMembers ? 'Загрузка...' : 'Найти участников'}
                </button>
              </div>
            </div>

            {/* Список участников */}
            {members.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Участники команды {teamCodeInput}:
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => handleSelectMember(member)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedMember?.id === member.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-red-300 hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium text-gray-800">
                        {member.last_name} {member.first_name} {member.patronymic || ''}
                      </p>
                      <p className="text-sm text-gray-600">
                        Текущая команда: {member.team_code || 'не указана'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Форма для ввода нового кода команды */}
            {selectedMember && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Изменить команду для: {selectedMember.last_name} {selectedMember.first_name}
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTeamCode}
                    onChange={(e) => setNewTeamCode(e.target.value)}
                    placeholder="Новый код команды"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveNewTeamCode()
                      }
                    }}
                  />
                  <button
                    onClick={handleSaveNewTeamCode}
                    disabled={saving || !newTeamCode.trim()}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMember(null)
                      setNewTeamCode('')
                    }}
                    disabled={saving}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Отменить
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeAction === 'delete-member' && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Удаление участника</h2>
            
            {/* Ввод кода команды */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Введите код команды для поиска участников:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={deleteTeamCodeInput}
                  onChange={(e) => setDeleteTeamCodeInput(e.target.value)}
                  placeholder="Код команды"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleLoadDeleteMembers()
                    }
                  }}
                />
                <button
                  onClick={handleLoadDeleteMembers}
                  disabled={loadingDeleteMembers}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingDeleteMembers ? 'Загрузка...' : 'Найти участников'}
                </button>
              </div>
            </div>

            {/* Список участников */}
            {deleteMembers.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Участники команды {deleteTeamCodeInput}:
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {deleteMembers.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => handleSelectMemberToDelete(member)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedMemberToDelete?.id === member.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-red-300 hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium text-gray-800">
                        {member.last_name} {member.first_name} {member.patronymic || ''}
                      </p>
                      <p className="text-sm text-gray-600">
                        Команда: {member.team_code || 'не указана'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Кнопки удаления */}
            {selectedMemberToDelete && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Удалить участника: {selectedMemberToDelete.last_name} {selectedMemberToDelete.first_name} {selectedMemberToDelete.patronymic || ''}?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Это действие нельзя отменить. Участник будет полностью удален из системы.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteMember}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? 'Удаление...' : 'Удалить'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMemberToDelete(null)
                    }}
                    disabled={deleting}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Отменить
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeAction === 'delete-team' && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Удаление команды</h2>
            
            {/* Ввод кода команды */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Введите код команды для поиска:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={deleteTeamCodeInputTeam}
                  onChange={(e) => setDeleteTeamCodeInputTeam(e.target.value)}
                  placeholder="Код команды"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleLoadTeamToDelete()
                    }
                  }}
                />
                <button
                  onClick={handleLoadTeamToDelete}
                  disabled={loadingTeamToDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingTeamToDelete ? 'Загрузка...' : 'Найти команду'}
                </button>
              </div>
            </div>

            {/* Информация о команде */}
            {teamToDelete && (
              <div className="mb-4">
                <div className="p-4 border border-gray-300 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {teamToDelete.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Код команды:</span> {teamToDelete.code}
                  </p>
                  {teamToDelete.mentor && (
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Наставник:</span> {teamToDelete.mentor}
                    </p>
                  )}
                  
                  {/* Участники команды */}
                  {teamToDelete.members.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Участники ({teamToDelete.members.length}):
                      </p>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {teamToDelete.members.map((member) => (
                          <p key={member.id} className="text-sm text-gray-600 pl-2">
                            • {member.last_name} {member.first_name} {member.patronymic || ''}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Кнопки удаления */}
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-700 mb-4">
                    При удалении команды будут удалены:
                    <br />• Команда из системы
                    <br />• {teamToDelete.members.length} участников
                    <br />• Все домашние задания команды
                    <br />• Все регистрации на мероприятия
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteTeam}
                      disabled={deletingTeam}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingTeam ? 'Удаление...' : 'Удалить команду'}
                    </button>
                    <button
                      onClick={() => {
                        setTeamToDelete(null)
                        setDeleteTeamCodeInputTeam('')
                      }}
                      disabled={deletingTeam}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Отменить
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeAction && activeAction !== 'change-member-team' && activeAction !== 'delete-member' && activeAction !== 'delete-team' && (
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

