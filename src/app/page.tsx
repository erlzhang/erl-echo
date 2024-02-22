"use client";

import * as NetlifyIdentityWidget from "netlify-identity-widget"
import Header from '@/components/header'
import "@/styles/layout.css";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function App() {
  const router = useRouter();
  useEffect(() => {
    router.push('/dashboard')
    // NetlifyIdentityWidget.on('init', user => {
    //   if (!user) {
    //     NetlifyIdentityWidget.open();
    //   } else {
    //     router.push('/admin')
    //   }
    // });

    // NetlifyIdentityWidget.init();
  }, [])

  return (
    <></>
  )
}