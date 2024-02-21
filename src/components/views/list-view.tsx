import {
  STATUS,
  CATEGORY,
  WRITING_MODE
} from '@/const/book';

export default function({ books }) {
  const items = books.map(book => {
    return (
      <li
        key={book.id}
      >
        <span>{ book.title }</span>
        <div>
          <span>{ STATUS[book.status].label }</span>
          <span>{ CATEGORY[book.category].label }</span>
          <span>{ WRITING_MODE[book.writingMode].label }</span>
          <span>{ book.date }</span>
        </div>
      </li>
    )
  })
  return (
    <div className="book-list">
      <ul>
        { items }
      </ul>
    </div>
  )
}