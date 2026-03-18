'use client'

import NavBar from '../../components/NavBar'
import Link from 'next/link'

export default function AdaptPractice() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 font-sans">
      {/* Top Navigation */}
      <NavBar />

      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-indigo-900 text-center mb-10 tracking-tight">
          ADAPT 2 Online Assessment: Candidate Overview
        </h1>

        {/* Module 1 - APQ */}
        <section className="mb-10 bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-indigo-900">1. ADAPT Personality Questionnaire (APQ)</h2>
            <Link
              href="/adapt-practice/apq"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition"
            >
              Practice
            </Link>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-indigo-800">
            <li><strong>Purpose:</strong> Evaluates your personality, values, behavior, and attitudes.</li>
            <li><strong>Time:</strong> No strict time limit; aim for 40–60 minutes.</li>
            <li><strong>Format:</strong> 11 sections with preference comparisons, agreement scales, and specific preference selection.</li>
            <li><strong>Strategy:</strong> Give your first reaction honestly; do not try to guess "the right answer".</li>
          </ul>
        </section>

        {/* Module 2 - KTE */}
        <section className="mb-10 bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-indigo-900">2. English - Advanced Comprehension (Kaplan Test of English)</h2>
            <Link
              href="/adapt-practice/kte"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition"
            >
              Practice
            </Link>
          </div>
          <p className="text-indigo-800 mb-2">
            Provided by Kaplan (KTE), delivered anonymously through the ADAPT platform. Kaplan does not receive your personal data.
          </p>
          <h3 className="text-indigo-900 font-semibold mt-3 mb-1">Test Mechanics</h3>
          <ul className="list-disc pl-5 space-y-2 text-indigo-800">
            <li><strong>Adaptive Nature:</strong> Questions adapt based on your previous answers.</li>
            <li><strong>Timing:</strong> Average 60 min (min 45, max 90).</li>
            <li><strong>Section Timing:</strong> Listening, Reading, Grammar sections are untimed individually.</li>
            <li><strong>Completion:</strong> Each section ends when proficiency is assessed.</li>
          </ul>
          <h3 className="text-indigo-900 font-semibold mt-3 mb-1">Core Proficiency Areas</h3>
          <ul className="list-disc pl-5 space-y-2 text-indigo-800">
            <li><strong>Listening Skills:</strong> Interpret messages accurately.</li>
            <li><strong>Reading Comprehension:</strong> Process and integrate text meaningfully.</li>
            <li><strong>Grammar:</strong> Apply sentence structural rules correctly.</li>
          </ul>
          <h3 className="text-indigo-900 font-semibold mt-3 mb-1">Critical Candidate Instructions</h3>
          <ul className="list-disc pl-5 space-y-2 text-indigo-800">
            <li>Do not click "Home", "Symbiotics Adapt", or "Logout".</li>
            <li>Put away phones/dictionaries; use blank paper for notes; headphones required.</li>
            <li>Answer all questions before finishing; you will return to the ADAPT system automatically.</li>
          </ul>
        </section>

        {/* Module 3 - Cognitive Foundation */}
        <section className="mb-10 bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-indigo-900">3. Cognitive Foundation Testing</h2>
            <Link
              href="/adapt-practice/cognitive"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition"
            >
              Practice
            </Link>
          </div>
          <p className="text-indigo-800 mb-3">Duration: ~30 minutes; multiple-choice across six core areas:</p>
          <table className="w-full border border-indigo-200 rounded-xl overflow-hidden text-indigo-800 mb-4">
            <thead className="bg-indigo-200 text-indigo-900">
              <tr>
                <th className="p-2 text-left">Topic</th>
                <th className="p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-t border-indigo-200">
                <td className="p-2 font-semibold">Numerical Reasoning</td>
                <td className="p-2">Algebra, sequences, conversions, speed/distance/time, percentages.</td>
              </tr>
              <tr className="bg-indigo-50 border-t border-indigo-200">
                <td className="p-2 font-semibold">Verbal Reasoning</td>
                <td className="p-2">Analyzing written info, anagrams, synonyms/antonyms, aviation acronyms.</td>
              </tr>
              <tr className="bg-white border-t border-indigo-200">
                <td className="p-2 font-semibold">Spatial Relationship</td>
                <td className="p-2">Mental rotation/reflection of images (shown for 5 seconds).</td>
              </tr>
              <tr className="bg-indigo-50 border-t border-indigo-200">
                <td className="p-2 font-semibold">Abstract Reasoning</td>
                <td className="p-2">Recognizing patterns and similarities between shapes/grids.</td>
              </tr>
              <tr className="bg-white border-t border-indigo-200">
                <td className="p-2 font-semibold">Perceptual Speed</td>
                <td className="p-2">Matching sequences and sorting data quickly (reaction time recorded).</td>
              </tr>
              <tr className="bg-indigo-50 border-t border-indigo-200">
                <td className="p-2 font-semibold">Working Memory</td>
                <td className="p-2">Retaining and retrieving short-term memory (dot memory, counting tasks, etc.).</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Module 4 - FAST */}
        <section className="mb-10 bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-indigo-900">4. FAST (Future Aptitude Selection Tool)</h2>
            <Link
              href="/adapt-register"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded shadow transition"
            >
              Register
            </Link>
          </div>
          <p className="text-indigo-800 mb-2">Duration: ~15 minutes. Requires multitasking with multiple simultaneous tasks:</p>
          <ul className="list-disc pl-5 space-y-2 text-indigo-800">
            <li>Cockpit Monitoring: Watch flight recording and listen to ATC.</li>
            <li>Flight Path: Use arrow keys to divert aircraft from blocks.</li>
            <li>Reporting: Press <span className="font-bold text-green-700">GREEN</span> for aircraft, <span className="font-bold text-red-600">RED</span> for waypoints.</li>
            <li>Cognitive Questions: Rapid-fire math, verbal logic, memory.</li>
          </ul>
        </section>

        {/* Module 5 - Coordination */}
        <section className="mb-10 bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-indigo-900">5. Coordination & Control (Pedals)</h2>
            <Link
              href="/adapt-register"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded shadow transition"
            >
              Register
            </Link>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-indigo-800">
            <li>Objective: Keep a ball centered on a crosshair within a tray for 3 minutes.</li>
            <li>Controls: Joystick vertical (y-axis), pedals horizontal (x-axis).</li>
            <li>Note: DGCA regulations require foot pedals in India.</li>
          </ul>
        </section>

        {/* Module 6 - Flight Test Generation 2 */}
        <section className="mb-10 bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-indigo-900">6. Flight Test Generation 2</h2>
            <Link
              href="/adapt-register"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded shadow transition"
            >
              Register
            </Link>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-indigo-800">
            <li>Introduction Stage: Learn joystick & throttle for basic maneuvers.</li>
            <li>Assessment Stage: Fly a path between waypoints while maintaining altitude & speed.</li>
          </ul>
          <p className="text-indigo-800 mt-2"><strong>Key Instruments:</strong></p>
          <ul className="list-disc pl-8 space-y-1 text-indigo-800">
            <li>Airspeed: Measured in knots.</li>
            <li>Altitude: Measured in feet.</li>
            <li>Heading: Rotating compass (e.g., "3" = 30°, "33" = 330°).</li>
          </ul>
        </section>
      </main>
    </div>
  )
}