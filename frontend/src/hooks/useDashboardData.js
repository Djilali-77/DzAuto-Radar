import { useEffect, useState } from "react";
import {
  fetchCars,
  fetchDeals,
  fetchHistory,
  fetchStats,
  getErrorMessage,
} from "../lib/api";

export function useDashboardData() {
  const [data, setData] = useState({ stats: null, cars: [], deals: [], history: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Changing this number triggers a new fetch
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [stats, cars, deals, history] = await Promise.all([
          fetchStats(),
          fetchCars(500),
          fetchDeals(),
          fetchHistory(),
        ]);
        if (!cancelled) setData({ stats, cars, deals, history });
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    // Ignore the result if the component unmounts or a newer request started
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = () => {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  };

  return { ...data, loading, error, reload };
}