import { motion } from "motion/react";
import { Moon, Radar, RefreshCw, Sun } from "lucide-react";

const buttonBase =
  "rounded-full bg-white p-3 shadow-sm transition-colors hover:bg-slate-100 disabled:opacity-60 dark:bg-slate-700 dark:hover:bg-slate-600";

export default function Header({ isDark, onToggleTheme, onRefresh, loading }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
    >
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-600/30">
          <Radar size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            DzAuto-Radar
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Algerian car market intelligence: prices, good deals and ML predictions
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onRefresh}
          disabled={loading}
          title="Refresh data"
          className={`${buttonBase} text-slate-700 dark:text-slate-100`}
        >
          <RefreshCw size={22} className={loading ? "animate-spin" : ""} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onToggleTheme}
          title="Toggle dark mode"
          className={`${buttonBase} text-slate-700 dark:text-yellow-400`}
        >
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </motion.button>
      </div>
    </motion.header>
  );
}