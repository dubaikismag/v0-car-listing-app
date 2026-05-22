'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore, categorySpecs, uaeLocations } from '@/lib/store'
import { ArrowLeft, X, Info } from 'lucide-react'

// Main Categories with subcategories
const mainCategories = [
  {
    id: 'Cars',
    name: 'Cars',
    emoji: '🚗',
    subcategories: ['New Cars', 'Used Cars', 'Car Parts', 'Car Accessories', 'Car Services'],
    specs: ['Make', 'Model', 'Year', 'Mileage', 'Transmission', 'Fuel Type', 'Color']
  },
  {
    id: 'Rooms',
    name: 'Real Estate',
    emoji: '🏢',
    subcategories: ['Apartments', 'Villas', 'Offices', 'Shops', 'Bed Spaces', 'Partitions'],
    specs: ['Bedrooms', 'Bathrooms', 'Sqft', 'Furnished/Unfurnished', 'Floor', 'Building Age']
  },
  {
    id: 'Jobs',
    name: 'Jobs',
    emoji: '💼',
    subcategories: ['Driving', 'Engineering', 'Healthcare', 'IT', 'Sales', 'Labour', 'Other'],
    specs: ['Job Title', 'Experience Required', 'Salary Range', 'Employment Type', 'Qualification']
  },
  {
    id: 'Services',
    name: 'Services',
    emoji: '🛠️',
    subcategories: ['Plumbing', 'Electrical', 'Painting', 'AC Tech', 'Cleaning', 'Moving', 'Tutoring', 'Other'],
    specs: ['Service Type', 'Experience', 'Availability', 'Service Area']
  },
  {
    id: 'Buy & Sell',
    name: 'Buy & Sell',
    emoji: '🛒',
    subcategories: ['Electronics', 'Furniture', 'Clothing', 'Books', 'Sports', 'Appliances', 'Other'],
    specs: ['Condition', 'Brand', 'Model', 'Age']
  },
  {
    id: 'Community',
    name: 'Community',
    emoji: '👥',
    subcategories: ['Events', 'Groups', 'Lost & Found', 'Help Needed', 'Classifieds'],
    specs: ['Event Type', 'Date', 'Time', 'Location Details']
  },
  {
    id: 'Wanted',
    name: 'Wanted',
    emoji: '❤️',
    subcategories: ['Looking for Items', 'Looking for Services', 'Looking for Housing', 'Looking for Jobs'],
    specs: ['What You Need', 'Budget', 'Urgency', 'Timeline']
  }
]

const priceTypes = [
  { id: 'fixed', name: 'Fixed Price' },
  { id: 'monthly', name: 'Per Month' },
  { id: 'yearly', name: 'Per Year' },
  { id: 'kg', name: 'Per KG' },
  { id: 'negotiable', name: 'Negotiable' },
]

const MAX_IMAGES = 8

