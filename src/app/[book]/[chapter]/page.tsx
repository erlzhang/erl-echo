"use client";
import { Editor } from '@/components/editor/editor';
import { useCallback, useEffect, useState, useRef, useContext } from 'react';
import { BookContext } from '@/contexts/bookContext'
import Chapter from '@/models/chapter';
import Button from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {FiSave, FiTrash2 } from "react-icons/fi";

import Title from '@/components/editor/title'
import EditableField from '@/components/ui/editable-field';
import {
  getWordCount
} from '@/utils/word';

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
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [prefix, setPrefix] = useState<string>('');
  const editorRef = useRef()

  const getContent = async (_chapter) => {
    const temp = await _chapter.getTempContent();
    if (temp != null) {
      const updatedTime = temp.updatedAt;
      const chapterUpdatedTime = new Date(_chapter.updatedAt).getTime();
      // 如果本地草稿保存时间大于远程保存时间，加载本地草稿
      if (updatedTime > chapterUpdatedTime) {
        setHasChanged(true);
        return temp.content;
      }
    }

    return _chapter.getContent();
  }

  useEffect(() => {
    if (!params.chapter || !summary || chapter) return;

    const _chapter = summary.getChapter(params.chapter);
    setChapter(_chapter);
    // _chapter.getContent()
    getContent(_chapter)
      .then((_content: string) => {
        setWordCount(getWordCount(_content));
        setContent(_content);
      })
  }, [params.chapter, summary])

  useEffect(() => {
    if (!summary || !chapter) return;

    setPrefix(summary.getPrefixOfChapter(chapter));
  }, [summary])

  const handleChange = useCallback((_content:string) => {
    chapter?.saveTempContent(_content)
      .then(() => {
        setWordCount(getWordCount(_content));
        setHasChanged(true);
      });
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

  const saveContent = useCallback(async () => {
    // const temp = await _chapter.getTempContent();
    return chapter?.getTempContent()
      .then(res => {
        return chapter?.saveContent(res.content)
          .then(() => {
            return summary?.updateChapter(params.chapter, {
              wordCount: getWordCount(res.content),
              updatedAt: new Date()
            }).then(() => {
              return {
                msg: '保存成功',
                payload: chapter
              }
            }).catch((e) => {
              throw({
                msg: '保存失败'
              });
            })
          })
      })
  }, [chapter])

  const afterSave = (_chapter) => {
    setChapter(_chapter.clone())
    setHasChanged(false);
    updateBookWordcount()
  };

  const handleRemove = useCallback(async () => {
    return summary?.remove(params.chapter)
      .then(() => {
        return {
          msg: '删除成功',
          payload: summary
        }
      })
  }, [summary])

  const afterRemove = (summary) => {
    router.push(`/${params.book}`);
    updateSummary(summary)
    updateBookWordcount()
  }

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

  useEffect(() => {
    if (!chapter) return;

    const handler = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveContent()
          .then(() => {
            afterSave(chapter);
          })
      }
    };
    window.document.addEventListener('keydown', handler);
    return () => {
      window.document.removeEventListener('keydown', handler);
    }
  }, [chapter])

  return (
    <>
      {
        chapter &&
        <>
          <div className="chapter-header">
            <div className="chapter-slug">
              <EditableField
                value={chapter.slug}
                name="slug"
                onChange={handleSlugChange}
                prefix={prefix}
                placeholder=""
              />
            </div>
            <div className="chapter-actions">
              {
                hasChanged &&
                <span className="unchanged-content-hint">
                  您有尚未保存的内容...
                </span>
              }
              <span className="word-count">{ wordCount } 字</span>
              <Button
                type="primary"
                loadingText="保存中..."
                async={true}
                onClick={saveContent}
                onSuccess={afterSave}
              >
                <FiSave/>
                保存
              </Button>
              <Button
                type="error"
                onClick={handleRemove}
                onSuccess={afterRemove}
                confirm="删除章节不可恢复，确认是否删除？"
                async={true}
              >
                <FiTrash2 />
                删除
              </Button>
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