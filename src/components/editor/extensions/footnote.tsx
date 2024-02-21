import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { ReactNodeViewRenderer } from '@tiptap/react'
import {
  KeyboardShortcutCommand, mergeAttributes, Node, wrappingInputRule,
} from '@tiptap/core'
import Component from './footnote/component'

export const Footnote = Node.create({
  name: 'footnote',

  content: 'footnoteItem+',

  group: 'block',

  atom: true,

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
        priority: 51,
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'footnotes',
        'data-type': 'footnote'
      }),
      [
        'ol',
        0
      ]
    ]
  },

  addCommands() {
    return {
      setFootnote: () => ({ commands, state }) => {
        // commands.insertContent('<sup>1</sup>')
        // return;
        let $footnoteBlock = this.editor.$node(this.name);
        console.log('block', $footnoteBlock)
        if (!$footnoteBlock) {
          commands.focus('end')
          commands.enter()
          commands.insertContent('<div class="footnotes" data-type="footnote"><footnote-item></footnote-item><footnote-item></footnote-item></div>')
          return;
        }

        // const $footnoteItemList = $footnoteBlock.querySelectorAll('footnoteItem');
        const last = $footnoteBlock.lastChild;
        console.warn('last', last, $footnoteBlock.children);
        commands.insertContentAt(last.after, '<footnote-item></footnote-item>');
      }
    }
  },

  // addNodeView() {
  //   return ReactNodeViewRenderer(Component)
  // }
})