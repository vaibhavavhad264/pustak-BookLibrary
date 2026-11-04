const STATUSES = ["to-read", "reading", "finished"];

function validateBook(req, res, next) {
  const b = req.body || {};
  const errors = [];
  const thisYear = new Date().getFullYear();

  if (!b.title || !String(b.title).trim()) errors.push("Title is required");
  if (!b.author || !String(b.author).trim()) errors.push("Author is required");

  if (b.year !== undefined && b.year !== null && b.year !== "") {
    const y = Number(b.year);
    if (!Number.isInteger(y) || y < 1000 || y > thisYear) {
      errors.push(`Year must be between 1000 and ${thisYear}`);
    }
  }

  if (b.pages !== undefined && b.pages !== null && b.pages !== "") {
    const p = Number(b.pages);
    if (!Number.isInteger(p) || p <= 0) errors.push("Pages must be a positive number");
  }

  if (b.rating !== undefined && b.rating !== "") {
    const r = Number(b.rating);
    if (!Number.isInteger(r) || r < 0 || r > 5) errors.push("Rating must be 0 to 5");
  }

  if (b.status !== undefined && !STATUSES.includes(b.status)) {
    errors.push("Invalid status");
  }

  if (errors.length) return res.status(400).json({ message: errors.join(". ") });
  next();
}

module.exports = { validateBook, STATUSES };
