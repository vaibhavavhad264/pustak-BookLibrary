import { useState } from "react";
import useBooks from "./hooks/useBooks";
import useTheme from "./hooks/useTheme";
import useToast from "./hooks/useToast";
import exportJson from "./utils/exportJson";

import Navbar from "./components/Navbar";
import StatsBar from "./components/StatsBar";
import Toolbar from "./components/Toolbar";
import BookTable from "./components/BookTable";
import BookGrid from "./components/BookGrid";
import BookModal from "./components/BookModal";
import ConfirmDialog from "./components/ConfirmDialog";
import EmptyState from "./components/EmptyState";
import Toast from "./components/Toast";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { toast, notify } = useToast();
  const { books, stats, filters, setFilter, resetFilters, hasFilters, loading, error, refresh, actions } =
    useBooks(notify);

  const [view, setView] = useState("table");
  const [modal, setModal] = useState({ open: false, book: null });
  const [confirm, setConfirm] = useState(null); // { type: "one", book } | { type: "many" }
  const [selectedRaw, setSelected] = useState([]);

  // ignore ids that are no longer in the list (filtered out / deleted)
  const selected = selectedRaw.filter((id) => books.some((b) => b.id === id));
  const genres = stats?.genres ?? [];

  const openAdd = () => setModal({ open: true, book: null });
  const openEdit = (book) => setModal({ open: true, book });
  const closeModal = () => setModal({ open: false, book: null });

  const handleSave = (data) =>
    modal.book ? actions.update(modal.book.id, data) : actions.create(data);

  const handleRate = (book, rating) => actions.update(book.id, { ...book, rating });

  const toggleSelect = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const toggleAll = () =>
    setSelected(selected.length === books.length ? [] : books.map((b) => b.id));

  const confirmDelete = async () => {
    if (confirm.type === "one") await actions.remove(confirm.book.id);
    else {
      await actions.removeMany(selected);
      setSelected([]);
    }
    setConfirm(null);
  };

  const handlers = {
    onEdit: openEdit,
    onDelete: (book) => setConfirm({ type: "one", book }),
    onFavorite: actions.toggleFavorite,
    onStatus: actions.changeStatus,
    onRate: handleRate,
    onProgress: actions.setProgress,
  };

  return (
    <>
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onAdd={openAdd}
        onExport={() => exportJson(books)}
      />

      <main className="container main">
        <StatsBar stats={stats} />

        <Toolbar
          filters={filters}
          setFilter={setFilter}
          genres={genres}
          view={view}
          setView={setView}
          hasFilters={hasFilters}
          onReset={resetFilters}
          count={books.length}
        />

        {selected.length > 0 && (
          <div className="bulk-bar">
            <span>{selected.length} selected</span>
            <div>
              <button className="btn btn-ghost" onClick={() => setSelected([])}>Clear</button>
              <button className="btn btn-danger" onClick={() => setConfirm({ type: "many" })}>
                Delete selected
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="banner">
            <span>{error}</span>
            <button className="btn btn-ghost" onClick={refresh}>Retry</button>
          </div>
        )}

        {loading ? (
          <p className="muted center">Loading your library...</p>
        ) : books.length === 0 && !error ? (
          <EmptyState filtered={hasFilters} onReset={resetFilters} onAdd={openAdd} />
        ) : view === "table" ? (
          <BookTable
            books={books}
            selected={selected}
            onToggleSelect={toggleSelect}
            onToggleAll={toggleAll}
            {...handlers}
          />
        ) : (
          <BookGrid books={books} {...handlers} />
        )}
      </main>

      {modal.open && (
        <BookModal book={modal.book} genres={genres} onSave={handleSave} onClose={closeModal} />
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.type === "one" ? "Delete this book?" : `Delete ${selected.length} books?`}
          message={
            confirm.type === "one"
              ? `"${confirm.book.title}" will be removed from your library.`
              : "The selected books will be removed from your library."
          }
          onConfirm={confirmDelete}
          onCancel={() => setConfirm(null)}
        />
      )}

      <Toast toast={toast} />
    </>
  );
}
