import { useEffect, useState } from "react";
import Rating from "./Rating";
import { STATUSES } from "../utils/constants";
import { IconClose } from "./Icons";

const emptyForm = {
  title: "", author: "", genre: "", year: "", pages: "",
  status: "to-read", rating: 0, notes: "",
};

export default function BookModal({ book, genres, onSave, onClose }) {
  const isEdit = Boolean(book);
  const [form, setForm] = useState(
    isEdit ? { ...emptyForm, ...book, year: book.year ?? "", pages: book.pages ?? "" } : emptyForm
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    const thisYear = new Date().getFullYear();
    if (!form.title.trim()) err.title = "Title is required";
    if (!form.author.trim()) err.author = "Author is required";
    if (form.year !== "" && (form.year < 1000 || form.year > thisYear)) {
      err.year = `Between 1000 and ${thisYear}`;
    }
    if (form.pages !== "" && form.pages <= 0) err.pages = "Must be more than 0";
    return err;
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    setSaving(true);
    const ok = await onSave({
      ...form,
      year: form.year === "" ? "" : Number(form.year),
      pages: form.pages === "" ? "" : Number(form.pages),
    });
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <div className="overlay" onMouseDown={onClose}>
      <form className="modal" onMouseDown={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <div className="modal-head">
          <h2>{isEdit ? "Edit book" : "Add a book"}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <IconClose />
          </button>
        </div>

        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={form.title} onChange={change} autoFocus />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="field">
          <label htmlFor="author">Author</label>
          <input id="author" name="author" value={form.author} onChange={change} />
          {errors.author && <span className="error">{errors.author}</span>}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="genre">Genre</label>
            <input id="genre" name="genre" list="genre-list" value={form.genre} onChange={change} placeholder="e.g. Fiction" />
            <datalist id="genre-list">
              {genres.map((g) => <option key={g} value={g} />)}
            </datalist>
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={change}>
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="year">Year</label>
            <input id="year" name="year" type="number" value={form.year} onChange={change} />
            {errors.year && <span className="error">{errors.year}</span>}
          </div>
          <div className="field">
            <label htmlFor="pages">Pages</label>
            <input id="pages" name="pages" type="number" value={form.pages} onChange={change} />
            {errors.pages && <span className="error">{errors.pages}</span>}
          </div>
        </div>

        <div className="field">
          <label>Rating</label>
          <Rating value={Number(form.rating)} onChange={(n) => setForm({ ...form, rating: n })} size={22} />
        </div>

        <div className="field">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows="3" value={form.notes} onChange={change} />
        </div>

        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Add book"}
          </button>
        </div>
      </form>
    </div>
  );
}
