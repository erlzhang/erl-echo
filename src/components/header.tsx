import Image from 'next/image'
import Link from 'next/link';

export default function() {
  return (
    <header className="header">
        <div className="logo">
          <Link href="/">
            <Image src="/quill-pen.svg" alt="logo" width="40" height="40" />
            Echo
          </Link>
        </div>      
    </header>
  )
}