import "@/styles/form.css"
import React from "react"
import { FiLoader } from "react-icons/fi";

export const FormItem = (
  { children, label, inline }:
  {
    children: React.ReactElement,
    label: string,
    inline: boolean
  }
) => {
  return (
    <div className={`form-item${inline ? ' form-item-inline': ''}`}>
      <label htmlFor="name">{ label }</label>
      <div className="form-item-content">
        { children }
      </div>
    </div>
  )
}

export const Input = (
  {name, onChange, type, value, style, disabled, innerRef, onBlur}:
  {
    name: string,
    onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
    type: string,
    value: string | number,
    style: object,
    disabled: boolean,
    innerRef: string,
    onBlur: React.FocusEventHandler<HTMLInputElement>
  }
) => {
  return (
    <div className="input" style={style}>
      {
        type === 'textarea' ?
        <textarea
          ref={innerRef}
          name={name}
          className="form-control"
          onChange={onChange}
          required
          value={value}
          disabled={disabled}
        >{ value }</textarea> :
        <input
          ref={innerRef}
          type={type || 'text'}
          name={name}
          className="form-control"
          onChange={onChange}
          required
          value={value}
          disabled={disabled}
          onBlur={onBlur}
        ></input>
      }
      
    </div>
  )
}

export const Button = (
  { children, type, onClick, style, loading, loadingText }:
  {
    children: React.ReactElement | string,
    type: string|Array<string>,
    onClick: React.MouseEventHandler<HTMLDivElement>,
    loading: boolean,
    loadingText: String,
    style: any | null
  }
) => {
  type = type || 'default'
  let claStr = 'btn';
  if (Array.isArray(type)) {
    claStr += type.map(item => ` btn-${item}`).join('');
  } else {
    claStr += ` btn-${type}`
  }

  if (loading) {
    claStr += ' loading';
  }

  const handleClick = (e: any) => {
    if (loading) {
      return;
    }

    onClick && onClick(e);
  }
  return (
    <div
      className={claStr}
      onClick={handleClick}
      style={style}
    >
      {
        loading ?
        <>
          <FiLoader/>
          {loadingText || 'loading'}...
        </>
        : children

      }
    </div>
  )
}