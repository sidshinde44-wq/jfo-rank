'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserAndApps()
  }, [])

  const getUserAndApps = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    setUser(user)

    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)

    setApplications(data || [])
    setLoading(false)
  }

  const addApplication = async () => {
    const { data: { user } } = await supabase.auth.getUser()

  await supabase.from('applications').insert([
    {
      user_id: user?.id,
      airline: 'IndiGo',
      category: 'Cadet',
      stage: 'Written'
    }
  ])

  getUserAndApps()
}

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Welcome {user.email}</h1>

      <h2>Your Applications</h2>

      {applications.map(app => (
        <div key={app.id} className="border p-4 mb-2">
          <p><b>Airline:</b> {app.airline}</p>
          <p><b>Category:</b> {app.category}</p>
          <p><b>Stage:</b> {app.stage}</p>
        </div>
      ))}
      <button onClick={addApplication}>
        Add Application
      </button>
    </div>
  )
}
