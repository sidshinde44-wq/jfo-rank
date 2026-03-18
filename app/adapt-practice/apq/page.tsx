'use client'

import NavBar from '../../../components/NavBar'
import RegisterButton from '../../../components/RegisterButton'

import { useState } from 'react'

type ForcedChoice = { question: string; optionA: string; optionB: string }
type LikertChoice = { question: string }
type BehavioralChoice = { question: string; options: string[] }

export default function APQPractice() {
  // Sample Questions (you can expand)
  const forcedChoices: ForcedChoice[] = [
    { question: 'Choose the statement more like you:', optionA: 'I enjoy working alone', optionB: 'I prefer working in a team' },
    { question: 'Choose the statement more like you:', optionA: 'I focus on the big picture', optionB: 'I focus on the fine details' },
    { question: 'Choose the statement more like you:', optionA: 'I am a quick decision-maker', optionB: 'I like to take my time to decide' },
    // Add all 17 questions here
  ]

  const likertChoices: LikertChoice[] = [
    { question: 'I enjoy theoretical discussions and debates.' },
    { question: 'I find it easy to stay focused on repetitive tasks.' },
    { question: 'I am rarely bothered by unexpected changes to my schedule.' },
    { question: 'I always double-check my work before submitting it.' },
    // Add all 17 questions here
  ]

  const behavioralChoices: BehavioralChoice[] = [
    { question: 'I prefer instructions to be:', options: ['Written in a manual', 'Delivered verbally', 'Pictorial/Diagram based', 'Demonstrated by someone'] },
    { question: 'When I am in a high-stress situation, I usually:', options: ['Slow down to ensure I do not make mistakes', 'Speed up to finish the task', 'Ask someone else to take over', 'Stop and re-evaluate the plan'] },
    { question: 'In a team project, my typical role is:', options: ['Creative idea generator', 'Scheduler', 'Technical worker', 'Conflict resolver'] },
    // Add all behavioral questions here
  ]

  // State to track answers (optional, could store in an array/object)
  const [answers, setAnswers] = useState({})

  const handleAnswer = (q: string, val: string) => {
    setAnswers({ ...answers, [q]: val })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 font-sans">
      <NavBar />

      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-indigo-900 text-center mb-10 tracking-tight">
          ADAPT Personality Questionnaire (APQ) - Practice
        </h1>

        {/* Type 1 - Forced Choice */}
        <section className="mb-10 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Type 1: Forced Choice (Preferences)</h2>
          {forcedChoices.map((q, idx) => (
            <div key={idx} className="mb-4 border-b border-indigo-200 pb-3">
              <p className="text-indigo-800 mb-2">{q.question}</p>
              <div className="flex gap-4 flex-wrap">
                <button
                  className={`px-3 py-1 rounded border hover:bg-indigo-100 ${
                    answers[q.question] === q.optionA ? 'bg-indigo-200' : ''
                  }`}
                  onClick={() => handleAnswer(q.question, q.optionA)}
                >
                  {q.optionA}
                </button>
                <button
                  className={`px-3 py-1 rounded border hover:bg-indigo-100 ${
                    answers[q.question] === q.optionB ? 'bg-indigo-200' : ''
                  }`}
                  onClick={() => handleAnswer(q.question, q.optionB)}
                >
                  {q.optionB}
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Type 2 - Likert Scale */}
        <section className="mb-10 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Type 2: Likert Scale (Agreement)</h2>
          {likertChoices.map((q, idx) => (
            <div key={idx} className="mb-4 border-b border-indigo-200 pb-3">
              <p className="text-indigo-800 mb-2">{q.question}</p>
              <div className="flex gap-3 flex-wrap">
                {['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'].map((opt) => (
                  <button
                    key={opt}
                    className={`px-3 py-1 rounded border hover:bg-indigo-100 ${
                      answers[q.question] === opt ? 'bg-indigo-200' : ''
                    }`}
                    onClick={() => handleAnswer(q.question, opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Type 3 - Behavioral Selection */}
        <section className="mb-10 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Type 3: Specific Selection (Behavioral)</h2>
          {behavioralChoices.map((q, idx) => (
            <div key={idx} className="mb-4 border-b border-indigo-200 pb-3">
              <p className="text-indigo-800 mb-2">{q.question}</p>
              <div className="flex gap-3 flex-wrap">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    className={`px-3 py-1 rounded border hover:bg-indigo-100 ${
                      answers[q.question] === opt ? 'bg-indigo-200' : ''
                    }`}
                    onClick={() => handleAnswer(q.question, opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Bottom Note */}
        <section className="mb-10 bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-400">
          <p className="text-yellow-900 font-semibold">
            Register for actual Indigo ADAPT test set, WhatsApp/Call <span className="font-mono">+91 90821 00685</span>.<br />
            Registration fees: ₹15,000 Limited Slots Available, 5-day workshop fees: ₹20,000.<br />
            Includes actual Indigo ADAPT paper discussion, tips, tricks, exam simulation & questions. Total: ₹35,000.
          </p>
	 <div className="text-center mt-8">
          <RegisterButton />
          <p className="text-sm text-indigo-700 mt-2">
            Due to special hardware and sensitivity differences, we recommend joining the 5-day workshop
            to prepare for the actual ADAPT test.
          </p>
        </div>
        </section>
      </main>
    </div>
  )
}