import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function LuxeButton({
    children,
    variant = 'primary', // primary | secondary | ghost
    className,
    disabled,
    onClick,
    type = 'button'
}) {

    const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"

    const variants = {
        primary: "bg-luxe-900 text-white hover:bg-black shadow-luxe-lg hover:shadow-xl",
        secondary: "bg-white text-luxe-900 border border-luxe-200 hover:border-luxe-900 shadow-sm",
        ghost: "bg-transparent text-luxe-900 hover:bg-luxe-100"
    }

    return (
        <motion.button
            whileTap={!disabled ? { scale: 0.98 } : {}}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={clsx(baseStyles, variants[variant], className)}
        >
            {children}
        </motion.button>
    )
}
