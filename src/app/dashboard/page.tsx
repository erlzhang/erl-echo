'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/form';

import Book from '@/models/book';
import { FiPlus } from "react-icons/fi";
import { CiViewBoard, CiViewList, CiGrid41 } from "react-icons/ci";
import '@/styles/app.css';
import CardView from "@/components/views/card-view";
import NewBookDialog from '@/components/new-book-dialog';
import {
  getMaxIndexOfBooks
} from '@/utils/book';

enum BooksView {
  CardView,
  BoardView,
  ListView
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [maxIndex, setMaxIndex] = useState<number>(0);
  const [view, setView] = useState<BooksView>(BooksView.CardView);
  const [showDialog, setShowDialog] = useState<boolean>(false)
  
  const router = useRouter();
  
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
          {/* <Button
            onClick={() => setView(BooksView.CardView)}
          >
            <CiGrid41/>
            卡片
          </Button>
          <Button
            onClick={() => setView(BooksView.ListView)}
          >
            <CiViewList/>
            列表
          </Button>
          <Button
            onClick={() => setView(BooksView.ListView)}
          >
            <CiViewBoard/>
            看板
          </Button> */}
        </div>
        <div className="top-actions-right">
          <Button
            type="primary"
            onClick={() => setShowDialog(true)}
          >
            <FiPlus />
            New Book
          </Button>
        </div>
      </div>
      {
        view === BooksView.CardView &&
        <CardView
          books={books}
        />
      }
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
