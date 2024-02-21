import ContentEditable from 'react-contenteditable'
import React, { useEffect, useRef } from 'react'

export default function({
  value,
  onBlur,
  onChange,
  onEnter
}: {
  value: String,
  onBlur: React.FocusEventHandler<HTMLInputElement>,
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
  onEnter: Function
}) {
  const text = useRef(value || '');
  const ref = useRef()

  useEffect(() => {
    const onKeyPress = (e) => {
      if (e.ctrlKey) {
        if (['KeyB', 'KeyI', 'KeyU'].includes(e.code)) {
          e.preventDefault();
          return;
        }
      }

      if (e.code === 'Enter') {
        e.preventDefault();
        ref.current?.blur();
        onEnter && onEnter()
      }
    }
    ref.current?.addEventListener('keydown', onKeyPress)

    return () => {
      ref.current?.removeEventListener('keydown', onKeyPress)
    }
  }, [ref])

  useEffect(() => {
    text.current = value && value.replace(/<[^>]+>/g,"");
  }, [value])

  const handleChange = (evt: any) => {
    text.current = evt.target.value.replace(/<[^>]+>/g,"");;
    // onChange && onChange(text.current);
  };

  const handleBlur = () => {
    onChange && onChange(text.current);
  };
  return (
    <ContentEditable
      html={text.current}
      innerRef={ref}
      onBlur={handleBlur}
      onChange={handleChange}
      className="chapter-title-inner"
    ></ContentEditable>
  )
}