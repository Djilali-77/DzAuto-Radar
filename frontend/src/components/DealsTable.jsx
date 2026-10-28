import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink, Flame, Search } from "lucide-react";
import Card from "./ui/Card";
import SectionTitle from "./ui/SectionTitle";
import { formatMillions, formatPercent } from "../lib/format";

const PAGE_SIZE = 8;

const filterInputClass =
  "rounded-lg border border-gray-300 bg-white py-2 text-sm text-slate-800 outline-none transition-all focus:ring-2 focus:ring-rose-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white";

const pageButtonClass =
  "inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600";

export default function DealsTable({ deals }) {
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return deals.filter((deal) => {
      const matchesSearch = String(deal.Title).toLowerCase().includes(term);
      const matchesPrice = maxPrice === "" || deal.Price_Millions <= Number(maxPrice);
      return matchesSearch && matchesPrice;
    });
  }, [deals, search, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleDeals = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleMaxPrice = (e) => {
    setMaxPrice(e.target.value);
    setPage(1);
  };

  return (
    <Card delay={0.25} className="overflow-hidden">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 p-6 dark:border-slate-700 md:flex-row md:items-center">
        <div className="[&>div]:mb-0">
          <SectionTitle
            icon={Flame}
            accent="rose"
            title={`Good Deals (${filtered.length})`}
          />
        </div>

        <div className="flex w-full gap-3 md:w-auto">
          <div className="relative w-full md:w-52">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search a car..."
              value={search}
              onChange={handleSearch}
              className={`w-full pl-9 pr-3 ${filterInputClass}`}
            />
          </div>
          <input
            type="number"
            placeholder="Max price (M)"
            value={maxPrice}
            onChange={handleMaxPrice}
            className={`w-full px-3 md:w-36 ${filterInputClass}`}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <th className="p-4 font-semibold">Listing</th>
              <th className="p-4 font-semibold">Year</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Fair price</th>
              <th className="p-4 font-semibold">Discount</th>
              <th className="p-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {visibleDeals.map((deal, index) => (
              <motion.tr
                key={`${deal.Link}-${index}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <td className="max-w-xs truncate p-4 font-medium text-slate-800 dark:text-slate-100">
                  {deal.Title}
                </td>
                <td className="p-4 text-slate-500 dark:text-slate-400">{deal.Year}</td>
                <td className="p-4 font-bold text-rose-500">
                  {formatMillions(deal.Price_Millions)}
                </td>
                <td className="p-4 text-slate-500 dark:text-slate-400">
                  {formatMillions(deal.Predicted_Price)}
                </td>
                <td className="p-4">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    −{formatPercent(deal.Discount_Pct)}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {deal.Link && deal.Link !== "N/A" ? (
                    <a
                      href={deal.Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1.5 font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                    >
                      View <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </motion.tr>
            ))}

            {visibleDeals.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No good deal matches your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page <span className="font-bold">{currentPage}</span> of{" "}
            <span className="font-bold">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={pageButtonClass}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={pageButtonClass}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}