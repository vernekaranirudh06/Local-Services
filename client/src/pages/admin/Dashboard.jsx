    import { Link } from 'react-router-dom'
    import { useGetPendingProvidersQuery } from '../../features/admin/adminApi.js'
    import { useGetPendingReviewsQuery }   from '../../features/admin/adminApi.js'
    import { useGetAllBookingsQuery }      from '../../features/admin/adminApi.js'
    import useAuth from '../../hooks/useAuth.js'
    import Card from '../../components/ui/Card.jsx'
    import Spinner from '../../components/ui/Spinner.jsx'
    import BookingStatusBadge from '../../components/shared/BookingStatusBadge.jsx'
    import { formatDateTime } from '../../utils/formatDate.js'
    import { Users, Star, CalendarDays, Wrench, ArrowRight } from 'lucide-react'

    const AdminDashboard = () => {
    const { user } = useAuth()

    // const { data: pendingProviders, isLoading: loadingProviders } = useGetPendingProvidersQuery()
    // const { data: pendingReviews,   isLoading: loadingReviews   } = useGetPendingReviewsQuery()
    // const { data: allBookings,      isLoading: loadingBookings   } = useGetAllBookingsQuery()

    const { data: pendingProviders, isLoading: loadingProviders } = useGetPendingProvidersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    })
    const { data: pendingReviews, isLoading: loadingReviews } = useGetPendingReviewsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    })
    const { data: allBookings, isLoading: loadingBookings } = useGetAllBookingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    })
    const stats = [
        {
        label:   'Pending Providers',
        value:   pendingProviders?.length || 0,
        color:   'text-yellow-600',
        bg:      'bg-yellow-50',
        icon:    Users,
        link:    '/admin/providers',
        },
        {
        label:   'Pending Reviews',
        value:   pendingReviews?.length || 0,
        color:   'text-purple-600',
        bg:      'bg-purple-50',
        icon:    Star,
        link:    '/admin/reviews',
        },
        {
        label:   'Total Bookings',
        value:   allBookings?.length || 0,
        color:   'text-blue-600',
        bg:      'bg-blue-50',
        icon:    CalendarDays,
        link:    '/admin/bookings',
        },
        {
        label:   'Active Bookings',
        value:   allBookings?.filter(b => ['Requested','Confirmed','In-Progress'].includes(b.status)).length || 0,
        color:   'text-green-600',
        bg:      'bg-green-50',
        icon:    Wrench,
        link:    '/admin/bookings',
        },
    ]

    return (
        <div className="flex flex-col gap-8">

        {/* Header */}
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}. Here's what needs your attention.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ label, value, color, bg, icon: Icon, link }) => (
            <Link to={link} key={label}>
                <Card className={`${bg} border-0 hover:shadow-md transition-shadow cursor-pointer`}>
                <div className="flex items-center justify-between">
                    <div>
                    <p className={`text-3xl font-bold ${color}`}>{value}</p>
                    <p className="text-sm text-gray-500 mt-1">{label}</p>
                    </div>
                    <Icon size={28} className={`${color} opacity-60`} />
                </div>
                </Card>
            </Link>
            ))}
        </div>

        {/* Pending Providers Alert */}
        {!loadingProviders && pendingProviders?.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
            <div>
                <p className="font-semibold text-yellow-800">
                {pendingProviders.length} provider{pendingProviders.length > 1 ? 's' : ''} waiting for approval
                </p>
                <p className="text-sm text-yellow-600 mt-0.5">Review and approve them to let them start accepting jobs.</p>
            </div>
            <Link to="/admin/providers">
                <button className="flex items-center gap-1 text-sm font-medium text-yellow-700 hover:underline cursor-pointer">
                Review <ArrowRight size={14} />
                </button>
            </Link>
            </div>
        )}

        {/* Recent Bookings */}
        <Card>
            <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                View all <ArrowRight size={13} />
            </Link>
            </div>

            {loadingBookings ? <Spinner /> : allBookings?.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No bookings yet.</p>
            ) : (
            <div className="flex flex-col divide-y divide-gray-100">
                {allBookings?.slice(0, 6).map((booking) => (
                <div key={booking._id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                    <p className="text-sm font-medium text-gray-800">{booking.service?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {booking.customer?.name} → {booking.provider?.name} · {formatDateTime(booking.scheduledAt)}
                    </p>
                    </div>
                    <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-blue-600">₹{booking.price}</p>
                    <BookingStatusBadge status={booking.status} />
                    </div>
                </div>
                ))}
            </div>
            )}
        </Card>

        </div>
    )
    }

    export default AdminDashboard