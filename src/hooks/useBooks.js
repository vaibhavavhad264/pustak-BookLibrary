import { useCallback, useEffect, useState } from "react";
import * as api from "../api/bookService";
import useDebounce from "./useDebounce";

const defaultFilters = {
  q: "",
  genre: "",
  status: "",
  favorite: false,
  sort: "createdAt",
  order: "desc",
};

export default function useBooks(notify) {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0); // bump to refetch

  const q = useDebounce(filters.q, 300);
  const { genre, status, favorite, sort, order } = filters;

  useEffect(() => {
    let ignore = false;

    Promise.all([api.fetchBooks({ q, genre, status, favorite, sort, order }), api.fetchStats()])
      .then(([list, summary]) => {
        if (ignore) return;
        setBooks(list);
        setStats(summary);
        setError("");
      })
      .catch((err) => !ignore && setError(err.message))
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
  }, [q, genre, status, favorite, sort, order, version]);

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const resetFilters = () => setFilters(defaultFilters);
  const refresh = () => setVersion((v) => v + 1);

  // runs an api call, refreshes the list, shows a toast
  const run = useCallback(
    async (fn, okMessage) => {
      try {
        await fn();
        setVersion((v) => v + 1);
        if (okMessage) notify(okMessage);
        return true;
      } catch (err) {
        notify(err.message, "error");
        return false;
      }
    },
    [notify]
  );

  const actions = {
    create: (data) => run(() => api.createBook(data), "Book added"),
    update: (id, data) => run(() => api.updateBook(id, data), "Book updated"),
    remove: (id) => run(() => api.removeBook(id), "Book deleted"),
    removeMany: (ids) => run(() => api.removeMany(ids), `${ids.length} books deleted`),
    toggleFavorite: (id) => run(() => api.toggleFavorite(id)),
    changeStatus: (id, value) => run(() => api.changeStatus(id, value)),
    setProgress: (id, page) => run(() => api.updateProgress(id, page), "Progress saved"),
  };

  const hasFilters =
    filters.q || filters.genre || filters.status || filters.favorite ||
    filters.sort !== defaultFilters.sort || filters.order !== defaultFilters.order;

  return { books, stats, filters, setFilter, resetFilters, hasFilters, loading, error, refresh, actions };
}
