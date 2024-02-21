import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import {
  KeyboardShortcutCommand, mergeAttributes, Node, wrappingInputRule,
} from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import Component from './footnote/component'

export const FootnoteItem = Node.create({
  name: 'footnoteItem',

  defining: true,

  content: 'text*',

  parseHTML() {
    return [
      {
        tag: `footnote-item`,
        priority: 52
      }
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['footnote-item', mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component, { contentDOMElementTag: 'li' })
  }
})