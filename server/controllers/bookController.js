const { readBooks, writeBooks, nextId } = require("../utils/db");
const { STATUSES } = require("../middleware/validateBook");

const SORTABLE = ["title", "author", "year", "pages", "rating", "createdAt"];

// turn the request body into a clean book object
function clean(b) {
  const num = (v) => (v === "" || v === null || v === undefined ? null : Number(v));
  return {
    title: String(b.title).trim(),
    author: String(b.author).trim(),
    genre: b.genre && String(b.genre).trim() ? String(b.genre).trim() : "Uncategorized",
    year: num(b.year),
    pages: num(b.pages),
    rating: Number(b.rating) || 0,
    status: b.status || "to-read",
    notes: b.notes ? String(b.notes).trim() : "",
  };
}

// keeps status and currentPage consistent with each other
function syncProgress(book) {
  const current = book.currentPage || 0;
  if (book.status === "finished" && book.pages) book.currentPage = book.pages;
  else if (book.status === "to-read") book.currentPage = 0;
  else if (book.pages && current > book.pages) book.currentPage = book.pages;
  else book.currentPage = current;
  return book;
}

// GET /books?q=&genre=&status=&favorite=true&sort=title&order=asc
exports.getBooks = (req, res) => {
  const { q, genre, status, favorite, sort = "createdAt", order = "desc" } = req.query;
  let list = readBooks();

  if (q) {
    const s = q.toLowerCase();
    list = list.filter(
      (b) =>
        b.title.toLowerCase().includes(s) ||
        b.author.toLowerCase().includes(s) ||
        b.genre.toLowerCase().includes(s)
    );
  }
  if (genre) list = list.filter((b) => b.genre === genre);
  if (status) list = list.filter((b) => b.status === status);
  if (favorite === "true") list = list.filter((b) => b.favorite);

  const key = SORTABLE.includes(sort) ? sort : "createdAt";
  list.sort((a, b) => {
    const x = a[key];
    const y = b[key];
    const diff = typeof x === "string" ? x.localeCompare(y) : (x ?? 0) - (y ?? 0);
    return order === "asc" ? diff : -diff;
  });

  res.json(list);
};

// GET /books/stats
exports.getStats = (req, res) => {
  const books = readBooks();
  const rated = books.filter((b) => b.rating > 0);

  res.json({
    total: books.length,
    finished: books.filter((b) => b.status === "finished").length,
    reading: books.filter((b) => b.status === "reading").length,
    toRead: books.filter((b) => b.status === "to-read").length,
    favorites: books.filter((b) => b.favorite).length,
    avgRating: rated.length
      ? Number((rated.reduce((sum, b) => sum + b.rating, 0) / rated.length).toFixed(1))
      : 0,
    pagesRead: books.reduce((sum, b) => sum + (b.currentPage || 0), 0),
    genres: [...new Set(books.map((b) => b.genre))].sort(),
  });
};

// GET /books/:id
exports.getBook = (req, res) => {
  const book = readBooks().find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

// POST /books
exports.createBook = (req, res) => {
  const books = readBooks();
  const duplicate = books.some(
    (b) =>
      b.title.toLowerCase() === String(req.body.title).trim().toLowerCase() &&
      b.author.toLowerCase() === String(req.body.author).trim().toLowerCase()
  );
  if (duplicate) {
    return res.status(409).json({ message: "This book is already in your library" });
  }

  const book = syncProgress({
    id: nextId(books),
    ...clean(req.body),
    currentPage: 0,
    favorite: false,
    createdAt: new Date().toISOString(),
  });
  books.push(book);
  writeBooks(books);
  res.status(201).json(book);
};

// PUT /books/:id
exports.updateBook = (req, res) => {
  const books = readBooks();
  const index = books.findIndex((b) => b.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Book not found" });

  books[index] = syncProgress({ ...books[index], ...clean(req.body) });
  writeBooks(books);
  res.json(books[index]);
};

// PATCH /books/:id/favorite  (toggles)
exports.toggleFavorite = (req, res) => {
  const books = readBooks();
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });

  book.favorite = !book.favorite;
  writeBooks(books);
  res.json(book);
};

// PATCH /books/:id/status  { status: "reading" }
exports.updateStatus = (req, res) => {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const books = readBooks();
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });

  book.status = status;
  syncProgress(book);
  writeBooks(books);
  res.json(book);
};

// PATCH /books/:id/progress  { currentPage: 120 }
// status follows the page: 0 = to-read, last page = finished, anything between = reading
exports.updateProgress = (req, res) => {
  const page = Number((req.body || {}).currentPage);
  if (!Number.isInteger(page) || page < 0) {
    return res.status(400).json({ message: "Current page must be 0 or more" });
  }
  const books = readBooks();
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (!book.pages) {
    return res.status(400).json({ message: "Add the page count to this book first" });
  }
  if (page > book.pages) {
    return res.status(400).json({ message: `This book has only ${book.pages} pages` });
  }

  book.currentPage = page;
  book.status = page === 0 ? "to-read" : page >= book.pages ? "finished" : "reading";
  writeBooks(books);
  res.json(book);
};

// DELETE /books/:id
exports.deleteBook = (req, res) => {
  const books = readBooks();
  const index = books.findIndex((b) => b.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Book not found" });

  const [removed] = books.splice(index, 1);
  writeBooks(books);
  res.json(removed);
};

// POST /books/bulk-delete  { ids: [1, 2, 3] }
exports.bulkDelete = (req, res) => {
  const { ids } = req.body || {};
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Send an array of ids" });
  }
  const books = readBooks();
  const remaining = books.filter((b) => !ids.includes(b.id));
  writeBooks(remaining);
  res.json({ deleted: books.length - remaining.length });
};
