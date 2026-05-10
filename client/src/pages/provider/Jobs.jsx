    import { useState } from 'react'
    import { Link } from 'react-router-dom'
    import { useGetProviderBookingsQuery } from '../../features/bookings/bookingsApi.js'
    import Card from '../../components/ui/Card.jsx'
    import Button from '../../components/ui/Button.jsx'
    import BookingStatusBadge from '../../components/shared/BookingStatusBadge.jsx'
    import Spinner from '../../components/ui/Spinner.jsx'
    import { formatDateTime } from '../../utils/formatDate.js'
    import { BOOKING_STATUSES } from '../../utils/constants.js'
    import { MapPin, User } from 'lucide-react'

    const Jobs = () => {
    const [statusFilter, setStatusFilter] = useState('')
    const { data: bookings, isLoading } = useGetProviderBookingsQuery(statusFilter)

    return (
        <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
            <p className="text-sm text-gray-500 mt-1">All jobs assigned to you</p>
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

        {isLoading ? <Spinner /> : bookings?.length === 0 ? (
            <Card className="text-center py-12">
            <p className="text-gray-400">No jobs found.</p>
            </Card>
        ) : (
            <div className="flex flex-col gap-4">
            {bookings?.map((booking) => (
                <Card key={booking._id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                    <p className="font-semibold text-gray-800">{booking.service?.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <User size={13} /> {booking.customer?.name}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin size={13} /> {booking.address}
                    </p>
                    <p className="text-xs text-gray-400">{formatDateTime(booking.scheduledAt)}</p>
                    <p className="text-sm font-semibold text-blue-600">₹{booking.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                    <BookingStatusBadge status={booking.status} />
                    <Link to={`/provider/jobs/${booking._id}`}>
                        <Button variant="outline" size="sm">Manage Job</Button>
                    </Link>
                    </div>
                </div>
                </Card>
            ))}
            </div>
        )}
        </div>
    )
    }

    export default Jobs