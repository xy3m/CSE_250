import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function LuxeCard({ children, className, hover = true, onClick }) {
    return (
        <motion.div
            whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
            onClick={onClick}
            className={clsx(
                "bg-white rounded-2xl p-6 border border-luxe-200 shadow-luxe-md transition-shadow duration-300",
                hover && "hover:shadow-luxe-hover cursor-pointer",
                className
            )}
        >
            {children}
        </motion.div>
    )
}
