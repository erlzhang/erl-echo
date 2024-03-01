import "@/styles/alert.css"
import { BiErrorCircle, BiCheckCircle } from "react-icons/bi";

export default function({ type = "error", message }) {
  return (
    <div className="alert-container">
      <div className={`alert alert-${type}`}>
        {
          type === 'error' &&
          <BiErrorCircle/>
        }
        {
          type === 'success' &&
          <BiCheckCircle/>
        }
        { message }
      </div>
    </div>
    
  )
}