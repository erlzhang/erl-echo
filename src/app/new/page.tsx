"use client";
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookImporter from '@/utils/book-importer';

import NewBookDialog from '@/components/new-book-dialog';
import { GiNotebook } from "react-icons/gi";
import { RiUploadCloud2Fill } from "react-icons/ri";

import "@/styles/new-book.css";

export default function NewBook() {
  const router = useRouter();

  const uploaderRef = useRef(null)
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const handleUploaderClick = () => {
    uploaderRef.current?.click();
  }

  const handleNewClick = () => {
    setShowDialog(true)
  }

  const onAdd = (slug: string) => {
    router.push(`/${slug}`);
  }

  const handleSelectFile = (e) => {
    const file = e.target.files[0];
    const importer = new BookImporter(file);
    importer.load()
      .then((id) => onAdd(id));
  }

  return (
    <main className="new-book-page">
      <div className="new-book-header">
        <h1>Ready for Creating a New Book ...</h1>
        <p>You can choose any of the following ways:</p>
      </div>
      <div className="new-book-cards">
        <div
          className="new-book-action-card"
          onClick={handleNewClick}
        >
          <GiNotebook></GiNotebook>
          <div>Create Empty and Write</div>
        </div>
        <div
          className="new-book-action-card"
          onClick={handleUploaderClick}
        >
          <RiUploadCloud2Fill></RiUploadCloud2Fill>
          <div>Import From Zip file</div>
          <input
            ref={uploaderRef}
            onChange={handleSelectFile}
            type="file"
            style={{
              display: 'none'
            }}
            accept="zip"
          />
        </div>
      </div>
      {
        showDialog &&
        <NewBookDialog
          onClose={() => setShowDialog(false)}
          onSubmit={onAdd}
        ></NewBookDialog>
      }
    </main>
  )
}