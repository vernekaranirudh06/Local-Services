    import { Star } from 'lucide-react'

    const StarRating = ({ rating, max = 5 }) => {
    return (
        <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
            <Star
            key={i}
            size={16}
            className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
        ))}
        </div>
    )
    }

    export default StarRating