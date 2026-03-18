'use client'

import NavBar from '../../../components/NavBar'
import RegisterButton from '../../components/RegisterButton'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 font-sans">
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-indigo-900 text-center mb-8 tracking-tight">
          Indigo ADAPT Test Registration
        </h1>

        <section className="mb-8 p-6 bg-indigo-100 rounded-lg border border-indigo-300 text-indigo-900">
          <p className="font-semibold mb-4">
            Why join the 5-day ADAPT Workshop?
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              The actual test requires <strong>special hardware</strong> with sensitivity different from practice.
            </li>
            <li>
              Hands-on practice to familiarize yourself with the real ADAPT hardware.
            </li>
            <li>
              Exposure to <strong>questions used during the actual exam</strong> and tips to excel.
            </li>
            <li>
              Improve your confidence and readiness for ADAPT test day.
            </li>
          </ul>
        </section>

        <section className="mb-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200 text-indigo-900">
          <p className="mb-2 font-semibold">Contact & Registration:</p>
          <p>WhatsApp / Call: <strong>+91 90821 00685</strong></p>
          <p className="mt-2">Registration Fees: ₹15,000 (Limited Slots Available)</p>
          <p>5-Day Workshop Fees: ₹20,000 (Includes hands-on practice, tips, tricks, exam simulation & actual ADAPT questions)</p>
          <p className="mt-2 font-bold">Total: ₹35,000</p>
        </section>

         <div className="text-center mt-6">
    {/* Place the button here */}
    <RegisterButton href="https://wa.me/919082100685" />
          <p className="text-sm text-indigo-700 mt-2">
            Due to special hardware and sensitivity differences, we recommend joining the 5-day workshop
            to prepare for the actual ADAPT test.
          </p>
        </div>
      </main>
    </div>
  )
}