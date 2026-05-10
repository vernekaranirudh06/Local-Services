    import {
    useGetPendingReviewsQuery,
    useApproveReviewMutation,
    useRejectReviewMutation,
    } from '../../features/admin/adminApi.js'
    import Card from '../../components/ui/Card.jsx'
    import Button from '../../components/ui/Button.jsx'
    import Spinner from '../../components/ui/Spinner.jsx'
    import StarRating from '../../components/shared/StarRating.jsx'
    import { formatDate } from '../../utils/formatDate.js'
    import toast from 'react-hot-toast'

    const AdminReviews = () => {
    const { data: reviews, isLoading } = useGetPendingReviewsQuery()
    const [approveReview, { isLoading: approving }] = useApproveReviewMutation()
    const [rejectReview,  { isLoading: rejecting  }] = useRejectReviewMutation()

    const handleApprove = async (id) => {
        try {
        await approveReview(id).unwrap()
        toast.success('Review approved and published')
        } catch (err) {
        toast.error(err?.data?.message || 'Failed to approve')
        }
    }

    const handleReject = async (id) => {
        if (!confirm('Remove this review permanently?')) return
        try {
        await rejectReview(id).unwrap()
        toast.success('Review removed')
        } catch (err) {
        toast.error(err?.data?.message || 'Failed to remove')
        }
    }

    return (
        <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Review Moderation</h1>
            <p className="text-sm text-gray-500 mt-1">
            Approve or remove reviews before they appear publicly on provider profiles.
            </p>
        </div>

        {isLoading ? <Spinner /> : reviews?.length === 0 ? (
            <Card className="text-center py-16">
            <p className="text-gray-400 font-medium">All caught up!</p>
            <p className="text-sm text-gray-300 mt-1">No reviews pending moderation.</p>
            </Card>
        ) : (
            <div className="flex flex-col gap-4">
            {reviews?.map((review) => (
                <Card key={review._id}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">

                    {/* Review Content */}
                    <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <StarRating rating={review.rating} />
                        <span className="text-sm font-semibold text-gray-700">{review.rating}/5</span>
                    </div>

                    {review.comment ? (
                        <p className="text-sm text-gray-700 italic max-w-lg">"{review.comment}"</p>
                    ) : (
                        <p className="text-sm text-gray-400 italic">No comment provided.</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 mt-1">
                        <span>
                        By: <span className="text-gray-600 font-medium">{review.customer?.name}</span>
                        </span>
                        <span>
                        For: <span className="text-gray-600 font-medium">{review.provider?.name}</span>
                        </span>
                        <span>{formatDate(review.createdAt)}</span>
                    </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 sm:flex-col sm:items-end flex-shrink-0">
                    <Button
                        variant="success"
                        size="sm"
                        loading={approving}
                        onClick={() => handleApprove(review._id)}
                        className="flex-1 sm:flex-none"
                    >
                        Approve
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        loading={rejecting}
                        onClick={() => handleReject(review._id)}
                        className="flex-1 sm:flex-none"
                    >
                        Remove
                    </Button>
                    </div>

                </div>
                </Card>
            ))}
            </div>
        )}
        </div>
    )
    }

    export default AdminReviews