import { useEffect, useState } from "react";

// Type the page you are on and press Enter (or click away) to save.
// The server updates the status for you: page 0 = to read, last page = finished.
export default function ProgressControl({ book, onChange }) {
  const current = book.currentPage || 0;
  const [value, setValue] = useState(current);

  useEffect(() => {
    setValue(current);
  }, [current]);

  if (!book.pages) {
    return <span className="muted small">Add pages to track</span>;
  }

  const pct = Math.round((current / book.pages) * 100);

  const commit = () => {
    const n = Math.min(Math.max(Number(value) || 0, 0), book.pages);
    setValue(n);
    if (n !== current) onChange(book.id, n);
  };

  return (
    <div className="progress-ctl">
      <div className="mini-bar">
        <div className="mini-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-nums">
        <input
          type="number"
          min="0"
          max={book.pages}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
          aria-label="Current page"
        />
        <span>/ {book.pages} ({pct}%)</span>
      </div>
    </div>
  );
}
