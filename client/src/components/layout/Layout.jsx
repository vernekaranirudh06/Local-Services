    import Navbar from './Navbar.jsx'
    import AdminSidebar from './AdminSidebar.jsx'
    import { Toaster } from 'react-hot-toast'
    import useAuth from '../../hooks/useAuth.js'

    const Layout = ({ children }) => {
    const { isAdmin } = useAuth()

    return (
        <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
            {isAdmin && <AdminSidebar />}
            <main className={`flex-1 px-4 py-8 ${isAdmin ? 'max-w-5xl' : 'max-w-6xl mx-auto w-full'}`}>
            {children}
            </main>
        </div>
        <Toaster position="top-right" />
        </div>
    )
    }

        export default Layout