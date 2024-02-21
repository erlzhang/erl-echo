import Dialog from "@/components/ui/dialog";
import { FormItem, Input, Button } from "@/components/ui/form";
import Select from "@/components/ui/select";
import React, { useState } from "react";
import {
  CATEGORY,
  WRITING_MODE
} from '@/const/book';
import Book from '@/models/Book';

export default function NewBookDialog(
  { onClose, onSubmit }
) {
  const [form, setForm] = useState({})
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
    Book.new(form)
      .then(book => {
        setLoading(false)
        onSubmit?.call(null, book.slug)
      })
  }

  return (
    <Dialog
      title="Create New Book"
      onClose={() => onClose?.call()}
      style={{
        width: "600px"
      }}
    >
      <div className="new-book-form">
        <FormItem
          label="Title"
        >
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
          ></Input>
        </FormItem>
        <FormItem
          label="Slug"
        >
          <Input
            name="slug"
            value={form.slug}
            onChange={handleChange}
          ></Input>
        </FormItem>
        <div className="form-item form-item-row">
          <FormItem label="Category" inline={true}>
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
          <FormItem label="Writing Mode" inline={true}>
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
            loadingText="Submitting ..."
          >Enter New</Button>
        </div>
      </div>
    </Dialog>
  )
}