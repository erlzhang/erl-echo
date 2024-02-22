"use client";
import React, { useState, useContext } from 'react';
import { BookContext } from '@/contexts/bookContext'
import Select from '@/components/ui/select';
import Confirm from '@/components/ui/confirm';
import { GoTrash } from "react-icons/go";
// import { FiDownloadCloud } from "react-icons/fi";
import { LiaArrowRightSolid, LiaReadme } from "react-icons/lia";
// import { LiaReadme } from "react-icons/lia";

import { Status } from '@/models/book';
import {
  STATUS,
  CATEGORY,
  WRITING_MODE
} from '@/const/book';
import { useRouter } from 'next/navigation';

import EditableField from '@/components/ui/editable-field';

export default function BookPage() {
  const router = useRouter();

  const { book, updateBook } = useContext(BookContext);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    book?.update({ [name]: value })
      .then(res => {
        updateBook(book);
      });
  }

  const setStatus = (val: Status) => {
    handleChange({ target: { name: 'status', value: val } })
  }

  const handleRemove = (e) => {
    book?.remove();
    setShowConfirm(false);
    router.push('/dashboard');
  }

  return (
    <>
      {
        showConfirm &&
        <Confirm
          text="删除书籍将删除全部章节内容，不可恢复，确认是否删除？"
          onConfirm={handleRemove}
          onClose={() => setShowConfirm(false)}
        ></Confirm>
      }
      {
        book &&
        <div className="book-form">
          <div className="book-header">
            <h1 className="book-title">
              <EditableField
                value={book.title}
                name="title"
                onChange={handleChange}
              ></EditableField>
            </h1>
            <div className="book-description">
              <EditableField
                value={book.content}
                name="content"
                placeholder="Your Book's Description ..."
                onChange={handleChange}
              ></EditableField>
            </div>
            <div className="book-tags">
              <Select
                name="category"
                value={book.category}
                tagMode={true}
                style={{
                  backgroundColor: 'rgb(238, 224, 218)'
                }}
                options={
                  Object.keys(CATEGORY).map(key => {
                    return {
                      value: Number(key),
                      label: CATEGORY[key].label,
                      icon: CATEGORY[key].icon
                    }
                  })
                }
                onChange={handleChange}
              ></Select>
              <Select
                name="writingMode"
                value={book.writingMode}
                tagMode={true}
                style={{
                  backgroundColor: 'rgb(211, 229, 239)'
                }}
                options={
                  Object.keys(WRITING_MODE).map(key => {
                    return {
                      value: Number(key),
                      label: WRITING_MODE[key].label,
                      icon: WRITING_MODE[key].icon
                    }
                  })
                }
                onChange={handleChange}
              ></Select>
            </div>
          </div>
          <div className="book-status">
            {
              STATUS[book.status - 1] &&
              <>
                <div
                  className="book-status-tag status-prev"
                  onClick={() => setStatus((book.status - 1) as Status)}
                >
                  { STATUS[book.status - 1].label }
                </div>
                <span className="book-status-arrow"><LiaArrowRightSolid/></span>
              </>
            }
            <div className="book-status-tag">
              { STATUS[book.status].icon }
              { STATUS[book.status].label }
            </div>
            {
              STATUS[book.status + 1] &&
              <>
                <span className="book-status-arrow"><LiaArrowRightSolid/></span>
                <div
                  className="book-status-tag status-next"
                  onClick={() => setStatus((book.status + 1) as Status)}
                >
                  { STATUS[book.status + 1].label }
                </div>
              </>
            }
          </div>
          <div className="book-meta">
            <span>已撰写 { book.wordCount || 0 } 字</span>
            <span>更新于 { book.updatedAt.toLocaleString() }</span>
          </div>
          <div className="book-actions">
            {/* <div
              className="book-action book-action-default"
              onClick={exportBook}
            >
              <FiDownloadCloud></FiDownloadCloud>
              Export Book
            </div> */}
            <div
              className="book-action book-action-danger"
              onClick={() => setShowConfirm(true)}
            >
              <GoTrash />
              Delete Book
            </div>
            {/* <div
              className="book-action book-action-danger"
            >
              <a href={`https://erl.im/` +}>
                <LiaReadme />
                Preview
              </a>
            </div> */}
          </div>
        </div>
      }
    </>
  )
}