import Dialog from '@/components/ui/dialog';
import "@/styles/ocr.css"
import Uploader from "@/components/ui/uploader";
import { Input, Button } from '@/components/ui/form';
import { useState } from 'react';
import { FiLoader } from "react-icons/fi";
import {
  ocrLoad
} from '@/api/ocr';

export default function OcrDialog(
  { onClose, onInsert }:
  {
    onClose: Function,
    onInsert: Function
  }
) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false)
  const [imgSelected, setImgSelected] = useState<string | null>(null)

  const handleSelectImg = ({ base64 }: {
    base64: string
  }) => {
    setImgSelected(base64);
  }

  const startLoad = () => {
    setLoading(true);
    ocrLoad(imgSelected)
      .then(res => {
        setContent(res.data.result);
        setLoading(false);
      });
  }

  const handleInsert = () => {
    onInsert(content)
    onClose()
  }

  return (
    <Dialog
      title="ocr图片识别"
      onClose={onClose}
    >
      <div className="ocr-container">
        <div className="ocr-col">
          <div className="ocr-uploader">
            <Uploader
              type="uploader"
              width="100%"
              height="100%"
              onChange={handleSelectImg}
            ></Uploader>
            {
              loading &&
              <div className="ocr-loading">
                <div className="ocr-loading-icon">
                  <FiLoader />
                </div>
              </div>
            }
          </div>
        </div>
        <div className="ocr-col">
          <Input
            type="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!content}
          ></Input>
        </div>
      </div>
      <div className="ocr-footer">
        {
          imgSelected &&
          <Button
            type="primary"
            onClick={startLoad}
          >点击识别图片</Button>
        }
        {
          content != null &&
          <Button
            type="primary"
            onClick={handleInsert}
          >确认插入文本</Button>
        }
      </div>
    </Dialog>
  );
}