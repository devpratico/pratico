import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './colors.css'
import './globals.css'


export const luciole = localFont({
  src: [
    {
      path: '../public/fonts/Luciole-Regular.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../public/fonts/Luciole-Bold.woff2',
      weight: 'bold',
      style: 'normal',
    },
    {
      path: '../public/fonts/Luciole-Italic.woff2',
      weight: 'normal',
      style: 'italic',
    },
    {
      path: '../public/fonts/Luciole-BoldItalic.woff2',
      weight: 'bold',
      style: 'italic',
    },
  ],
})


export const metadata: Metadata = {
  title: 'Pratico',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="pratico">
      <body className={luciole.className}>{children}</body>
    </html>
  )
}
