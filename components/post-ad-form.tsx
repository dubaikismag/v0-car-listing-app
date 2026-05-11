"use client"

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore, categories, type Listing } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { addWatermark, validatePhoneNumber } from '@/lib/image-utils'
import { Upload, X, Loader2, AlertCircle, Plus } from 'lucide-react'

interface FormErrors {
  [key: string]: string
}

interface SpecField {
  key: string
  value: string
}

const categorySpecs: Record<string, string[]> = {
  Vehicles: ['Brand', 'Model', 'Year', 'Kilometers', 'Color', 'Fuel Type', 'Transmission'],
  Property: ['Bedrooms', 'Bathrooms', 'Size', 'Furnished', 'Floor', 'Parking'],
  Electronics: ['Brand', 'Model', 'Storage', 'RAM', 'Color', 'Condition'],
  Jobs: ['Position', 'Experience', 'Salary', 'Work Type'],
  Labour: ['Experience', 'Languages', 'Availability'],
  Furniture: ['Material', 'Condition', 'Dimensions'],
  Farmland: ['Size', 'Water', 'Soil Type']
}

export function PostAdForm() {
  const router = useRouter()
  const { user, openAuthModal } = useAuth()
  const addListing = useAppStore((state) => state.addListing)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const [errors, setErrors] = useState<FormErrors>({})

  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [priceType, setPriceType] = useState<'fixed' | 'monthly' | 'yearly' | 'kg'>('fixed')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [location, setLocation] = useState('Dubai')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [sameAsPhone, setSameAsPhone] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'featured' | 'urgent'>('free')
  const [specs, setSpecs] = useState<SpecField[]>([])

  const selectedCategory = categories.find((c) => c.id === category)

  // Handle image upload with watermark
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newProgress = Array(files.length).fill(0)
    setUploadProgress(newProgress)

    const newImages: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, images: 'Only image files are allowed' }))
        continue
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, images: 'Image size must be less than 5MB' }))
        continue
      }

      try {
        for (let p = 0; p <= 100; p += 20) {
          await new Promise((r) => setTimeout(r, 100))
          setUploadProgress((prev) => {
            const updated = [...prev]
            updated[i] = p
            return updated
          })
        }

        const watermarkedImage = await addWatermark(file)
        newImages.push(watermarkedImage)
      } catch (error) {
        console.error('Image processing error:', error)
        setErrors((prev) => ({ ...prev, images: 'Failed to process image' }))
      }
    }

    setImages((prev) => [...prev, ...newImages])
    setUploadProgress([])
    e.target.value = ''
  }, [])

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addSpec = () => {
    setSpecs((prev) => [...prev, { key: '', value: '' }])
  }

  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    setSpecs((prev) => {
      const updated = [...prev]
      updated[index][field] = value
      return updated
    })
  }

  const removeSpec = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!title.trim() || title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    }

    if (!description.trim() || description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }

    if (!price || parseFloat(price) < 0) {
      newErrors.price = 'Valid price is required'
    }

    if (!category) {
      newErrors.category = 'Category is required'
    }

    if (!location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhoneNumber(phone)) {
      newErrors.phone = 'Please enter a valid phone number (e.g., +971501234567)'
    }

    const whatsappNumber = sameAsPhone ? phone : whatsapp
    if (!whatsappNumber.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required'
    } else if (!validatePhoneNumber(whatsappNumber)) {
      newErrors.whatsapp = 'Please enter a valid WhatsApp number'
    }

    const validSpecs = specs.filter((s) => s.key.trim() && s.value.trim())
    if (validSpecs.length < 3) {
      newErrors.specs = 'Please add at least 3 specifications'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      openAuthModal()
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const specsObject: Record<string, string> = {}
      specs.forEach((spec) => {
        if (spec.key.trim() && spec.value.trim()) {
          specsObject[spec.key.trim()] = spec.value.trim()
        }
      })

      const categoryEmojis: Record<string, string> = {
        vehicles: '🚗',
        property: '🏠',
        jobs: '💼',
        labour: '👷',
        electronics: '📱',
        furniture: '🛋️',
        farmland: '🌾',
        more: '📦'
      }

      const newListing: Listing = {
        id: Math.random().toString(36).substring(7),
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        priceType: priceType === 'fixed' ? undefined : priceType,
        category: selectedCategory?.name || category,
        subcategory: subcategory || undefined,
        emoji: categoryEmojis[category] || '📦',
        location: location.trim(),
        phone: phone,
        whatsapp: sameAsPhone ? phone : whatsapp,
        images,
        specs: specsObject,
        isFeatured: selectedPlan !== 'free',
        featuredDays: selectedPlan === 'featured' ? 7 : selectedPlan === 'urgent' ? 14 : 0,
        badge: selectedPlan === 'urgent' ? 'HOT' : selectedPlan === 'featured' ? 'NEW' : undefined,
        views: 0
      }

      addListing(newListing)
      
      await new Promise((r) => setTimeout(r, 1000))
      
      router.push('/')
    } catch (error) {
      console.error('Submit error:', error)
      setErrors({ submit: 'Failed to post ad. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const suggestedSpecs = selectedCategory ? categorySpecs[selectedCategory.name] || [] : []

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setSubcategory('')
            const cat = categories.find((c) => c.id === e.target.value)
            if (cat) {
              const defaultSpecs = categorySpecs[cat.name] || []
              setSpecs(defaultSpecs.slice(0, 4).map((key) => ({ key, value: '' })))
            }
          }}
          className={`w-full p-3 rounded-xl border ${errors.category ? 'border-red-500' : 'border-gray-200'} bg-white text-gray-900`}
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      {/* Subcategory */}
      {selectedCategory && selectedCategory.subcategories && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Subcategory</label>
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900"
          >
            <option value="">-- Select Subcategory --</option>
            {selectedCategory.subcategories.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Ad Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Toyota Camry 2020 - Dubai Marina"
          className={`w-full p-3 rounded-xl border ${errors.title ? 'border-red-500' : 'border-gray-200'} bg-white`}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Price (AED) *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0 for free / negotiable"
            className={`w-full p-3 rounded-xl border ${errors.price ? 'border-red-500' : 'border-gray-200'} bg-white`}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Price Type</label>
          <select
            value={priceType}
            onChange={(e) => setPriceType(e.target.value as typeof priceType)}
            className="w-full p-3 rounded-xl border border-gray-200 bg-white"
          >
            <option value="fixed">Fixed</option>
            <option value="monthly">/month</option>
            <option value="yearly">/year</option>
            <option value="kg">/kg</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe item, condition, availability..."
          rows={4}
          className={`w-full p-3 rounded-xl border ${errors.description ? 'border-red-500' : 'border-gray-200'} bg-white`}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Location *</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={`w-full p-3 rounded-xl border ${errors.location ? 'border-red-500' : 'border-gray-200'} bg-white`}
        >
          <option value="Dubai">Dubai</option>
          <option value="Abu Dhabi">Abu Dhabi</option>
          <option value="Sharjah">Sharjah</option>
          <option value="Ajman">Ajman</option>
          <option value="RAK">RAK</option>
          <option value="Fujairah">Fujairah</option>
          <option value="Al Ain">Al Ain</option>
        </select>
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
      </div>

      {/* Phone / WhatsApp */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Phone / WhatsApp *</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+971 50 000 0000"
          className={`w-full p-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} bg-white`}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="sameAsPhone"
            checked={sameAsPhone}
            onChange={(e) => setSameAsPhone(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="sameAsPhone" className="text-sm text-gray-600">WhatsApp same as phone</label>
        </div>

        {!sameAsPhone && (
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="WhatsApp number"
            className={`w-full p-3 rounded-xl border ${errors.whatsapp ? 'border-red-500' : 'border-gray-200'} bg-white mt-2`}
          />
        )}
        {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Photos</label>
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {images.length < 8 && (
            <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              {uploadProgress.length > 0 ? (
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              ) : (
                <>
                  <span className="text-2xl">📷</span>
                  <span className="text-xs text-gray-500 mt-1">Tap to add up to 8 photos</span>
                </>
              )}
            </label>
          )}
        </div>
        {errors.images && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.images}</p>}
      </div>

      {/* Specifications */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Specifications (min 3) *</label>
        
        {/* Suggested specs */}
        {suggestedSpecs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedSpecs.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => {
                  if (!specs.find((s) => s.key === spec)) {
                    setSpecs((prev) => [...prev, { key: spec, value: '' }])
                  }
                }}
                disabled={specs.some((s) => s.key === spec)}
                className="px-2 py-1 text-xs bg-purple-50 text-purple-600 rounded-full disabled:opacity-50"
              >
                + {spec}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {specs.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => updateSpec(index, 'key', e.target.value)}
                placeholder="Spec name"
                className="flex-1 p-2 rounded-lg border border-gray-200 text-sm"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => updateSpec(index, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 p-2 rounded-lg border border-gray-200 text-sm"
              />
              <button
                type="button"
                onClick={() => removeSpec(index)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSpec}
          className="w-full mt-2 p-2 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm flex items-center justify-center gap-1 hover:border-purple-400 hover:text-purple-600"
        >
          <Plus className="w-4 h-4" /> Add Specification
        </button>
        {errors.specs && <p className="text-red-500 text-sm mt-1">{errors.specs}</p>}
      </div>

      {/* Select Plan */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Select Plan</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setSelectedPlan('free')}
            className={`p-3 rounded-xl border-2 text-center ${selectedPlan === 'free' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
          >
            <p className="font-bold text-sm">FREE</p>
            <p className="text-purple-600 font-bold">AED 0</p>
            <p className="text-xs text-gray-500">14 days</p>
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlan('featured')}
            className={`p-3 rounded-xl border-2 text-center ${selectedPlan === 'featured' ? 'border-amber-500 bg-amber-50' : 'border-gray-200'}`}
          >
            <p className="font-bold text-sm flex items-center justify-center gap-1">⭐ FEATURED</p>
            <p className="text-amber-600 font-bold">AED 20</p>
            <p className="text-xs text-gray-500">Top of list</p>
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlan('urgent')}
            className={`p-3 rounded-xl border-2 text-center ${selectedPlan === 'urgent' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
          >
            <p className="font-bold text-sm flex items-center justify-center gap-1">🚀 URGENT</p>
            <p className="text-red-600 font-bold">AED 50</p>
            <p className="text-xs text-gray-500">5x views</p>
          </button>
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {errors.submit}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Posting...
          </>
        ) : (
          `Post Ad Now — ${selectedPlan === 'free' ? 'FREE' : selectedPlan === 'featured' ? 'AED 20' : 'AED 50'}`
        )}
      </button>
    </form>
  )
}
