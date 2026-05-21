'use client'

export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import FunContent from './FunContent'

export default function FunPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center">
        <p className="text-purple-600 font-medium">Loading fun zone...</p>
      </div>
    }>
      <FunContent />
    </Suspense>
  )
}