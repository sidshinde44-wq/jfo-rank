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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 1️⃣ Check required fields
    if (!email || !category || !time) {
      alert("Please fill all required fields")
      setLoading(false)
      return
    }

    try {
      // 2️⃣ Duplicate check
      const { data: existing, error: fetchError } = await supabase
        .from('candidates')
        .select('*')
        .eq('roll_number', roll)
        .eq('exam_category', category)

      if (fetchError) {
        console.error(fetchError)
        alert("Error checking existing submissions")
        setLoading(false)
        return
      }

      if (existing && existing.length > 0) {
        alert("You have already submitted this exam result. Duplicate submissions are not allowed.")
        setLoading(false)
        return
      }

      // 3️⃣ Insert new submission
      const { error: insertError } = await supabase.from('candidates').insert([
        {
          email: email,
          exam_category: category,
          roll_number: roll,
          result_time: time,
        },
      ])

      if (insertError) {
        console.error(insertError)
        alert("Error submitting data")
        setLoading(false)
        return
      }

      // 4️⃣ Calculate rank
      const { count } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true })
        .eq('exam_category', category)
        .lt('result_time', time)

      const newRank = (count ?? 0) + 1
      setRank(newRank)
      alert(`Submission successful! Your estimated rank is ${newRank}`)

    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    }

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