"use client"

import Image from 'next/image'
import Link from 'next/link';
import { Button } from './ui/form';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';
import { CiLogout } from "react-icons/ci";
import { usePathname } from "next/navigation";

export default function() {
  const { user, logout } = useContext(AuthContext);
  const pathname = usePathname();
  console.log('user', user);

  return (
    <>
      {
        pathname !== '/' &&
        <header className="header">
          <div className="logo">
            <Link href="/dashboard">
              <Image src="/quill-pen.svg" alt="logo" width="40" height="40" />
              Echo
            </Link>
          </div>
          <div className="user-info">
            <img
              src="http://erlim.oss-cn-hongkong.aliyuncs.com/img/avatar.jpg"
              alt="avatar"
              className="avatar-img"
              width="30"
              height="30"
            />
            Hello, Erl!
            <Button
              onClick={logout}
              style={{
                textDecoration: 'underline'
              }}
            >
              <CiLogout/>
              退出登录
            </Button>
          </div>        
        </header>
      }
    </>
    
  )
}