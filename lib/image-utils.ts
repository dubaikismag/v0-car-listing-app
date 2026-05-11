export async function addWatermark(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = document.createElement('img')
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        // Set canvas size to image size
        canvas.width = img.width
        canvas.height = img.height

        // Draw the original image
        ctx.drawImage(img, 0, 0)

        // Configure watermark text
        const text = 'dubaikismag.com'
        const fontSize = Math.max(24, Math.min(img.width, img.height) * 0.05)
        
        ctx.font = `bold ${fontSize}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Calculate text metrics
        const textMetrics = ctx.measureText(text)
        const textWidth = textMetrics.width
        const textHeight = fontSize

        // Draw multiple watermarks across the image
        const padding = 100
        const spacingX = textWidth + padding
        const spacingY = textHeight + padding * 2

        ctx.save()
        ctx.rotate(-20 * Math.PI / 180) // Rotate -20 degrees

        for (let y = -img.height; y < img.height * 2; y += spacingY) {
          for (let x = -img.width; x < img.width * 2; x += spacingX) {
            // White shadow for visibility
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
            ctx.fillText(text, x + 2, y + 2)
            
            // Main text
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
            ctx.fillText(text, x, y)
          }
        }

        ctx.restore()

        // Add corner watermark (more prominent)
        const cornerFontSize = Math.max(16, Math.min(img.width, img.height) * 0.04)
        ctx.font = `bold ${cornerFontSize}px Arial`
        
        // Bottom right corner watermark with background
        const cornerText = 'dubaikismag.com'
        const cornerMetrics = ctx.measureText(cornerText)
        const cornerPadding = 10
        const cornerX = img.width - cornerMetrics.width - cornerPadding * 2
        const cornerY = img.height - cornerFontSize - cornerPadding * 2

        // Semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fillRect(
          cornerX - cornerPadding,
          cornerY - cornerPadding / 2,
          cornerMetrics.width + cornerPadding * 2,
          cornerFontSize + cornerPadding
        )

        // White text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.fillText(cornerText, cornerX, cornerY)

        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
        resolve(dataUrl)
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

export function validatePhoneNumber(phone: string): boolean {
  // UAE phone number validation: +971 followed by 9 digits
  // Or international format with country code
  const phoneRegex = /^\+?[1-9]\d{9,14}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-numeric characters except +
  return phone.replace(/[^\d+]/g, '')
}
