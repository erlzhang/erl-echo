import React, { useState, useRef, useEffect } from "react";
import { TbEdit } from "react-icons/tb";

export default function({ value, onChange, name, placeholder = "", prefix = "" }: {
  value: string,
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
  name: string,
  placeholder: string,
  prefix: string
}) {
  const ref = useRef(null)
  const [editable, setEditable] = useState<boolean>(false)
  const [val, setVal] = useState<string>('')

  useEffect(() => {
    setVal(value);
  }, [value])

  useEffect(() => {
    if (!editable) {
      return;
    }

    ref.current?.focus()

    const cancelInput = (e: any) => {
      if (e.code === "Escape") {
        e.preventDefault();
        setVal(value);
        setEditable(false)
      }
    }

    ref.current?.addEventListener('keydown', cancelInput);

    return () => {
      ref.current?.removeEventListener('keydown', cancelInput);
    }
  }, [editable])

  return (
    <div className="editable-field">
      {
        prefix &&
        <span className="editable-field-prefix">{ prefix }</span>
      }
      {
        editable ?
        <input
          className="form-control"
          name={name}
          value={val}
          ref={ref}
          onChange={(e) => setVal(e.target.value)}
          onBlur={(e) => {
            onChange(e)
            setEditable(false)
          }}
        ></input> :
        <>
          {
            value ||
            <span className="placeholder">
              { placeholder }
            </span>
          }
          <button
            className="hover-btn"
            onClick={() => setEditable(true)}
          >
            <TbEdit></TbEdit>
          </button>
        </>
      }
    </div>
  )
}