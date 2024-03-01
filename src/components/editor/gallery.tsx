import "@/styles/gallery.css"

import Dialog from '@/components/ui/dialog';
import { Button } from "@/components/ui/form";
import Uploader from "@/components/ui/uploader";
import { useEffect, useState } from 'react';
import { FiXCircle, FiLoader, FiArrowLeft } from "react-icons/fi";
import { FcFolder } from "react-icons/fc";

import {
  getImages,
  remove,
  upload
} from '@/api/gallery';
import {
  getLastSlug
} from '@/utils/file';

export default function GalleryDialog({ onClose, onInsert }) {
  const [images, setImages] = useState<{
    prefix: string,
    url: string,
    loading: boolean,
    name: string
  }[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [prefix, setPrefix] = useState<string>('img/')
  const [prefixPath, setPrefixPath] = useState<string[]>(['img/'])

  useEffect(() => {
    getImages(prefix)
      .then(res => {
        setImages(res.data.data);
      })
  }, [prefix])

  const handleRemove = (name: string) => {
    remove(name)
      .then(() => {
        setImages((_images) => {
          return _images.filter(img => img.name !== name)
        })
      })
  }

  const imgBlocks = images.map(img => {
    return (
      <>
        {
          img.prefix ?
          <div
            key={img.prefix}
            className="img-item img-item-folder"
            onDoubleClick={() => {
              setPrefixPath([...prefixPath, img.prefix])
              setPrefix(img.prefix)
            }}
          >
            <FcFolder/>
            <div>{ getLastSlug(img.prefix) }</div>
          </div> :
          <div
            key={img.url}
            className={`img-item${selected === img.url ? ' selected' : ''}${img.loading ? ' img-loading': ''}`}
            style={{
              backgroundImage: `url(${img.url})`
            }}
            onClick={() => setSelected(img.url)}
          >
            {
              img.loading &&
              <div className="ocr-loading-icon">
                <FiLoader/>
              </div>
            }
            {
              selected === img.url &&
              <div
                className="remove-img-btn"
                onClick={() => handleRemove(img.name)}
              >
                <FiXCircle/>
              </div>
            }
          </div>
        }
      </>
    )
  })

  const handleInsert = () => {
    onInsert(selected)
    onClose()
  }

  const handleUpload = ({ file, base64 }) => {
    setImages([
      ...images,
      {
        url: base64,
        loading: true
      }
    ])
    upload(file, prefix)
      .then(res => {
        setImages([
          ...images.slice(),
          {
            url: res.data.url,
            name: res.data.name
          }
        ])
      })
  }

  return (
    <Dialog
      title="图片管理"
      onClose={onClose}
    >
      {/* <div className="gallery"> */}
        {
          prefixPath.length > 1 &&
          <div className="gallery-header">
            <Button
              onClick={() => {
                prefixPath.pop()
                const last = prefixPath[prefixPath.length - 1]
                setPrefixPath(prefixPath.slice())
                setPrefix(last)
              }}
            >
              <FiArrowLeft/>
              <span>返回</span>
            </Button>
          </div>
        }
        <div className="images">
          { imgBlocks }
        </div>
        <div className="gallery-footer">
          <Uploader
            onChange={handleUpload}
          ></Uploader>
          {
            selected &&
            <Button
              type="primary"
              onClick={handleInsert}
            >插入图片</Button>
          }
        </div>
      {/* </div> */}
    </Dialog>
  )
}