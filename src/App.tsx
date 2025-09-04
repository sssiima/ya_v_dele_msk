import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense } from 'react'
import Layout from './components/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'

import HomePage from './pages/HomePage'
import RegistrationPage from './pages/RegistrationPage'
import ProfilePage from './pages/ProfilePage'
import AuthPage from './pages/AuthPage'

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reg" element={<RegistrationPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App
