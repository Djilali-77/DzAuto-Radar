import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Calculator } from "lucide-react";
import Card from "./ui/Card";
import SectionTitle from "./ui/SectionTitle";
import { fetchBrands, getErrorMessage, predictPrice } from "../lib/api";
import { formatDinars } from "../lib/format";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1980;
const MAX_YEAR = CURRENT_YEAR + 1;

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white";

export default function PriceSimulator() {
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState(CURRENT_YEAR);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // The model only knows the brands it was trained on, so we offer them in a dropdown
  useEffect(() => {
    let cancelled = false;
    fetchBrands()
      .then((list) => {
        if (cancelled) return;
        setBrands(list);
        setBrand(list[0] ?? "");
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await predictPrice(brand, Number(year));
      setPrediction(result);
    } catch (err) {
      setPrediction(null);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card delay={0.15} className="flex flex-col justify-between p-6">
      <div>
        <SectionTitle icon={Calculator} accent="blue" title="Price Simulator" />
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Estimate the fair price of a vehicle from its brand and year, using a Random Forest model.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
              Brand
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className={inputClass}
              required
            >
              {brands.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
              Year
            </label>
            <input
              type="number"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={loading || !brand}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Calculating..." : "Predict Price"}
          </motion.button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
            {error}
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {prediction && (
          <motion.div
            key={`${prediction.brand}-${prediction.year}-${prediction.estimated_price_millions}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5 text-center dark:border-slate-600 dark:bg-slate-700"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Estimated price
            </p>
            <p className="mt-2 text-3xl font-black text-blue-700 dark:text-white">
              {Math.round(prediction.estimated_price_millions)}{" "}
              <span className="text-xl">M</span>
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              ≈ {formatDinars(prediction.estimated_price_millions)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}