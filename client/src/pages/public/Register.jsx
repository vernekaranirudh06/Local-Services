    import { useEffect } from 'react'
    import { useForm } from 'react-hook-form'
    import { zodResolver } from '@hookform/resolvers/zod'
    import { z } from 'zod'
    import { Link, useNavigate } from 'react-router-dom'
    import { useDispatch } from 'react-redux'
    import { useRegisterMutation } from '../../features/auth/authApi.js'
    import { setCredentials } from '../../features/auth/authSlice.js'
    import useAuth from '../../hooks/useAuth.js'
    import Input from '../../components/ui/Input.jsx'
    import Button from '../../components/ui/Button.jsx'
    import toast from 'react-hot-toast'

    const schema = z.object({
    name:     z.string().min(2, 'Name must be at least 2 characters'),
    email:    z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role:     z.enum(['customer', 'provider']),
    city:     z.string().min(2, 'City is required'),
    phone:    z.string().min(10, 'Enter valid phone number'),
    })

    const Register = () => {
    const dispatch  = useDispatch()
    const navigate  = useNavigate()
    const { isLoggedIn } = useAuth()
    const [registerUser, { isLoading }] = useRegisterMutation()

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { role: 'customer' },
    })

    const selectedRole = watch('role')

    useEffect(() => {
        if (isLoggedIn) navigate('/')
    }, [isLoggedIn])

    const onSubmit = async (data) => {
        try {
        const result = await registerUser(data).unwrap()

        // Providers need approval — don't log them in yet
        if (result.role === 'provider') {
            toast.success('Registration successful! Wait for admin approval before logging in.')
            navigate('/login')
            return
        }

        dispatch(setCredentials(result))
        toast.success(`Welcome, ${result.name}!`)
        navigate('/customer/dashboard')

        } catch (err) {
        toast.error(err?.data?.message || 'Registration failed')
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

            <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="text-sm text-gray-500 mt-1">Join ServeLocal today</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/* Role Selector */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                {['customer', 'provider'].map((role) => (
                <label
                    key={role}
                    className={`flex-1 text-center py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                    selectedRole === role
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <input type="radio" value={role} className="hidden" {...register('role')} />
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                </label>
                ))}
            </div>

            <Input
                label="Full Name"
                placeholder="John Doe"
                error={errors.name?.message}
                {...register('name')}
            />
            <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
            />
            <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
            />
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

            {selectedRole === 'provider' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                ⚠️ Provider accounts require admin approval before you can log in.
                </div>
            )}

            <Button type="submit" loading={isLoading} className="w-full mt-2">
                Create Account
            </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Login
            </Link>
            </p>

        </div>
        </div>
    )
    }

    export default Register