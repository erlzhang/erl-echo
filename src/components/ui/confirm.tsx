import Dialog from "./dialog"
import { Button } from "./form"

export default function Confirm(
  {
    onConfirm,
    onClose,
    text
  }: {
    onConfirm: Function,
    onClose: Function,
    text: string
  }
) {
  return (
    <Dialog
      style={{
        width: 300,
      }}
    >
      <h3
        style={{
          textAlign: "center",
          marginBottom: 30
        }}
      >{ text }</h3>
      <div className="dialog-actions">
        <Button
          type="primary"
          onClick={ onConfirm }
        >确认</Button>
        <Button
          type="default"
          onClick={onClose}
        >取消</Button>
      </div>
    </Dialog>
  )
}