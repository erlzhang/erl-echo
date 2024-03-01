import { BookContext } from "@/contexts/bookContext"
import { useContext } from "react"
import BookHeader from '@/components/book-header';
import Summary from '@/components/summary';

export default function Sidebar() {
  const { book } = useContext(BookContext)
  return (
    <>
      {
        book?.hasSummary &&
        <div className="sidebar">
          <BookHeader/>
          <Summary/>
        </div>
      }
    </>
    
  )
}