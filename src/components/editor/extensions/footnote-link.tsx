import {
  KeyboardShortcutCommand, mergeAttributes, Node, wrappingInputRule,
} from '@tiptap/core'

export const FootnoteLink = Node.create({
  name: 'footnoteLink',

  content: 'text*',

  renderHTML({ node, HTMLAttributes }) {
    [
      'a',
      {
        href: `#fnref:${node.id}`,
        class: 'reversefootnote',
        role: 'doc-backlink'
      },
      '↩'
    ]
  }
})