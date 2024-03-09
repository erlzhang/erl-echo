// src/Tiptap.jsx
import { EditorContent, useEditor, BubbleMenu, FloatingMenu } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Document from '@tiptap/extension-document'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import '@/styles/editor.css'
import { useEffect, useImperativeHandle } from 'react'
import Command, { suggestion } from './extensions/slash-command';
import Ocr from './extensions/ocr';
import Gallery from './extensions/gallery';
import BubbleMenuItems from './bubble-menu';
import {Footnote} from './extensions/footnote';
import {FootnoteItem} from './extensions/footnote-item';
import {FootnoteMark} from './extensions/footnote-mark';
import {FootnoteLink} from './extensions/footnote-link';

const empty = `
  <p></p>
`;

export const Editor = (
  { onChange, content, innerRef }:
  {
    onChange: Function,
    content: string,
    innerRef: any
  }
) => {

  const CustomDocument = Document.extend({
    content: 'block*',
  })
  // define your extension array
  const editor = useEditor({
    extensions: [
      // StarterKit,
      Typography,
      CustomDocument,
      StarterKit.configure({
        document: false,
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        showOnlyCurrent: false,
        placeholder: ({ node }) => {
          return '书写你的故事 ...'
        },
      }),
      Image.configure({
        inline: true,
      }),
      Subscript,
      Superscript,
      Highlight,
      Link,
      FootnoteLink,
      FootnoteMark,
      FootnoteItem,
      Footnote,
      Ocr,
      Gallery,
      Command.configure({
        suggestion
      })
    ],
    content: content || empty,
    // triggered on every change
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      onChange(content);
      // send the content to an API here
    },
  })

  useEffect(() => {
    if (!editor) {
      return;
    }
    editor.commands.setContent(content || empty)
  }, [content, editor])

  useImperativeHandle(innerRef, () => {
    return {
      focus: () => {
        editor?.commands.focus('start')
      }
    }
  });

  return (
    <>
      {editor && <BubbleMenuItems
        editor={editor}
      />}
      <EditorContent editor={editor} />
    </>
  )
}