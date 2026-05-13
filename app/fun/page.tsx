import { Suspense } from 'react'
import FunContent from './FunContent' // Move your current logic here

export default function FunPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FunContent />
    </Suspense>
  )
}
