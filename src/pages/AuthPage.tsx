import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { memberAuthApi, structureAuthApi, authUtilsApi } from '@/services/api'

const AuthPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // Сначала проверим наличие username
      const exists = await authUtilsApi.checkUsername(username)
      const foundIn = exists?.data?.foundIn as 'member' | 'structure' | 'both' | null
      if (!foundIn) {
        setError('Пользователь не существует')
        return
      }

      // Если есть, пробуем логины по очереди
      let authed = false
      if (foundIn === 'member' || foundIn === 'both') {
        const resMember = await memberAuthApi.login(username, password).catch(() => null)
        if (resMember?.success) {
          const memberId = resMember?.data?.id
          if (!memberId) throw new Error('Некорректный ответ сервера (member)')
          localStorage.removeItem('structure_id')
          localStorage.setItem('member_id', String(memberId))
          navigate('/profile-member')
          authed = true
        }
      }

      if (!authed && (foundIn === 'structure' || foundIn === 'both')) {
        const resStruct = await structureAuthApi.login(username, password).catch(() => null)
        if (resStruct?.success) {
          const structureCtid = resStruct?.data?.ctid
          if (!structureCtid) throw new Error('Некорректный ответ сервера (structure)')
          localStorage.removeItem('member_id')
          localStorage.removeItem('structure_id')
          localStorage.setItem('structure_ctid', String(structureCtid))
          navigate('/profile-structure')
          authed = true
        }
      }

      if (!authed) {
        setError('Неверный пароль')
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации')
    } finally {
      setLoading(false)
    }
  }

  // Обработчик для кнопки "Забыли пароль?"
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault() // Предотвращаем отправку формы
    navigate('/reset')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-2">
      <div className="card w-full max-w-md bg-brand rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white text-center mb-6 uppercase">АВТОРИЗАЦИЯ</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-s font-semibold text-white mb-2">Логин</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-full" 
              autoComplete="off" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-s font-semibold text-white mb-2">Пароль</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-full" 
              autoComplete="new-password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <div className='text-white italic text-center hover:underline'>
            <button 
              type="button" // Важно: type="button" чтобы не отправлять форму
              onClick={handleForgotPassword}
            >
              Забыли пароль?
            </button>
          </div>
          {error && <p className="text-red-200 text-xs">{error}</p>}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full font-bold rounded-full transition-colors pt-4"
          >
            <h2 className="text-xl uppercase text-white">{loading ? 'Вход...' : 'Войти'}</h2>
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthPage