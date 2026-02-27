import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/signup'
import Login from './pages/login'
import { UserDataContext } from './context/UserContext.jsx'

function App() {
  const { user, loading } = useContext(UserDataContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Protected: Only for logged-in users */}
      <Route path='/' element={user ? <Home /> : <Navigate to="/login" />} />

      {/* Restricted: Only for logged-out users */}
      <Route path='/signup' element={user ? <Navigate to="/" /> : <Signup />} />
      <Route path='/login' element={user ? <Navigate to="/" /> : <Login />} />
    </Routes>
  );
}

export default App;