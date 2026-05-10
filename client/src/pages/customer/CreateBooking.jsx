    import { useEffect, useState } from 'react'
    import { useSearchParams, useNavigate } from 'react-router-dom'
    import { useGetServicesQuery } from '../../features/services/servicesApi.js'
    import { useGetProviderQuery } from '../../features/providers/providersApi.js'
    import { useCreateBookingMutation } from '../../features/bookings/bookingsApi.js'
    import Card from '../../components/ui/Card.jsx'
    import Button from '../../components/ui/Button.jsx'
    import Input from '../../components/ui/Input.jsx'
    import Spinner from '../../components/ui/Spinner.jsx'
    import toast from 'react-hot-toast'

    const CreateBooking = () => {
    const [searchParams]  = useSearchParams()
    const navigate        = useNavigate()
    const providerId      = searchParams.get('providerId')

    const [serviceId,     setServiceId]     = useState('')
    const [address,       setAddress]       = useState('')
    const [scheduledAt,   setScheduledAt]   = useState('')
    const [customerNotes, setCustomerNotes] = useState('')
    const [image,         setImage]         = useState(null)

    const { data: services, isLoading: servicesLoading } = useGetServicesQuery()
    const { data: provider, isLoading: providerLoading  } = useGetProviderQuery(providerId, {
        skip: !providerId,
    })
    const [createBooking, { isLoading: creating }] = useCreateBookingMutation()

    const selectedService = services?.find(s => s._id === serviceId)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!serviceId || !address || !scheduledAt) {
        return toast.error('Please fill all required fields')
        }

        const formData = new FormData()
        formData.append('providerId',     providerId)
        formData.append('serviceId',      serviceId)
        formData.append('address',        address)
        formData.append('scheduledAt',    scheduledAt)
        formData.append('customerNotes',  customerNotes)
        if (image) formData.append('customerImage', image)

        try {
        const booking = await createBooking(formData).unwrap()
        toast.success('Booking created successfully!')
        navigate(`/customer/bookings/${booking._id}`)
        } catch (err) {
        toast.error(err?.data?.message || 'Failed to create booking')
        }
    }

    if (providerLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    if (!provider)       return <p className="text-center text-gray-400 py-20">Provider not found.</p>

    return (
        <div className="max-w-xl mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Booking</h1>

        {/* Provider Summary */}
        <Card className="flex items-center gap-4 bg-blue-50 border-blue-100">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
            {provider?.name?.[0]}
            </div>
            <div>
            <p className="font-semibold text-gray-800">{provider?.name}</p>
            <p className="text-sm text-gray-500">{provider?.city} · {provider?.skills?.join(', ')}</p>
            </div>
        </Card>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Select Service */}
            <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Select Service *</label>
            {servicesLoading ? <Spinner size="sm" /> : (
                <div className="grid grid-cols-2 gap-2">
                {services?.map((service) => (
                    <button
                    type="button"
                    key={service._id}
                    onClick={() => setServiceId(service._id)}
                    className={`p-3 rounded-lg border text-left text-sm transition-colors cursor-pointer ${
                        serviceId === service._id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    >
                    <p className="font-medium">{service.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">₹{service.basePrice}</p>
                    </button>
                ))}
                </div>
            )}
            </div>

            {/* Price Preview */}
            {selectedService && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                <span className="text-green-700 font-medium">
                Estimated Price: ₹{selectedService.basePrice}
                </span>
                <p className="text-green-600 text-xs mt-0.5">This price will be locked at booking time</p>
            </div>
            )}

            <Input
            label="Address *"
            placeholder="Full address where work is needed"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            />

            <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Date & Time *</label>
            <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                required
            />
            </div>

            <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
            <textarea
                placeholder="Describe the issue or any special instructions..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
            />
            </div>

            <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Upload Photo (optional)</label>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
            />
            </div>

            <Button type="submit" loading={creating} size="lg" className="w-full">
            Confirm Booking
            </Button>
        </form>
        </div>
    )
    }

    export default CreateBooking