    import { useSelector } from 'react-redux'
    import { selectCurrentUser, selectCurrentToken, selectIsLoggedIn } from '../features/auth/authSlice.js'

    // Use this hook anywhere you need current user info
    // instead of calling useSelector every time
    const useAuth = () => {
    const user      = useSelector(selectCurrentUser)
    const token     = useSelector(selectCurrentToken)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    return {
        user,
        token,
        isLoggedIn,
        isCustomer: user?.role === 'customer',
        isProvider: user?.role === 'provider',
        isAdmin:    user?.role === 'admin',
    }
    }

    export default useAuth