import React, { useState, useRef, useEffect } from 'react';

export default function NewCard(
  { onAdd }:
  {
    onAdd: Function
  }
) {
  const [showInput, setShowInput] = useState<boolean>(false);
  const ref = useRef(null);

  useEffect(() => {
    if (showInput) {
      ref.current.focus();
    }
  }, [showInput]);

  const handleClick = () => {
    setShowInput(true);
  }

  const handleBlur = (e) => {
    const value = e.target.value;
    if (value !== '') {
      onAdd(value);
    }
    setShowInput(false);
  }

  return (
    <div
      className="add-btn-container"
    >
      {
        showInput ?
        <input
          ref={ref}
          className="add-input"
          onBlur={handleBlur}
          placeholder="章节路径"
        /> :
        <div
          className="add-btn"
          onClick={handleClick}
        >
          + 新增章节
        </div>
      }
    </div>
  );
}