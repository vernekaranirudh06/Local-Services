import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'

// Usage:
// <ProtectedRoute allowedRoles={['customer']} />
// <ProtectedRoute allowedRoles={['provider', 'admin']} />

    const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isLoggedIn, user } = useAuth()

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />
    }

    return children
    }

export default ProtectedRoute