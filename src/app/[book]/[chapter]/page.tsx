"use client";
import { Editor } from '@/components/editor/editor';
import { useCallback, useEffect, useState, useRef, useContext } from 'react';
import { BookContext } from '@/contexts/bookContext'
import Chapter from '@/models/chapter';
import { Button } from '@/components/ui/form';
import Confirm from '@/components/ui/confirm';
import { useRouter } from 'next/navigation';

import Title from '@/components/editor/title'
import EditableField from '@/components/ui/editable-field';
import {
  getWordCount
} from '@/utils/word';
// import { getChapter, putChapter } from '@/api/db';

export default function ChapterPage(
  {params}:
  {
    params: {
      book: string,
      chapter: string
    }
  }
) {
  const router = useRouter();
  const { summary, updateSummary, book, updateBook } = useContext(BookContext);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [content, setContent] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const editorRef = useRef()

  useEffect(() => {
    if (!params.chapter || !summary || chapter) return;

    const _chapter = summary.getChapter(params.chapter);
    setChapter(_chapter);
    _chapter.getContent()
      .then((_content: string) => {
        setWordCount(_chapter.wordCount);
        setContent(_content);
      })
  }, [params.chapter, summary])

  const handleChange = useCallback((_content:string) => {
    setWordCount(getWordCount(_content));
    setContent(_content);
  }, [chapter]);

  const updateBookWordcount = useCallback(() => {
    const wordCount = summary?.getWordCount()
    book?.update({
      wordCount: wordCount,
      updatedAt: new Date()
    }).then(() => {
      updateBook(book)
    })
  }, [book, summary])

  const saveContent = useCallback(() => {
    setSaving(true);
    chapter?.saveContent(content)
      .then(() => {
        summary?.updateChapter(params.chapter, {
          wordCount: getWordCount(content),
          updatedAt: new Date()
        }).then((_chapter: Chapter) => {
          setChapter(_chapter.clone())
          setSaving(false);
          updateBookWordcount()
        });
      })
  }, [chapter, content])

  const handleRemove = useCallback(() => {
    summary?.remove(params.chapter)
      .then(() => {
        setShowConfirm(false);
        router.push(`/${params.book}`);
        updateSummary(summary)
        updateBookWordcount()
      })
  }, [summary])

  const handleTitleChange = useCallback((val: string) => {
    summary?.updateChapter(params.chapter, {
      title: val.replace(/<[^>]+>/g,"")
    }).then((_chapter) => {
      updateSummary(summary)
      setChapter(_chapter.clone())
    })
  }, [summary])

  const handleSlugChange = useCallback((e: any) => {
    summary?.updateChapter(params.chapter, {
      slug: e.target.value
    }).then((_chapter) => {
      updateSummary(summary)
      setChapter(_chapter.clone())
    })
  }, [summary]);

  return (
    <>
      {
        showConfirm &&
        <Confirm
          text="删除章节不可恢复，确认是否删除？"
          onConfirm={handleRemove}
          onClose={() => setShowConfirm(false)}
        ></Confirm>
      }
      {
        chapter &&
        <>
          <div className="chapter-header">
            <div className="chapter-slug">
              <EditableField
                value={chapter.slug}
                name="slug"
                onChange={handleSlugChange}
                prefix={`/${chapter.book}/`}
                placeholder=""
              />
            </div>
            <div className="chapter-actions">
              <span className="word-count">{ wordCount } 字</span>
              <Button
                type="primary"
                loading={saving}
                loadingText="Saving..."
                onClick={() => saveContent()}
              >Save Chapter</Button>
              <Button
                type="error"
                onClick={() => setShowConfirm(true)}
              >Delete Chapter</Button>
            </div>
          </div>
          <div className="chapter-inner">
            <div className="chapter-title">
              <Title
                value={chapter.title || ''}
                onChange={handleTitleChange}
                onEnter={() => editorRef.current?.focus()}
              ></Title>
            </div>
            <div className="chapter-editor">
              <Editor
                onChange={handleChange}
                content={content}
                innerRef={editorRef}
              />
            </div>
          </div>
        </>
      }
    </>
  );
}