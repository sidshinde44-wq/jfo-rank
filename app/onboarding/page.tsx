'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Category = 'cadet' | 'cpl' | 'tr'
type Airline = 'indigo' | 'aix'

const pipelines: Record<Airline, Record<Category, string[]>> = {
  indigo: {
    cadet: ['Written', 'ADAPT', 'GDPI', 'Medical', 'CPL', 'TR', 'SIM Check', 'Line Training'],
    cpl: ['Written', 'ADAPT', 'GDPI', 'TR', 'Medical', 'SIM Check', 'Line Training'],
    tr: ['Written', 'ADAPT', 'GDPI', 'SIM Check', 'Medical', 'Line Training'],
  },
  aix: {
    cadet: ['Screening', 'Interview', 'Medical', 'Training'],
    cpl: ['Screening', 'Interview', 'TR', 'Medical', 'Line Training'],
    tr: ['Screening', 'Interview', 'SIM Check', 'Line Training'],
  }
}

export default function Onboarding() {
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [category, setCategory] = useState<Category | null>(null)
  const [airline, setAirline] = useState<Airline | null>(null)
  const [stageIndex, setStageIndex] = useState<number | null>(null)

  const stages = category && airline ? pipelines[airline][category] : []

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !category || !airline || stageIndex === null) return

    const { error } = await supabase.from('applications').insert({
      user_id: user.id,
      airline,
      category,
      stage_name: stages[stageIndex],
      stage_index: stageIndex,
      stage_updated_at: new Date().toISOString()
    })

    if (!error) {
      router.push('/dashboard')
    } else {
      alert('Error saving data')
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
        
        <h1 className="text-xl font-semibold mb-4 text-center">
          Set up your profile
        </h1>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <p className="mb-3 font-medium">Select Category</p>
            {['cadet', 'cpl', 'tr'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c as Category)
                  setStep(2)
                }}
                className="w-full mb-2 py-2 rounded-lg border hover:bg-black hover:text-white"
              >
                {c.toUpperCase()}
              </button>
            ))}
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <p className="mb-3 font-medium">Select Airline</p>
            {['indigo', 'aix'].map((a) => (
              <button
                key={a}
                onClick={() => {
                  setAirline(a as Airline)
                  setStep(3)
                }}
                className="w-full mb-2 py-2 rounded-lg border hover:bg-black hover:text-white"
              >
                {a.toUpperCase()}
              </button>
            ))}

            <button
              onClick={() => setStep(1)}
              className="text-sm mt-3 text-gray-500"
            >
              ← Back
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <p className="mb-3 font-medium">Select Current Stage</p>

            {stages.map((stage, index) => (
              <button
                key={index}
                onClick={() => setStageIndex(index)}
                className={`w-full mb-2 py-2 rounded-lg border ${
                  stageIndex === index
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {stage}
              </button>
            ))}

            <button
              onClick={handleSubmit}
              disabled={stageIndex === null}
              className="w-full mt-4 bg-black text-white py-2 rounded-lg disabled:opacity-50"
            >
              Continue
            </button>

            <button
              onClick={() => setStep(2)}
              className="text-sm mt-3 text-gray-500"
            >
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}
