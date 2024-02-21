'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'

import Summary from '@/components/summary';

import Book from '@/models/book';
import store from '@/core/store';

import '@/styles/book.css';

export default function BookLayout(
  {children}:
  {
    children: React.ReactNode
  }
) {
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const slug = params.book;
    if (!slug) {
      return;
    }

    Book.get(slug as string).then(data => {
      setBook(data);
      store.book = data;
    });
    
    const handleBookChange = (val: Book) => setBook(val)

    const handleWordcountChanged = (val: number) => {
      store.book?.update({
        wordCount: val,
        updatedAt: new Date()
      }).then(res => {
        const _book = store.book.clone();
        setBook(_book);
      });
    }

    store.$on('book', handleBookChange);
    store.$on('wordCount', handleWordcountChanged)
    return () => {
      store.$off('book', handleBookChange);
      store.$off('wordCount', handleWordcountChanged)
    }
  }, [params.book]);

  return (
    <main className="content-container">
      <div className="sidebar">
        {
          book &&
          <div className="summary-header">
            <Link href={`/${params.book}`}>
              <h1>{book.title}</h1>
              <small>总字数：{book.wordCount}</small>
            </Link>
          </div>
        }
        <Summary
          book={params.book as string}
        />
      </div>
      <div className="content">
        {/* <div className="chapter-inner"> */}
          { children }
        {/* </div> */}
      </div>
    </main>
  )
}