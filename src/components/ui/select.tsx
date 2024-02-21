import "@/styles/form.css"
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useListNavigation,
  useInteractions,
  FloatingFocusManager,
  useTypeahead,
  offset,
  flip,
  size,
  autoUpdate,
  FloatingPortal
} from "@floating-ui/react";
import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function Select({ value, name, onChange, options, placeholder = '请选择', tagMode = false, style }: {
  value: string,
  name: string,
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
  options: Array<{
    label: string,
    value: string,
    icon: string
  }>,
  placeholder: string,
  tagMode: boolean,
  style: any
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

useEffect(() => {
  const initIndex = options.findIndex(opt => opt.value === value);
  if (initIndex > -1 && selectedIndex !== initIndex) {
    setSelectedIndex(initIndex);
  }
});

const { refs, floatingStyles, context } = useFloating({
  placement: "bottom-start",
  open: isOpen,
  onOpenChange: setIsOpen,
  whileElementsMounted: autoUpdate,
  middleware: [
    offset(5),
    flip({ padding: 10 }),
    size({
      apply({ rects, elements, availableHeight }) {
        Object.assign(elements.floating.style, {
          maxHeight: `${availableHeight}px`,
          minWidth: `${rects.reference.width}px`
        });
      },
      padding: 10
    })
  ]
});

const listRef = useRef([]);
const listContentRef = useRef(options);
const isTypingRef = useRef(false);

const click = useClick(context, { event: "mousedown" });
const dismiss = useDismiss(context);
const role = useRole(context, { role: "listbox" });
const listNav = useListNavigation(context, {
  listRef,
  activeIndex,
  selectedIndex,
  onNavigate: setActiveIndex,
  // This is a large list, allow looping.
  loop: true
});
const typeahead = useTypeahead(context, {
  listRef: listContentRef,
  activeIndex,
  selectedIndex,
  onMatch: isOpen ? setActiveIndex : setSelectedIndex,
  onTypingChange(isTyping) {
    isTypingRef.current = isTyping;
  }
});

const {
  getReferenceProps,
  getFloatingProps,
  getItemProps
} = useInteractions([dismiss, role, listNav, typeahead, click]);

const handleSelect = (index: number) => {
  setSelectedIndex(index);
  setIsOpen(false);
  onChange({
    target: {
      name: name,
      value: index !== null ? options[index].value : undefined
    }
  })
};

const selectedItemLabel =
  selectedIndex !== null ? options[selectedIndex].label : undefined;

const selectedItemIcon = 
  selectedIndex !== null ? options[selectedIndex].icon : undefined

return (
  <div className={`select${tagMode ? ' select-tag': ''}`}>
    <div
      className="form-control"
      style={style}
      tabIndex={0}
      ref={refs.setReference}
      aria-labelledby="select-label"
      aria-autocomplete="none"
      {...getReferenceProps()}
    >
      { selectedItemIcon }
      {selectedItemLabel || placeholder}
      <span className="select-icon">
        {
          isOpen ?
          <FiChevronUp></FiChevronUp>:
          <FiChevronDown></FiChevronDown>
        }
      </span>
      
    </div>
    {isOpen && (
      <FloatingPortal>
        <FloatingFocusManager context={context} modal={false}>
          <div
            className="select-options"
            ref={refs.setFloating}
            style={{
              ...floatingStyles
            }}
            {...getFloatingProps()}
          >
            {options.map((opt, i) => (
              <div
                className="select-option"
                key={value}
                ref={(node) => {
                  listRef.current[i] = node;
                }}
                role="option"
                tabIndex={i === activeIndex ? 0 : -1}
                aria-selected={i === selectedIndex && i === activeIndex}
                style={{
                  background: i === activeIndex ? "var(--lighter)" : ""
                  // background: i === activeIndex ? "cyan" : ""
                }}
                {...getItemProps({
                  // Handle pointer select.
                  onClick() {
                    handleSelect(i);
                  },
                  // Handle keyboard select.
                  onKeyDown(event) {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSelect(i);
                    }

                    if (event.key === " " && !isTypingRef.current) {
                      event.preventDefault();
                      handleSelect(i);
                    }
                  }
                })}
              >
                {opt.label}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    right: 10
                  }}
                >
                  {i === selectedIndex ? " ✓" : ""}
                </span>
              </div>
            ))}
          </div>
        </FloatingFocusManager>
      </FloatingPortal>
    )}
  </div>
);
}