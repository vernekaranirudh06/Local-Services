    import { useParams, Link } from 'react-router-dom'
    import { useGetProviderQuery } from '../../features/providers/providersApi.js'
    import { useGetProviderReviewsQuery } from '../../features/reviews/reviewsApi.js'
    import Card from '../../components/ui/Card.jsx'
    import Spinner from '../../components/ui/Spinner.jsx'
    import Button from '../../components/ui/Button.jsx'
    import StarRating from '../../components/shared/StarRating.jsx'
    import { MapPin, Phone, Briefcase, Wrench } from 'lucide-react'
    import useAuth from '../../hooks/useAuth.js'
    import { formatDate } from '../../utils/formatDate.js'

    const ProviderProfile = () => {
    const { id } = useParams()
    const { isLoggedIn, isCustomer } = useAuth()

    const { data: provider, isLoading } = useGetProviderQuery(id)
    const { data: reviewData } = useGetProviderReviewsQuery(id)

    if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    if (!provider) return <p className="text-center text-gray-400 py-20">Provider not found.</p>

    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <Card className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            {provider.profileImage ? (
            <img src={provider.profileImage} className="w-24 h-24 rounded-full object-cover" />
            ) : (
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Wrench size={36} className="text-blue-500" />
            </div>
            )}

            <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                provider.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                {provider.isAvailable ? 'Available' : 'Busy'}
                </span>
            </div>

            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 justify-center sm:justify-start">
                <span className="flex items-center gap-1"><MapPin size={14} />{provider.city}</span>
                {provider.phone && <span className="flex items-center gap-1"><Phone size={14} />{provider.phone}</span>}
                {provider.experience > 0 && (
                <span className="flex items-center gap-1"><Briefcase size={14} />{provider.experience} yrs exp.</span>
                )}
            </div>

            {reviewData && (
                <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <StarRating rating={Math.round(reviewData.avgRating || 0)} />
                <span className="text-sm text-gray-500">
                    {reviewData.avgRating || 0} ({reviewData.total} reviews)
                </span>
                </div>
            )}

            {provider.bio && (
                <p className="text-sm text-gray-600 mt-3">{provider.bio}</p>
            )}
            </div>
        </Card>

        {/* Skills */}
        {provider.skills?.length > 0 && (
            <Card>
            <h2 className="font-semibold text-gray-800 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
               {provider.skills?.map((skill) => (
  <span key={skill._id} className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full">
    {skill.name}
  </span>
))}
            </div>
            </Card>
        )}

        {/* Book Button */}
        {isLoggedIn && isCustomer && provider.isAvailable && (
            <Link to={`/customer/bookings/create?providerId=${provider._id}`}>
            <Button className="w-full" size="lg">Book This Provider</Button>
            </Link>
        )}

        {/* Reviews */}
        <Card>
            <h2 className="font-semibold text-gray-800 mb-4">
            Reviews ({reviewData?.total || 0})
            </h2>
            {reviewData?.reviews?.length === 0 ? (
            <p className="text-sm text-gray-400">No reviews yet.</p>
            ) : (
            <div className="flex flex-col gap-4">
                {reviewData?.reviews?.map((review) => (
                <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-gray-800">{review.customer?.name}</p>
                    <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                    </div>
                    <StarRating rating={review.rating} />
                    {review.comment && (
                    <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                    )}
                </div>
                ))}
            </div>
            )}
        </Card>

        </div>
    )
    }

    export default ProviderProfile