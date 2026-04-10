'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageDropdown() {
  const { language, setLanguage } = useLanguage()

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
      className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer"
      title={language === 'en' ? 'Switch to Bengali' : 'Switch to English'}
    >
      <img
        src={language === 'en' ? 'https://flagcdn.com/w40/us.png' : 'https://flagcdn.com/w40/bd.png'}
        alt={language === 'en' ? 'USA' : 'Bangladesh'}
        className="w-full h-full object-cover"
      />
    </button>
  )
}
