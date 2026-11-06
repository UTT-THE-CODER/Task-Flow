export default function StatsCard({ label, count, text, icon, highlight }) {
  return (
    <div className={highlight ? "stat-card highlight" : "stat-card"}>
      <div className="stat-top"><span>{label}</span>{icon}</div>
      <p className="stat-count">{String(count).padStart(2, "0")}</p>
      <small>{text}</small>
    </div>
  );
}
