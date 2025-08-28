import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Stores from './pages/Stores.jsx'
import Admin from './pages/Admin.jsx'
import AdminUserDetails from './pages/AdminUserDetails.jsx'
import Owner from './pages/Owner.jsx'
import Profile from './pages/Profile.jsx'
import { AuthProvider } from './state/AuthContext.jsx'
import { ThemeProvider } from './state/ThemeContext.jsx'
import Layout from './components/Layout.jsx'
import { ProtectedRoute, RoleRoute } from './routes/guards.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'stores', element: <ProtectedRoute><Stores /></ProtectedRoute> },
      { path: 'admin', element: <RoleRoute role="admin"><Admin /></RoleRoute> },
      { path: 'admin/users/:id', element: <RoleRoute role="admin"><AdminUserDetails /></RoleRoute> },
      { path: 'owner', element: <RoleRoute role="store-owner"><Owner /></RoleRoute> },
      { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
