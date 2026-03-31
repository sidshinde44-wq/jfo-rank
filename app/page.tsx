'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [airline, setAirline] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)

      if (user) {
        // Optional: redirect directly if already onboarded
        // router.push('/dashboard')
      }
    }

    checkUser()
  }, [])

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/dashboard`
      }
    })

    if (error) console.error(error.message)
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

    router.push('/dashboard')
  }

  if (loading) return null

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">

      {/* NAVBAR */}
      <nav className="w-full px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold tracking-tight">Jforank</h1>
        {!user && (
          <button
            onClick={handleGoogleLogin}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Continue with Google
          </button>
        )}
      </nav>

      {/* NOT LOGGED IN */}
      {!user ? (
        <>
          {/* HERO */}
          <section className="flex-1 flex items-center justify-center px-6">
            <div className="max-w-xl w-full text-center">

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Track your pilot hiring journey
              </h2>

              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Cadet • CPL • Type Rated pipelines across airlines — all in one place
              </p>

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition shadow-sm"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>

              <p className="text-xs text-gray-400 mt-4">
                Built for Indian aviation aspirants
              </p>
            </div>
          </section>

          {/* PIPELINE */}
          <section className="px-6 pb-16">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border p-6">

                <p className="text-sm text-gray-500 mb-4 text-center">
                  Example hiring pipeline
                </p>

                <div className="flex flex-wrap justify-center gap-3 text-xs sm:text-sm">
                  {[
                    'Written',
                    'ADAPT',
                    'GDPI',
                    'Medical',
                    'TR',
                    'SIM',
                    'Line Training'
                  ].map((stage, index) => (
                    <div key={stage} className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg">
                        {stage}
                      </span>
                      {index !== 6 && (
                        <span className="text-gray-300">→</span>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="text-center text-xs text-gray-400 pb-6">
            © {new Date().getFullYear()} Jforank
          </footer>
        </>
      ) : (
        // ✈️ ONBOARDING
        <section className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-sm border">

            <h2 className="text-xl font-semibold mb-6 text-center">
              Start Tracking
            </h2>

            <div className="mb-4">
              <label className="block mb-2 text-sm text-gray-500">
                Select Airline
              </label>
              <select
                value={airline}
                onChange={(e) => setAirline(e.target.value)}
                className="w-full p-3 rounded-lg border"
              >
                <option value="">Choose</option>
                <option value="IndiGo">IndiGo</option>
                <option value="Air India Express">Air India Express</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm text-gray-500">
                Your Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-lg border"
              >
                <option value="">Choose</option>
                <option value="Cadet">Cadet</option>
                <option value="CPL">CPL Holder</option>
                <option value="Type Rated">Type Rated</option>
              </select>
            </div>

            <button
              onClick={handleCreateApplication}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Continue
            </button>

          </div>
        </section>
      )}

    </main>
  )
}