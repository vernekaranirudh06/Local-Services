    import { Link } from 'react-router-dom'
    import { useGetServicesQuery } from '../../features/services/servicesApi.js'
    import Button from '../../components/ui/Button.jsx'
    import Card from '../../components/ui/Card.jsx'
    import Spinner from '../../components/ui/Spinner.jsx'
    import { Wrench, Star, ShieldCheck, ArrowRight } from 'lucide-react'

    const Home = () => {
    const { data: services, isLoading } = useGetServicesQuery()

    return (
        <div className="flex flex-col gap-16">

        {/* Hero */}
        <section className="text-center py-16 flex flex-col items-center gap-6">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Book trusted local <br />
            <span className="text-blue-600">service professionals</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl">
            Connect with verified plumbers, electricians, cleaners and more.
            Fast, reliable, and affordable.
            </p>
            <div className="flex gap-3">
            <Link to="/services">
                <Button size="lg">Browse Services</Button>
            </Link>
            <Link to="/register">
                <Button size="lg" variant="outline">Join as Provider</Button>
            </Link>
            </div>
        </section>

        {/* Why Us */}
        <section>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why ServeLocal?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { icon: ShieldCheck, title: 'Verified Providers', desc: 'Every provider is manually approved by our team before joining.' },
                { icon: Star,        title: 'Rated & Reviewed',   desc: 'Read honest reviews from real customers before booking.' },
                { icon: Wrench,      title: 'Track Your Job',     desc: 'Live status updates from Requested all the way to Completed.' },
            ].map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon size={22} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
                </Card>
            ))}
            </div>
        </section>

        {/* Services Preview */}
        <section>
            <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Services</h2>
            <Link to="/services" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                View all <ArrowRight size={14} />
            </Link>
            </div>

            {isLoading ? (
            <Spinner />
            ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {services?.slice(0, 8).map((service) => (
                <Link to={`/services?category=${service.category}`} key={service._id}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer text-center flex flex-col items-center gap-3 py-6">
                    {service.image ? (
                        <img src={service.image} alt={service.name} className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                        <Wrench size={24} className="text-blue-500" />
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-gray-800 text-sm">{service.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Starting ₹{service.basePrice}</p>
                    </div>
                    </Card>
                </Link>
                ))}
            </div>
            )}
        </section>

        {/* CTA */}
        <section className="bg-blue-600 rounded-2xl p-10 text-center text-white flex flex-col items-center gap-4">
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="text-blue-100">Book your first service in under 2 minutes.</p>
            <Link to="/register">
            <Button variant="secondary" size="lg">Create Free Account</Button>
            </Link>
        </section>

        </div>
    )
    }

    export default Home