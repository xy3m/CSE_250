import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function GlowButton({ children, onClick, className, variant = 'primary', ...props }) {
    const isPrimary = variant === 'primary';

    return (
        <motion.button
            onClick={onClick}
            className={clsx(
                isPrimary ? "btn-pro-primary" : "btn-pro-secondary",
                className
            )}
            whileTap={{ scale: 0.96 }}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}
