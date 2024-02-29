import Book from "@/models/book";

export function getMaxIndexOfBooks(books: Book[]) {
  let _maxIndex = 0;
  books.forEach((book:Book) => {
    _maxIndex = Math.max(book.index, _maxIndex);
  });
  return _maxIndex + 1;
}