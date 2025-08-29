import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Storiats - Alumni Community Platform',
  description: 'Storiats is the community OS that turns scattered alumni lists into living networks',
            icons: {
            icon: '/transparent.png',
            shortcut: '/transparent.png',
            apple: '/transparent.png',
          },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/transparent.png" type="image/png" />
        <link rel="shortcut icon" href="/transparent.png" type="image/png" />
        <link rel="apple-touch-icon" href="/transparent.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
