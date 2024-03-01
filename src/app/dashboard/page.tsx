'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/form';

import Book, { Status } from '@/models/book';
import { STATUS } from '@/const/book';
import { FiPlus } from "react-icons/fi";
import '@/styles/app.css';
import CardView from "@/components/views/card-view";
import NewBookDialog from '@/components/new-book-dialog';
import {
  getMaxIndexOfBooks
} from '@/utils/book';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [maxIndex, setMaxIndex] = useState<number>(0);
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [status, setStatus] = useState<null|Status>(null)
  
  const router = useRouter();

  const getCountOfStatus = useCallback((val: Status) => {
    return books.filter(b => val === null || b.status === val).length;
  }, [books])

  const filters = Object.keys(STATUS).map((key) => {
    const _status = Number(key) as Status;
    const n = getCountOfStatus(_status);
    if (n === 0) {
      return (
        <></>
      );
    }

    return (
      <div
        className={`status-filter-tag${status === _status ? ' active' : ''}`}
        onClick={() => setStatus(_status)}
      >
        { STATUS[_status].label }
        <span className="status-filter-count">{ n }</span>
      </div>
    )
  })
  
  useEffect(() => {
    Book.list().then((data : Book[]) => {
      // if (!data.length) {
      //   router.push(`/new`);
      //   return;
      // }
      setBooks(data);
      setMaxIndex(getMaxIndexOfBooks(data));
    });
  }, []);

  const onAdd = (slug: string) => {
    router.push(`/${slug}`);
  }

  return (
    <main className="books-main">
      <div className="top-actions">
        <div className="top-actions-left">
          <div className="status-filter">
            <span
              className={`status-filter-tag${status == null ? ' active' : ''}`}
              onClick={() => setStatus(null)}
            >
              全部
            </span>
            { filters }
          </div>
        
        </div>
        <div className="top-actions-right">
          <Button
            type="primary"
            onClick={() => setShowDialog(true)}
          >
            <FiPlus />
            新建
          </Button>
        </div>
      </div>
      <CardView
        books={books.filter(b => status == null || status === b.status)}
      />
      {
        showDialog &&
        <NewBookDialog
          onClose={() => setShowDialog(false)}
          onSubmit={onAdd}
          index={maxIndex}
        ></NewBookDialog>
      }
    </main>
  )
}
