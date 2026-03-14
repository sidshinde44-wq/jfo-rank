	'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Candidate {
  roll_number: string | null
  result_time: string
}

export default function Home() {
  const [mode, setMode] = useState<'submit' | 'check'>('submit')

  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('CPL')
  const [roll, setRoll] = useState('')
  const [time, setTime] = useState('')
  const [rank, setRank] = useState<number | null>(null)
  const [percentile, setPercentile] = useState<number | null>(null)
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0)
  const [leaderboard, setLeaderboard] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)

  const [cplCount, setCplCount] = useState(0)
  const [trCount, setTrCount] = useState(0)
  const [fastestTime, setFastestTime] = useState<string | null>(null)
  const [latestTime, setLatestTime] = useState<string | null>(null)

  // Fetch live stats
  const fetchStats = async () => {
    const { count } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
    setTotalSubmissions(count ?? 0)

    const { count: cpl } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('exam_category', 'CPL')
    setCplCount(cpl ?? 0)

    const { count: tr } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('exam_category', 'Type Rated')
    setTrCount(tr ?? 0)

    const { data: fastest } = await supabase
      .from('candidates')
      .select('result_time')
      .order('result_time', { ascending: true })
      .limit(1)
    if (fastest && fastest.length > 0) setFastestTime(fastest[0].result_time)

    const { data: latest } = await supabase
      .from('candidates')
      .select('result_time')
      .order('created_at', { ascending: false })
      .limit(1)
    if (latest && latest.length > 0) setLatestTime(latest[0].result_time)
  }

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('candidates')
      .select('roll_number,result_time')
      .eq('exam_category', category)
      .order('result_time', { ascending: true })
      .limit(10)
    if (data) setLeaderboard(data)
  }

  // Calculate rank & percentile
  const calculateRank = async (userTime: string) => {
    const { count } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('exam_category', category)
      .lt('result_time', userTime)

    const newRank = (count ?? 0) + 1
    setRank(newRank)

    const { count: total } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('exam_category', category)

    if (total) {
      const p = (1 - newRank / total) * 100
      setPercentile(Math.round(p))
    }
  }

  // ✅ Async-safe useEffect
  useEffect(() => {
    const init = async () => {
      await fetchStats()
      await fetchLeaderboard()
    }
    init()

    const channel = supabase
      .channel('public:candidates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'candidates' },
        () => {
          fetchStats()
          fetchLeaderboard()
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [category])

  // Submit result
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: existing } = await supabase
      .from('candidates')
      .select('*')
      .eq('roll_number', roll)
      .eq('exam_category', category)

    if (existing && existing.length > 0) {
      alert('Result already submitted. Use Check My Rank.')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('candidates')
      .insert([{ email, roll_number: roll, exam_category: category, result_time: time }])

    if (!error) {
      await calculateRank(time)
      fetchStats()
      fetchLeaderboard()
    }

    setLoading(false)
  }

  // Check rank
  const handleCheckRank = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data } = await supabase
      .from('candidates')
      .select('result_time')
      .eq('exam_category', category)
      .or(`roll_number.eq.${roll},email.eq.${email}`)
      .limit(1)

    if (!data || data.length === 0) {
      alert('No submission found')
      return
    }

    await calculateRank(data[0].result_time)
  }

  // Rank band helper
  const getRankBand = (r: number) => {
    if (r <= 10) return '🥇 Gold'
    if (r <= 25) return '🥈 Silver'
    if (r <= 50) return '🥉 Bronze'
    return 'Participant'
  }

  return (
    <div style={{ maxWidth: '750px', margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>Indigo JFO Rank Estimator</h1>

      {/* LIVE STATS PANEL */}
      <div style={{ background: '#f5f7fa', padding: 15, borderRadius: 8, marginBottom: 25 }}>
        <h3>Live Exam Stats</h3>
        <p>Total Submissions: {totalSubmissions}</p>
        <p>CPL Candidates: {cplCount}</p>
        <p>Type Rated: {trCount}</p>
        {fastestTime && <p>Fastest Result Time: {fastestTime}</p>}
        {latestTime && <p>Latest Submission Time: {latestTime}</p>}
      </div>

      {/* Mode Selection */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setMode('submit')} style={{ marginRight: 10 }}>
          Submit Result
        </button>
        <button onClick={() => setMode('check')}>Check My Rank</button>
      </div>

      {/* Form */}
      <form onSubmit={mode === 'submit' ? handleSubmit : handleCheckRank}>
        <label>Exam Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="CPL">CPL</option>
          <option value="Type Rated">Type Rated</option>
        </select>

        <br /><br />

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <br /><br />

        <label>Roll Number</label>
        <input type="text" value={roll} onChange={(e) => setRoll(e.target.value)} />

        <br /><br />

        {mode === 'submit' && (
          <>
            <label>Result Time</label>
            <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} required />
            <br /><br />
          </>
        )}

        <button type="submit" disabled={loading}>
          {mode === 'submit' ? (loading ? 'Submitting...' : 'Submit Result') : 'Check My Rank'}
        </button>
      </form>

      {/* Rank Display */}
      {rank && (
        <div style={{ marginTop: 30, padding: 15, border: '1px solid #ddd', borderRadius: 8 }}>
          <h2>Your Rank: {rank}</h2>
          {percentile !== null && <p>Percentile: {percentile}%</p>}
          <p>Rank Band: {getRankBand(rank)}</p>
        </div>
      )}

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3>Top 10 Fastest ({category})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ccc', padding: 6 }}>Rank</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: 6 }}>Result Time</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((c, idx) => (
                <tr key={idx}>
                  <td style={{ padding: 6 }}>{idx + 1}</td>
                  <td style={{ padding: 6 }}>{c.result_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rank && rank > 10 && (
            <p style={{ marginTop: 10, fontWeight: 'bold', color: '#0f5132' }}>
              Your Rank: {rank} (not in top 10)
            </p>
          )}
        </div>
      )}
    </div>
  )
}