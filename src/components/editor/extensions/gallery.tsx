import { Extension, ReactRenderer } from "@tiptap/react";
import Gallery from '../gallery';

export default Extension.create({
  name: 'gallery',

  addCommands() {
    let component;

    return {
      openGallery: () => () => {
        component = new ReactRenderer(
          Gallery,
          {
            editor: this.editor,
            props: {
              onClose: () =>{
                this.editor.commands.closeGallery();
              },
              onInsert: (val: string) => {
                this.editor.chain().focus().setImage({ src: val }).run()
              }
            }
          }
        )
        document.body.appendChild(component.element);
      },
      closeGallery: () => () => {
        component?.destroy();
      }
    }
  },
})