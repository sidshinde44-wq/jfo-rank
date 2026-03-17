'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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

  // ------------------------- Helpers -------------------------
  const resetForm = () => {
    setEmail('')
    setRoll('')
    setTime('')
    setAdaptReceived('')
    setAdaptDate('')
    setUpdateId(null)
    setRank(null)
  }

  // ------------------------- Stats -------------------------
  const fetchStats = async () => {
    const { count: cpl } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('exam_category', 'CPL')

    const { count: tr } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('exam_category', 'Type Rated')

    setTotalCPL(cpl ?? 0)
    setTotalTR(tr ?? 0)
  }

  // ------------------------- Leaderboards -------------------------
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

  // ------------------------- Rank -------------------------
  const calculateRank = async (userTime: string, cat: 'CPL' | 'Type Rated') => {
    const { count } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('exam_category', cat)
      .lt('result_time', userTime)

    setRank((count ?? 0) + 1)
  }

  // ------------------------- Submit -------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!email || !roll || !time || !adaptReceived) {
      return setMessage('⚠️ Please fill all required fields')
    }

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

    await calculateRank(time, category)
    await fetchStats()
    await fetchLeaderboards()

    setMessage('✅ Submitted successfully')
    setLoading(false)
  }

  // ------------------------- Check -------------------------
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

    await calculateRank(user.result_time, user.exam_category)

    setMessage('✅ Record found')
    setLoading(false)
  }

  // ------------------------- Update Fetch -------------------------
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

  // ------------------------- Update -------------------------
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

    await calculateRank(time, category)
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
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold text-center mb-6">Indigo JFO Merit Rank</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded">CPL: {totalCPL}</div>
        <div className="bg-green-100 p-4 rounded">Type Rated: {totalTR}</div>
      </div>

      {/* Mode */}
      <div className="flex gap-3 mb-6">
        {['submit','check','update'].map((m:any)=> (
          <button
            key={m}
            onClick={() => { setMode(m); resetForm() }}
            className={`px-4 py-2 rounded ${mode===m ? 'bg-black text-white':'bg-gray-200'}`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Message */}
      {message && <div className="mb-4 text-sm">{message}</div>}

      {/* Form */}
      <form onSubmit={mode === 'submit' ? handleSubmit : mode === 'check' ? handleCheck : handleUpdate} className="space-y-4">
        <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full p-2 border rounded">
          <option value="CPL">CPL</option>
          <option value="Type Rated">Type Rated</option>
        </select>

        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Roll Number" value={roll} onChange={(e) => setRoll(e.target.value)} />

        {mode !== 'check' && (
          <input type="datetime-local" className="w-full p-2 border rounded" value={time} onChange={(e) => setTime(e.target.value)} />
        )}

        {(mode === 'submit' || updateId) && (
          <>
            <select className="w-full p-2 border rounded" value={adaptReceived} onChange={(e) => setAdaptReceived(e.target.value as any)}>
              <option value="">ADAPT?</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>

            {adaptReceived === 'yes' && (
              <input type="date" className="w-full p-2 border rounded" value={adaptDate} onChange={(e) => setAdaptDate(e.target.value)} />
            )}
          </>
        )}

        {mode === 'update' && !updateId && (
          <button type="button" onClick={handleFetchForUpdate} className="w-full bg-yellow-400 p-2 rounded">
            Fetch My Data
          </button>
        )}

        {(mode !== 'update' || updateId) && (
          <button type="submit" disabled={loading} className="w-full bg-black text-white p-2 rounded">
            {loading ? 'Processing...' : mode === 'submit' ? 'Submit' : mode === 'check' ? 'Check Rank' : 'Update'}
          </button>
        )}
      </form>

      {/* Rank */}
      {rank && (
        <div className="mt-6 p-4 bg-green-100 rounded text-center">
          Your Rank: <span className="font-bold">{rank}</span>
        </div>
      )}

      {/* Leaderboards */}
      <div className="mt-8">
        <h3 className="font-semibold mb-2">CPL Top 10</h3>
        {leaderboardCPL.map((c, i) => (
          <div key={i}>{i + 1}. {c.result_time}</div>
        ))}

        <h3 className="font-semibold mt-6 mb-2">Type Rated Top 10</h3>
        {leaderboardTR.map((c, i) => (
          <div key={i}>{i + 1}. {c.result_time}</div>
        ))}
      </div>
    </div>
  )
}
