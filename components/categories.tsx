"use client"

import Link from 'next/link'
import { categories } from '@/lib/store'

export function Categories() {
  return (
    <section className="py-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-lg font-bold text-gray-900">Browse Categories</h2>
        <Link href="/browse" className="text-purple-600 text-sm font-medium">All &rsaquo;</Link>
      </div>
      <div className="grid grid-cols-4 gap-3 px-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/browse?category=${category.id}`}
            className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all"
          >
            <span className="text-3xl">{category.emoji}</span>
            <span className="text-xs font-medium text-center text-gray-700">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
