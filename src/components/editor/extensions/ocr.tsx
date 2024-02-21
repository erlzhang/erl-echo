import { Extension, ReactRenderer } from "@tiptap/react";
import Ocr from '../ocr';

export default Extension.create({
  name: 'ocr',

  addOptions() {
    return {
      
    }
  },

  addCommands() {
    let component;
    return {
      openOcrDialog: () => () => {
        component = new ReactRenderer(Ocr, {
          editor: this.editor,
          props: {
            onClose: () => {
              this.editor.commands.closeOcrDialog();
            },
            onInsert: (content: string) => {
              const paragraphs = content.split('\n');
              const result = paragraphs.map((p: string) => {
                return `<p>${p}</p>`;
              }).join('');
              this.editor.commands.insertContent(result);

            }
          }
        })
        document.body.appendChild(component.element);
      },
      closeOcrDialog: () => () => {
        component?.destroy();
      }
    }
  }
})