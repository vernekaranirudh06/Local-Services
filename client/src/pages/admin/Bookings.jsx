    import { useState } from 'react'
    import { useGetAllBookingsQuery } from '../../features/admin/adminApi.js'
    import Card from '../../components/ui/Card.jsx'
    import Spinner from '../../components/ui/Spinner.jsx'
    import BookingStatusBadge from '../../components/shared/BookingStatusBadge.jsx'
    import { formatDateTime } from '../../utils/formatDate.js'
    import { BOOKING_STATUSES } from '../../utils/constants.js'
    import { MapPin, User, Wrench } from 'lucide-react'

    const AdminBookings = () => {
    const [statusFilter, setStatusFilter] = useState('')
    const { data: bookings, isLoading } = useGetAllBookingsQuery(statusFilter)

    const total     = bookings?.length || 0
    const revenue   = bookings
        ?.filter(b => b.status === 'Completed')
        ?.reduce((sum, b) => sum + b.price, 0) || 0

    return (
        <div className="flex flex-col gap-6">

        {/* Header */}
        <div>
            <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
            <p className="text-sm text-gray-500 mt-1">Full overview of every booking on the platform.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            { label: 'Total',      value: total,                                                                          color: 'text-gray-800' },
            { label: 'Requested',  value: bookings?.filter(b => b.status === 'Requested').length   || 0,                 color: 'text-yellow-600' },
            { label: 'Completed',  value: bookings?.filter(b => b.status === 'Completed').length   || 0,                 color: 'text-green-600' },
            { label: 'Revenue',    value: `₹${revenue.toLocaleString('en-IN')}`,                                         color: 'text-blue-600' },
            ].map(({ label, value, color }) => (
            <Card key={label} className="text-center">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
            </Card>
            ))}
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
            {['', ...BOOKING_STATUSES].map((status) => (
            <button
                key={status || 'all'}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                statusFilter === status
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                }`}
            >
                {status || 'All'}
            </button>
            ))}
        </div>

        {/* Bookings Table */}
        {isLoading ? <Spinner /> : bookings?.length === 0 ? (
            <Card className="text-center py-12">
            <p className="text-gray-400">No bookings found.</p>
            </Card>
        ) : (
            <div className="flex flex-col gap-3">
            {bookings?.map((booking) => (
                <Card key={booking._id} className="hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">

                    <div className="flex flex-col gap-1.5">
                    {/* Service */}
                    <div className="flex items-center gap-2">
                        <Wrench size={14} className="text-gray-400" />
                        <p className="font-semibold text-gray-800">{booking.service?.name}</p>
                        <span className="text-xs text-gray-400">#{booking._id.slice(-6).toUpperCase()}</span>
                    </div>

                    {/* Customer → Provider */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User size={13} />
                        <span>{booking.customer?.name}</span>
                        <span className="text-gray-300">→</span>
                        <span>{booking.provider?.name}</span>
                    </div>

                    {/* Address + Date */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                        <MapPin size={11} /> {booking.address}
                        </span>
                        <span>{formatDateTime(booking.scheduledAt)}</span>
                    </div>
                    </div>

                    {/* Price + Status */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-3">
                    <p className="text-base font-bold text-blue-600">₹{booking.price}</p>
                    <BookingStatusBadge status={booking.status} />
                    </div>

                </div>
                </Card>
            ))}
            </div>
        )}
        </div>
    )
    }

    export default AdminBookings