// app/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('CPL')
  const [roll, setRoll] = useState('')
  const [time, setTime] = useState('')
  const [rank, setRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('candidates').insert([
      {
        email: email,
        exam_category: category,
        roll_number: roll,
        result_time: time,
      },
    ])

    if (error) {
      alert('Error submitting data')
      setLoading(false)
      return
    }

    const { count } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('exam_category', category)
      .lt('result_time', time)

    setRank(count + 1)
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>Indigo JFO Rank Estimator</h1>
      <p>Submit your written exam result timing to estimate your approximate merit ranking.</p>

      <form onSubmit={handleSubmit}>
        <label>Exam Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="CPL">CPL</option>
          <option value="Type Rated">Type Rated</option>
        </select>

        <br /><br />

        <label>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

        <br /><br />

        <label>Roll Number (optional)</label>
        <input type="text" value={roll} onChange={(e) => setRoll(e.target.value)} />

        <br /><br />

        <label>Result Time</label>
        <input type="datetime-local" required value={time} onChange={(e) => setTime(e.target.value)} />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit & Estimate Rank'}
        </button>
      </form>

      {rank && (
        <div style={{ marginTop: '30px' }}>
          <h2>Your Estimated Rank: {rank}</h2>
          <p>This estimate improves as more candidates submit their result timings.</p>
        </div>
      )}
    </div>
  )
}