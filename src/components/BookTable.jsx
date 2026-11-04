import Rating from "./Rating";
import StatusSelect from "./StatusSelect";
import ProgressControl from "./ProgressControl";
import { IconEdit, IconStar, IconTrash } from "./Icons";

export default function BookTable({
  books, selected, onToggleSelect, onToggleAll,
  onEdit, onDelete, onFavorite, onStatus, onRate, onProgress,
}) {
  const allSelected = books.length > 0 && books.every((b) => selected.includes(b.id));

  return (
    <div className="table-wrap">
      <table className="book-table">
        <thead>
          <tr>
            <th className="col-check">
              <input type="checkbox" checked={allSelected} onChange={onToggleAll} aria-label="Select all" />
            </th>
            <th>Book</th>
            <th>Genre</th>
            <th>Year</th>
            <th>Status</th>
            <th>Progress</th>
            <th>Rating</th>
            <th className="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id} className={selected.includes(b.id) ? "row-selected" : ""}>
              <td className="col-check">
                <input
                  type="checkbox"
                  checked={selected.includes(b.id)}
                  onChange={() => onToggleSelect(b.id)}
                  aria-label={`Select ${b.title}`}
                />
              </td>
              <td>
                <div className="title-cell">
                  <button
                    className={"fav" + (b.favorite ? " on" : "")}
                    onClick={() => onFavorite(b.id)}
                    title={b.favorite ? "Remove from favourites" : "Add to favourites"}
                  >
                    <IconStar filled={b.favorite} width={17} height={17} />
                  </button>
                  <div>
                    <div className="book-title">{b.title}</div>
                    <div className="book-author">{b.author}</div>
                  </div>
                </div>
              </td>
              <td><span className="genre-tag">{b.genre}</span></td>
              <td>{b.year ?? "-"}</td>
              <td><StatusSelect value={b.status} onChange={(v) => onStatus(b.id, v)} /></td>
              <td><ProgressControl book={b} onChange={onProgress} /></td>
              <td><Rating value={b.rating} onChange={(n) => onRate(b, n)} size={15} /></td>
              <td className="col-actions">
                <button className="icon-btn" onClick={() => onEdit(b)} title="Edit"><IconEdit /></button>
                <button className="icon-btn danger" onClick={() => onDelete(b)} title="Delete"><IconTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
