'use client'

import { useState } from 'react'

export interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  faqs: FaqItem[]
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleIndex = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index
          const contentId = `faq-panel-${index}`
          const triggerId = `faq-trigger-${index}`

          return (
            <div
              key={faq.question}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 transition-shadow hover:shadow-xl"
            >
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                id={triggerId}
                className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-2xl"
                aria-expanded={isOpen}
                aria-controls={contentId}
              >
                <span className="text-xl font-semibold text-gray-900">{faq.question}</span>
                <span
                  className={`mt-1 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-transform ${
                    isOpen ? 'rotate-180 bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50'
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div
                id={contentId}
                role="region"
                aria-labelledby={triggerId}
                className={`px-6 text-gray-600 leading-relaxed transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[1200px] pb-6 pt-2' : 'max-h-0 pb-0 pt-0 overflow-hidden'
                }`}
              >
                <p className="text-base">{faq.answer}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
