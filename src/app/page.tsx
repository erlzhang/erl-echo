"use client";

import * as NetlifyIdentityWidget from "netlify-identity-widget"
import "@/styles/layout.css";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function App() {
  const router = useRouter();
  useEffect(() => {
    // router.push('/dashboard')
    NetlifyIdentityWidget.on('init', user => {
      if (!user) {
        NetlifyIdentityWidget.open();
      } else {
        router.push('/dashboard')
      }
    });

    NetlifyIdentityWidget.init();
  }, [])

  return (
    <></>
  )
}
