import "@/styles/gallery.css"

import Dialog from '@/components/ui/dialog';
import { Button } from "@/components/ui/form";
import Uploader from "@/components/ui/uploader";
import { useEffect, useRef, useState } from 'react';
import { FiXCircle, FiLoader, FiArrowLeft } from "react-icons/fi";
import { FcFolder } from "react-icons/fc";

import {
  createFolder,
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
  const [showNewFolder, setShowNewFolder] = useState<boolean>(false)
  const [showPreview, setShowPreview] = useState<boolean>(false)

  const newFolderInputRef = useRef();

  useEffect(() => {
    getImages(prefix)
      .then(res => {
        setImages(res.data.data);
      })
  }, [prefix])

  useEffect(() => {
    newFolderInputRef.current?.focus()

    const evtHandler = (e: any) => {
      if (e.code === "Escape") {
        e.preventDefault();
        e.stopPropagation()
        setShowNewFolder(false);
      } else if (e.code === 'Enter') {
        e.preventDefault();
        onCreateFolder({
          target: newFolderInputRef.current
        });
      }
    }

    newFolderInputRef.current?.addEventListener('keydown', evtHandler);

    return () => {
      newFolderInputRef.current?.removeEventListener('keydown', evtHandler);
    }
  }, [showNewFolder])

  const handleRemove = (name: string) => {
    remove(name)
      .then(() => {
        setImages((_images) => {
          return _images.filter(img => img.name !== name)
        })
        setSelected(null)
      })
  }

  const removeCurrentFolder = () => {
    remove(prefix)
      .then(() => {
        prefixPath.pop()
        const last = prefixPath[prefixPath.length - 1]
        setPrefixPath(prefixPath.slice())
        setPrefix(last)
      })
  }

  const onCreateFolder = (e) => {
    console.log('e', e);
    const val = e.target.value;
    if (val === '') {
      setShowNewFolder(false);
      return;
    }

    createFolder(prefix, val)
      .then(res => {
        setShowNewFolder(false);
        const _prefix = prefix + val + '/';
        setPrefixPath([...prefixPath, _prefix])
        setPrefix(_prefix)
        setSelected(null)
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
              setSelected(null)
            }}
          >
            <FcFolder/>
            <div>{ getLastSlug(img.prefix) }</div>
          </div> :
          <div
            key={img.url}
            className={`img-item${selected === img.url ? ' selected' : ''}${img.loading ? ' img-loading': ''}`}
            style={{
              backgroundImage: `url(${img.url}?x-oss-process=image/resize,w_100,h_100,m_fill)`
            }}
            onClick={() => setSelected(img.url)}
            onDoubleClick={() => {
              setSelected(img.url)
              setShowPreview(true)
            }}
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
                setSelected(null)
              }}
            >
              <FiArrowLeft/>
              <span>返回</span>
            </Button>
          </div>
        }
        <div className="images">
          { imgBlocks }
          {
            showNewFolder &&
            <div
              className="img-item img-item-folder"
            >
              <FcFolder/>
              <div>
                <input
                  ref={newFolderInputRef}
                  className="form-control"
                  onBlur={onCreateFolder}
                />
              </div>
            </div>
          }
        </div>
        <div className="gallery-footer">
          <Uploader
            onChange={handleUpload}
          ></Uploader>
          <Button
            type="primary"
            onClick={() => setShowNewFolder(true)}
          >创建目录</Button>
          {
            prefixPath.length > 1 && !images.length &&
            <Button
              type="primary"
              onClick={removeCurrentFolder}
            >
              删除目录
            </Button>
          }
          {
            selected &&
            <Button
              type="primary"
              onClick={handleInsert}
            >插入图片</Button>
          }
        </div>
        {
          showPreview &&
          <div className="gallery-preview">
            <div
              className="gallery-preview-mask"
              onClick={() => setShowPreview(false)}
            >
            </div>
            <img src={selected}/>
          </div>
        }
      {/* </div> */}
    </Dialog>
  )
}