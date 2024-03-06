"use client";
import "@/styles/layout.css";
import Image from 'next/image'

export default function App() {
  return (
    <>
      <div className="welcome">
        <Image src="/write.svg" alt="logo" width="450" height="450" />
        <h1>Have Fun Writing !</h1>
      </div>
    </>
  )
}