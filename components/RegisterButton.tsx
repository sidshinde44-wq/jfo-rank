'use client'

type RegisterButtonProps = {
  href?: string
}

export default function RegisterButton({ href }: RegisterButtonProps) {
  return (
    <a
      href={href || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold inline-block"
    >
      Register Now
    </a>
  )
}