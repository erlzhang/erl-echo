import { BookContext } from '@/contexts/bookContext'
import { useParams } from 'next/navigation'
import React, { useContext } from 'react';
import Link from 'next/link';

export default function BookHeader() {
  const { book } = useContext(BookContext);
  const params = useParams();

  return (
    <>
      {
        book &&
        <div className="summary-header">
          <Link href={`/${params.book}`}>
            <h1>{book.title}</h1>
            <small>总字数：{book.wordCount}</small>
          </Link>
        </div>
      }
    </>
  )
}