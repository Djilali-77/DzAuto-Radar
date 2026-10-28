import { TriangleAlert } from "lucide-react";
import Card from "./ui/Card";

export default function ErrorState({ message, onRetry }) {
  return (
    <Card className="mx-auto max-w-xl p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
        <TriangleAlert size={28} />
      </div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
        Could not load the dashboard
      </h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Try again
      </button>
    </Card>
  );
}