    import clsx from 'clsx'

    const variants = {
    primary:   'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    danger:    'bg-red-600 hover:bg-red-700 text-white',
    success:   'bg-green-600 hover:bg-green-700 text-white',
    outline:   'border border-blue-600 text-blue-600 hover:bg-blue-50',
    }

    const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    }

    const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    className = '',
    ...props
    }) => {
    return (
        <button
        className={clsx(
            'rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
            variants[variant],
            sizes[size],
            className
        )}
        disabled={loading || props.disabled}
        {...props}
        >
        {loading ? (
            <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Loading...
            </span>
        ) : children}
        </button>
    )
    }

    export default Button