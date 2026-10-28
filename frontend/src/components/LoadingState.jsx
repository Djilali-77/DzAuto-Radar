export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-32">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      <p className="text-xl font-medium text-slate-500 dark:text-slate-400">
        Fetching data from the backend...
      </p>
    </div>
  );
}