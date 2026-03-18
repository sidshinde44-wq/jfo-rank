// app/layout.tsx
import './globals.css'  // <-- ADD THIS
import React from 'react'
import { Analytics } from "@vercel/analytics/next"
import NavBar from '../components/NavBar'

export const metadata = {
  title: 'Indigo JFO Rank Estimator',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
