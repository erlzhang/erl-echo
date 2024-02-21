import { BubbleMenu, isNodeSelection } from '@tiptap/react'
import { LuBold, LuItalic, LuStrikethrough, LuCode, LuSubscript, LuSuperscript, LuHighlighter, LuLink2, LuLink2Off, LuCheck, LuBookMarked } from "react-icons/lu";
import { useState, useRef, useEffect } from 'react';

const items = [
  {
    label: '加粗',
    key: 'bold',
    icon: <LuBold/>,
    command: (editor) => {
      editor.chain().focus().toggleBold().run()
    }
  },
  {
    label: '倾斜',
    key: 'italic',
    icon: <LuItalic/>,
    command: (editor) => {
      editor.chain().focus().toggleItalic().run()
    }
  },
  {
    label: '划线',
    key: 'strike',
    icon: <LuStrikethrough/>,
    command: (editor) => {
      editor.chain().focus().toggleStrike().run()
    }
  },
  {
    label: '代码',
    key: 'code',
    icon: <LuCode/>,
    command: (editor) => {
      editor.chain().focus().toggleCode().run()
    }
  },
  {
    label: '上标',
    key: 'superscript',
    icon: <LuSuperscript/>,
    command: (editor) => {
      editor.chain().focus().toggleSuperscript().run()
    }
  },
  {
    label: '下标',
    key: 'subscript',
    icon: <LuSubscript/>,
    command: (editor) => {
      editor.chain().focus().toggleSubscript().run()
    }
  },
  {
    label: '高亮',
    key: 'highlight',
    icon: <LuHighlighter/>,
    command: (editor) => {
      editor.chain().focus().toggleHighlight().run()
    }
  },
  // {
  //   label: '脚注',
  //   key: 'footnote',
  //   icon: <LuBookMarked/>,
  //   command: (editor) => {
  //     editor.commands.setFootnote();
  //   }
  // }
]

export default function({ editor }) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const linkRef = useRef(null);

  const handleSetLink = () => {
    const value = linkRef.current?.value;
    if (value != '') {
      editor.chain().focus().setLink({
        href: linkRef.current?.value,
        target: '_blank'
      }).run()
    }
    setShowLinkInput(false)
  }

  useEffect(() => {
    linkRef.current?.focus()

    const onKeyPress = (e) => {
      if (e.code === 'Enter') {
        e.preventDefault();
        handleSetLink();
      }
    }

    linkRef.current?.addEventListener('keydown', onKeyPress)

    return () => {
      linkRef.current?.removeEventListener('keydown', onKeyPress)
    }
  }, [showLinkInput])

  const btns = items.map((item) => {
    return (
      <button
        key={item.key}
        onClick={() => item.command(editor)}
        className={editor.isActive(item.key) ? 'is-active' : ''}
      >
        { item.icon }
      </button>
    )
  })
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        onHidden: () => {
          setShowLinkInput(false);
        },
      }}
      shouldShow={({ state, editor }) => {
        const { selection } = state;
        const { empty } = selection;

        // don't show bubble menu if:
        // - the selected node is an image
        // - the selection is empty
        // - the selection is a node selection (for drag handles)
        if (editor.isActive("image") || empty || isNodeSelection(selection)) {
          return false;
        }
        // if (editor.isActive('image')) {
        //   return false;
        // }
        return true;
      }}
    >
      <div className="bubble-menu">
        { btns }
        {
          editor.isActive('link') ?
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
          >
            <LuLink2Off/>
          </button> :
          <button
            onClick={() => setShowLinkInput(true)}
            className={showLinkInput ? 'is-active' : ''}
          >
            <LuLink2/>
          </button>
        }
        {
          showLinkInput &&
          <div className="bubble-link-input">
            <input
              ref={linkRef}
              name="link"
              type="text"
              className="form-control"
          ></input>
          <button
            onClick={handleSetLink}
          >
            <LuCheck/>
          </button>
          </div>
        }
      </div>
    </BubbleMenu>
  )
}