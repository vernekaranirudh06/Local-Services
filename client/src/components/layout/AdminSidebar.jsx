    import { NavLink } from 'react-router-dom'
    import {
    LayoutDashboard,
    Users,
    Wrench,
    Star,
    CalendarDays,
    } from 'lucide-react'
    import clsx from 'clsx'

    const links = [
    { to: '/admin/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
    { to: '/admin/providers', label: 'Providers',  icon: Users           },
    { to: '/admin/services',  label: 'Services',   icon: Wrench          },
    { to: '/admin/reviews',   label: 'Reviews',    icon: Star            },
    { to: '/admin/bookings',  label: 'Bookings',   icon: CalendarDays    },
    ]

    const AdminSidebar = () => {
    return (
        <aside className="w-56 min-h-screen bg-white border-r border-gray-200 px-3 py-6 flex flex-col gap-1 sticky top-14 self-start">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Admin Panel
        </p>
        {links.map(({ to, label, icon: Icon }) => (
            <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
                clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                )
            }
            >
            <Icon size={17} />
            {label}
            </NavLink>
        ))}
        </aside>
    )
    }

    export default AdminSidebar