export default function PostPage() {
  const router = useRouter()
  const { isAuthenticated, setShowAuthModal, addListing } = useAppStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    title: '',
    price: '',
    priceType: 'fixed',
    description: '',
    location: 'Dubai Marina',
    phone: '',
    photos: [] as string[],
    plan: 'free' as 'free' | 'featured' | 'urgent',
    specs: {} as Record<string, string>
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)

  // Get selected category object
  const selectedCategoryObj = mainCategories.find(c => c.id === formData.category)
  const currentSpecs = selectedCategoryObj?.specs || []

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    const remainingSlots = MAX_IMAGES - formData.photos.length
    if (remainingSlots <= 0) return
    
    Array.from(files).slice(0, remainingSlots).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
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
              ctx.fillText('DubaiKismag.com', img.width / 2, img.height - 30)
              ctx.strokeStyle = 'rgba(128, 0, 128, 0.5)'
              ctx.lineWidth = 2
              ctx.strokeText('DubaiKismag.com', img.width / 2, img.height - 30)
              
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
    if (!formData.subcategory) newErrors.subcategory = 'Subcategory is required'
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.price.trim()) newErrors.price = 'Price is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    
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
    
    const newListing = {
      id: Date.now().toString(),
      title: formData.title,
      price: parseFloat(formData.price) || 0,
      priceType: formData.priceType as 'fixed' | 'monthly' | 'yearly' | 'kg' | 'negotiable',
      category: formData.category,
      subcategory: formData.subcategory,
      location: formData.location,
      emoji: selectedCategoryObj?.emoji || '📦',
      phone: formData.phone,
      whatsapp: formData.phone,
      description: formData.description,
      images: formData.photos,
      specs: formData.specs,
      isFeatured: formData.plan !== 'free',
      featuredDays: formData.plan === 'featured' ? 7 : formData.plan === 'urgent' ? 14 : 0,
      views: 0,
      likes: 0,
      shares: 0,
      tags: formData.plan === 'featured' ? ['Featured'] : formData.plan === 'urgent' ? ['Urgent', 'Featured'] : [],
      timeAgo: 'Just now'
    }
    
    addListing(newListing)
    setShowSuccess(true)
    
    setTimeout(() => {
      setShowSuccess(false)
      router.push('/')
    }, 2000)
  }

  const plans = [
    { id: 'free', name: 'FREE', price: 0, duration: '14 days' },
    { id: 'featured', name: 'FEATURED', price: 20, duration: 'Top of list', icon: '⭐' },
    { id: 'urgent', name: 'URGENT', price: 50, duration: '5x views', icon: '🚀' },
  ]

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-24">
      <Header showSearch={false} />
      
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-40 mt-32">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Post Your Ad</h1>
      </div>

      <main className="px-4 py-4">
        <div className="flex items-center gap-3 mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
          <span className="text-3xl">📝</span>
          <div>
            <p className="text-sm text-purple-700">Reach 12,000+ buyers in UAE</p>
            <p className="text-xs text-purple-500">Post FREE today - quick approval</p>
          </div>
        </div>

        {/* Main Category Selection */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
          <div className="grid grid-cols-3 gap-2">
            {mainCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFormData({ ...formData, category: cat.id, subcategory: '', specs: {} })}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  formData.category === cat.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-2xl mb-1">{cat.emoji}</div>
                <p className="text-xs font-medium text-gray-900">{cat.name}</p>
              </button>
            ))}
          </div>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Subcategory Selection */}
        {formData.category && selectedCategoryObj && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Subcategory *</label>
            <div className="grid grid-cols-2 gap-2">
              {selectedCategoryObj.subcategories.map((subcat) => (
                <button
                  key={subcat}
                  onClick={() => setFormData({ ...formData, subcategory: subcat })}
                  className={`p-3 rounded-lg border-2 text-center text-sm transition-all ${
                    formData.subcategory === subcat
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {subcat}
                </button>
              ))}
            </div>
            {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
          </div>
        )}

        {/* Category-specific Specifications */}
        {currentSpecs.length > 0 && formData.category && (
          <div className="mb-4 p-4 bg-gray-50 rounded-xl">
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-500" />
              {selectedCategoryObj?.name} Details
            </label>
            <div className="grid grid-cols-2 gap-3">
              {currentSpecs.map((spec) => (
                <div key={spec}>
                  <label className="block text-xs text-gray-500 mb-1">{spec}</label>
                  <input
                    type="text"
                    placeholder={`Enter ${spec}`}
                    value={formData.specs[spec] || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      specs: { ...prev.specs, [spec]: e.target.value }
                    }))}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="0 for free / negotiable"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={`flex-1 p-4 bg-white border rounded-xl text-gray-900 placeholder-gray-400 ${
                errors.price ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            <select
              value={formData.priceType}
              onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
              className="p-4 bg-white border border-gray-200 rounded-xl text-gray-900"
            >
              {priceTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
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
          <label className="block text-sm font-semibold text-gray-900 mb-2">Location (UAE)</label>
          <select
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full p-4 bg-white border border-gray-200 rounded-xl text-gray-900"
          >
            {uaeLocations.map((loc) => (
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
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Photos <span className="text-gray-400 font-normal">(Max {MAX_IMAGES} images)</span>
          </label>
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
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {formData.photos.length < MAX_IMAGES && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400"
                >
                  <span className="text-2xl">+</span>
                  <span className="text-xs">{formData.photos.length}/{MAX_IMAGES}</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl text-center bg-gray-50"
            >
              <span className="text-4xl block mb-2">📷</span>
              <p className="text-gray-500">Tap to add up to {MAX_IMAGES} photos</p>
            </button>
          )}
          <div className="flex items-center gap-2 mt-2 p-2 bg-amber-50 rounded-lg">
            <span className="text-amber-500">💧</span>
            <p className="text-xs text-amber-700">Watermark &quot;DubaiKismag.com&quot; will be added automatically to protect your images</p>
          </div>
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
                <p className="text-xl font-bold text-purple-600">{plan.price === 0 ? 'FREE' : `AED ${plan.price}`}</p>
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

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full">
            <span className="text-6xl block mb-4">✅</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ad Posted!</h2>
            <p className="text-gray-500">Your ad is now live and visible to buyers.</p>
          </div>
        </div>
      )}

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}
