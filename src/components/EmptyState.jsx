export default function EmptyState({ filtered, onReset, onAdd }) {
  return (
    <div className="empty">
      <h3>{filtered ? "No books match your filters" : "Your shelf is empty"}</h3>
      <p className="muted">
        {filtered ? "Try a different search or clear the filters." : "Add your first book to get started."}
      </p>
      {filtered ? (
        <button className="btn btn-ghost" onClick={onReset}>Clear filters</button>
      ) : (
        <button className="btn btn-primary" onClick={onAdd}>Add a book</button>
      )}
    </div>
  );
}
