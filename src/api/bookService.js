const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BOOKS = `${BASE_URL}/books`;

async function request(url, options = {}) {
  let res;
  try {
    res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Cannot reach the server. Is it running on port 5000?");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export function fetchBooks(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== false && value != null) params.set(key, value);
  });
  return request(`${BOOKS}?${params.toString()}`);
}

export const fetchStats = () => request(`${BOOKS}/stats`);

export const createBook = (book) =>
  request(BOOKS, { method: "POST", body: JSON.stringify(book) });

export const updateBook = (id, book) =>
  request(`${BOOKS}/${id}`, { method: "PUT", body: JSON.stringify(book) });

export const toggleFavorite = (id) =>
  request(`${BOOKS}/${id}/favorite`, { method: "PATCH" });

export const changeStatus = (id, status) =>
  request(`${BOOKS}/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });

export const updateProgress = (id, currentPage) =>
  request(`${BOOKS}/${id}/progress`, { method: "PATCH", body: JSON.stringify({ currentPage }) });

export const removeBook = (id) => request(`${BOOKS}/${id}`, { method: "DELETE" });

export const removeMany = (ids) =>
  request(`${BOOKS}/bulk-delete`, { method: "POST", body: JSON.stringify({ ids }) });
