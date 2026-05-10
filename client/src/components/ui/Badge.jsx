    import clsx from 'clsx'
    import { STATUS_COLORS } from '../../utils/constants.js'

    const Badge = ({ label, status, className = '' }) => {
    return (
        <span
        className={clsx(
            'px-2.5 py-0.5 rounded-full text-xs font-medium',
            status ? STATUS_COLORS[status] : 'bg-gray-100 text-gray-700',
            className
        )}
        >
        {label || status}
        </span>
    )
    }

    export default Badge