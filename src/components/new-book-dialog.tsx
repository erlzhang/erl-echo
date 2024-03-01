import Dialog from "@/components/ui/dialog";
import { FormItem, Input, Button } from "@/components/ui/form";
import Select from "@/components/ui/select";
import React, { useState } from "react";
import {
  CATEGORY,
  WRITING_MODE
} from '@/const/book';
import Book, { Category, WritingMode } from '@/models/book';

export default function NewBookDialog(
  { onClose, onSubmit, index }
) {
  const [form, setForm] = useState({
    category: Category.Eassy,
    writingMode: WritingMode.HandWriting
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  }

  const handleSubmitForm = () => {
    // TODO: validate form
    // onSubmit?.call(null, form)
    setLoading(true)
    Book.new({
      ...form,
      index
    })
      .then(book => {
        setLoading(false)
        onSubmit?.call(null, book.slug)
      })
  }

  return (
    <Dialog
      title="开启新创作"
      onClose={() => onClose?.call()}
      style={{
        width: "600px"
      }}
    >
      <div className="new-book-form">
        <FormItem
          label="标题"
        >
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
          ></Input>
        </FormItem>
        <FormItem
          label="路径"
        >
          <Input
            name="slug"
            value={form.slug}
            onChange={handleChange}
          ></Input>
        </FormItem>
        <div className="form-item form-item-row">
          <FormItem label="分类" inline={true}>
            <Select
              name="category"
              value={form.category}
              options={Object.keys(CATEGORY).map(id => {
                return {
                  value: Number(id),
                  label: CATEGORY[id].label
                }
              })}
              onChange={handleChange}
            ></Select>
          </FormItem>
          <FormItem label="写作方式" inline={true}>
            <Select
              name="writingMode"
              value={form.writingMode}
              options={Object.keys(WRITING_MODE).map(id => {
                return {
                  value: Number(id),
                  label: WRITING_MODE[id].label
                }
              })}
              onChange={handleChange}
            ></Select>
          </FormItem>
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: 20,
          marginBottom: 20
        }}>
          <Button
            type={["primary", "block"]}
            onClick={handleSubmitForm}
            loading={loading}
            loadingText="创建中 ..."
          >确认新建</Button>
        </div>
      </div>
    </Dialog>
  )
}