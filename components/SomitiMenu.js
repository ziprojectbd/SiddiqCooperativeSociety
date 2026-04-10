'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSidebar } from '@/contexts/SidebarContext'

export default function SomitiMenu() {
  const { t } = useLanguage()
  const { closeSidebar } = useSidebar()
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  return (
    <div className="space-y-1">
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 text-white transition-colors"
      >
        <span className="text-lg">{t('somiti')}</span>
        {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      
      {expanded && (
        <div className="ml-4 space-y-1">
          <a
            href="/member/somiti-overview"
            onClick={closeSidebar}
            className="block px-4 py-2 rounded-lg hover:bg-gray-700 text-gray-300 transition-colors"
          >
            {t('overview')}
          </a>
          <a
            href="/member/committee"
            onClick={closeSidebar}
            className="block px-4 py-2 rounded-lg hover:bg-gray-700 text-gray-300 transition-colors"
          >
            {t('committee')}
          </a>
          <a
            href="/member/about"
            onClick={closeSidebar}
            className="block px-4 py-2 rounded-lg hover:bg-gray-700 text-gray-300 transition-colors"
          >
            {t('aboutSomiti')}
          </a>
        </div>
      )}
    </div>
  )
}
