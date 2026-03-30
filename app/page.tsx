'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [airline, setAirline] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  }

  const handleCreateApplication = async () => {
    if (!airline || !category) return alert('Select all fields')

    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('applications').insert([
      {
        user_id: user?.id,
        airline,
        category,
        stage: 'Applied'
      }
    ])

    window.location.href = '/dashboard'
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      {!user ? (
        // 🔐 LOGIN VIEW
        <div className="text-center max-w-md w-full">
          <h1 className="text-4xl font-bold mb-4">
            JFO Rank
          </h1>

          <p className="text-gray-400 mb-8">
            Track your airline application. See where you stand.
          </p>

          <button
            onClick={handleLogin}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Continue with Google
          </button>
        </div>
      ) : (
        // ✈️ ONBOARDING VIEW
        <div className="max-w-md w-full">

          <h2 className="text-2xl font-semibold mb-6 text-center">
            Start Tracking
          </h2>

          {/* Airline */}
          <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-400">
              Select Airline
            </label>
            <select
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700"
            >
              <option value="">Choose</option>
              <option value="IndiGo">IndiGo</option>
              <option value="Air India Express">Air India Express</option>
            </select>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block mb-2 text-sm text-gray-400">
              Your Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700"
            >
              <option value="">Choose</option>
              <option value="Cadet">Cadet</option>
              <option value="CPL">CPL Holder</option>
              <option value="Type Rated">Type Rated</option>
            </select>
          </div>

          <button
            onClick={handleCreateApplication}
            className="w-full bg-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-500 transition"
          >
            Continue
          </button>

        </div>
      )}

    </div>
  )
}
