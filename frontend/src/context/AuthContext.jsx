import React from 'react'
import { AuthDataContext } from './AuthDataContext'

// Change 'function' to 'const' for better Vite HMR support
const AuthContext = ({ children }) => {
    const serverURL = "http://localhost:8000"
    
    let value = {
        serverURL
    }

    return (
        <AuthDataContext.Provider value={value}>
            {children}
        </AuthDataContext.Provider>
    )
}

export default AuthContext