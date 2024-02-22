'use client';
import React from 'react';

import '@/styles/book.css';

import BookContextProvider from '@/contexts/bookContext'
import BookHeader from '@/components/book-header';
import Summary from '@/components/summary';

export default function BookLayout(
  {children}:
  {
    children: React.ReactNode
  }
) {
  return (
    <BookContextProvider>
      <main className="content-container">
        <div className="sidebar">
          <BookHeader></BookHeader>
          <Summary/>
        </div>
        <div className="content">
          {/* <div className="chapter-inner"> */}
            { children }
          {/* </div> */}
        </div>
      </main>
    </BookContextProvider>
  )
}