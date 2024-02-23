import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import Link from 'next/link';

export default function Card(
  { id, text, index, moveCard, path, moveLevel, level, active }:
  {
    id: string,
    text: string,
    index: number,
    moveCard: Function,
    moveLevel: Function,
    path: string,
    level: number,
    active: boolean
  }
) {
  const ref = useRef(null)
  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      const hoverClientX = clientOffset.x - hoverBoundingRect.left

      if (dragIndex === hoverIndex) {
        if (hoverClientX > 100) {
          // 向右移动
          moveLevel(dragIndex, 1);
          // console.warn('drag to right', dragIndex, hoverClientX);
        } else if (hoverClientX < 90) {
          moveLevel(dragIndex, 0);
        }
        return
      }
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      if (hoverClientX > 100) {
        // 向右移动
        moveLevel(dragIndex, 1);
        // console.warn('drag to right', dragIndex, hoverClientX);
      } else if (hoverClientX < 90) {
        moveLevel(dragIndex, 0);
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  drag(drop(ref))
  return (
    <li
      className={`chapter-item${isDragging ? ' dragging' : ''}${active ? ' active': ''}`}
      ref={ref}
      data-handler-id={handlerId}
      style={{
        paddingLeft: (5 + 20 * level) + 'px'
      }}
    >
      <Link href={path}>
        {/* <div className="drag-handler"></div> */}
        {
          text ?
          text :
          <div className="chapter-meta">/{ id }</div>
        }
      </Link>
    </li>
  )
}
