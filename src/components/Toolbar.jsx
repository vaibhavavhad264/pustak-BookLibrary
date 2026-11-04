import { SORT_OPTIONS, STATUSES } from "../utils/constants";
import { IconGrid, IconList, IconSearch, IconStar } from "./Icons";

export default function Toolbar({
  filters, setFilter, genres, view, setView, hasFilters, onReset, count,
}) {
  return (
    <section className="toolbar">
      <div className="search-box">
        <IconSearch />
        <input
          type="search"
          placeholder="Search by title, author or genre"
          value={filters.q}
          onChange={(e) => setFilter("q", e.target.value)}
        />
      </div>

      <select value={filters.genre} onChange={(e) => setFilter("genre", e.target.value)} aria-label="Genre">
        <option value="">All genres</option>
        {genres.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <select value={filters.status} onChange={(e) => setFilter("status", e.target.value)} aria-label="Status">
        <option value="">Any status</option>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <div className="sort-group">
        <select value={filters.sort} onChange={(e) => setFilter("sort", e.target.value)} aria-label="Sort by">
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>Sort: {s.label}</option>
          ))}
        </select>
        <button
          className="btn btn-ghost sort-dir"
          onClick={() => setFilter("order", filters.order === "asc" ? "desc" : "asc")}
          title="Toggle order"
        >
          {filters.order === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>
      </div>

      <button
        className={"btn btn-ghost chip" + (filters.favorite ? " active" : "")}
        onClick={() => setFilter("favorite", !filters.favorite)}
      >
        <IconStar filled={filters.favorite} width={16} height={16} /> Favourites
      </button>

      <div className="toolbar-end">
        <span className="count">{count} {count === 1 ? "result" : "results"}</span>
        {hasFilters && (
          <button className="link-btn" onClick={onReset}>Reset</button>
        )}
        <div className="view-toggle">
          <button className={view === "table" ? "active" : ""} onClick={() => setView("table")} title="Table view">
            <IconList />
          </button>
          <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} title="Card view">
            <IconGrid />
          </button>
        </div>
      </div>
    </section>
  );
}
