    import { useState } from 'react'
    import { useParams } from 'react-router-dom'
    import {
    useGetBookingQuery,
    useUpdateStatusMutation,
    useCancelBookingMutation,
    useUploadJobImagesMutation,
    } from '../../features/bookings/bookingsApi.js'
    import Card from '../../components/ui/Card.jsx'
    import Button from '../../components/ui/Button.jsx'
    import BookingStatusBadge from '../../components/shared/BookingStatusBadge.jsx'
    import Spinner from '../../components/ui/Spinner.jsx'
    import { formatDateTime } from '../../utils/formatDate.js'
    import { MapPin, Clock, User, Upload } from 'lucide-react'
    import toast from 'react-hot-toast'

    // What action buttons to show based on current status
    const NEXT_ACTIONS = {
    Requested:    { label: 'Accept Job',       newStatus: 'Confirmed',    variant: 'success'  },
    Confirmed:    { label: 'Mark In-Progress', newStatus: 'In-Progress',  variant: 'primary'  },
    'In-Progress':{ label: 'Mark Completed',   newStatus: 'Completed',    variant: 'success'  },
    }

    const JobDetail = () => {
    const { id } = useParams()
    const [note,      setNote]      = useState('')
    const [workNotes, setWorkNotes] = useState('')
    const [beforeImg, setBeforeImg] = useState(null)
    const [afterImg,  setAfterImg]  = useState(null)

    const { data: booking, isLoading } = useGetBookingQuery(id)
    const [updateStatus,  { isLoading: updating }]   = useUpdateStatusMutation()
    const [cancelBooking, { isLoading: cancelling }] = useCancelBookingMutation()
    const [uploadImages,  { isLoading: uploading }]  = useUploadJobImagesMutation()

    if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    if (!booking)  return <p className="text-center text-gray-400 py-20">Job not found.</p>

    const nextAction = NEXT_ACTIONS[booking.status]
    const canCancel  = ['Requested', 'Confirmed'].includes(booking.status)

    const handleStatusUpdate = async () => {
        if (!nextAction) return
        try {
        await updateStatus({
            id:        booking._id,
            newStatus: nextAction.newStatus,
            note:      workNotes || note,
        }).unwrap()
        toast.success(`Job marked as ${nextAction.newStatus}`)
        setNote('')
        setWorkNotes('')
        } catch (err) {
        toast.error(err?.data?.message || 'Failed to update status')
        }
    }

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this job?')) return
        try {
        await cancelBooking({ id: booking._id, note }).unwrap()
        toast.success('Job cancelled')
        } catch (err) {
        toast.error(err?.data?.message || 'Failed to cancel')
        }
    }

    const handleImageUpload = async (type, file) => {
        if (!file) return
        const formData = new FormData()
        formData.append('image', file)
        formData.append('type', type)
        try {
        await uploadImages({ id: booking._id, formData }).unwrap()
        toast.success(`${type} image uploaded`)
        if (type === 'before') setBeforeImg(null)
        else setAfterImg(null)
        } catch (err) {
        toast.error(err?.data?.message || 'Upload failed')
        }
    }

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Job Detail</h1>
            <BookingStatusBadge status={booking.status} />
        </div>

        {/* Customer & Job Info */}
        <Card className="flex flex-col gap-4">
            <h2 className="font-semibold text-gray-800">Job Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-1">
                <p className="text-gray-400">Service</p>
                <p className="font-medium text-gray-800">{booking.service?.name}</p>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-gray-400 flex items-center gap-1"><User size={13} /> Customer</p>
                <p className="font-medium text-gray-800">{booking.customer?.name}</p>
                <p className="text-gray-500">{booking.customer?.phone}</p>
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
            <div className="border-t border-gray-100 pt-3 flex justify-between">
            <p className="text-sm text-gray-500">Payout</p>
            <p className="text-lg font-bold text-green-600">₹{booking.price}</p>
            </div>
        </Card>

        {/* Customer Notes / Image */}
        {(booking.customerNotes || booking.customerImage) && (
            <Card>
            <h2 className="font-semibold text-gray-800 mb-3">Customer Notes</h2>
            {booking.customerNotes && (
                <p className="text-sm text-gray-600 italic">"{booking.customerNotes}"</p>
            )}
            {booking.customerImage && (
                <img src={booking.customerImage} className="mt-3 rounded-lg w-full max-h-60 object-cover" />
            )}
            </Card>
        )}

        {/* Image Upload — show for Confirmed or In-Progress */}
        {['Confirmed', 'In-Progress', 'Completed'].includes(booking.status) && (
            <Card>
            <h2 className="font-semibold text-gray-800 mb-4">Job Photos</h2>
            <div className="grid grid-cols-2 gap-4">

                {/* Before Image */}
                <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600 font-medium">Before Photo</p>
                {booking.beforeImage ? (
                    <img src={booking.beforeImage} className="rounded-lg w-full h-32 object-cover" />
                ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg h-32 flex items-center justify-center">
                    <p className="text-xs text-gray-400">Not uploaded</p>
                    </div>
                )}
                {!booking.beforeImage && booking.status !== 'Completed' && (
                    <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBeforeImg(e.target.files[0])}
                        className="hidden"
                        id="beforeImg"
                    />
                    <label htmlFor="beforeImg" className="cursor-pointer">
                        <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => beforeImg && handleImageUpload('before', beforeImg)}
                        >
                        <Upload size={14} className="mr-1" />
                        {beforeImg ? 'Upload' : 'Choose Photo'}
                        </Button>
                    </label>
                    {beforeImg && (
                        <Button
                        size="sm"
                        className="w-full mt-1"
                        loading={uploading}
                        onClick={() => handleImageUpload('before', beforeImg)}
                        >
                        Upload Before Photo
                        </Button>
                    )}
                    </div>
                )}
                </div>

                {/* After Image */}
                <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600 font-medium">After Photo</p>
                {booking.afterImage ? (
                    <img src={booking.afterImage} className="rounded-lg w-full h-32 object-cover" />
                ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg h-32 flex items-center justify-center">
                    <p className="text-xs text-gray-400">Not uploaded</p>
                    </div>
                )}
                {!booking.afterImage && booking.status !== 'Completed' && (
                    <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAfterImg(e.target.files[0])}
                        className="hidden"
                        id="afterImg"
                    />
                    <label htmlFor="afterImg">
                        <Button variant="outline" size="sm" className="w-full cursor-pointer">
                        <Upload size={14} className="mr-1" /> Choose Photo
                        </Button>
                    </label>
                    {afterImg && (
                        <Button
                        size="sm"
                        className="w-full mt-1"
                        loading={uploading}
                        onClick={() => handleImageUpload('after', afterImg)}
                        >
                        Upload After Photo
                        </Button>
                    )}
                    </div>
                )}
                </div>
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

        {/* Actions */}
        {(nextAction || canCancel) && (
            <Card>
            <h2 className="font-semibold text-gray-800 mb-3">Update Job</h2>

            <textarea
                placeholder="Add a note (optional)..."
                value={workNotes || note}
                onChange={(e) => setWorkNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 resize-none mb-3"
            />

            <div className="flex gap-2 flex-wrap">
                {nextAction && (
                <Button
                    variant={nextAction.variant}
                    onClick={handleStatusUpdate}
                    loading={updating}
                    className="flex-1"
                >
                    {nextAction.label}
                </Button>
                )}
                {canCancel && (
                <Button
                    variant="danger"
                    onClick={handleCancel}
                    loading={cancelling}
                    className="flex-1"
                >
                    Cancel Job
                </Button>
                )}
            </div>
            </Card>
        )}

        </div>
    )
    }

    export default JobDetail