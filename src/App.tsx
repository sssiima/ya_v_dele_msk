import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense } from 'react'
import Layout from './components/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'

import HomePage from './pages/HomePage'
import RegistrationPage from './pages/RegistrationPage'
import ProfilePage from './pages/ProfilePage'
import ProfilePageMember from './pages/ProfilePageMember'
import AuthPage from './pages/AuthPage'
import ResetPage from './pages/ResetPage'
import RegistrationPageStructure from './pages/RegistrationPageStructure'


function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reg" element={<RegistrationPage />} />
          <Route path="/regstruct" element={<RegistrationPageStructure />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reset" element={<ResetPage />} />
          <Route path="/profile-structure" element={<ProfilePage />} />
          <Route path="/profile-member" element={<ProfilePageMember />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App
