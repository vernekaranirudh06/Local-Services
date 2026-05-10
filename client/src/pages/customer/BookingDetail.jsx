import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  useGetBookingQuery,
  useCancelBookingMutation,
  useRescheduleBookingMutation,
} from '../../features/bookings/bookingsApi.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import BookingStatusBadge from '../../components/shared/BookingStatusBadge.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { formatDateTime, formatDate } from '../../utils/formatDate.js'
import toast from 'react-hot-toast'
import { MapPin, Clock, User, Wrench } from 'lucide-react'

const BookingDetail = () => {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const [showReschedule, setShowReschedule] = useState(false)
  const [newDate, setNewDate]               = useState('')

  const { data: booking, isLoading } = useGetBookingQuery(id)
  const [cancelBooking,  { isLoading: cancelling }]    = useCancelBookingMutation()
  const [rescheduleBooking, { isLoading: rescheduling }] = useRescheduleBookingMutation()

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!booking)  return <p className="text-center text-gray-400 py-20">Booking not found.</p>

  const canCancel     = ['Requested', 'Confirmed'].includes(booking.status)
  const canReschedule = ['Requested', 'Confirmed'].includes(booking.status)
  const canReview     = booking.status === 'Completed'

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    try {
      await cancelBooking({ id: booking._id }).unwrap()
      toast.success('Booking cancelled')
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to cancel')
    }
  }

  const handleReschedule = async () => {
    if (!newDate) return toast.error('Please select a new date and time')
    try {
      await rescheduleBooking({ id: booking._id, scheduledAt: newDate }).unwrap()
      toast.success('Booking rescheduled')
      setShowReschedule(false)
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to reschedule')
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
        <BookingStatusBadge status={booking.status} />
      </div>

      {/* Main Info */}
      <Card className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <p className="text-gray-400 flex items-center gap-1"><Wrench size={13} /> Service</p>
            <p className="font-medium text-gray-800">{booking.service?.name}</p>
            <p className="text-gray-500">{booking.service?.category}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-400 flex items-center gap-1"><User size={13} /> Provider</p>
            <p className="font-medium text-gray-800">{booking.provider?.name}</p>
            <p className="text-gray-500">{booking.provider?.phone}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-400 flex items-center gap-1"><MapPin size={13} /> Address</p>
            <p className="font-medium text-gray-800">{booking.address}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-400 flex items-center gap-1"><Clock size={13} /> Scheduled</p>
            <p className="font-medium text-gray-800">{formatDateTime(booking.scheduledAt)}</p>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <p className="text-sm text-gray-500">Total Price</p>
          <p className="text-lg font-bold text-blue-600">₹{booking.price}</p>
        </div>
      </Card>

      {/* Customer Notes / Image */}
      {(booking.customerNotes || booking.customerImage) && (
        <Card>
          <h2 className="font-semibold text-gray-800 mb-3">Your Notes</h2>
          {booking.customerNotes && <p className="text-sm text-gray-600">{booking.customerNotes}</p>}
          {booking.customerImage && (
            <img src={booking.customerImage} className="mt-3 rounded-lg w-full max-h-60 object-cover" />
          )}
        </Card>
      )}

      {/* Provider Work Notes / Images */}
      {(booking.workNotes || booking.beforeImage || booking.afterImage) && (
        <Card>
          <h2 className="font-semibold text-gray-800 mb-3">Provider Updates</h2>
          {booking.workNotes && <p className="text-sm text-gray-600">{booking.workNotes}</p>}
          <div className="grid grid-cols-2 gap-3 mt-3">
            {booking.beforeImage && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Before</p>
                <img src={booking.beforeImage} className="rounded-lg w-full h-36 object-cover" />
              </div>
            )}
            {booking.afterImage && (
              <div>
                <p className="text-xs text-gray-400 mb-1">After</p>
                <img src={booking.afterImage} className="rounded-lg w-full h-36 object-cover" />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Status History */}
      <Card>
        <h2 className="font-semibold text-gray-800 mb-3">Status History</h2>
        <div className="flex flex-col gap-3">
          {booking.statusHistory?.map((entry, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">{entry.status}</p>
                {entry.note && <p className="text-xs text-gray-400">{entry.note}</p>}
                <p className="text-xs text-gray-300">{formatDateTime(entry.changedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reschedule Form */}
      {showReschedule && (
        <Card>
          <h2 className="font-semibold text-gray-800 mb-3">Reschedule Booking</h2>
          <input
            type="datetime-local"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
          />
          <div className="flex gap-2 mt-3">
            <Button onClick={handleReschedule} loading={rescheduling} size="sm">
              Confirm Reschedule
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowReschedule(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {canReview && (
          <Link to={`/customer/review/${booking._id}`} className="flex-1">
            <Button className="w-full">Leave a Review</Button>
          </Link>
        )}
        {canReschedule && !showReschedule && (
          <Button variant="outline" onClick={() => setShowReschedule(true)} className="flex-1">
            Reschedule
          </Button>
        )}
        {canCancel && (
          <Button variant="danger" onClick={handleCancel} loading={cancelling} className="flex-1">
            Cancel Booking
          </Button>
        )}
      </div>

    </div>
  )
}

export default BookingDetail