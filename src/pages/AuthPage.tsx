// import { useEffect } from 'react'
// import { useForm } from 'react-hook-form'
// import { useNavigate } from 'react-router-dom'

// interface LoginValues {
//   username: string
//   password: string
// }

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

  return (
    <div className="min-h-screen flex items-center justify-center p-2">
      <div className="card w-full max-w-md bg-brand rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white text-center mb-6 uppercase">АВТОРИЗАЦИЯ</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-s font-semibold text-white mb-2">Логин</label>
            <input className="w-full px-4 py-3 border border-gray-300 rounded-full" autoComplete="off" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block text-s font-semibold text-white mb-2">Пароль</label>
            <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-full" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className='text-white italic text-center hover:underline'>
            <button onClick={() => navigate('/reset')}>Забыли пароль?</button>
          </div>
          {error && <p className="text-red-200 text-xs">{error}</p>}
          <button type="submit" disabled={loading} className="w-full font-bold rounded-full transition-colors pt-4">
            <h2 className="text-xl uppercase text-white">{loading ? 'Вход...' : 'Войти'}</h2>
          </button>
        </form>
      </div>
    </div>
  )
  // const { 
  //   register, 
  //   handleSubmit, 
  //   formState: { errors, isValid } 
  // } = useForm<LoginValues>({
  //   mode: 'onChange' // Валидация при изменении полей
  // })

  // const onSubmit = (data: LoginValues) => {
  //   console.log('login')
  //   navigate('/profile') // Переход после успешной валидации
  // }

  // const navigate = useNavigate()

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  // return (
  //   <div className="min-h-screen flex items-center justify-center p-2">
  //     <div className="card w-full max-w-md bg-brand rounded-2xl shadow-lg p-6">
  //       <h1 className="text-2xl font-bold text-white text-center mb-6 uppercase">АВТОРИЗАЦИЯ</h1>
        
  //       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  //         <div>
  //           <label className="block text-s font-semibold text-white mb-2">Логин</label>
  //           <input 
  //             className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  //             {...register('username', { 
  //               required: 'Логин обязателен'
  //             })}
  //           />
  //           {errors.username && <p className="text-red-300 text-xs mt-1">{errors.username.message}</p>}
  //         </div>

  //         <div>
  //           <label className="block text-s font-semibold text-white mb-2">Пароль</label>
  //           <input 
  //             type="password"
  //             className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  //             {...register('password', { 
  //               required: 'Пароль обязателен'
  //             })}
  //           />
  //           {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password.message}</p>}
  //         </div>

  //         <div className="text-center mt-2">
  //           <a href="/reset" className="text-s text-white italic hover:underline">
  //             Забыли логин или пароль?
  //           </a>
  //         </div>
          
  //         <button 
  //           type="submit"
  //           className={`w-full font-bold rounded-full transition-colors pt-10 ${
  //             isValid ? '': 'cursor-not-allowed'
  //           }`}
  //           disabled={!isValid}
  //         >
  //           <h2 className="text-3xl uppercase text-white">ВОЙТИ</h2>
  //         </button>

  //         <div className="relative my-2">
  //           <div className="absolute inset-0 flex items-center justify-center">
  //             <div className="min-w-60 border-t border-gray-300"></div>
  //           </div>
  //         </div>

  //         <div className="text-center">
  //           <h2><a href="/reg" className="inline-block text-s text-white py-4">
  //             Регистрация
  //           </a></h2>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // )
}

export default AuthPage