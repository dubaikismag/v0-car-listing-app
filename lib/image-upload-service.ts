import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const BUCKET_NAME = 'listings'

export interface UploadResult {
  url: string
  path: string
}

// Initialize the storage bucket (called once on app start)
export async function initializeStorage(): Promise<void> {
  const { data: buckets } = await supabase.storage.listBuckets()
  
  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME)
  
  if (!bucketExists) {
    await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10485760 // 10MB
    })
  }
}

// Upload a single image
export async function uploadImage(
  file: File,
  folder: string = 'images'
): Promise<UploadResult> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in to upload images')
  }

  // Generate a unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('[v0] Error uploading image:', error)
    throw error
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)

  return {
    url: publicUrl,
    path: data.path
  }
}

// Upload multiple images
export async function uploadMultipleImages(
  files: File[],
  folder: string = 'images'
): Promise<UploadResult[]> {
  const results: UploadResult[] = []

  for (const file of files) {
    try {
      const result = await uploadImage(file, folder)
      results.push(result)
    } catch (error) {
      console.error('[v0] Error uploading file:', file.name, error)
      // Continue with other files even if one fails
    }
  }

  return results
}

// Delete an image
export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path])

  if (error) {
    console.error('[v0] Error deleting image:', error)
    throw error
  }
}

// Delete multiple images
export async function deleteMultipleImages(paths: string[]): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(paths)

  if (error) {
    console.error('[v0] Error deleting images:', error)
    throw error
  }
}

// Get a signed URL for private images (if needed)
export async function getSignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(path, expiresIn)

  if (error) {
    console.error('[v0] Error getting signed URL:', error)
    throw error
  }

  return data.signedUrl
}

// Validate file before upload
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.'
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit.'
    }
  }

  return { valid: true }
}

// Compress image before upload (optional, for optimization)
export async function compressImage(file: File, maxWidth: number = 1200): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Could not compress image'))
            return
          }
          resolve(new File([blob], file.name, { type: 'image/jpeg' }))
        },
        'image/jpeg',
        0.85
      )
    }

    img.onerror = () => reject(new Error('Could not load image'))
    img.src = URL.createObjectURL(file)
  })
}
