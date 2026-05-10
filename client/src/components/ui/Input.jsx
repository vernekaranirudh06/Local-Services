    import clsx from 'clsx'

    const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-1">
        {label && (
            <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <input
            className={clsx(
            'w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors',
            error
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-500',
            className
            )}
            {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
    }

    export default Input