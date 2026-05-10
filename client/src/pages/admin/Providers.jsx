    import {
    useGetPendingProvidersQuery,
    useApproveProviderMutation,
    useRejectProviderMutation,
    } from '../../features/admin/adminApi.js'
    import Card from '../../components/ui/Card.jsx'
    import Button from '../../components/ui/Button.jsx'
    import Spinner from '../../components/ui/Spinner.jsx'
    import { formatDate } from '../../utils/formatDate.js'
    import { MapPin, Briefcase, Phone } from 'lucide-react'
    import toast from 'react-hot-toast'

    const AdminProviders = () => {
    const { data: providers, isLoading } = useGetPendingProvidersQuery()
    const [approveProvider, { isLoading: approving }] = useApproveProviderMutation()
    const [rejectProvider,  { isLoading: rejecting  }] = useRejectProviderMutation()

    const handleApprove = async (id, name) => {
        try {
        await approveProvider(id).unwrap()
        toast.success(`${name} approved successfully`)
        } catch (err) {
        toast.error(err?.data?.message || 'Failed to approve')
        }
    }

    const handleReject = async (id, name) => {
        if (!confirm(`Are you sure you want to reject and remove ${name}?`)) return
        try {
        await rejectProvider(id).unwrap()
        toast.success(`${name} rejected`)
        } catch (err) {
        toast.error(err?.data?.message || 'Failed to reject')
        }
    }

    return (
        <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Pending Providers</h1>
            <p className="text-sm text-gray-500 mt-1">
            Review and approve service providers before they can accept jobs.
            </p>
        </div>

        {isLoading ? <Spinner /> : providers?.length === 0 ? (
            <Card className="text-center py-16">
            <p className="text-gray-400 font-medium">All caught up!</p>
            <p className="text-sm text-gray-300 mt-1">No providers waiting for approval.</p>
            </Card>
        ) : (
            <div className="flex flex-col gap-4">
            {providers?.map((provider) => (
                <Card key={provider._id}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">

                    {/* Info */}
                    <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
                        {provider.name[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="font-semibold text-gray-800">{provider.name}</p>
                        <p className="text-sm text-gray-500">{provider.email}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
                        {provider.phone && (
                            <span className="flex items-center gap-1"><Phone size={11} />{provider.phone}</span>
                        )}
                        {provider.city && (
                            <span className="flex items-center gap-1"><MapPin size={11} />{provider.city}</span>
                        )}
                        {provider.experience > 0 && (
                            <span className="flex items-center gap-1"><Briefcase size={11} />{provider.experience} yrs</span>
                        )}
                        </div>

                        {/* Skills */}
                        {provider.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {provider.skills.map((skill) => (
                            <span key={skill} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                {skill}
                            </span>
                            ))}
                        </div>
                        )}

                        {provider.bio && (
                        <p className="text-xs text-gray-400 mt-2 max-w-sm">{provider.bio}</p>
                        )}

                        <p className="text-xs text-gray-300 mt-1">
                        Registered: {formatDate(provider.createdAt)}
                        </p>
                    </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 sm:flex-col sm:items-end">
                    <Button
                        variant="success"
                        size="sm"
                        loading={approving}
                        onClick={() => handleApprove(provider._id, provider.name)}
                        className="flex-1 sm:flex-none"
                    >
                        Approve
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        loading={rejecting}
                        onClick={() => handleReject(provider._id, provider.name)}
                        className="flex-1 sm:flex-none"
                    >
                        Reject
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

    export default AdminProviders