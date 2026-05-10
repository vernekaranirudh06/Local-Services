    import { Link, useNavigate } from 'react-router-dom'
    import { useDispatch } from 'react-redux'
    import { logout } from '../../features/auth/authSlice.js'
    import useAuth from '../../hooks/useAuth.js'
    import Button from '../ui/Button.jsx'
    import { LogOut, User, LayoutDashboard, ClipboardList, Briefcase, UserCircle } from 'lucide-react'
    import toast from 'react-hot-toast'

    const Navbar = () => {
    const { isLoggedIn, user, isCustomer, isProvider, isAdmin } = useAuth()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logout())
        toast.success('Logged out')
        navigate('/')
    }

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="text-xl font-bold text-blue-600">
            ServeLocal
        </Link>

        <div className="flex items-center gap-1">

            {/* Public links */}
            <Link to="/services" className="text-sm text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50">
            Services
            </Link>

            {/* Customer links */}
            {isLoggedIn && isCustomer && (
            <>
                <Link to="/customer/dashboard" className="text-sm text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                <LayoutDashboard size={15} /> Dashboard
                </Link>
                <Link to="/customer/bookings" className="text-sm text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                <ClipboardList size={15} /> My Bookings
                </Link>
            </>
            )}

            {/* Provider links */}
            {isLoggedIn && isProvider && (
            <>
                <Link to="/provider/dashboard" className="text-sm text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                <LayoutDashboard size={15} /> Dashboard
                </Link>
                <Link to="/provider/requests" className="text-sm text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                <ClipboardList size={15} /> Requests
                </Link>
                <Link to="/provider/jobs" className="text-sm text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                <Briefcase size={15} /> Jobs
                </Link>
                <Link to="/provider/profile" className="text-sm text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                <UserCircle size={15} /> Profile
                </Link>
            </>
            )}

            {/* Auth buttons */}
            {isLoggedIn ? (
            <div className="flex items-center gap-2 ml-2">
                <div className="flex items-center gap-1.5 text-sm text-gray-600 px-3 py-2">
                <User size={15} />
                {user?.name}
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut size={14} className="mr-1" /> Logout
                </Button>
            </div>
            ) : (
            <div className="flex items-center gap-2 ml-2">
                <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                <Button size="sm">Register</Button>
                </Link>
            </div>
            )}

        </div>
        </nav>
    )
    }

    export default Navbar