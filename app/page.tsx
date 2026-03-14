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
  const [time, setTime] = useState('2026-03-12T22:00') // default start time

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

  const validateRoll = () => {
    if (roll && !/^\d+$/.test(roll)) {
      alert('Roll number must contain digits only')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()
    setLoading(true)

    if (!email || !time) {
      alert('Please fill all required fields')
      setLoading(false)
      return
    }

    if (!validateRoll()) {
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
        alert('You already submitted this result.')
        setLoading(false)
        return
      }

      const { error: insertError } = await supabase
        .from('candidates')
        .insert([
          {
            email,
            roll_number: roll,
            exam_category: category,
            result_time: time
          }
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

    if (!validateRoll()) return

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

      const candidateTime = candidate.result_time

      const { count } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true })
        .eq('exam_category', category)
        .lt('result_time', candidateTime)

      const calculatedRank = (count ?? 0) + 1

      setRank(calculatedRank)

    } catch (err) {

      console.error(err)
      alert('Error checking rank')

    }

    setLoading(false)

  }

  return (

    <div style={{
      backgroundColor: '#f5f7fb',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: 'Arial'
    }}>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#003366' }}>
          ✈ Indigo JFO Rank Estimator
        </h1>
        <p style={{ color: '#555' }}>
          {totalSubmissions} candidates have already submitted results
        </p>
      </div>

      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
      }}>

        <div style={{ marginBottom: '20px', textAlign: 'center' }}>

          <button
            onClick={() => setMode('submit')}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              background: '#003366',
              color: 'white',
              border: 'none',
              borderRadius: '6px'
            }}
          >
            Submit Result
          </button>

          <button
            onClick={() => setMode('check')}
            style={{
              padding: '10px 20px',
              background: '#4da6ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px'
            }}
          >
            Check Rank
          </button>

        </div>

        {mode === 'submit' && (

          <form onSubmit={handleSubmit}>

            <label>Exam Category</label><br />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="CPL">CPL</option>
              <option value="Type Rated">Type Rated</option>
            </select>

            <br /><br />

            <label>Email</label><br />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />

            <br /><br />

            <label>Roll Number</label><br />
            <input
              type="number"
              inputMode="numeric"
              placeholder="Enter numeric roll number"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />

            <br /><br />

            <label>Result Time</label><br />
            <input
              type="datetime-local"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              min="2026-03-12T22:00"
              max="2026-03-12T24:00"
              style={{ width: '100%', padding: '8px' }}
            />

            <br /><br />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#003366',
                color: 'white',
                border: 'none',
                borderRadius: '6px'
              }}
            >
              {loading ? 'Submitting...' : 'Submit & Estimate Rank'}
            </button>

          </form>

        )}

        {mode === 'check' && (

          <div>

            <label>Exam Category</label><br />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="CPL">CPL</option>
              <option value="Type Rated">Type Rated</option>
            </select>

            <br /><br />

            <label>Roll Number</label><br />
            <input
              type="number"
              inputMode="numeric"
              placeholder="Enter numeric roll number"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />

            <br /><br />

            <button
              onClick={handleCheckRank}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#4da6ff',
                color: 'white',
                border: 'none',
                borderRadius: '6px'
              }}
            >
              {loading ? 'Checking...' : 'Check Rank'}
            </button>

          </div>

        )}

        {rank && (

          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: '#ecfdf5',
            border: '1px solid #bbf7d0',
            borderRadius: '10px',
            textAlign: 'center'
          }}>

            <h2>Your Estimated Rank</h2>

            <h1 style={{ fontSize: '40px' }}>
              #{rank}
            </h1>

            {percentile !== null &&
              <p>Percentile: {percentile}%</p>
            }

            <p>Total submissions: {totalSubmissions}</p>

          </div>

        )}

        {leaderboard.length > 0 && (

          <div style={{ marginTop: '40px' }}>

            <h3>Top 10 Fastest Results</h3>

            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>

              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '8px' }}>Rank</th>
                  <th style={{ padding: '8px' }}>Result Time</th>
                </tr>
              </thead>

              <tbody>

                {leaderboard.map((c, idx) => {

                  const isUser = c.roll_number === roll

                  return (

                    <tr
                      key={idx}
                      style={{
                        background: isUser ? '#d1fae5' : 'white'
                      }}
                    >

                      <td style={{ padding: '8px' }}>
                        {idx + 1}
                      </td>

                      <td style={{ padding: '8px' }}>
                        {c.result_time}
                      </td>

                    </tr>

                  )

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  )

}