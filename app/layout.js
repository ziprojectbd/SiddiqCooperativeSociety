import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { SessionProvider } from '@/components/SessionProvider'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Somobay Somiti Management System',
  description: 'A comprehensive management system for somobay somiti',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-gray-900">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className + " bg-gray-900"}>
        <SessionProvider>
          <LanguageProvider>
            <SidebarProvider>
              <Header />
              <div className="pt-16 bg-gray-900 min-h-screen">
                {children}
              </div>
            </SidebarProvider>
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
