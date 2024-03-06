import { Extension } from '@tiptap/core';
import { ReactRenderer } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";

import tippy from 'tippy.js'
import Toolbar from '../toolbar';
import { LuHeading2, LuHeading3, LuList, LuListOrdered, LuQuote, LuImage } from "react-icons/lu";
import { TbTextScan2 } from "react-icons/tb";

export const suggestion = {
  items: () => {
    return [
      {
        key: 'h2',
        label: '标题2',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 2 })
            .run()
        },
        icon: <LuHeading2 />
      },
      {
        key: 'h3',
        label: '标题3',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 3 })
            .run()
        },
        icon: <LuHeading3 />
      },
      {
        key: 'ul',
        label: '无序列表',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleBulletList()
            .run()
        },
        icon: <LuList />
      },
      {
        key: 'ol',
        label: '有序列表',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleOrderedList()
            .run()
        },
        icon: <LuListOrdered/>
      },
      {
        key: 'quote',
        label: '引用',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setBlockquote()
            .run()
        },
        icon: <LuQuote />
      },
      {
        key: 'ocr',
        label: '手写识别',
        icon: <TbTextScan2 />,
        command: ({ editor, range }) => {
          editor.chain()
          .focus().deleteRange(range).openOcrDialog().run()
        }
      },
      {
        key: 'image',
        label: '图片管理',
        icon: <LuImage />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).openGallery().run()
        }
      }
    ];
  },
  render: () => {
    let popup;
    let component;

    return {
      onStart: props => {
        component = new ReactRenderer(Toolbar, {
          props,
          editor: props.editor,
        });

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate: props => {
        component?.updateProps(props);

        popup &&
          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component?.ref?.onKeyDown(props);
      },

      onExit() {
        popup?.[0].destroy()
        component?.destroy()
      },
    }
  }
}

export default Extension.create({
  name: 'commands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }) => {
          props.command({ editor, range })
        },
      }
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  }
})