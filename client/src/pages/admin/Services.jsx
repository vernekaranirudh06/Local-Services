    import { useState } from 'react'
    import {
    useGetServicesQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeactivateServiceMutation,
    } from '../../features/services/servicesApi.js'
    import Card from '../../components/ui/Card.jsx'
    import Button from '../../components/ui/Button.jsx'
    import Input from '../../components/ui/Input.jsx'
    import Spinner from '../../components/ui/Spinner.jsx'
    import { Pencil, Trash2, Plus, X } from 'lucide-react'
    import toast from 'react-hot-toast'

    const EMPTY_FORM = { name: '', description: '', category: '', basePrice: '' }

    const AdminServices = () => {
    const [showForm,   setShowForm]   = useState(false)
    const [editTarget, setEditTarget] = useState(null) // service being edited
    const [form,       setForm]       = useState(EMPTY_FORM)
    const [image,      setImage]      = useState(null)

    const { data: services, isLoading } = useGetServicesQuery()
    const [createService,     { isLoading: creating    }] = useCreateServiceMutation()
    const [updateService,     { isLoading: updating    }] = useUpdateServiceMutation()
    const [deactivateService, { isLoading: deactivating}] = useDeactivateServiceMutation()

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const openCreate = () => {
        setEditTarget(null)
        setForm(EMPTY_FORM)
        setImage(null)
        setShowForm(true)
    }

    const openEdit = (service) => {
        setEditTarget(service)
        setForm({
        name:        service.name,
        description: service.description || '',
        category:    service.category,
        basePrice:   service.basePrice,
        })
        setShowForm(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.category || !form.basePrice) {
        return toast.error('Name, category and price are required')
        }

        try {
        if (editTarget) {
            await updateService({ id: editTarget._id, ...form }).unwrap()
            toast.success('Service updated')
        } else {
            const formData = new FormData()
            Object.entries(form).forEach(([k, v]) => formData.append(k, v))
            if (image) formData.append('image', image)
            await createService(formData).unwrap()
            toast.success('Service created')
        }
        setShowForm(false)
        setForm(EMPTY_FORM)
        setEditTarget(null)
        } catch (err) {
        toast.error(err?.data?.message || 'Failed to save service')
        }
    }

    const handleDeactivate = async (id, name) => {
        if (!confirm(`Deactivate "${name}"? Customers won't see it anymore.`)) return
        try {
        await deactivateService(id).unwrap()
        toast.success(`${name} deactivated`)
        } catch (err) {
        toast.error(err?.data?.message || 'Failed to deactivate')
        }
    }

    return (
        <div className="flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage service categories on the platform.</p>
            </div>
            <Button onClick={openCreate}>
            <Plus size={16} className="mr-1" /> Add Service
            </Button>
        </div>

        {/* Create / Edit Form */}
        {showForm && (
            <Card className="border-blue-200 bg-blue-50">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">
                {editTarget ? 'Edit Service' : 'New Service'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={18} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                label="Service Name *"
                name="name"
                placeholder="e.g. Pipe Fixing"
                value={form.name}
                onChange={handleChange}
                />
                <Input
                label="Category *"
                name="category"
                placeholder="e.g. Plumbing"
                value={form.category}
                onChange={handleChange}
                />
                <Input
                label="Base Price (₹) *"
                name="basePrice"
                type="number"
                placeholder="500"
                value={form.basePrice}
                onChange={handleChange}
                />
                <Input
                label="Description"
                name="description"
                placeholder="Short description..."
                value={form.description}
                onChange={handleChange}
                />

                {!editTarget && (
                <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Service Image</label>
                    <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-white file:text-blue-600 cursor-pointer"
                    />
                </div>
                )}

                <div className="sm:col-span-2 flex gap-2">
                <Button type="submit" loading={creating || updating}>
                    {editTarget ? 'Save Changes' : 'Create Service'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                    Cancel
                </Button>
                </div>
            </form>
            </Card>
        )}

        {/* Services List */}
        {isLoading ? <Spinner /> : services?.length === 0 ? (
            <Card className="text-center py-12">
            <p className="text-gray-400">No services yet. Create your first one.</p>
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services?.map((service) => (
                <Card key={service._id} className="flex items-center gap-4">
                {/* Image */}
                {service.image ? (
                    <img src={service.image} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                ) : (
                    <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-500 text-xl font-bold">
                    {service.name[0]}
                    </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{service.name}</p>
                    <p className="text-xs text-gray-400">{service.category}</p>
                    <p className="text-sm font-medium text-blue-600 mt-0.5">₹{service.basePrice}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                    <button
                    onClick={() => openEdit(service)}
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                    <Pencil size={15} />
                    </button>
                    <button
                    onClick={() => handleDeactivate(service._id, service.name)}
                    disabled={deactivating}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                    <Trash2 size={15} />
                    </button>
                </div>
                </Card>
            ))}
            </div>
        )}
        </div>
    )
    }

    export default AdminServices