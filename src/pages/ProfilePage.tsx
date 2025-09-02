import { useTelegram } from '../hooks/useTelegram'
import { Settings, Calendar, Heart, Users, LogOut, Edit } from 'lucide-react'

interface UserEvent {
  id: string
  title: string
  date: string
  status: 'upcoming' | 'past' | 'organized'
}

const mockUserEvents: UserEvent[] = [
  {
    id: '1',
    title: 'Нетворкинг в центре Москвы',
    date: '2024-01-15',
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Йога в парке',
    date: '2024-01-10',
    status: 'past',
  },
  {
    id: '3',
    title: 'Встреча фотографов',
    date: '2024-01-20',
    status: 'organized',
  },
]

const ProfilePage = () => {
  const { user, showAlert } = useTelegram()

  const stats = [
    { label: 'Посещено событий', value: '12', icon: Calendar },
    { label: 'Избранных', value: '8', icon: Heart },
    { label: 'Организовано', value: '3', icon: Users },
  ]

  const handleEditProfile = () => {
    showAlert('Функция редактирования профиля в разработке')
  }

  const handleLogout = () => {
    showAlert('Функция выхода в разработке')
  }

  return (
    <div className="space-y-6">
      {/* Профиль пользователя */}
      <div className="card">
        <div className="flex items-center space-x-4">
          {user?.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.first_name}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold text-xl">
                {user?.first_name?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">
              {user?.first_name} {user?.last_name}
            </h1>
            {user?.username && (
              <p className="text-gray-600">@{user.username}</p>
            )}
            <p className="text-sm text-gray-500">
              Участник сообщества
            </p>
          </div>
          
          <button
            onClick={handleEditProfile}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Edit size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Статистика
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Icon size={24} className="text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Мои события */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Мои события
        </h2>
        <div className="space-y-3">
          {mockUserEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {event.date}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.status === 'upcoming'
                    ? 'bg-blue-100 text-blue-700'
                    : event.status === 'past'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {event.status === 'upcoming' && 'Предстоит'}
                {event.status === 'past' && 'Прошло'}
                {event.status === 'organized' && 'Организовано'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Настройки */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Настройки
        </h2>
        <div className="space-y-3">
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Settings size={20} className="text-gray-600" />
            <span className="text-gray-900">Настройки приложения</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Calendar size={20} className="text-gray-600" />
            <span className="text-gray-900">Уведомления</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Users size={20} className="text-gray-600" />
            <span className="text-gray-900">Приватность</span>
          </button>
        </div>
      </div>

      {/* Выход */}
      <div className="card">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-left text-red-600"
        >
          <LogOut size={20} />
          <span>Выйти из аккаунта</span>
        </button>
      </div>
    </div>
  )
}

export default ProfilePage
