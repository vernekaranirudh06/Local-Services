    import { Link } from 'react-router-dom'
    import { useGetProviderBookingsQuery } from '../../features/bookings/bookingsApi.js'
    import Card from '../../components/ui/Card.jsx'
    import Button from '../../components/ui/Button.jsx'
    import Spinner from '../../components/ui/Spinner.jsx'
    import { formatDateTime } from '../../utils/formatDate.js'
    import { MapPin, Clock, User } from 'lucide-react'

    const Requests = () => {
    const { data: bookings, isLoading } = useGetProviderBookingsQuery('Requested')

    return (
        <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Incoming Requests</h1>
            <p className="text-sm text-gray-500 mt-1">Accept or reject new booking requests</p>
        </div>

        {isLoading ? <Spinner /> : bookings?.length === 0 ? (
            <Card className="text-center py-16">
            <p className="text-gray-400">No pending requests right now.</p>
            <p className="text-sm text-gray-300 mt-1">New requests will appear here.</p>
            </Card>
        ) : (
            <div className="flex flex-col gap-4">
            {bookings?.map((booking) => (
                <Card key={booking._id} className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex flex-col gap-1.5">
                    <p className="font-semibold text-gray-800">{booking.service?.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <User size={13} /> {booking.customer?.name} · {booking.customer?.phone}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin size={13} /> {booking.address}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={13} /> {formatDateTime(booking.scheduledAt)}
                    </p>
                    <p className="text-sm font-semibold text-blue-600">₹{booking.price}</p>
                    {booking.customerNotes && (
                        <p className="text-xs text-gray-400 italic">"{booking.customerNotes}"</p>
                    )}
                    </div>

                    {booking.customerImage && (
                    <img
                        src={booking.customerImage}
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                        alt="Customer uploaded"
                    />
                    )}
                </div>

                <div className="flex gap-2">
                    <Link to={`/provider/jobs/${booking._id}`} className="flex-1">
                    <Button className="w-full">View & Respond</Button>
                    </Link>
                </div>
                </Card>
            ))}
            </div>
        )}
        </div>
    )
    }

    export default Requests