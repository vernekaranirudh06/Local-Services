import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateProfileMutation } from '../../features/providers/providersApi.js'
import { useGetServicesQuery } from '../../features/services/servicesApi.js'
import useAuth from '../../hooks/useAuth.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import toast from 'react-hot-toast'
import { Check } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../features/auth/authSlice.js'

const schema = z.object({
  bio:        z.string().optional(),
  experience: z.coerce.number().min(0).max(50).optional(),
  city:       z.string().min(2, 'City is required'),
  phone:      z.string().min(10, 'Enter valid phone'),
})

const Profile = () => {
  const { user } = useAuth()

  // Selected service IDs
  const [selectedServices, setSelectedServices] = useState(
    user?.skills?.map(s => s._id || s) || []
  )

  const { data: allServices, isLoading: servicesLoading } = useGetServicesQuery()
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      bio:        user?.bio || '',
      experience: user?.experience || 0,
      city:       user?.city || '',
      phone:      user?.phone || '',
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        bio:        user.bio || '',
        experience: user.experience || 0,
        city:       user.city || '',
        phone:      user.phone || '',
      })
      setSelectedServices(user.skills?.map(s => s._id || s) || [])
    }
  }, [user])

  const toggleService = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
  if (selectedServices.length === 0) {
    return toast.error('Please select at least one service you provide')
  }
  try {
    const updated = await updateProfile({ ...data, skills: selectedServices }).unwrap()
    
    // ✅ Update Redux store with new profile data
    dispatch(setCredentials({
      ...updated,
      token: localStorage.getItem('token'),
    }))

    toast.success('Profile updated successfully')
  } catch (err) {
    toast.error(err?.data?.message || 'Update failed')
  }
}

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Keep your profile updated to attract more customers</p>
      </div>

      {/* Read-only info */}
      <Card className="bg-blue-50 border-blue-100">
        <p className="font-semibold text-gray-800">{user?.name}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            user?.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {user?.isAvailable ? 'Available' : 'Unavailable'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
            Provider
          </span>
        </div>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

        {/* Basic Info */}
        <Card>
          <h2 className="font-semibold text-gray-800 mb-4">Basic Info</h2>
          <div className="flex flex-col gap-4">
            <Input
              label="City"
              placeholder="Mumbai"
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label="Phone"
              placeholder="9876543210"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label="Years of Experience"
              type="number"
              placeholder="3"
              error={errors.experience?.message}
              {...register('experience')}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <textarea
                placeholder="Tell customers about yourself..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
                {...register('bio')}
              />
            </div>
          </div>
        </Card>

        {/* Services Selection */}
        <Card>
          <h2 className="font-semibold text-gray-800 mb-1">Services You Provide</h2>
          <p className="text-xs text-gray-400 mb-4">
            Select all services you offer. Customers will book you based on these.
          </p>

          {servicesLoading ? <Spinner /> : (
            <div className="grid grid-cols-2 gap-2">
              {allServices?.map((service) => {
                const isSelected = selectedServices.includes(service._id)
                return (
                  <button
                    type="button"
                    key={service._id}
                    onClick={() => toggleService(service._id)}
                    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer relative ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2">
                        <Check size={14} className="text-blue-600" />
                      </span>
                    )}
                    <p className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                      {service.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {service.category} · ₹{service.basePrice}
                    </p>
                  </button>
                )
              })}
            </div>
          )}

          {selectedServices.length > 0 && (
            <p className="text-xs text-blue-600 mt-3">
              ✅ {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
            </p>
          )}
        </Card>

        <Button type="submit" loading={isLoading} size="lg" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  )
}

export default Profile