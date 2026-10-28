import Header from "./components/Header";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import StatCards from "./components/StatCards";
import PriceTrendChart from "./components/PriceTrendChart";
import PriceSimulator from "./components/PriceSimulator";
import PriceScatterChart from "./components/PriceScatterChart";
import DealsTable from "./components/DealsTable";
import { useTheme } from "./hooks/useTheme";
import { useDashboardData } from "./hooks/useDashboardData";

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const { stats, cars, deals, history, loading, error, reload } = useDashboardData();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 transition-colors duration-300 dark:bg-slate-900 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <Header
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onRefresh={reload}
          loading={loading}
        />

        {error && <ErrorState message={error} onRetry={reload} />}
        {!error && !stats && <LoadingState />}

        {!error && stats && (
          <>
            <StatCards stats={stats} />
            <PriceTrendChart history={history} isDark={isDark} />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <PriceSimulator />
              <PriceScatterChart cars={cars} isDark={isDark} />
            </div>

            <DealsTable deals={deals} />
          </>
        )}
      </div>
    </div>
  );
}