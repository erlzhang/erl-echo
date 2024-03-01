import Confirm from "./confirm";
import React, { useState, useRef } from 'react';
import Alert from "./alert";
import "@/styles/button.css"
import { FiLoader } from "react-icons/fi";
import { createRoot } from 'react-dom/client';

export default function Button(
  {
    children,
    type = 'default',
    onClick,
    style,
    loadingText,
    confirm = null,
    async = false,
    onSuccess,
    onError,
  }:
  {
    children: React.ReactElement | string,
    type: string|Array<string>,
    onClick: Function<Promise>,
    // onClick: React.MouseEventHandler<HTMLDivElement>,
    loadingText: String,
    style: any | null,
    confirm: string | null,
    async: boolean
  }
) {
  // const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const root = useRef(null)

  let claStr = 'btn';
  if (Array.isArray(type)) {
    claStr += type.map(item => ` btn-${item}`).join('');
  } else {
    claStr += ` btn-${type}`
  }

  if (loading) {
    claStr += ' loading';
  }

  const handleClick = (e: any) => {
    if (loading) {
      return;
    }

    if (confirm) {
      showConfirmDialog();
      return;
    }

    handleAction(e);
  }

  const handleConfirm = (e: any) => {
    handleAction(e);
  }

  const showAlertMsg = (_type: string, _message: string) => {
    root.current = document.createElement('div')
    root.current.id = '__react-alert__'
    document.body.appendChild(root.current)

    const _root = createRoot(root.current);
    _root.render(<Alert
      type={_type}
      message={_message}
    />);
    setTimeout(() => {
      document.body.removeChild(root.current);
    }, 3 * 1000);
  }

  const showConfirmDialog = () => {
    root.current = document.createElement('div')
    root.current.id = '__react-confirm__'
    document.body.appendChild(root.current)

    const closeConfirm = () => {
      document.body.removeChild(root.current)
    }

    const _root = createRoot(root.current);
    _root.render(<Confirm
      text={confirm || ''}
      onConfirm={() => {
        closeConfirm();
        handleConfirm();
      }}
      onClose={closeConfirm}
    />);
  }

  const handleAction = (e) => {
    if (!onClick) return;

    if (!async) {
      onClick(e);
      return;
    }

    setLoading(true);
    onClick(e)
      .then(({msg, payload}) => {
        showAlertMsg('success', msg);
        onSuccess && onSuccess(payload);
      })
      .catch((msg) => {
        showAlertMsg('error', msg || '操作异常');
        onError && onError();
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <>
      <div
        className={claStr}
        onClick={handleClick}
        style={style}
      >
        {
          loading ?
          <>
            <FiLoader/>
            {loadingText || 'loading'}...
          </>
          : children

        }
      </div>
    </>
    
  )
}