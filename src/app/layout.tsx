import Header from '@/components/header'
import "@/styles/layout.css";
import AuthContextProvider from "@/contexts/authContext";

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
          <Header></Header>
          <AuthContextProvider>
            <div className="body">
              {children}
            </div>
          </AuthContextProvider>
        </div>
      </body>
    </html>
  )
}
