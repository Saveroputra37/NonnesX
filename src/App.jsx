import React from 'react'
import { ClerkProvider, useUser } from '@clerk/clerk-react'
import Navbar from './assets/Navbar'
import Home from './page/Home/home'
import Layout from './page/LayoutLogin/layout'

const AppContent = () => {
  const { user, isLoaded } = useUser()

  // Loading state saat Clerk mengecek authentication
  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Jika user sudah login, tampilkan Home
  if (user) {
    return (
      <div>
        <Home />
      </div>
    );
  }

  // Jika user belum login, tampilkan Login
  return <Layout />;
}

const App = () => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <AppContent />
    </ClerkProvider>
  )
}

export default App
