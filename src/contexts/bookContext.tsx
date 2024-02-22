"use client";

import { createContext, useEffect, useState } from "react"
import { useParams } from 'next/navigation'

import Book from '@/models/book';
import Summary from '@/models/summary';

export const BookContext = createContext({
  book: null,
  summary: null
})

interface Context {
  book: Book | null,
  summary: Summary | null,
  updateBook: Function,
  updateSummary: Function
}

const BookContextProvider = ({ children }) => {
  const params = useParams();

  const [context, setContext] = useState<Context>({
    book: null,

    summary: null,

    updateBook(book) {
      setContext(prev => {
        return {
          ...prev,
          book
        }
      })
    },

    updateSummary(summary) {
      console.warn('in update summary');
      setContext(prev => {
        return {
          ...prev,
          summary
        }
      })
    }
  });

  useEffect(() => {
    if (!params.book) {
      return;
    }

    const slug = params.book as string;
    Book.get(slug).then(book => {
      Summary.get(slug)
        .then(summary => {
          console.log('before setContext');
          setContext({
            ...context,
            book,
            summary
          });
        });
    });
  }, [params.book])

  return (
    <BookContext.Provider value={context}>
      { children }
    </BookContext.Provider>
  );
}

export default BookContextProvider