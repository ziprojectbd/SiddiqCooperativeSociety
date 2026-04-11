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
    return 'SK সমবায় সমিতি,কাউনিয়া, রংপুর'
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
        </div>
      )}
      <div className="flex-1 marquee-container">
        <div className="marquee-content text-white text-base md:text-lg">
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ | আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু | SK সমবায় সমিতি, কাউনিয়া, রংপুর-এর পক্ষ থেকে আপনাদের জানাই আন্তরিক শুভেচ্ছা ও স্বাগতম। | আমরা আশা করি, আপনাদের সবার সহযোগিতা ও অংশগ্রহণে আমাদের এই সমিতি আরও উন্নতি ও সমৃদ্ধির পথে এগিয়ে যাবে ইনশাআল্লাহ। | ধন্যবাদ সবাইকে। &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ | আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু | SK সমবায় সমিতি, কাউনিয়া, রংপুর-এর পক্ষ থেকে আপনাদের জানাই আন্তরিক শুভেচ্ছা ও স্বাগতম। | আমরা আশা করি, আপনাদের সবার সহযোগিতা ও অংশগ্রহণে আমাদের এই সমিতি আরও উন্নতি ও সমৃদ্ধির পথে এগিয়ে যাবে ইনশাআল্লাহ। | ধন্যবাদ সবাইকে।
        </div>
      </div>
      {showHamburger && <LanguageDropdown />}
    </header>
  )
}
