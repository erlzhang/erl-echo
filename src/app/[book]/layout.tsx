'use client';
import React from 'react';

import '@/styles/book.css';

import BookContextProvider from '@/contexts/bookContext'

import Sidebar from '@/components/sidebar';

export default function BookLayout(
  {children}:
  {
    children: React.ReactNode
  }
) {
  return (
    <BookContextProvider>
      <main className="content-container">
        <Sidebar/>
        <div className="content">
          { children }
        </div>
      </main>
    </BookContextProvider>
  )
}