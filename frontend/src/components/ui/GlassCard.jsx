import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function GlassCard({ children, className, hoverEffect = true, floating = false, ...props }) {
    return (
        <motion.div
            className={clsx(
                "titanium-card p-6",
                className
            )}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            animate={floating ? {
                y: [0, -10, 0],
                transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            } : undefined}
            whileHover={hoverEffect ? {
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px -5px rgba(59, 130, 246, 0.6)",
                borderColor: "rgba(59, 130, 246, 0.5)"
            } : {}}
            {...props}
        >
            {/* Subtle Titanium Sheen Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
}
