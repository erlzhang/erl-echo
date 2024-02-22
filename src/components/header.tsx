"use client"

import Image from 'next/image'
import Link from 'next/link';
import { Button } from './ui/form';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';

export default function() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="header">
        <div className="logo">
          <Link href="/">
            <Image src="/quill-pen.svg" alt="logo" width="40" height="40" />
            Echo
          </Link>
        </div>
        <div className="user-info">
          Hello, {user.name}!
          <Button
            onClick={logout}
            style={{
              textDecoration: 'underline'
            }}
          >LogOut</Button>
        </div>
    </header>
  )
}
