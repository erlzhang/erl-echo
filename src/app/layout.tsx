import Header from '@/components/header'
import "@/styles/layout.css";
import AuthContextProvider from "@/contexts/authContext";
import { useRouter, usePathname } from "next/navigation";

export const metadata = {
  title: 'Echo',
  description: 'Books Content Management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <AuthContextProvider>
            <Header></Header>
            <div className="body">
              {children}
            </div>
          </AuthContextProvider>
        </div>
      </body>
    </html>
  )
}
