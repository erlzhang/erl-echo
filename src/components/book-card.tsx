import Link from 'next/link';
import Book from '@/models/book';
import {
  STATUS,
  CATEGORY,
  WRITING_MODE
} from '@/const/book';

export default function BookCard(
  { book }:
  { book: Book }
) {
  return (
    <div className="book-card">
      <Link href={`/${book.slug}`}>
        <div className="book-title">
          { book.title }
        </div>
        <div className="book-status">
          { STATUS[book.status].label }
        </div>
        <div className="book-content">
          { book.content }
        </div>
        <div className="book-meta">
          {
            book.date &&
            <span>{ book.date }</span>
          }
          <span>{ CATEGORY[book.category] && CATEGORY[book.category].label }</span>
          <span>{ WRITING_MODE[book.writingMode] && WRITING_MODE[book.writingMode].label }</span>
          <span>{ book.wordCount }字</span>
        </div>
      </Link>
    </div>
  )
}