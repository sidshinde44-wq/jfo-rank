'use client'

import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Title */}
        <div className="text-2xl font-bold tracking-tight">
          Indigo JFO Rank
        </div>

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link
            href="/"
            className="hover:text-indigo-200 font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            href="/adapt-practice"
            className="hover:text-indigo-200 font-medium transition-colors"
          >
            ADAPT Practice
          </Link>
        </div>
      </div>
    </nav>
  )
}