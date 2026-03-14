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

  const fetchTotalSubmissions = async () => {
    const { count } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('exam_category', category)

    setTotalSubmissions(count ?? 0)
  }

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('candidates')
      .select('roll_number, result_time')
      .eq('exam_category', category)
      .order('result_time', { ascending: true })
      .limit(10)

    if (!error && data) setLeaderboard(data)
  }

  useEffect(() => {
    fetchTotalSubmissions()
    fetchLeaderboard()

    const channel = supabase
      .channel('public:candidates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'candidates' },
        (payload) => {
          if (payload.new.exam_category === category) {
            setTotalSubmissions((prev) => prev + 1)
            fetchLeaderboard()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }

  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!email || !category || !time) {
      alert('Please fill all required fields')
      setLoading(false)
      return
    }

    try {

      const { data: existing } = await supabase
        .from('candidates')
        .select('*')
        .eq('roll_number', roll)
        .eq('exam_category', category)

      if (existing && existing.length > 0) {
        alert('You have already submitted this exam result.')
        setLoading(false)
        return
      }

      const { error: insertError } = await supabase
        .from('candidates')
        .insert([
          { email, roll_number: roll, exam_category: category, result_time: time }
        ])

      if (insertError) {
        alert('Error submitting data')
        setLoading(false)
        return
      }

      const { count } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true })
        .eq('exam_category', category)
        .lt('result_time', time)

      const newRank = (count ?? 0) + 1
      setRank(newRank)

      const total = totalSubmissions + 1
      const newPercentile = (1 - newRank / total) * 100
      setPercentile(Math.round(newPercentile))

      alert(`Submission successful! Your estimated rank is ${newRank}`)

      fetchLeaderboard()

    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    }

    setLoading(false)
  }

  const handleCheckRank = async () => {

    if (!roll) {
      alert('Enter roll number')
      return
    }

    setLoading(true)

    try {

      const { data: candidate, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('roll_number', roll)
        .eq('exam_category', category)
        .single()

      if (error || !candidate) {
        alert('No submission found')
        setLoading(false)
        return
      }

      const time = candidate.result_time

      const { count } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true })
        .eq('exam_category', category)
        .lt('result_time', time)

      const calculatedRank = (count ?? 0) + 1

      setRank(calculatedRank)

    } catch (err) {
      console.error(err)
      alert('Error checking rank')
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', fontFamily: 'Arial' }}>

      <h1>Indigo JFO Rank Estimator</h1>
      <p>Submit your written exam result timing to estimate your approximate merit ranking.</p>

      {/* Mode Switch */}

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setMode('submit')}>
          Submit Result
        </button>

        <button
          style={{ marginLeft: '10px' }}
          onClick={() => setMode('check')}
        >
          Check Rank
        </button>
      </div>

      {/* Submit Mode */}

      {mode === 'submit' && (

        <form onSubmit={handleSubmit}>

          <label>Exam Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="CPL">CPL</option>
            <option value="Type Rated">Type Rated</option>
          </select>

          <br /><br />

          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <br /><br />

          <label>Roll Number (optional)</label>
          <input
            type="text"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
          />

          <br /><br />

          <label>Result Time</label>
          <input
            type="datetime-local"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <br /><br />

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit & Estimate Rank'}
          </button>

        </form>

      )}

      {/* Check Rank Mode */}

      {mode === 'check' && (

        <div>

          <label>Exam Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="CPL">CPL</option>
            <option value="Type Rated">Type Rated</option>
          </select>

          <br /><br />

          <label>Roll Number</label>
          <input
            type="text"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
          />

          <br /><br />

          <button onClick={handleCheckRank} disabled={loading}>
            {loading ? 'Checking...' : 'Check Rank'}
          </button>

        </div>

      )}

      {/* Results */}

      {rank && (

        <div style={{
          marginTop: '30px',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>

          <h2>Your Estimated Rank: {rank}</h2>

          {percentile !== null &&
            <p>Approximate Percentile: {percentile}%</p>
          }

          <p>Total submissions in {category}: {totalSubmissions}</p>

        </div>

      )}

      {/* Leaderboard */}

      {leaderboard.length > 0 && (

        <div style={{ marginTop: '40px' }}>

          <h3>Top 10 Fastest Submissions ({category})</h3>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left'
          }}>

            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ccc', padding: '5px' }}>Rank</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: '5px' }}>Result Time</th>
              </tr>
            </thead>

            <tbody>

              {leaderboard.map((c, idx) => {

                const isUser = c.roll_number === roll

                return (

                  <tr key={idx} style={{ backgroundColor: isUser ? '#d1e7dd' : 'transparent' }}>

                    <td style={{ borderBottom: '1px solid #eee', padding: '5px' }}>
                      {idx + 1}
                    </td>

                    <td style={{ borderBottom: '1px solid #eee', padding: '5px' }}>
                      {c.result_time}
                    </td>

                  </tr>

                )

              })}

            </tbody>

          </table>

          {rank && rank > 10 && (

            <p style={{
              marginTop: '10px',
              fontWeight: 'bold',
              color: '#0f5132'
            }}>
              Your Rank: {rank} (not in top 10)
            </p>

          )}

        </div>

      )}

    </div>
  )
}