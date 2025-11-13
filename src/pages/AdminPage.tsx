import Header from '@/components/Header'

const AdminPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Административная панель</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Страница находится в разработке</p>
        </div>
      </div>
    </div>
  )
}

export default AdminPage

