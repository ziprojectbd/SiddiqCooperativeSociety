'use client'

import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import LanguageDropdown from './LanguageDropdown'
import { useSidebar } from '@/contexts/SidebarContext'

export default function Header() {
  const pathname = usePathname()
  const { toggleSidebar } = useSidebar()
  
  const isMemberRoute = pathname?.startsWith('/member')
  const isAdminRoute = pathname?.startsWith('/admin')
  const showHamburger = isMemberRoute || isAdminRoute

  const getHeaderText = () => {
    if (isMemberRoute) return 'সিদ্দিক সমবায় সমিতি, গ্রাহক আইডি'
    if (isAdminRoute) return 'সিদ্দিক সমবায় সমিতি, অ্যাডমিন আইডি'
    return 'সিদ্দিক সমবায় সমিতি, কাউনিয়া, রংপুর'
  }

  return (
    <header className={`fixed top-0 right-0 left-0 z-50 bg-gray-800 border-b border-gray-700 px-4 py-3 flex ${showHamburger ? 'justify-between' : 'justify-center'} items-center`}>
      {showHamburger && (
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700 text-white"
          >
            <Menu size={24} />
          </button>
          <div className="text-white font-bold text-base md:text-lg">
            {getHeaderText()}
          </div>
        </div>
      )}
      {!showHamburger && (
        <div className="text-white font-bold text-base md:text-lg text-center">
          {getHeaderText()}
        </div>
      )}
      {showHamburger && <LanguageDropdown />}
    </header>
  )
}
