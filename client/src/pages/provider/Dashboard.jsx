    import { Link } from 'react-router-dom'
    import { useGetProviderBookingsQuery } from '../../features/bookings/bookingsApi.js'
    import { useToggleAvailabilityMutation } from '../../features/providers/providersApi.js'
    import { useDispatch } from 'react-redux'
    import { setCredentials } from '../../features/auth/authSlice.js'
    import useAuth from '../../hooks/useAuth.js'
    import Card from '../../components/ui/Card.jsx'
    import Button from '../../components/ui/Button.jsx'
    import BookingStatusBadge from '../../components/shared/BookingStatusBadge.jsx'
    import Spinner from '../../components/ui/Spinner.jsx'
    import { formatDateTime } from '../../utils/formatDate.js'
    import { ToggleLeft, ToggleRight, ClipboardList, Briefcase } from 'lucide-react'
    import toast from 'react-hot-toast'

    const ProviderDashboard = () => {
    const { user } = useAuth()
    const dispatch = useDispatch()

    const { data: bookings, isLoading } = useGetProviderBookingsQuery()
    const [toggleAvailability, { isLoading: toggling }] = useToggleAvailabilityMutation()

    const pending    = bookings?.filter(b => b.status === 'Requested')    || []
    const active     = bookings?.filter(b => ['Confirmed', 'In-Progress'].includes(b.status)) || []
    const completed  = bookings?.filter(b => b.status === 'Completed')    || []

    const handleToggle = async () => {
        try {
        const result = await toggleAvailability().unwrap()
        // Update user in redux + localStorage
        dispatch(setCredentials({ ...user, token: localStorage.getItem('token'), isAvailable: result.isAvailable }))
        toast.success(result.isAvailable ? 'You are now available' : 'You are now unavailable')
        } catch {
        toast.error('Failed to update availability')
        }
    }

    return (
        <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
            <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.name} 👋</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your jobs and availability</p>
            </div>

            {/* Availability Toggle */}
            <button
            onClick={handleToggle}
            disabled={toggling}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border ${
                user?.isAvailable
                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
            }`}
            >
            {user?.isAvailable
                ? <><ToggleRight size={18} /> Available</>
                : <><ToggleLeft  size={18} /> Unavailable</>
            }
            </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            { label: 'Total Jobs',   value: bookings?.length || 0,  color: 'text-gray-800' },
            { label: 'Pending',      value: pending.length,          color: 'text-yellow-600' },
            { label: 'Active',       value: active.length,           color: 'text-blue-600' },
            { label: 'Completed',    value: completed.length,        color: 'text-green-600' },
            ].map(({ label, value, color }) => (
            <Card key={label} className="text-center">
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
            </Card>
            ))}
        </div>

        {/* Pending Requests */}
        <Card>
            <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <ClipboardList size={18} /> Pending Requests
                {pending.length > 0 && (
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
                    {pending.length}
                </span>
                )}
            </h2>
            <Link to="/provider/requests" className="text-sm text-blue-600 hover:underline">
                View all
            </Link>
            </div>

            {isLoading ? <Spinner /> : pending.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No pending requests right now.</p>
            ) : (
            <div className="flex flex-col divide-y divide-gray-100">
                {pending.slice(0, 3).map((booking) => (
                <Link
                    key={booking._id}
                    to={`/provider/jobs/${booking._id}`}
                    className="py-4 flex items-center justify-between hover:bg-gray-50 px-2 rounded-lg transition-colors"
                >
                    <div>
                    <p className="font-medium text-sm text-gray-800">{booking.service?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {booking.customer?.name} · {formatDateTime(booking.scheduledAt)}
                    </p>
                    </div>
                    <BookingStatusBadge status={booking.status} />
                </Link>
                ))}
            </div>
            )}
        </Card>

        {/* Active Jobs */}
        <Card>
            <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Briefcase size={18} /> Active Jobs
            </h2>
            <Link to="/provider/jobs" className="text-sm text-blue-600 hover:underline">
                View all
            </Link>
            </div>

            {isLoading ? <Spinner /> : active.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No active jobs right now.</p>
            ) : (
            <div className="flex flex-col divide-y divide-gray-100">
                {active.slice(0, 3).map((booking) => (
                <Link
                    key={booking._id}
                    to={`/provider/jobs/${booking._id}`}
                    className="py-4 flex items-center justify-between hover:bg-gray-50 px-2 rounded-lg transition-colors"
                >
                    <div>
                    <p className="font-medium text-sm text-gray-800">{booking.service?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {booking.customer?.name} · {formatDateTime(booking.scheduledAt)}
                    </p>
                    </div>
                    <BookingStatusBadge status={booking.status} />
                </Link>
                ))}
            </div>
            )}
        </Card>

        </div>
    )
    }

    export default ProviderDashboard