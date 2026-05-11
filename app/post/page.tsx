'use client'

import { useState, useRef } from 'react'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore } from '@/lib/store'

const categories = [
  { id: 'vehicles', name: 'Vehicles' },
  { id: 'property', name: 'Property' },
  { id: 'jobs', name: 'Jobs' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'labour', name: 'Labour' },
  { id: 'farmland', name: 'Farmland' },
  { id: 'services', name: 'Services' },
]

const locations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'Fujairah', 'Al Ain']

export default function PostPage() {
  const { isAuthenticated, setShowAuthModal, addListing } = useAppStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    price: '',
    description: '',
    location: 'Dubai',
    phone: '',
    photos: [] as string[],
    plan: 'free' as 'free' | 'featured' | 'urgent'
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    const newPhotos: string[] = []
    Array.from(files).slice(0, 8 - formData.photos.length).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          // Add watermark
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.drawImage(img, 0, 0)
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
              ctx.font = `bold ${Math.max(20, img.width / 20)}px Arial`
              ctx.textAlign = 'center'
              ctx.fillText('dubaikismag.com', img.width / 2, img.height - 30)
              setFormData(prev => ({
                ...prev,
                photos: [...prev.photos, canvas.toDataURL('image/jpeg', 0.8)]
              }))
            }
          }
          img.src = e.target.result as string
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.price.trim()) newErrors.price = 'Price is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    
    // Validate phone number (UAE format)
    const phoneRegex = /^(\+971|971|05|5)[0-9]{8,9}$/
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Enter a valid UAE phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    
    if (!validateForm()) return
    
    // Create listing
    const newListing = {
      id: Date.now().toString(),
      title: formData.title,
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      location: formData.location,
      emoji: getCategoryEmoji(formData.category),
      phone: formData.phone,
      whatsapp: formData.phone,
      description: formData.description,
      images: formData.photos,
      isFeatured: formData.plan !== 'free',
      featuredDays: formData.plan === 'featured' ? 7 : formData.plan === 'urgent' ? 14 : 0,
      views: 0
    }
    
    addListing(newListing)
    alert('Ad posted successfully!')
    
    // Reset form
    setFormData({
      category: '',
      title: '',
      price: '',
      description: '',
      location: 'Dubai',
      phone: '',
      photos: [],
      plan: 'free'
    })
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      vehicles: '🚗',
      property: '🏠',
      jobs: '💼',
      electronics: '📱',
      furniture: '🛋️',
      labour: '👷',
      farmland: '🌾',
      services: '🔧'
    }
    return emojis[category] || '📦'
  }

  const plans = [
    { id: 'free', name: 'FREE', price: 0, duration: '14 days' },
    { id: 'featured', name: 'FEATURED', price: 20, duration: 'Top of list', icon: '⭐' },
    { id: 'urgent', name: 'URGENT', price: 50, duration: '5x views', icon: '🚀' },
  ]

  return (
    <div className="min-h-screen bg-[#f8f7fc] pb-24">
      <Header />
      <TopTabs />

      <main className="px-4 py-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📝</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Post Your Ad</h1>
            <p className="text-sm text-gray-500">Reach 12,000+ buyers in UAE - post FREE today</p>
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={`w-full p-4 bg-white border rounded-xl text-gray-900 ${
              errors.category ? 'border-red-500' : 'border-gray-200'
            }`}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Ad Title */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Ad Title *</label>
          <input
            type="text"
            placeholder="e.g. Toyota Camry 2020 - Dubai Marina"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full p-4 bg-white border rounded-xl text-gray-900 placeholder-gray-400 ${
              errors.title ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Price (AED) *</label>
          <input
            type="number"
            placeholder="0 for free / negotiable"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className={`w-full p-4 bg-white border rounded-xl text-gray-900 placeholder-gray-400 ${
              errors.price ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
          <textarea
            rows={4}
            placeholder="Describe item, condition, availability..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full p-4 bg-white border rounded-xl text-gray-900 placeholder-gray-400 resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
          <select
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full p-4 bg-white border border-gray-200 rounded-xl text-gray-900"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Phone / WhatsApp */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Phone / WhatsApp *</label>
          <input
            type="tel"
            placeholder="+971 50 000 0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full p-4 bg-white border rounded-xl text-gray-900 placeholder-gray-400 ${
              errors.phone ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Photos */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Photos</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />
          
          {formData.photos.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 mb-2">
              {formData.photos.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      photos: prev.photos.filter((_, idx) => idx !== i)
                    }))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    x
                  </button>
                </div>
              ))}
              {formData.photos.length < 8 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400"
                >
                  +
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl text-center bg-gray-50"
            >
              <span className="text-4xl block mb-2">📷</span>
              <p className="text-gray-500">Tap to add up to 8 photos</p>
            </button>
          )}
          <p className="text-xs text-gray-400 mt-1">Watermark will be added automatically</p>
        </div>

        {/* Select Plan */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Select Plan</label>
          <div className="grid grid-cols-3 gap-3">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setFormData({ ...formData, plan: plan.id as typeof formData.plan })}
                className={`p-4 rounded-xl border-2 text-center transition-colors ${
                  formData.plan === plan.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <p className="text-xs text-gray-500 font-medium mb-1 flex items-center justify-center gap-1">
                  {plan.icon && <span>{plan.icon}</span>}
                  {plan.name}
                </p>
                <p className="text-xl font-bold text-purple-600">AED {plan.price}</p>
                <p className="text-xs text-gray-400">{plan.duration}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-white font-bold text-lg"
        >
          Post Ad Now - {formData.plan === 'free' ? 'FREE' : `AED ${plans.find(p => p.id === formData.plan)?.price}`}
        </button>
      </main>

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}
