import "@/styles/dialog.css";
import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function Dialog(
  { children, title, onClose, style }:
  {
    children: React.ReactNode,
    title: string,
    onClose: React.MouseEventHandler<HTMLDivElement>,
    style: React.CSSProperties
  }
) {
  useEffect(() => {
    const handleKeyUp = (e: any) => {
      if (e.key === 'Escape') {
        onClose(e);
      }
    }

    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
  })

  return (
    <div className="dialog-wrapper">
      <div className="dialog" style={style}>
        {
          title || onClose ?
          <div className="dialog-header">
            {
              title &&
              <h1 className="dialog-title">{ title }</h1>
            }
            {
              onClose &&
              <div
                className="dialog-close-btn"
                onClick={onClose}
              >
                <FiX />
              </div>
            }
          </div> :
          ''
        }
        
        <div className="dialog-content">
          { children }
        </div>
      </div>
    </div>
  )
}