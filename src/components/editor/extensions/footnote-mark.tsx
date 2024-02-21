import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import {
  KeyboardShortcutCommand, mergeAttributes, Node, wrappingInputRule,
} from '@tiptap/core'

export const FootnoteMark = Node.create({
  name: 'footnoteMark',
  
  inline: true,

  renderHTML({  }) {
    const id = 1;
    return [
      'sup',
      {
        id: `fnref:${id}`,
        role: 'doc-noteref'
      },
      [
        'a',
        {
          ref: `#fn:${id}`,
          class: 'footnote',
          rel: 'footnote'
        },
        0
      ]
    ]
  }
})