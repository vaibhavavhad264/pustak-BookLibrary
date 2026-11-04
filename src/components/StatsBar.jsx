export default function StatsBar({ stats }) {
  if (!stats) return null;
  const progress = stats.total ? Math.round((stats.finished / stats.total) * 100) : 0;

  const tiles = [
    { label: "Books", value: stats.total },
    { label: "Reading now", value: stats.reading },
    { label: "Finished", value: stats.finished },
    { label: "Avg. rating", value: stats.avgRating ? stats.avgRating.toFixed(1) : "-" },
    { label: "Pages read", value: stats.pagesRead.toLocaleString() },
  ];

  return (
    <section className="stats">
      <div className="stats-tiles">
        {tiles.map((t) => (
          <div className="stat" key={t.label}>
            <span className="stat-value">{t.value}</span>
            <span className="stat-label">{t.label}</span>
          </div>
        ))}
      </div>
      <div className="progress-wrap">
        <div className="progress-text">
          <span>Library completion</span>
          <span>{progress}%</span>
        </div>
        <div className="progress" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </section>
  );
}
