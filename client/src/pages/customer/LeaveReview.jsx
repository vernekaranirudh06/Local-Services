    import { useState } from 'react'
    import { useParams, useNavigate } from 'react-router-dom'
    import { useSubmitReviewMutation } from '../../features/reviews/reviewsApi.js'
    import { useGetBookingQuery } from '../../features/bookings/bookingsApi.js'
    import Card from '../../components/ui/Card.jsx'
    import Button from '../../components/ui/Button.jsx'
    import Spinner from '../../components/ui/Spinner.jsx'
    import { Star } from 'lucide-react'
    import toast from 'react-hot-toast'

    const LeaveReview = () => {
    const { bookingId } = useParams()
    const navigate      = useNavigate()
    const [rating,  setRating]  = useState(0)
    const [hovered, setHovered] = useState(0)
    const [comment, setComment] = useState('')

    const { data: booking, isLoading } = useGetBookingQuery(bookingId)
    const [submitReview, { isLoading: submitting }] = useSubmitReviewMutation()

    if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (rating === 0) return toast.error('Please select a rating')

        try {
        await submitReview({ bookingId, rating, comment }).unwrap()
        toast.success('Review submitted! It will appear after admin approval.')
        navigate('/customer/bookings')
        } catch (err) {
        toast.error(err?.data?.message || 'Failed to submit review')
        }
    }

    return (
        <div className="max-w-md mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-900">Leave a Review</h1>

        <Card className="bg-blue-50 border-blue-100">
            <p className="font-medium text-gray-800">{booking?.service?.name}</p>
            <p className="text-sm text-gray-500 mt-1">Provider: {booking?.provider?.name}</p>
        </Card>

        <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Star Rating Picker */}
            <div className="flex flex-col items-center gap-3">
                <p className="text-sm font-medium text-gray-700">How was your experience?</p>
                <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="cursor-pointer transition-transform hover:scale-110"
                    >
                    <Star
                        size={36}
                        className={
                        star <= (hovered || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }
                    />
                    </button>
                ))}
                </div>
                <p className="text-sm text-gray-400">
                {rating === 0 ? 'Select a rating' :
                rating === 1 ? 'Poor' :
                rating === 2 ? 'Fair' :
                rating === 3 ? 'Good' :
                rating === 4 ? 'Very Good' : 'Excellent'}
                </p>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Comment (optional)</label>
                <textarea
                placeholder="Share your experience with this provider..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
                />
            </div>

            <Button type="submit" loading={submitting} className="w-full">
                Submit Review
            </Button>
            </form>
        </Card>
        </div>
    )
    }

    export default LeaveReview