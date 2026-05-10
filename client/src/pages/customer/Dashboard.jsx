    import { Link } from 'react-router-dom'
    import { useGetMyBookingsQuery } from '../../features/bookings/bookingsApi.js'
    import useAuth from '../../hooks/useAuth.js'
    import Card from '../../components/ui/Card.jsx'
    import Button from '../../components/ui/Button.jsx'
    import BookingStatusBadge from '../../components/shared/BookingStatusBadge.jsx'
    import Spinner from '../../components/ui/Spinner.jsx'
    import { formatDateTime } from '../../utils/formatDate.js'
    import { CalendarPlus, ListOrdered } from 'lucide-react'

    const CustomerDashboard = () => {
    const { user } = useAuth()
    const { data: bookings, isLoading } = useGetMyBookingsQuery()

    const active = bookings?.filter(b =>
        ['Requested', 'Confirmed', 'In-Progress'].includes(b.status)
    ) || []

    return (
        <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
            <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.name} 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your bookings here</p>
            </div>
            <Link to="/customer/bookings/create">
            <Button>
                <CalendarPlus size={16} className="mr-2" /> New Booking
            </Button>
            </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            { label: 'Total',       value: bookings?.length || 0,                                         color: 'text-gray-800' },
            { label: 'Active',      value: active.length,                                                  color: 'text-blue-600' },
            { label: 'Completed',   value: bookings?.filter(b => b.status === 'Completed').length || 0,   color: 'text-green-600' },
            { label: 'Cancelled',   value: bookings?.filter(b => b.status === 'Cancelled').length || 0,   color: 'text-red-500' },
            ].map(({ label, value, color }) => (
            <Card key={label} className="text-center">
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
            </Card>
            ))}
        </div>

        {/* Active Bookings */}
        <Card>
            <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <ListOrdered size={18} /> Active Bookings
            </h2>
            <Link to="/customer/bookings" className="text-sm text-blue-600 hover:underline">
                View all
            </Link>
            </div>

            {isLoading ? <Spinner /> : active.length === 0 ? (
            <div className="text-center py-8 flex flex-col items-center gap-3">
                <p className="text-gray-400 text-sm">No active bookings.</p>
                <Link to="/services">
                <Button variant="outline" size="sm">Browse Services</Button>
                </Link>
            </div>
            ) : (
            <div className="flex flex-col divide-y divide-gray-100">
                {active.map((booking) => (
                <Link
                    to={`/customer/bookings/${booking._id}`}
                    key={booking._id}
                    className="py-4 flex items-center justify-between hover:bg-gray-50 px-2 rounded-lg transition-colors"
                >
                    <div>
                    <p className="font-medium text-gray-800 text-sm">{booking.service?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {booking.provider?.name} · {formatDateTime(booking.scheduledAt)}
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

    export default CustomerDashboard