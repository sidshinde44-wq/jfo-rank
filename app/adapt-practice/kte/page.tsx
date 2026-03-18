'use client'

import NavBar from '../../../components/NavBar'
import RegisterButton from '../../../components/RegisterButton'

export default function KTEPractice() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 font-sans">
      {/* Top Navigation */}
      <NavBar />

      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-indigo-900 text-center mb-10 tracking-tight">
          Kaplan Test of English (KTE) Practice
        </h1>

        <p className="mb-6 text-indigo-800">
          The Kaplan Test of English (KTE) is adaptive; the difficulty of questions changes based on your performance. 
          Below are practice examples for the Grammar and Reading sections.
        </p>

        {/* Grammar Practice */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-3">1. Grammar Practice (Sentence Structure & Rules)</h2>
          <p className="text-indigo-800 mb-2">Directions: Choose the correct word or phrase to complete the sentence.</p>
          <ol className="list-decimal pl-5 space-y-2 text-indigo-800">
            <li>The Captain requested that all cabin crew _________ for a briefing before boarding started. (a) meet (b) meets (c) meeting (d) will meet</li>
            <li>If the weather _________ cleared earlier, the flight would not have been delayed. (a) has (b) had (c) would have (d) was</li>
            <li>The technician is responsible _________ maintaining the hydraulic systems on the A320. (a) with (b) to (c) for (d) of</li>
            <li>Hardly _________ the aircraft reached its cruising altitude when the turbulence began. (a) did (b) has (c) had (d) was</li>
            <li>The new safety regulations are _________ more stringent than the previous ones. (a) very (b) much (c) many (d) so</li>
          </ol>
        </section>

        {/* Reading Comprehension */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-3">2. Reading Comprehension (Meaning & Interpretation)</h2>
          <p className="text-indigo-800 mb-2">
            Passage: "Standard Operating Procedures (SOPs) are the backbone of aviation safety. While they provide a clear framework for routine operations, their true value is realized during emergency scenarios. Pilots are trained to rely on these checklists to reduce cognitive load, ensuring that critical steps are not overlooked when stress levels are high. However, SOPs cannot account for every unique variable, requiring pilots to maintain a high level of situational awareness alongside procedural adherence."
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-indigo-800">
            <li>According to the passage, what is the primary benefit of using checklists during an emergency? (a) To replace the need for situational awareness (b) To ensure all routine operations are completed (c) To decrease the mental burden on the pilot (d) To account for every unique variable in the flight</li>
            <li>What does the author suggest about the relationship between SOPs and situational awareness? (a) SOPs are more important than situational awareness (b) Following SOPs perfectly makes situational awareness unnecessary (c) Both are necessary because SOPs have limitations (d) Situational awareness is only needed when SOPs fail</li>
          </ol>
        </section>

        {/* Answer Key */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-3">Answer Key & Explanations</h2>
          <p className="text-indigo-800">
            <strong>Grammar:</strong> (a) meet, (b) had, (c) for, (c) had, (b) much
          </p>
          <p className="text-indigo-800">
            <strong>Reading:</strong> (c) To decrease the mental burden on the pilot, (c) Both are necessary because SOPs have limitations
          </p>
        </section>

        {/* Registration Note */}
        <section className="mb-8 p-4 bg-indigo-100 rounded-lg border border-indigo-300 text-indigo-900">
          <p className="font-semibold mb-2">Register for actual Indigo ADAPT test set:</p>
          <p>WhatsApp/Call: +91 90821 00685</p>
          <p>Registration fees: ₹15,000 (Limited Slots Available)</p>
          <p>5-day workshop fees: ₹20,000 (Includes actual Indigo ADAPT paper discussion, tips, tricks, exam simulation & questions)</p>
          <p className="mt-2 font-bold">Total: ₹35,000</p>
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