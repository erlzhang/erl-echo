import React, { useState, useEffect, useImperativeHandle, useCallback } from "react"

export default React.forwardRef(({
  items,
  command,
  editor,
  range,
}, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (idx: number) => {
    const item = items[idx]

    if (item) {
      command(item)
    }
  }

  const onKeyDown = ({event}) => {
    let e = event;
    e.preventDefault();

    if (e.key === "ArrowUp") {
      setSelectedIndex(((selectedIndex + items.length) - 1) % items.length)
      return true;
    }
    if (e.key === "ArrowDown") {
      setSelectedIndex((selectedIndex + 1) % items.length)
      return true;
    }
    if (e.key === "Enter") {
      selectItem(selectedIndex);
      return true;
    }
    return false;
  }

  useImperativeHandle(ref, () => {
    return {
      onKeyDown
    }
  });

  const actions = items.map((cmd, idx) => {
    return (
      <button
        key={cmd.key}
        title={cmd.label}
        onClick={() => selectItem(idx)}
        className={`action-btn${idx === selectedIndex ? ' active' : ''}`}
        onMouseEnter={() => setSelectedIndex(idx)}
      >
        { cmd.icon }
        <span>{ cmd.label }</span>
      </button>
    )
  })

  return (
    <div className="actions-menu">
      { actions }
    </div>
  )
});