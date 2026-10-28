import { motion } from "motion/react";

// Base card used everywhere: fade-in + slide-up animation, light/dark colors
export default function Card({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-2xl border border-slate-100 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      {children}
    </motion.div>
  );
}