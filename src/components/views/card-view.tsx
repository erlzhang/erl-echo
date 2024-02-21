import BookCard from '@/components/book-card';

export default function({ books }) {
  const bookCards = books.map(book => {
    return (
      <BookCard
        book={book}
      ></BookCard>
    )
  });

  return (
    <div className="book-cards">
      {
        bookCards
      }
    </div>
  )
}