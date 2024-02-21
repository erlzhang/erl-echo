"use client";

import "@/styles/form.css";
import { Plus } from 'react-feather';
import { useState, useRef } from "react";
import { Button } from "./form";

export default function Uploader({ onChange, width, height, type = 'button' }: {
  onChange: Function,
  width: string,
  height: string,
  type: string
}) {
  const [imgData, setImgData] = useState<string | null>(null);
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  }

  const handleSelect = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", (evt) => {
      const _imgData = evt.target.result;
      setImgData(_imgData as string);
      onChange && onChange({
        file,
        base64: _imgData
      });
    });
  }

  return (
    <>
      {
        type === 'button' ?
        <Button
          type="primary"
          onClick={handleClick}
        >上传图片</Button>
        :
        <div
          className="uploader form-control"
          onClick={handleClick}
          style={{
            backgroundImage: imgData ? `url(${imgData})` : 'none',
            width: width || '150px',
            height: height || '150px'
          }}
        >
          <Plus color="var(--border-color)" size={48} />
        </div>
      }
      
      
      <input
        ref={inputRef}
        onChange={handleSelect}
        type="file"
        style={{
          display: 'none'
        }}
        accept="image/png, image/jpg, image/jpeg"
      />
    </>
  )
}