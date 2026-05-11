"use client"

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useStore, categories, type Listing } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { addWatermark, validatePhoneNumber } from '@/lib/image-utils'
import {
  Upload,
  X,
  ImageIcon,
  AlertCircle,
  Crown,
  Phone,
  MessageCircle,
  Loader2,
  CheckCircle2,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormErrors {
  [key: string]: string
}

interface SpecificationField {
  key: string
  value: string
}

const categorySpecifications: Record<string, string[]> = {
  Motors: ['Brand', 'Model', 'Year', 'Kilometers', 'Color', 'Fuel Type', 'Transmission', 'Body Type', 'Doors', 'Seats', 'Engine Size', 'Horsepower'],
  Property: ['Property Type', 'Bedrooms', 'Bathrooms', 'Size', 'Floor', 'Parking', 'View', 'Furnishing', 'Amenities'],
  Electronics: ['Brand', 'Model', 'Storage', 'RAM', 'Color', 'Condition', 'Warranty', 'Accessories'],
  Furniture: ['Brand', 'Material', 'Color', 'Condition', 'Age', 'Dimensions'],
  Fashion: ['Brand', 'Model', 'Size', 'Color', 'Condition', 'Material', 'Authenticity'],
  Services: ['Service Type', 'Experience', 'Availability', 'Languages', 'Certifications'],
  Jobs: ['Position', 'Company Type', 'Experience Required', 'Salary Range', 'Work Type', 'Benefits'],
  Community: ['Event Type', 'Date', 'Time', 'Capacity', 'Age Group']
}

export function PostAdForm() {
  const router = useRouter()
  const { user, openAuthModal } = useAuth()
  const addListing = useStore((state) => state.addListing)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const [errors, setErrors] = useState<FormErrors>({})

  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('AED')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [sameAsPhone, setSameAsPhone] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [isPaid, setIsPaid] = useState(false)
  const [specifications, setSpecifications] = useState<SpecificationField[]>([])

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
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, images: 'Only image files are allowed' }))
        continue
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, images: 'Image size must be less than 5MB' }))
        continue
      }

      try {
        // Simulate upload progress
        for (let p = 0; p <= 100; p += 20) {
          await new Promise((r) => setTimeout(r, 100))
          setUploadProgress((prev) => {
            const updated = [...prev]
            updated[i] = p
            return updated
          })
        }

        // Add watermark
        const watermarkedImage = await addWatermark(file)
        newImages.push(watermarkedImage)
      } catch (error) {
        console.error('[v0] Image processing error:', error)
        setErrors((prev) => ({ ...prev, images: 'Failed to process image' }))
      }
    }

    setImages((prev) => [...prev, ...newImages])
    setUploadProgress([])
    
    // Clear input
    e.target.value = ''
  }, [])

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { key: '', value: '' }])
  }

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    setSpecifications((prev) => {
      const updated = [...prev]
      updated[index][field] = value
      return updated
    })
  }

  const removeSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters'
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required'
    } else if (description.length < 30) {
      newErrors.description = 'Description must be at least 30 characters'
    }

    if (!price || parseFloat(price) <= 0) {
      newErrors.price = 'Valid price is required'
    }

    if (!category) {
      newErrors.category = 'Category is required'
    }

    if (!subcategory) {
      newErrors.subcategory = 'Subcategory is required'
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

    if (images.length === 0) {
      newErrors.images = 'At least one image is required'
    }

    // Validate specifications
    const validSpecs = specifications.filter((s) => s.key.trim() && s.value.trim())
    if (validSpecs.length < 3) {
      newErrors.specifications = 'Please add at least 3 specifications'
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
      // Create specifications object
      const specsObject: Record<string, string | number> = {}
      specifications.forEach((spec) => {
        if (spec.key.trim() && spec.value.trim()) {
          specsObject[spec.key.trim()] = spec.value.trim()
        }
      })

      const newListing: Listing = {
        id: Math.random().toString(36).substring(7),
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        currency,
        category: selectedCategory?.name || category,
        subcategory,
        images,
        isPaid,
        paidUntil: isPaid ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined,
        priorityLevel: isPaid ? 50 : 1,
        createdAt: new Date(),
        userId: user.id,
        userPhone: phone,
        userWhatsApp: sameAsPhone ? phone : whatsapp,
        location: location.trim(),
        specifications: specsObject,
        views: 0
      }

      addListing(newListing)
      
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000))
      
      router.push('/')
    } catch (error) {
      console.error('[v0] Submit error:', error)
      setErrors({ submit: 'Failed to post ad. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const suggestedSpecs = category ? categorySpecifications[selectedCategory?.name || ''] || [] : []

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Images Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Photos</CardTitle>
          <CardDescription>
            Add up to 10 photos. First image will be the cover. Watermark will be added automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <Badge className="absolute bottom-1 left-1 text-[10px]">Cover</Badge>
                )}
              </div>
            ))}
            
            {images.length < 10 && (
              <label className={cn(
                "aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors",
                errors.images ? "border-destructive" : "border-muted-foreground/25 hover:border-amber-500"
              )}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {uploadProgress.length > 0 ? (
                  <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">Add Photo</span>
                  </>
                )}
              </label>
            )}
          </div>
          {errors.images && (
            <p className="text-sm text-destructive mt-2 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.images}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Basic Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., 2023 Mercedes-Benz S-Class S500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your item in detail. Include condition, features, and any other relevant information."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
            <p className="text-xs text-muted-foreground">{description.length}/1000 characters</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AED">AED</SelectItem>
                  <SelectItem value="AED/month">AED/month</SelectItem>
                  <SelectItem value="AED/year">AED/year</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={category} 
                onValueChange={(v) => {
                  setCategory(v)
                  setSubcategory('')
                  // Add default specifications
                  const catName = categories.find((c) => c.id === v)?.name || ''
                  const defaultSpecs = categorySpecifications[catName] || []
                  setSpecifications(defaultSpecs.slice(0, 6).map((key) => ({ key, value: '' })))
                }}
              >
                <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory *</Label>
              <Select 
                value={subcategory} 
                onValueChange={setSubcategory}
                disabled={!category}
              >
                <SelectTrigger className={errors.subcategory ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory?.subcategories.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subcategory && (
                <p className="text-sm text-destructive">{errors.subcategory}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className={errors.location ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dubai Marina">Dubai Marina</SelectItem>
                <SelectItem value="Downtown Dubai">Downtown Dubai</SelectItem>
                <SelectItem value="Palm Jumeirah">Palm Jumeirah</SelectItem>
                <SelectItem value="JBR">JBR</SelectItem>
                <SelectItem value="Business Bay">Business Bay</SelectItem>
                <SelectItem value="DIFC">DIFC</SelectItem>
                <SelectItem value="JLT">JLT</SelectItem>
                <SelectItem value="Deira">Deira</SelectItem>
                <SelectItem value="Bur Dubai">Bur Dubai</SelectItem>
                <SelectItem value="Al Barsha">Al Barsha</SelectItem>
                <SelectItem value="Emirates Hills">Emirates Hills</SelectItem>
                <SelectItem value="Al Quoz">Al Quoz</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Specifications</CardTitle>
          <CardDescription>
            Add detailed specifications for your item (minimum 3 required)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Suggested specs buttons */}
          {suggestedSpecs.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestedSpecs.map((spec) => (
                <Button
                  key={spec}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!specifications.find((s) => s.key === spec)) {
                      setSpecifications((prev) => [...prev, { key: spec, value: '' }])
                    }
                  }}
                  disabled={specifications.some((s) => s.key === spec)}
                  className="text-xs"
                >
                  + {spec}
                </Button>
              ))}
            </div>
          )}

          {/* Specification fields */}
          <div className="space-y-3">
            {specifications.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Specification name"
                  value={spec.key}
                  onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSpecification(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addSpecification}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Specification
          </Button>

          {errors.specifications && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.specifications}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+971 50 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="same-whatsapp"
              checked={sameAsPhone}
              onCheckedChange={setSameAsPhone}
            />
            <Label htmlFor="same-whatsapp" className="text-sm">
              WhatsApp number is same as phone
            </Label>
          </div>

          {!sameAsPhone && (
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Number *
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="+971 50 123 4567"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className={errors.whatsapp ? 'border-destructive' : ''}
              />
              {errors.whatsapp && (
                <p className="text-sm text-destructive">{errors.whatsapp}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Premium Listing Option */}
      <Card className={cn(
        "border-2 transition-colors",
        isPaid ? "border-amber-500 bg-amber-500/5" : ""
      )}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
              isPaid ? "bg-amber-500" : "bg-muted"
            )}>
              <Crown className={cn(
                "h-6 w-6",
                isPaid ? "text-white" : "text-muted-foreground"
              )} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Featured Listing</h3>
                  <p className="text-sm text-muted-foreground">
                    Get more visibility with priority placement
                  </p>
                </div>
                <Switch
                  checked={isPaid}
                  onCheckedChange={setIsPaid}
                />
              </div>
              {isPaid && (
                <div className="mt-3 p-3 bg-amber-500/10 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold text-amber-600">Benefits:</span>
                  </p>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-amber-500" />
                      Top position in search results
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-amber-500" />
                      Featured badge on your listing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-amber-500" />
                      30 days of premium visibility
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    Payment link will be provided after submission
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      {errors.submit && (
        <p className="text-sm text-destructive text-center">{errors.submit}</p>
      )}

      <Button
        type="submit"
        className="w-full h-12 bg-amber-500 hover:bg-amber-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Posting...
          </>
        ) : (
          <>
            <ImageIcon className="h-4 w-4 mr-2" />
            Post Ad
          </>
        )}
      </Button>
    </form>
  )
}
