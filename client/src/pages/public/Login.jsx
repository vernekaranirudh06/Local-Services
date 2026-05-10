    import { useEffect } from 'react'
    import { useForm } from 'react-hook-form'
    import { zodResolver } from '@hookform/resolvers/zod'
    import { z } from 'zod'
    import { Link, useNavigate } from 'react-router-dom'
    import { useDispatch } from 'react-redux'
    import { useLoginMutation } from '../../features/auth/authApi.js'
    import { setCredentials } from '../../features/auth/authSlice.js'
    import useAuth from '../../hooks/useAuth.js'
    import Input from '../../components/ui/Input.jsx'
    import Button from '../../components/ui/Button.jsx'
    import toast from 'react-hot-toast'

    const schema = z.object({
    email:    z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    })

    const Login = () => {
    const dispatch   = useDispatch()
    const navigate   = useNavigate()
    const { isLoggedIn, isAdmin, isProvider } = useAuth()
    const [login, { isLoading }] = useLoginMutation()

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    })

    // If already logged in, redirect to correct dashboard
    useEffect(() => {
        if (isLoggedIn) {
        if (isAdmin)    navigate('/admin/dashboard')
        else if (isProvider) navigate('/provider/dashboard')
        else navigate('/customer/dashboard')
        }
    }, [isLoggedIn])

    const onSubmit = async (data) => {
        try {
        const result = await login(data).unwrap()
        dispatch(setCredentials(result))
        toast.success(`Welcome back, ${result.name}!`)

        if (result.role === 'admin')    navigate('/admin/dashboard')
        else if (result.role === 'provider') navigate('/provider/dashboard')
        else navigate('/customer/dashboard')

        } catch (err) {
        toast.error(err?.data?.message || 'Login failed')
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

            <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Login to your ServeLocal account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

            <Button type="submit" loading={isLoading} className="w-full mt-2">
                Login
            </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
                Register
            </Link>
            </p>

        </div>
        </div>
    )
    }

    export default Login