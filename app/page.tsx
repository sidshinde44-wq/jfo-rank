'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import NavBar from '../components/NavBar'

// app/page.tsx
export default function Home() {
  return <div>NEW HOMEPAGE</div>
}
export default function Home() {
  const [mode, setMode] = useState<'submit' | 'check' | 'update'>('submit')
  const [email, setEmail] = useState('')
  const [roll, setRoll] = useState('')
  const [category, setCategory] = useState<'CPL' | 'Type Rated'>('CPL')
  const [time, setTime] = useState('')
  const [adaptReceived, setAdaptReceived] = useState<'yes' | 'no' | ''>('')
  const [adaptDate, setAdaptDate] = useState('')
  const [rank, setRank] = useState<number | null>(null)
  const [updateId, setUpdateId] = useState<number | null>(null)
  const [totalCPL, setTotalCPL] = useState(0)
  const [totalTR, setTotalTR] = useState(0)
  const [leaderboardCPL, setLeaderboardCPL] = useState<any[]>([])
  const [leaderboardTR, setLeaderboardTR] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [batch, setBatch] = useState<number | null>(null)
  const [percentile, setPercentile] = useState<number | null>(null)


  const resetForm = () => {
    setEmail('')
    setRoll('')
    setTime('')
    setAdaptReceived('')
    setAdaptDate('')
    setUpdateId(null)
    setRank(null)
    setBatch(null)
    setPercentile(null)
  }

  const fetchStats = async () => {
    const { count: cpl } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('exam_category', 'CPL')

	const handleLogin = async () => {
      await supabase.auth.signInWithOAuth({
       provider: 'google'
  })
}

    const { count: tr } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('exam_category', 'Type Rated')

    setTotalCPL(cpl ?? 0)
    setTotalTR(tr ?? 0)
  }

  const fetchLeaderboards = async () => {
    const { data: cpl } = await supabase
      .from('candidates')
      .select('roll_number,result_time')
      .eq('exam_category', 'CPL')
      .order('result_time', { ascending: true })
      .limit(10)

    const { data: tr } = await supabase
      .from('candidates')
      .select('roll_number,result_time')
      .eq('exam_category', 'Type Rated')
      .order('result_time', { ascending: true })
      .limit(10)

    setLeaderboardCPL(cpl || [])
    setLeaderboardTR(tr || [])
  }

    const calculateStats = async (userTime: string, cat: 'CPL' | 'Type Rated') => {
    const { count: better } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('exam_category', cat)
      .lt('result_time', userTime)

    const { count: total } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('exam_category', cat)

    const r = (better ?? 0) + 1
    const b = Math.ceil(r / 50)
    const p = total ? ((total - r) / total) * 100 : 0

    setRank(r)
    setBatch(b)
    setPercentile(parseFloat(p.toFixed(1)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    if (!email || !roll || !time || !adaptReceived) return setMessage('⚠️ Please fill all required fields')
    setLoading(true)

    const { data: existing } = await supabase
      .from('candidates')
      .select('*')
      .eq('roll_number', roll)
      .eq('exam_category', category)
      .limit(1)

    if (existing && existing.length > 0) {
      setMessage('⚠️ Already submitted. Use Check Rank.')
      setLoading(false)
      return
    }

    await supabase.from('candidates').insert([
      {
        email,
        roll_number: roll,
        exam_category: category,
        result_time: time,
        adapt_received: adaptReceived === 'yes',
        adapt_date: adaptReceived === 'yes' ? adaptDate : null,
      },
    ])

    await calculateStats(time, category)
    await fetchStats()
    await fetchLeaderboards()
    setMessage('✅ Submitted successfully')
    setLoading(false)
  }

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    if (!roll && !email) return setMessage('⚠️ Enter Email or Roll')
    setLoading(true)

    const { data } = await supabase
      .from('candidates')
      .select('*')
      .or(`roll_number.eq.${roll},email.eq.${email}`)
      .eq('exam_category', category)
      .limit(1)

    if (!data || data.length === 0) {
      setMessage('❌ No record found')
      setLoading(false)
      return
    }

    const user = data[0]
    setAdaptReceived(user.adapt_received ? 'yes' : 'no')
    setAdaptDate(user.adapt_date || '')
    await calculateStats(user.result_time, user.exam_category)
    setMessage('✅ Record found')
    setLoading(false)
  }

  const handleFetchForUpdate = async () => {
    setMessage('')
    if (!roll) return setMessage('⚠️ Enter Roll Number')
    setLoading(true)

    const { data } = await supabase
      .from('candidates')
      .select('*')
      .eq('roll_number', roll)
      .eq('exam_category', category)
      .limit(1)

    if (!data || data.length === 0) {
      setMessage('❌ No record found')
      setLoading(false)
      return
    }

    const user = data[0]
    setUpdateId(user.id)
    setEmail(user.email || '')
    setTime(user.result_time || '')
    setAdaptReceived(user.adapt_received ? 'yes' : 'no')
    setAdaptDate(user.adapt_date || '')
    setMessage('✅ Data loaded. You can edit now.')
    setLoading(false)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    if (!updateId) return setMessage('⚠️ Fetch record first')
    setLoading(true)

    await supabase
      .from('candidates')
      .update({
        email,
        roll_number: roll,
        exam_category: category,
        result_time: time,
        adapt_received: adaptReceived === 'yes',
        adapt_date: adaptReceived === 'yes' ? adaptDate : null,
      })
      .eq('id', updateId)

    await calculateStats(time, category)
    await fetchStats()
    await fetchLeaderboards()
    setMessage('✅ Updated successfully')
    setLoading(false)
  }

  useEffect(() => {
    fetchStats()
    fetchLeaderboards()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 font-sans">
      {/* Top navigation bar */}
      <NavBar />

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <h1 className="text-4xl font-bold text-indigo-900 text-center mb-10 tracking-tight">
          Indigo JFO Merit Rank
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-indigo-200/80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform">
            <p className="text-indigo-900 font-semibold text-lg">CPL Candidates</p>
            <p className="text-3xl font-bold mt-2">{totalCPL}</p>
          </div>
          <div className="bg-indigo-200/80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform">
            <p className="text-indigo-900 font-semibold text-lg">Type Rated Candidates</p>
            <p className="text-3xl font-bold mt-2">{totalTR}</p>
          </div>
        </div>

        {/* Link to ADAPT Practice */}
        <div className="text-center mb-8">
          <Link
            href="/adapt-practice"
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform"
          >
            Go to ADAPT Practice
          </Link>
        </div>

        {/* Mode buttons */}
        <div className="flex gap-4 justify-center mb-6">
          {['submit', 'check', 'update'].map((m: any) => (
            <button
              key={m}
              onClick={() => { setMode(m); resetForm() }}
              className={`px-6 py-3 rounded-full font-medium text-white transition-colors duration-200 ${
                mode === m ? 'bg-indigo-700 shadow-lg' : 'bg-indigo-400 hover:bg-indigo-600'
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Message */}
        {message && <div className="mb-4 text-center text-indigo-800">{message}</div>}

        {/* Form */}
        <form onSubmit={mode === 'submit' ? handleSubmit : mode === 'check' ? handleCheck : handleUpdate} className="space-y-4 max-w-xl mx-auto">
          <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full p-3 border border-indigo-300 rounded-lg">
            <option value="CPL">CPL</option>
            <option value="Type Rated">Type Rated</option>
          </select>

          <input className="w-full p-3 border border-indigo-300 rounded-lg" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full p-3 border border-indigo-300 rounded-lg" placeholder="Roll Number" value={roll} onChange={(e) => setRoll(e.target.value)} />

          {mode !== 'check' && (
            <input type="datetime-local" className="w-full p-3 border border-indigo-300 rounded-lg" value={time} onChange={(e) => setTime(e.target.value)} />
          )}

          {(mode === 'submit' || updateId) && (
            <>
              <select className="w-full p-3 border border-indigo-300 rounded-lg" value={adaptReceived} onChange={(e) => setAdaptReceived(e.target.value as any)}>
                <option value="">ADAPT?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {adaptReceived === 'yes' && (
                <input type="date" className="w-full p-3 border border-indigo-300 rounded-lg" value={adaptDate} onChange={(e) => setAdaptDate(e.target.value)} />
              )}
            </>
          )}

          {mode === 'update' && !updateId && (
            <button type="button" onClick={handleFetchForUpdate} className="w-full p-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 font-medium transition-colors">
              Fetch My Data
            </button>
          )}

          {(mode !== 'update' || updateId) && (
            <button type="submit" disabled={loading} className="w-full p-3 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-semibold transition-colors">
              {loading ? 'Processing...' : mode === 'submit' ? 'Submit' : mode === 'check' ? 'Check Rank' : 'Update'}
            </button>
          )}
        </form>

        {/* Rank display */}
        {rank && batch && percentile !== null && (
	  <div className="mt-8 p-5 bg-indigo-100 rounded-xl shadow text-center text-indigo-900 space-y-2">

 	   <div className="text-xl font-bold">
  	    Your Rank: {rank}
  	  </div>

  	  <div>
  	    Batch: <b>{batch}</b> ({(batch - 1) * 50 + 1}–{batch * 50})
  	  </div>

	    <div>
 	     Percentile Score: <b>{percentile}%</b>
  	  </div>

	    <div className="mt-3 text-yellow-700 font-medium">
	      ADAPT calls have not started yet
	    </div>

 	   <div className="text-sm text-gray-600">
 	     Earlier batches are typically called first once ADAPT begins.
 	   </div>

	  </div>
  )}

        {/* Leaderboards */}
        <div className="mt-10 max-w-xl mx-auto space-y-3">
          <h3 className="text-indigo-900 font-semibold text-lg">CPL Top 10</h3>
          {leaderboardCPL.map((c, i) => (
            <div key={i} className="p-3 bg-indigo-50 rounded-xl shadow hover:shadow-lg transition-shadow">{i + 1}. {c.result_time}</div>
          ))}

          <h3 className="text-indigo-900 font-semibold text-lg mt-6">Type Rated Top 10</h3>
          {leaderboardTR.map((c, i) => (
            <div key={i} className="p-3 bg-indigo-50 rounded-xl shadow hover:shadow-lg transition-shadow">{i + 1}. {c.result_time}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
