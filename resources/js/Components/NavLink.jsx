import { Link } from '@inertiajs/react'

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                ' inline-flex items-center px-4 py-3 text-medium transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? ' rounded-[.8rem] border border-gray-800 bg-gray-900 font-medium text-white dark:bg-gray-800 dark:text-white '
                    : ' rounded-[.8rem] px-4 py-2 text-gray-700 hover:bg-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 dark:hover:bg-gray-900 dark:hover:text-white dark:text-gray-400 ') +
                className
            }
        >
            {children}
        </Link>
    )
}
