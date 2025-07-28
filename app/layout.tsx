import './globals.css'
import type { Metadata } from 'next'
//import { Inter } from 'next/font/google'
import { AuthContextProvider } from '@/app/context/auth-context';
import {  Toaster } from 'react-hot-toast';

//const inter = Inter({ subsets: ['latin'] })
const app_name:any = process.env.NEXT_PUBLIC_APP_NAME;

export const metadata: Metadata = {
  title: app_name,
  description: 'Welcome to Your Debt Elimination Assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body className={''/*inter.className*/}>
      <Toaster/>
      <AuthContextProvider>        
        {children}        
      </AuthContextProvider>
      </body>
    </html>
  )
}
