    import { useState } from 'react'
    import { useSearchParams, Link } from 'react-router-dom'
    import { useGetServicesQuery } from '../../features/services/servicesApi.js'
    import { useGetProvidersQuery } from '../../features/providers/providersApi.js'
    import Card from '../../components/ui/Card.jsx'
    import Input from '../../components/ui/Input.jsx'
    import Spinner from '../../components/ui/Spinner.jsx'
    import Button from '../../components/ui/Button.jsx'
    import { MapPin, Wrench } from 'lucide-react'
    import useAuth from '../../hooks/useAuth.js'

    const Services = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [city, setCity]           = useState('')
    const [cityFilter, setCityFilter] = useState('')

    const category = searchParams.get('category') || ''

    const { data: services, isLoading: servicesLoading } = useGetServicesQuery(category)
    const selectedService = services?.find(s => s.category === category)

    const { data: providers, isLoading: providersLoading } = useGetProvidersQuery({
    ...(cityFilter && { city: cityFilter }),
    ...(selectedService && { serviceId: selectedService._id }),
    })

    const { isLoggedIn, isCustomer } = useAuth()

    const handleCitySearch = () => setCityFilter(city)

    return (
        <div className="flex flex-col gap-10">

        <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Services</h1>
            <p className="text-gray-500 mt-1">Find the right professional for your needs</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 flex-1">
            <Input
                placeholder="Filter by city (e.g. Mumbai)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1"
            />
            <Button onClick={handleCitySearch} variant="outline">
                <MapPin size={16} className="mr-1" /> Search
            </Button>
            </div>
            {category && (
            <Button variant="secondary" onClick={() => setSearchParams({})}>
                Clear Filter
            </Button>
            )}
        </div>

        {/* Services */}
        <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {category ? `${category} Services` : 'All Services'}
            </h2>
            {servicesLoading ? <Spinner /> : (
            <div className="flex flex-wrap gap-3">
                {services?.map((service) => (
                <button
                    key={service._id}
                    onClick={() => setSearchParams({ category: service.category })}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors cursor-pointer ${
                    category === service.category
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                >
                    {service.name} — ₹{service.basePrice}
                </button>
                ))}
            </div>
            )}
        </section>

        {/* Providers */}
        <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Available Providers {cityFilter && `in ${cityFilter}`}
            </h2>

            {providersLoading ? <Spinner /> : providers?.length === 0 ? (
            <p className="text-gray-400 text-sm">No providers found. Try a different city.</p>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {providers?.map((provider) => (
                <Card key={provider._id} className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                    {provider.profileImage ? (
                        <img src={provider.profileImage} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Wrench size={20} className="text-blue-500" />
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-gray-800">{provider.name}</p>
                       <p className="text-sm text-gray-500">
  {provider?.city} · {provider?.skills?.map(s => s.name).join(', ')}
</p>
                    </div>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                        provider.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                        {provider.isAvailable ? 'Available' : 'Busy'}
                    </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                            {provider.skills?.map((skill) => (
        <span key={skill._id} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
            {skill.name}
        </span>
        ))}
                    </div>

                    <div className="flex gap-2 mt-1">
                    <Link to={`/providers/${provider._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                    </Link>
                    {isLoggedIn && isCustomer && provider.isAvailable && (
                        <Link
                        to={`/customer/bookings/create?providerId=${provider._id}`}
                        className="flex-1"
                        >
                        <Button size="sm" className="w-full">Book Now</Button>
                        </Link>
                    )}
                    </div>
                </Card>
                ))}
            </div>
            )}
        </section>

        </div>
    )
    }

    export default Services