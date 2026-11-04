import Rating from "./Rating";
import StatusSelect from "./StatusSelect";
import ProgressControl from "./ProgressControl";
import coverColor from "../utils/coverColor";
import { IconEdit, IconStar, IconTrash } from "./Icons";

export default function BookCard({ book, onEdit, onDelete, onFavorite, onStatus, onRate, onProgress }) {
  return (
    <article className="book-card">
      <div className="cover" style={{ background: coverColor(book.title) }}>
        <span className="cover-title">{book.title}</span>
        <span className="cover-author">{book.author}</span>
        <button
          className={"fav on-cover" + (book.favorite ? " on" : "")}
          onClick={() => onFavorite(book.id)}
          title="Toggle favourite"
        >
          <IconStar filled={book.favorite} width={18} height={18} />
        </button>
      </div>

      <div className="card-body">
        <div className="card-meta">
          <span className="genre-tag">{book.genre}</span>
          <span className="muted">{book.year ?? ""}</span>
        </div>

        {book.notes && <p className="card-notes">{book.notes}</p>}

        <ProgressControl book={book} onChange={onProgress} />
        <Rating value={book.rating} onChange={(n) => onRate(book, n)} />

        <div className="card-footer">
          <StatusSelect value={book.status} onChange={(v) => onStatus(book.id, v)} />
          <div>
            <button className="icon-btn" onClick={() => onEdit(book)} title="Edit"><IconEdit /></button>
            <button className="icon-btn danger" onClick={() => onDelete(book)} title="Delete"><IconTrash /></button>
          </div>
        </div>
      </div>
    </article>
  );
}
