import BookCard from "./BookCard";

export default function BookGrid({ books, ...handlers }) {
  return (
    <div className="book-grid">
      {books.map((b) => (
        <BookCard key={b.id} book={b} {...handlers} />
      ))}
    </div>
  );
}
