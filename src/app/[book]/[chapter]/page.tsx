"use client";
import { Editor } from '@/components/editor/editor';
import { useCallback, useEffect, useState, useRef } from 'react';

import Chapter from '@/models/chapter';
import { Button } from '@/components/ui/form';
import Confirm from '@/components/ui/confirm';
import { useRouter } from 'next/navigation';

import Title from '@/components/editor/title'
import EditableField from '@/components/ui/editable-field';
import store from '@/core/store';
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
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [content, setContent] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const editorRef = useRef()

  useEffect(() => {
    if (!params.chapter) return;

    const getChapter = () => {
      const _chapter = store.getChapter(params.chapter);
      setChapter(_chapter);
      _chapter.getContent()
        .then((_content: string) => {
          setWordCount(_chapter.wordCount);
          setContent(_content);
        })
    }

    if (store.summary) {
      getChapter();
    }

    store.$on('summary', getChapter);

    return () => {
      store.$off('summary', getChapter);
    }
  }, [params.chapter])

  const handleChange = useCallback((_content:string) => {
    setWordCount(getWordCount(_content));
    setContent(_content);
    // chapter?.saveContent(content);
  }, [chapter]);

  const saveContent = useCallback(() => {
    setSaving(true);
    chapter?.saveContent(content)
      .then(() => {
        store.updateChapter(params.chapter, {
          wordCount: getWordCount(content),
          updatedAt: new Date()
        }).then((_chapter: Chapter) => {
          setChapter(_chapter);
          store.updateWordCount();
          setSaving(false);
        })
      })
  }, [chapter, content])

  const handleRemove = () => {
    store.removeChapter(params.chapter)
      .then(() => {
        setShowConfirm(false);
        router.push(`/${params.book}`);
      })
  }

  const handleTitleChange = (val: string) => {
    store.updateChapter(params.chapter, {
      title: val.replace(/<[^>]+>/g,"")
    }).then((_chapter: Chapter) => {
      setChapter(_chapter);
    })
  }

  const handleSlugChange = (e: any) => {
    store.updateChapter(params.chapter, {
      slug: e.target.value
    }).then((_chapter: Chapter) => {
      setChapter(_chapter);
    })
  }
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
            <div>
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