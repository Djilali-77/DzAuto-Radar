// Full class names (no string building) so Tailwind can detect them
const ACCENTS = {
  blue: "bg-blue-500/10 text-blue-500",
  purple: "bg-purple-500/10 text-purple-500",
  rose: "bg-rose-500/10 text-rose-500",
};

export default function SectionTitle({ icon: Icon, title, accent = "blue" }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className={`rounded-lg p-2 ${ACCENTS[accent]}`}>
        <Icon size={24} />
      </div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
    </div>
  );
}