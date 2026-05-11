"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { categories } from '@/lib/store'
import { 
  Car, 
  Home, 
  Smartphone, 
  Sofa,
  Shirt,
  Briefcase,
  Building,
  Users
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  car: Car,
  home: Home,
  smartphone: Smartphone,
  sofa: Sofa,
  shirt: Shirt,
  briefcase: Briefcase,
  building: Building,
  users: Users
}

const colorMap: Record<string, string> = {
  motors: 'bg-blue-500',
  property: 'bg-green-500',
  electronics: 'bg-purple-500',
  furniture: 'bg-orange-500',
  fashion: 'bg-pink-500',
  services: 'bg-teal-500',
  jobs: 'bg-indigo-500',
  community: 'bg-rose-500'
}

export function Categories() {
  const router = useRouter()

  return (
    <section className="py-6">
      <h2 className="text-lg font-semibold mb-4">Browse Categories</h2>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Briefcase
          const bgColor = colorMap[category.id] || 'bg-gray-500'
          
          return (
            <Button
              key={category.id}
              variant="ghost"
              className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-muted"
              onClick={() => router.push(`/browse?category=${category.id}`)}
            >
              <div className={`h-12 w-12 rounded-full ${bgColor} flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-medium text-center">{category.name}</span>
            </Button>
          )
        })}
      </div>
    </section>
  )
}
