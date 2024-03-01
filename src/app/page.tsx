"use client";
import "@/styles/layout.css";
import Image from 'next/image'

export default function App() {

  return (
    <>
      <div className="welcome">
        <Image src="/quill-pen.svg" alt="logo" width="100" height="100" />
        <h1>Have Fun Writing !</h1>
      </div>
    </>
  )
}