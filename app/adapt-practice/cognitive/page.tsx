'use client'

import NavBar from '../../../components/NavBar'
import RegisterButton from '../../../components/RegisterButton'

export default function CognitivePractice() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 font-sans">
      <NavBar />

      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-indigo-900 text-center mb-10 tracking-tight">
          Cognitive Foundation Testing – Practice
        </h1>

        <p className="mb-6 text-indigo-800">
          Based on the cognitive testing standards detailed in the ADAPT 2 handbook, here are practice questions for each of the core assessment areas.
        </p>

        {/* 1. Numerical Reasoning */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-3">1. Numerical Reasoning</h2>
          <ul className="list-disc pl-5 space-y-2 text-indigo-800">
            <li>Algebra: If 3x + 12 = 30, what is x?</li>
            <li>Sequences: What is the next number: 24, 32, 40, 48, ...?</li>
            <li>Conversions: How many miles in 80 km? (8 km = 5 miles)</li>
            <li>Speed/Distance/Time: Aircraft at 240 knots. Distance in 15 minutes?</li>
            <li>Percentages: Tuition ₹15,000 increased by 12%, new total?</li>
          </ul>
        </section>

        {/* 2. Verbal Reasoning */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-3">2. Verbal Reasoning</h2>
          <ul className="list-disc pl-5 space-y-2 text-indigo-800">
            <li>Antonyms: Opposite of "Regular"? (a) Normal (b) Usual (c) Unusual</li>
            <li>Synonyms: Synonym of "Abbreviate"? (a) Lengthen (b) Shorten (c) Create</li>
            <li>Aviation Acronyms: "ATC" stands for?</li>
            <li>Anagrams: Rearrange "ACT" to form a feline (CAT)</li>
            <li>Logic: All pilots wear uniforms. Siddhesh is a pilot. Does he wear a uniform? (True/False/Cannot Tell)</li>
          </ul>
        </section>

        {/* 3. Spatial Relationship */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-3">3. Spatial Relationship Reasoning</h2>
          <ul className="list-disc pl-5 space-y-2 text-indigo-800">
            <li>Reflection: Triangle pointing left reflected vertically, new direction?</li>
            <li>Rotation: Clock at 3:00 rotated 90° clockwise, what time appears?</li>
            <li>Cubes: Flat 2D "cross" folded into cube. Which sides opposite?</li>
            <li>Heading: Flying North, turn 270° right. New heading?</li>
            <li>Radars: Dot in upper-right, screen flipped horizontally. New quadrant?</li>
          </ul>
        </section>

        {/* 4. Abstract Reasoning */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-3">4. Abstract Reasoning</h2>
          <ul className="list-disc pl-5 space-y-2 text-indigo-800">
            <li>Odd One Out: Four grids, one odd number of dots. Select odd image.</li>
            <li>Sequence Completion: Square shading sequence: 1, 2, 3 sides shaded. Fourth?</li>
            <li>Grid Logic: 3×3 grid rotation pattern. Identify missing bottom-right shape.</li>
            <li>Analogy: Circle is to sphere as square is to _____?</li>
            <li>Pattern Recognition: Identify figure containing a specific hidden shape.</li>
          </ul>
        </section>

        {/* 5. Perceptual Speed & Accuracy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-3">5. Perceptual Speed & Accuracy</h2>
          <ul className="list-disc pl-5 space-y-2 text-indigo-800">
            <li>Number Matching: Which is exactly "46296"? (a) 46297 (b) 46396 (c) 46296 (d) 45295</li>
            <li>Letter Matching: Matches "FLIGHT"? (a) FILGHT (b) FLIGHT (c) FLYGHT</li>
            <li>Cockpit Dials: Four dials shown. Which reads above 100 knots?</li>
            <li>Data Sorting: Flight numbers IGO101, IGO202, IGO105… Lowest numerical value?</li>
            <li>Matrix Scanning: How many times does letter "X" appear in a grid of letters?</li>
          </ul>
        </section>

        {/* 6. Working Memory */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-3">6. Working Memory</h2>
          <ul className="list-disc pl-5 space-y-2 text-indigo-800">
            <li>Dot Memory: 5×5 grid with 3 red dots shown 5s. Click squares where dots were.</li>
            <li>Counting Task: Screen with blue circles & red squares for 5s. Count red squares.</li>
            <li>Memory Span: Sequence 7, 2, 9, 4 shown. Type in reverse order.</li>
            <li>Radar Location: Two aircraft symbols appear 5s. Identify positions on blank map.</li>
            <li>Match Image: Shown a cockpit instrument setting. Pick the exact match from 4 options.</li>
          </ul>
        </section>

        {/* Registration Note */}
        <section className="mb-8 p-4 bg-indigo-100 rounded-lg border border-indigo-300 text-indigo-900">
          <p className="font-semibold mb-2">Register for actual Indigo ADAPT test set:</p>
          <p>WhatsApp/Call: +91 90821 00685</p>
          <p>Registration fees: ₹15,000 (Limited Slots Available)</p>
          <p>5-day workshop fees: ₹20,000 (Includes actual Indigo ADAPT paper discussion, tips, tricks, exam simulation & questions)</p>
          <p className="mt-2 font-bold">Total: ₹35,000</p>
	 <div className="text-center mt-6">
            <RegisterButton href="https://wa.me/919082100685" /> {/* <-- WhatsApp redirect */}
            <p className="text-sm text-indigo-700 mt-2" />
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