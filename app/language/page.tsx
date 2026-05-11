'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BottomNavigation } from '@/components/bottom-navigation'
import { ArrowLeft, Check, Globe } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇦🇪' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'tl', name: 'Tagalog', native: 'Tagalog', flag: '🇵🇭' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', flag: '🇳🇵' },
  { code: 'si', name: 'Sinhala', native: 'සිංහල', flag: '🇱🇰' },
  { code: 'fa', name: 'Persian', native: 'فارسی', flag: '🇮🇷' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' }
]

export default function LanguagePage() {
  const [selectedLang, setSelectedLang] = useState('en')
  const [showSaved, setShowSaved] = useState(false)

  const handleSelect = (code: string) => {
    setSelectedLang(code)
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-100">
        <Link href="/more" className="p-2 -ml-2">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <Globe className="w-5 h-5 text-purple-600" />
        <h1 className="text-lg font-bold text-gray-900">Language / لغة</h1>
      </div>

      <main className="px-4 py-4">
        <p className="text-sm text-gray-500 mb-4">
          Select your preferred language. The app interface will be displayed in the selected language.
        </p>

        <div className="space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                selectedLang === lang.code
                  ? 'bg-purple-50 border-purple-300'
                  : 'bg-white border-gray-100'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">{lang.name}</h3>
                <p className="text-sm text-gray-500">{lang.native}</p>
              </div>
              {selectedLang === lang.code && (
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          More languages coming soon!
        </p>
      </main>

      {/* Saved Toast */}
      {showSaved && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg z-[100]">
          Language saved!
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}
